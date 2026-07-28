"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { LINKS } from "@/lib/data";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".contact-line", {
          yPercent: 110,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        });
        gsap.from(".contact-meta", {
          autoAlpha: 0,
          y: 24,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: root.current, start: "top 55%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      ref={root}
      id="contact"
      aria-labelledby="contact-heading"
      className="flex min-h-[100dvh] flex-col justify-between bg-ink pt-32 text-cream md:pt-44"
    >
      <div className="px-5 sm:px-8 md:px-10">
        <p className="contact-meta eyebrow mb-8 text-rust">
          Got a product to ship?
        </p>
        <h2 id="contact-heading" className="display text-huge">
          <span className="mask">
            <span className="line contact-line">Let’s build</span>
          </span>
          <span className="mask">
            <span className="line contact-line">
              something<span className="text-rust">.</span>
            </span>
          </span>
        </h2>
        <a
          href={`mailto:${LINKS.email}`}
          className="contact-meta group mt-12 inline-flex max-w-full items-center gap-3 break-all border-b rule-light pb-2 font-mono text-sm sm:gap-4 sm:text-base md:text-2xl"
        >
          {LINKS.email}
          <span
            aria-hidden
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition-transform duration-500 ease-[var(--ease-swift)] group-hover:translate-x-1 group-hover:-translate-y-0.5"
          >
            ↗
          </span>
        </a>
      </div>

      <div className="mt-24 border-t rule-light px-5 py-8 sm:px-8 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="contact-meta eyebrow text-cream/60">
            Remote or hybrid, US / EU / UK hours
          </p>
          <div className="contact-meta flex flex-wrap gap-x-6 gap-y-3">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow transition-opacity hover:opacity-60"
            >
              GitHub
            </a>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow transition-opacity hover:opacity-60"
            >
              LinkedIn
            </a>
            <a href={`tel:${LINKS.phone.replace(/\s/g, "")}`} className="eyebrow transition-opacity hover:opacity-60">
              {LINKS.phone}
            </a>
          </div>
          <button
            onClick={scrollTop}
            className="contact-meta eyebrow flex items-center gap-2 text-left transition-opacity hover:opacity-60"
          >
            Back to top <span aria-hidden>↑</span>
          </button>
        </div>
        <p className="eyebrow mt-8 text-cream/40">
          © {new Date().getFullYear()} Victor Udechukwu
        </p>
      </div>
    </footer>
  );
}
