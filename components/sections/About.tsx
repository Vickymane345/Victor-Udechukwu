"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import Words from "@/components/Words";
import { PROFILE_SHORT } from "@/lib/data";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
        () => {
          // Pin the section while the paragraph reveals word-by-word
          gsap.fromTo(
            ".about-copy .word",
            { opacity: 0.14 },
            {
              opacity: 1,
              stagger: 0.4,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: "+=160%",
                pin: true,
                scrub: 0.6,
              },
            }
          );
          gsap.to(".about-img", {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      );

      // Mobile / reduced motion: gentle one-shot reveal, no pinning
      mm.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 767px)",
        () => {
          gsap.from(".about-copy", {
            autoAlpha: 0,
            y: 32,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 70%" },
          });
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="about"
      aria-labelledby="about-heading"
      className="relative min-h-[100dvh] bg-cream text-ink"
    >
      <div className="grid min-h-[100dvh] grid-cols-1 md:grid-cols-12">
        {/* Full-bleed portrait with warm gradient */}
        <div className="about-img relative h-[46vh] overflow-hidden md:col-span-5 md:h-auto">
          <Image
            src="/hero-portrait.jpg"
            alt="Victor Udechukwu"
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            className="object-cover grayscale contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-rust/50 via-transparent to-cream/30 mix-blend-multiply" />
        </div>

        <div className="flex flex-col justify-center px-5 py-16 sm:px-8 md:col-span-7 md:px-14 md:py-24">
          <p className="eyebrow mb-8 text-rust-deep" id="about-heading">
            About me
          </p>
          <p className="about-copy max-w-[26ch] text-lede font-medium leading-[1.25] tracking-tight md:max-w-[36ch]">
            <Words text={PROFILE_SHORT} />
          </p>
          <p className="eyebrow mt-10 text-ink/60">
            6+ years in fintech, e-commerce, logistics, EdTech, SaaS
          </p>
        </div>
      </div>
    </section>
  );
}
