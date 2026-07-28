"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { LINKS } from "@/lib/data";

/* Portrait geometry — shared by the image and the outline clip so the
   outlined letters appear exactly where the type crosses the face. */
const PORTRAIT_W = "min(58vw, 460px)";

/* The word is rendered twice: a solid layer behind the portrait and an
   outlined layer above it, clipped to the portrait's width. Both must be
   positioned identically — keep these classes in sync. */
const WORD_POS =
  "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center";
const WORD_TYPE =
  "block display text-[13vw] leading-[0.9] tracking-[-0.01em] sm:text-[11vw]";

const HEADLINE_LINES = ["Mobile App", "& Web Dev"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-portrait", {
          autoAlpha: 0,
          scale: 1.05,
          duration: 1.6,
          ease: "expo.out",
        });
        // both word layers animate together so they stay perfectly aligned
        gsap.from(".hero-word", {
          yPercent: 112,
          duration: 1.3,
          ease: "expo.out",
          delay: 0.35,
        });
        gsap.from(".hero-meta", {
          autoAlpha: 0,
          y: 24,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.9,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        tl.to(".hero-portrait", { yPercent: 14, ease: "none" }, 0)
          .to(".hero-headline", { yPercent: -6, ease: "none" }, 0)
          .to(".hero-fade", { opacity: 0, ease: "none" }, 0);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="top"
      aria-label="Intro"
      className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden bg-ink text-cream"
    >
      {/* Accessible heading (visual word layers below are decorative) */}
      <h1 className="sr-only">
        Victor Udechukwu, Mobile App and Web Developer
      </h1>

      {/* Layer 2 — solid cream words (behind the portrait) */}
      <div className={`hero-headline z-[2] ${WORD_POS}`} aria-hidden>
        {HEADLINE_LINES.map((line) => (
          <span key={line} className="mask">
            <span className={`hero-word ${WORD_TYPE}`}>{line}</span>
          </span>
        ))}
      </div>

      {/* Layer 3 — portrait, centered */}
      <div
        className="hero-portrait absolute left-1/2 top-1/2 z-[3] h-[70vh] -translate-x-1/2 -translate-y-1/2 md:h-[86vh]"
        style={{ width: PORTRAIT_W }}
        aria-hidden
      >
        <Image
          src="/hero-portrait.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 58vw, 460px"
          className="object-cover object-[center_30%]"
        />
        {/* blend the photo's edges into the ink background */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </div>

      {/* Layer 4 — outlined word above the portrait, clipped to its width */}
      <div
        className={`hero-headline z-[4] ${WORD_POS}`}
        style={{
          clipPath: `inset(0 calc(50% - ${PORTRAIT_W} / 2) 0 calc(50% - ${PORTRAIT_W} / 2))`,
        }}
        aria-hidden
      >
        {HEADLINE_LINES.map((line) => (
          <span key={line} className="mask">
            <span
              className={`hero-word ${WORD_TYPE} text-transparent [-webkit-text-stroke:2px_var(--color-cream)]`}
            >
              {line}
            </span>
          </span>
        ))}
      </div>

      {/* Top meta row */}
      <div className="hero-fade relative z-[5] flex items-center justify-between px-5 pt-20 sm:px-8 md:px-10 md:pt-24">
        <p className="hero-meta eyebrow text-cream/85">
          Web, Mobile, AI
        </p>
        <span
          className="hero-meta hidden items-center text-2xl text-cream/85 md:flex"
          aria-hidden
        >
          ⟶
        </span>
      </div>

      {/* Bottom meta row */}
      <div className="hero-fade relative z-[5] flex flex-col gap-3 px-5 pb-8 sm:flex-row sm:items-end sm:justify-between sm:px-8 md:px-10 md:pb-10">
        <p className="hero-meta eyebrow text-cream/85">Victor Udechukwu</p>
        <div className="hero-meta flex flex-wrap gap-x-5 gap-y-2">
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow text-cream/85 transition-opacity hover:opacity-60"
          >
            GitHub
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow text-cream/85 transition-opacity hover:opacity-60"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${LINKS.email}`}
            className="eyebrow text-cream/85 transition-opacity hover:opacity-60"
          >
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
