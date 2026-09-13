# Victor Udechukwu — Portfolio

Personal portfolio site for Victor Udechukwu, Mobile App & Web Developer.
Editorial Swiss layout with scroll-driven motion.

**Live:** _add your Vercel URL here after deploying_

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** — design tokens live in `app/globals.css`
- **GSAP + ScrollTrigger** — all scroll animation
- **Lenis** — smooth scrolling, wired into the GSAP ticker
- **pnpm** — package manager

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

```bash
pnpm build   # production build
pnpm start   # serve the production build
```

## Structure

```
app/
  layout.tsx        fonts, metadata, smooth-scroll provider
  globals.css       design tokens (ink / cream / rust), type scale, utilities
  page.tsx          section composition
components/
  Nav.tsx           fixed navigation
  SmoothScroll.tsx  Lenis + GSAP ticker integration
  Words.tsx         splits text for word-by-word scroll reveals
  sections/         Hero, About, Manifesto, Services, Work, Stack, Contact
lib/
  data.ts             copy: services, posts, stack, links (+ offline project fallback)
  portfolio-config.ts knobs for the automated Work section
  projects.ts         pulls projects from GitHub + Vercel at build/revalidate time
  gsap.ts             GSAP plugin registration (client only)
```

**Static copy lives in `lib/data.ts`** — services, links, writing, the stack
marquee. **Projects are not static**; see below.

## Sections

1. **Hero** — layered type over portrait, mask reveal on load, parallax on scroll
2. **About** — pinned section, profile reveals word by word
3. **Manifesto** — scroll-scrubbed statement with a drifting image
4. **Services** — sticky mockup that swaps screens per active competency
5. **Selected Work** — project index with cursor-following previews, plus LinkedIn writing embeds
6. **Stack** — dual marquee
7. **Contact** — oversized CTA and footer

## Selected Work builds itself

Nothing about a project is typed by hand. `lib/projects.ts` runs on the server
and assembles the Work section from two sources:

| Source | What it provides |
| --- | --- |
| GitHub REST API | repo list, description, topics, `package.json`, language breakdown |
| Vercel REST API | the production alias for each linked project |

The tech stack is inferred from each repo's dependencies (`next` → Next.js,
`@supabase/supabase-js` → Supabase, and so on), falling back to the language
breakdown for non-JS repos. Previews are live screenshots of the deployment,
with the repo's OpenGraph card as a fallback if the screenshot service is slow.

The page is cached for an hour (`export const revalidate = 3600` in
`app/page.tsx`), so **deploy a new repo to Vercel and it appears here within the
hour — no code change, no redeploy.**

### Publishing a new project

1. Push the repo to GitHub (public).
2. Import it on Vercel and deploy.

That's it. Vercel writes the deployment URL onto the repo's homepage field, the
feed picks it up on the next revalidation, and the project slots in at the top
by push date.

### Tuning it

Everything adjustable is in `lib/portfolio-config.ts`:

- `MAX_PROJECTS` — how many rows render (default 8)
- `SELECTION` — `"deployed"` (anything with a live URL), `"topic"` (only repos
  tagged `portfolio` on GitHub), or `"all"`
- `HIDDEN_REPOS` — never show these
- `PINNED_REPOS` — force these to the top, in order
- `REPO_OVERRIDES` — override a title, tag, stack or URL for one repo
- `SCREENSHOT_PROVIDER` — `microlink`, `thum`, or `github`

### Environment variables

Copy `.env.example` to `.env.local`, and add the same keys under
**Vercel → Settings → Environment Variables**. All are optional — without them
the feed falls back to public GitHub data and the homepage URL on each repo.

- `GITHUB_TOKEN` — raises the API limit from 60 to 5000 requests/hour
- `VERCEL_TOKEN` — exact production aliases, custom domains included
- `VERCEL_TEAM_ID` — only if the projects sit under a team

If GitHub is unreachable or rate-limited, the hand-written `PROJECTS` array in
`lib/data.ts` renders instead, so the section is never empty.

## TODO

- `public/hero-portrait.jpg` is the hero and about portrait
- `Manifesto.tsx` still uses a `picsum.photos` placeholder

## Accessibility & performance

- Respects `prefers-reduced-motion` — all pinning and scrubbing is disabled, content renders static
- Pinned and hover-dependent layouts degrade to plain vertical flow on mobile
- Semantic landmarks, focus states, and screen-reader headings throughout
