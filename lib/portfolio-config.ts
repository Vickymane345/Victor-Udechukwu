/**
 * Knobs for the automated Work section.
 *
 * Titles, tech stack, live links and screenshots are all derived from GitHub
 * and Vercel at build / revalidate time. This file is the only place you edit
 * when you want to override that automation.
 */

/** GitHub account the projects are pulled from. */
export const GITHUB_USER = "Vickymane345";

/** How many projects the Work section renders. */
export const MAX_PROJECTS = 8;

/** How long fetched data is cached, in seconds. */
export const REVALIDATE = 60 * 60;

/**
 * Which repos qualify.
 *  "deployed" - any repo with a live Vercel deployment (or a homepage set on GitHub)
 *  "topic"    - only repos carrying the `portfolio` topic on GitHub
 *  "all"      - every public, non-fork repo
 */
export const SELECTION: "deployed" | "topic" | "all" = "deployed";

/** Topic used when SELECTION is "topic". */
export const PORTFOLIO_TOPIC = "portfolio";

/** Never show these, whatever their deploy status. */
export const HIDDEN_REPOS = [
  "Victor-Udechukwu", // this site
  "PORTFOLIOS",
  "Portfolio",
  "portfolio-front-end-projects",
];

/** Forced to the top, in this order, ahead of the recency sort. */
export const PINNED_REPOS: string[] = [];

/**
 * Always shown, even with no live deployment. For work that has no URL to
 * visit - notebooks, libraries, CLI tools - where the repo itself is the link.
 */
export const INCLUDE_REPOS = ["imdb-review-preprocessing"];

/** Cosmetic overrides. Anything you leave out falls back to the live API data. */
export const REPO_OVERRIDES: Record<
  string,
  {
    title?: string;
    tag?: string;
    /** Replaces the detected stack entirely when set. */
    stack?: string[];
    /** Replaces the Vercel / homepage URL when set. */
    url?: string;
    note?: string;
    device?: "phone" | "browser";
  }
> = {
  ConvoyConnect: { title: "ConvoyConnect", tag: "Marketplace" },
  Culverin: { tag: "SaaS" },
  snerga: { title: "Snerga", tag: "Product" },
  Ecommerce: { title: "E-Commerce Platform", tag: "E-Commerce" },
  School: { title: "Educational Landing Page", tag: "EdTech" },
  Gym: { title: "Gym Landing Page", tag: "Fitness" },
  sister: { title: "Sister", tag: "Web" },
  "imdb-review-preprocessing": {
    title: "IMDB Review Preprocessing",
    tag: "NLP",
  },
};

/**
 * Screenshot provider for live previews.
 *  "microlink" - free tier, renders the real page (default)
 *  "thum"      - image.thum.io, no key, slightly lower fidelity
 *  "github"    - skip screenshots, use each repo's OpenGraph card
 */
export const SCREENSHOT_PROVIDER: "microlink" | "thum" | "github" =
  (process.env.NEXT_PUBLIC_SCREENSHOT_PROVIDER as "microlink" | "thum" | "github") ??
  "microlink";
