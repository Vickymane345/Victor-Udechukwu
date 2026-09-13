/**
 * Live project feed: GitHub (source of truth for repos + stack) merged with
 * Vercel (source of truth for the production URL).
 *
 * Server-only. Called from app/page.tsx, cached for REVALIDATE seconds, so a
 * new repo or deployment shows up on the site within the hour with no code
 * change and no redeploy.
 *
 * Env (all optional, all set in .env.local / Vercel project settings):
 *   GITHUB_TOKEN    classic or fine-grained PAT, public_repo scope. Raises the
 *                   rate limit from 60/hr to 5000/hr. Without it the feed still
 *                   works, it just has less headroom.
 *   VERCEL_TOKEN    vercel.com/account/tokens. Gives the real production alias
 *                   for every project. Without it we fall back to the homepage
 *                   field on each GitHub repo.
 *   VERCEL_TEAM_ID  only if the projects live under a team, not your personal account.
 */

import {
  GITHUB_USER,
  HIDDEN_REPOS,
  INCLUDE_REPOS,
  MAX_PROJECTS,
  PINNED_REPOS,
  PORTFOLIO_TOPIC,
  REPO_OVERRIDES,
  REVALIDATE,
  SCREENSHOT_PROVIDER,
  SELECTION,
} from "./portfolio-config";
import { PROJECTS as FALLBACK_PROJECTS } from "./data";

export interface LiveProject {
  id: string;
  title: string;
  tag: string;
  /** Comma-joined for display, e.g. "Next.js, TypeScript, Tailwind CSS". */
  stack: string;
  stackList: string[];
  /** Live deployment. Undefined when the repo has never been deployed. */
  url?: string;
  repoUrl: string;
  description?: string;
  /** Preview image, and what to show if the screenshot service is down. */
  shot: string;
  shotFallback: string;
  device: "phone" | "browser";
  updatedAt: string;
  note?: string;
}

/* ------------------------------------------------------------------ types */

interface Repo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  private: boolean;
  default_branch: string;
  pushed_at: string;
}

interface VercelProject {
  name: string;
  link?: { type?: string; org?: string; repo?: string };
  targets?: {
    production?: { alias?: string[]; readyState?: string };
  };
}

/* ------------------------------------------------------------------ fetch */

