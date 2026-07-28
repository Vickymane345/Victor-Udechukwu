/** Single source of truth: content pulled from Victor's CV (udechukwu.PDF). */

export const LINKS = {
  email: "victorchikwado1222@gmail.com",
  phone: "+234 707 869 8149",
  github: "https://github.com/Vickymane345",
  linkedin: "https://www.linkedin.com/in/victorudechukwu",
};

export const PROFILE_SHORT =
  "Full Stack JavaScript Developer with 6+ years shipping production web and mobile apps across fintech, e-commerce, logistics, EdTech, and SaaS. I design and build REST and GraphQL APIs with Node.js, model data in PostgreSQL and MongoDB, and deliver pixel-perfect, accessible React, Next.js, and React Native front-ends in TypeScript. I work AI-first with Claude Code and agentic workflows.";

export const MANIFESTO =
  "I build production web and mobile apps, end to end.";

export interface Service {
  id: string;
  title: string;
  skills: string[];
}

export const SERVICES: Service[] = [
  { id: "web", title: "Full-Stack Web", skills: ["React 19", "Next.js 16", "TypeScript 5", "Node / Express"] },
  { id: "mobile", title: "React Native / Mobile", skills: ["Expo SDK 54", "NativeWind", "Zustand", "Redux"] },
  { id: "api", title: "APIs & Databases", skills: ["REST", "GraphQL", "PostgreSQL + RLS", "MongoDB"] },
  { id: "pay", title: "Payments & Auth", skills: ["Stripe", "Monnify", "OAuth 2.0", "JWT"] },
  { id: "devops", title: "DevOps & Cloud", skills: ["Docker", "CI/CD", "Vercel", "AWS, GCP, Nginx"] },
  { id: "ai", title: "AI Engineering", skills: ["Claude Code", "LLM APIs", "Agentic workflows", "Prompt engineering"] },
];

export interface Project {
  id: string;
  title: string;
  tag: string;
  stack: string;
  url?: string;
  note?: string;
  /** TODO: replace picsum seeds with real screenshots in /public */
  seed: string;
  device: "phone" | "browser";
}

export const PROJECTS: Project[] = [
  {
    id: "snerga",
    title: "Snerga",
    tag: "Product",
    stack: "Next.js, TypeScript, Tailwind",
    url: "http://snerga.vercel.app/",
    seed: "snerga-product",
    device: "browser",
  },
  {
    id: "culverin",
    title: "Culverin",
    tag: "SaaS",
    stack: "Next.js, GraphQL, PostgreSQL, Stripe, Docker",
    url: "https://culverin.vercel.app/",
    seed: "culverin-product",
    device: "browser",
  },
  {
    id: "ecommerce",
    title: "E-Commerce Platform",
    tag: "E-Commerce",
    stack: "React, TypeScript, Tailwind, Framer Motion",
    url: "https://ecommerce-chi-green.vercel.app/",
    seed: "storefront-commerce",
    device: "browser",
  },
  {
    id: "dashboard",
    title: "Food Management Dashboard",
    tag: "Dashboard",
    stack: "React, TypeScript, Tailwind, shadcn/ui",
    url: "https://dashboard-zeta-eight-47.vercel.app/",
    seed: "admin-dashboard",
    device: "browser",
  },
  {
    id: "school",
    title: "Educational Landing Page",
    tag: "EdTech",
    stack: "Next.js, Tailwind, Framer Motion",
    url: "https://school-taupe-ten.vercel.app/",
    seed: "education-campus",
    device: "browser",
  },
];

/** React Native write-ups published on LinkedIn (rendered as embeds). */
export interface Post {
  id: string;
  urn: string;
  title: string;
  blurb: string;
}

export const POSTS: Post[] = [
  {
    id: "rn-firebase",
    urn: "7368446549762174977",
    title: "React Native + Firebase",
    blurb: "Building a full mobile app with Firebase auth and data sync.",
  },
  {
    id: "rn-web",
    urn: "7368447978413481984",
    title: "React Native & React.js",
    blurb: "Sharing patterns and component architecture across web and mobile.",
  },
  {
    id: "rn-redux",
    urn: "7370617646725230592",
    title: "React Native + Redux + Axios",
    blurb: "State management and API layer design in mobile apps.",
  },
];

export const STACK = [
  "React 19",
  "Next.js 16",
  "TypeScript",
  "React Native",
  "Node / Express",
  "GraphQL",
  "Python",
  "C++",
  "Solidity",
  "PostgreSQL",
  "Supabase",
  "MongoDB",
  "Tailwind CSS",
  "Stripe",
  "Docker",
  "Web3",
  "AI Engineering",
  "Claude Code",
];
