"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { STACK } from "@/lib/data";

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-t rule-dark py-6" aria-hidden={reverse}>
      <div
        className={`marquee-track gap-10 ${reverse ? "reverse" : ""}`}
        style={{ ["--marquee-speed" as string]: reverse ? "56s" : "42s" }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="display flex shrink-0 items-center gap-10 text-[clamp(2rem,5vw,4rem)] text-ink/90"
          >
            {item}
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-rust" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Stack() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".stack-head", {
          autoAlpha: 0,
          y: 32,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-label="Tech stack"
      className="bg-cream py-20 text-ink sm:py-28 md:py-40"
    >
      <div className="stack-head mb-16 px-5 sm:px-8 md:px-10">
        <p className="eyebrow mb-4 text-rust-deep">Daily drivers</p>
        <h2 className="display text-big">The Stack</h2>
      </div>
      <Row items={STACK.slice(0, 9)} />
      <Row items={STACK.slice(9)} reverse />
      <div className="border-t rule-dark" />
    </section>
  );
}
