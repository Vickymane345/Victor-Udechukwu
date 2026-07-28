"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import Words from "@/components/Words";
import { MANIFESTO } from "@/lib/data";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".manifesto-copy .word",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 75%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          }
        );

        // Small floating image drifting through (parallax)
        gsap.fromTo(
          ".manifesto-float",
          { yPercent: 60, rotate: -6 },
          {
            yPercent: -60,
            rotate: 5,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-label="Manifesto"
      className="relative overflow-hidden bg-ink py-24 text-cream sm:py-32 md:py-48"
    >
      {/* Floating accent image */}
      <div
        className="manifesto-float pointer-events-none absolute right-[8%] top-1/2 z-[1] hidden h-44 w-32 overflow-hidden rounded-full md:block"
        aria-hidden
      >
        {/* TODO: replace with a real project / desk shot */}
        <Image
          src="https://picsum.photos/seed/code-desk/400/600"
          alt=""
          fill
          sizes="128px"
          className="object-cover grayscale contrast-125 opacity-70"
        />
      </div>

      <div className="relative z-[2] mx-auto max-w-6xl px-5 text-center sm:px-8 md:px-10">
        <p className="eyebrow mb-10 text-rust">Manifesto</p>
        <p className="manifesto-copy display text-big normal-case tracking-tight">
          <Words text={MANIFESTO} />
        </p>
      </div>
    </section>
  );
}
