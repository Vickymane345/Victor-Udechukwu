"use client";

import { LINKS } from "@/lib/data";

const ITEMS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference text-cream">
      <nav
        aria-label="Primary"
        className="flex items-center justify-between px-5 py-4 sm:px-8 md:px-10 md:py-6"
      >
        <a href="#top" className="eyebrow font-medium">
          VU Folio ’26
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="eyebrow transition-opacity duration-300 hover:opacity-60"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${LINKS.email}`}
          className="eyebrow flex items-center gap-2 font-medium"
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-rust motion-safe:animate-pulse"
          />
          Available for work
        </a>
      </nav>
    </header>
  );
}
