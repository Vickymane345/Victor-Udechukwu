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
  data.ts           all copy: projects, services, posts, stack, links
  gsap.ts           GSAP plugin registration (client only)
```

**All content lives in `lib/data.ts`.** Edit projects, services, links, and the
tech stack there — no need to touch component files.

## Sections

1. **Hero** — layered type over portrait, mask reveal on load, parallax on scroll
2. **About** — pinned section, profile reveals word by word
3. **Manifesto** — scroll-scrubbed statement with a drifting image
4. **Services** — sticky mockup that swaps screens per active competency
5. **Selected Work** — project index with cursor-following previews, plus LinkedIn writing embeds
6. **Stack** — dual marquee
7. **Contact** — oversized CTA and footer

## TODO

- Replace `picsum.photos` placeholders with real project screenshots in `public/`
- `public/hero-portrait.jpg` is the hero and about portrait

## Accessibility & performance

- Respects `prefers-reduced-motion` — all pinning and scrubbing is disabled, content renders static
- Pinned and hover-dependent layouts degrade to plain vertical flow on mobile
- Semantic landmarks, focus states, and screen-reader headings throughout