async function gh<T>(path: string): Promise<T | null> {
  const token = process.env.GITHUB_TOKEN;
  try {
    const res = await fetch("https://api.github.com" + path, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function vercelProjects(): Promise<VercelProject[]> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return [];
  const team = process.env.VERCEL_TEAM_ID;
  const qs = team ? "?limit=100&teamId=" + team : "?limit=100";
  try {
    const res = await fetch("https://api.vercel.com/v9/projects" + qs, {
      headers: { Authorization: "Bearer " + token },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { projects?: VercelProject[] };
    return json.projects ?? [];
  } catch {
    return [];
  }
}

/** Reads one file straight from the default branch. Free, no API quota. */
async function raw(repo: string, branch: string, file: string): Promise<string | null> {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/" +
        GITHUB_USER +
        "/" +
        repo +
        "/" +
        branch +
        "/" +
        file,
      { next: { revalidate: REVALIDATE } }
    );
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function packageJson(
  repo: string,
  branch: string
): Promise<Record<string, unknown> | null> {
  const text = await raw(repo, branch, "package.json");
  if (!text) return null;
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Package names from requirements.txt, falling back to pyproject.toml. */
async function pythonDeps(repo: string, branch: string): Promise<string[] | null> {
  const text =
    (await raw(repo, branch, "requirements.txt")) ??
    (await raw(repo, branch, "pyproject.toml"));
  if (text === null) return null;
  return text
    .split("\n")
    .map((line) => line.split("#")[0].trim())
    .map((line) => line.match(/[A-Za-z0-9_.-]+/)?.[0]?.toLowerCase() ?? "")
    .filter(Boolean);
}

/* ------------------------------------------------------------- stack rules */

/** First match wins, so order is meaningful. */
const DEP_LABELS: Array<[RegExp, string]> = [
  [/^next$/, "Next.js"],
  [/^expo$|^react-native$/, "React Native"],
  [/^@?remix-run/, "Remix"],
  [/^astro$/, "Astro"],
  [/^vue$/, "Vue"],
  [/^svelte$/, "Svelte"],
  [/^react$/, "React"],
  [/^typescript$/, "TypeScript"],
  [/^tailwindcss$/, "Tailwind CSS"],
  [/^gsap$/, "GSAP"],
  [/^three$|^@react-three\//, "Three.js"],
  [/^framer-motion$|^motion$/, "Motion"],
  [/^@supabase\//, "Supabase"],
  [/^firebase$/, "Firebase"],
  [/^@prisma\/client$|^prisma$/, "Prisma"],
  [/^drizzle-orm$/, "Drizzle"],
  [/^mongoose$|^mongodb$/, "MongoDB"],
  [/^pg$|^postgres$/, "PostgreSQL"],
  [/^express$/, "Express"],
  [/^fastify$/, "Fastify"],
  [/^@nestjs\//, "NestJS"],
  [/^graphql$|^@apollo\//, "GraphQL"],
  [/^trpc$|^@trpc\//, "tRPC"],
  [/^stripe$|^@stripe\//, "Stripe"],
  [/^next-auth$|^@auth\//, "Auth.js"],
  [/^@clerk\//, "Clerk"],
  [/^zustand$/, "Zustand"],
  [/^@reduxjs\/toolkit$|^redux$/, "Redux"],
  [/^@tanstack\/react-query$|^react-query$/, "React Query"],
  [/^socket\.io/, "WebSockets"],
  [/^ethers$|^wagmi$|^viem$|^web3$/, "Web3"],
  [/^openai$|^@anthropic-ai\//, "LLM APIs"],
  [/^@langchain\/|^langchain$/, "LangChain"],
  [/^zod$/, "Zod"],
  [/^lenis$|^@studio-freight\//, "Lenis"],
];

/** Python side of the same idea, read from requirements.txt / pyproject.toml. */
const PY_LABELS: Array<[RegExp, string]> = [
  [/^nltk$/, "NLTK"],
  [/^spacy$/, "spaCy"],
  [/^gensim$/, "Gensim"],
  [/^transformers$/, "Transformers"],
  [/^torch$/, "PyTorch"],
  [/^tensorflow/, "TensorFlow"],
  [/^scikit-learn$|^sklearn$/, "scikit-learn"],
  [/^pandas$/, "pandas"],
  [/^numpy$/, "NumPy"],
  [/^matplotlib$|^seaborn$/, "Matplotlib"],
  [/^langchain/, "LangChain"],
  [/^openai$|^anthropic$/, "LLM APIs"],
  [/^fastapi$/, "FastAPI"],
  [/^django$/, "Django"],
  [/^flask$/, "Flask"],
  [/^streamlit$/, "Streamlit"],
];

/** Languages worth naming when there is no package.json to read. */
const LANGUAGE_LABELS: Record<string, string> = {
  TypeScript: "TypeScript",
  JavaScript: "JavaScript",
  Python: "Python",
  Solidity: "Solidity",
  "C++": "C++",
  Go: "Go",
  Rust: "Rust",
  Java: "Java",
  Kotlin: "Kotlin",
  Swift: "Swift",
  Dart: "Dart",
  Ruby: "Ruby",
  PHP: "PHP",
  "Jupyter Notebook": "Jupyter",
  HTML: "HTML",
  CSS: "CSS",
  SCSS: "SCSS",
};

/** shadcn/ui leaves no dependency trace, so sniff its config instead. */
async function hasShadcn(repo: string, branch: string): Promise<boolean> {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/" +
        GITHUB_USER +
        "/" +
        repo +
        "/" +
        branch +
        "/components.json",
      { next: { revalidate: REVALIDATE } }
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function detectStack(repo: Repo): Promise<string[]> {
  const labels: string[] = [];
  const push = (label: string) => {
    if (label && !labels.includes(label)) labels.push(label);
  };

  const pkg = await packageJson(repo.name, repo.default_branch);

  if (pkg) {
    const deps = {
      ...((pkg.dependencies as Record<string, string>) ?? {}),
      ...((pkg.devDependencies as Record<string, string>) ?? {}),
    };
    const names = Object.keys(deps);
    for (const [pattern, label] of DEP_LABELS) {
      if (names.some((n) => pattern.test(n))) push(label);
    }
    if (labels.includes("Tailwind CSS") && (await hasShadcn(repo.name, repo.default_branch))) {
      push("shadcn/ui");
    }
    // A Next.js or React Native app is a React app; saying both is noise.
    if (labels.includes("Next.js") || labels.includes("React Native")) {
      const i = labels.indexOf("React");
      if (i > -1) labels.splice(i, 1);
    }
  }

  const py = await pythonDeps(repo.name, repo.default_branch);
  if (py) {
    push("Python");
    for (const [pattern, label] of PY_LABELS) {
      if (py.some((n) => pattern.test(n))) push(label);
    }
  }

  // Fill the gaps from the repo's language breakdown.
  const languages = await gh<Record<string, number>>(
    "/repos/" + repo.full_name + "/languages"
  );
  const ranked = Object.entries(languages ?? {})
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  for (const language of ranked) {
    const label = LANGUAGE_LABELS[language];
    if (!label) continue;
    // Markup is only worth mentioning when nothing else was detected, and
    // "JavaScript" is noise next to TypeScript or a named framework.
    const markup = label === "HTML" || label === "CSS" || label === "SCSS";
    if (markup && labels.length > 0) continue;
    if (label === "JavaScript" && (labels.includes("TypeScript") || labels.length >= 3)) {
      continue;
    }
    push(label);
    if (labels.length >= 5) break;
  }

  if (labels.length === 0 && repo.language) push(repo.language);

  return labels.slice(0, 5);
}

/* ------------------------------------------------------------- screenshots */

function githubCard(fullName: string): string {
  return "https://opengraph.githubassets.com/1/" + fullName;
}

function screenshot(url: string | undefined, fullName: string): string {
  if (!url) return githubCard(fullName);
  const encoded = encodeURIComponent(url);
  switch (SCREENSHOT_PROVIDER) {
    case "thum":
      return "https://image.thum.io/get/width/1200/crop/750/noanimate/" + url;
    case "github":
      return githubCard(fullName);
    default:
      return (
        "https://api.microlink.io/?url=" +
        encoded +
        "&screenshot=true&meta=false&embed=screenshot.url" +
        "&viewport.width=1280&viewport.height=800&waitUntil=networkidle2"
      );
  }
}

/* ------------------------------------------------------------------ merge */

function productionUrl(project: VercelProject): string | undefined {
  const target = project.targets?.production;
  const aliases = (target?.alias ?? []).filter(Boolean);
  if (aliases.length === 0) return undefined;
  // Prefer a custom domain, then the shortest vercel.app alias (the stable
  // project alias rather than the long per-deployment one).
  const custom = aliases.find((a) => !a.endsWith(".vercel.app"));
  const stable = aliases
    .filter((a) => a.endsWith(".vercel.app"))
    .sort((a, b) => a.length - b.length)[0];
  const host = custom ?? stable ?? aliases[0];
  return "https://" + host;
}

function normaliseHomepage(homepage: string | null): string | undefined {
  if (!homepage) return undefined;
  const trimmed = homepage.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : "https://" + trimmed;
}

function titleCase(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map((w) => (w === w.toUpperCase() ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

/** Vercel project names are derived from repo names, so compare loosely. */
function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function fallbackProjects(): LiveProject[] {
  return FALLBACK_PROJECTS.map((p) => ({
    id: p.id,
    title: p.title,
    tag: p.tag,
    stack: p.stack,
    stackList: p.stack.split(",").map((s) => s.trim()),
    url: p.url,
    repoUrl: "https://github.com/" + GITHUB_USER,
    shot: screenshot(p.url, GITHUB_USER + "/" + p.id),
    shotFallback: githubCard(GITHUB_USER + "/" + p.id),
    device: p.device,
    updatedAt: "",
    note: p.note,
  }));
}

export async function getProjects(): Promise<LiveProject[]> {
  const repos = await gh<Repo[]>(
    "/users/" + GITHUB_USER + "/repos?per_page=100&sort=pushed&direction=desc"
  );

  // GitHub unreachable or rate-limited: keep the hand-written list on screen
  // rather than shipping an empty Work section.
  if (!repos || repos.length === 0) return fallbackProjects();

  const vercel = await vercelProjects();
  const deployments = new Map<string, string>();
  for (const project of vercel) {
    const url = productionUrl(project);
    if (!url) continue;
    if (project.link?.repo) deployments.set(slug(project.link.repo), url);
    deployments.set(slug(project.name), url);
  }

  const candidates = repos
    .filter((r) => !r.fork && !r.archived && !r.private)
    .filter((r) => !HIDDEN_REPOS.includes(r.name))
    .map((repo) => {
      const override = REPO_OVERRIDES[repo.name] ?? {};
      const url =
        override.url ??
        deployments.get(slug(repo.name)) ??
        normaliseHomepage(repo.homepage);
      return { repo, override, url };
    })
    .filter(({ repo, url }) => {
      if (INCLUDE_REPOS.includes(repo.name)) return true;
      if (SELECTION === "all") return true;
      if (SELECTION === "topic") return (repo.topics ?? []).includes(PORTFOLIO_TOPIC);
      return Boolean(url);
    });

  const pinnedRank = (name: string) => {
    const i = PINNED_REPOS.indexOf(name);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };

  const selected = candidates
    .sort((a, b) => {
      const rank = pinnedRank(a.repo.name) - pinnedRank(b.repo.name);
      if (rank !== 0) return rank;
      return b.repo.pushed_at.localeCompare(a.repo.pushed_at);
    })
    .slice(0, MAX_PROJECTS);

  return Promise.all(
    selected.map(async ({ repo, override, url }) => {
      const stackList = override.stack ?? (await detectStack(repo));
      const isMobile =
        stackList.includes("React Native") || stackList.includes("Swift") || stackList.includes("Kotlin");

      return {
        id: repo.name,
        title: override.title ?? titleCase(repo.name),
        tag:
          override.tag ||
          titleCase(repo.topics?.[0] ?? "") ||
          repo.language ||
          "Project",
        stack: stackList.join(", "),
        stackList,
        url,
        repoUrl: repo.html_url,
        description: repo.description ?? undefined,
        shot: screenshot(url, repo.full_name),
        shotFallback: githubCard(repo.full_name),
        device: override.device ?? (isMobile ? "phone" : "browser"),
        updatedAt: repo.pushed_at,
        note: override.note,
      } satisfies LiveProject;
    })
  );
}
