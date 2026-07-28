"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SERVICES } from "@/lib/data";

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
        () => {
          const items = gsap.utils.toArray<HTMLElement>(".service-item");
          items.forEach((item, i) => {
            ScrollTrigger.create({
              trigger: item,
              start: "top center",
              end: "bottom center",
              onToggle: (self) => self.isActive && setActive(i),
            });
          });
          gsap.from(".services-heading .line", {
            yPercent: 110,
            duration: 1,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: root.current, start: "top 70%" },
          });
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  const current = SERVICES[active];

  return (
    <section
      ref={root}
      id="services"
      aria-labelledby="services-heading"
      className="bg-cream py-20 text-ink sm:py-28 md:py-40"
    >
      <div className="px-5 sm:px-8 md:px-10">
        <h2
          id="services-heading"
          className="services-heading display text-huge"
        >
          <span className="mask">
            <span className="line">What</span>
          </span>
          <span className="mask">
            <span className="line">
              I <span className="text-rust">Do!</span>
            </span>
          </span>
        </h2>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 px-5 sm:px-8 md:mt-24 md:grid-cols-12 md:px-10">
        {/* List — each item toggles the pinned mockup on the right */}
        <ol className="md:col-span-7" aria-label="Competency areas">
          {SERVICES.map((service, i) => (
            <li
              key={service.id}
              className="service-item border-t rule-dark last:border-b"
            >
              <div className="flex items-baseline gap-5 py-8 md:py-12">
                <span className="eyebrow w-8 shrink-0 text-ink/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3
                    className={`display text-[clamp(1.75rem,4.5vw,3.5rem)] transition-colors duration-500 ease-[var(--ease-swift)] ${
                      active === i ? "text-rust-deep" : "text-ink"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p className="mt-2 font-mono text-xs text-ink/60 md:hidden">
                    {service.skills.join(", ")}
                  </p>
                </div>
                <span
                  aria-hidden
                  className={`ml-auto h-2.5 w-2.5 shrink-0 self-center rounded-full transition-all duration-500 ${
                    active === i ? "scale-100 bg-rust" : "scale-50 bg-ink/20"
                  }`}
                />
              </div>
            </li>
          ))}
        </ol>

        {/* Sticky device mockup — screen swaps with the active item */}
        <div className="hidden md:col-span-5 md:block">
          <div className="sticky top-24">
            <div className="rounded-2xl bg-ink p-2 shadow-[0_40px_80px_-40px_rgba(17,17,16,0.5)]">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-3 py-2.5">
                <span className="h-2 w-2 rounded-full bg-cream/25" />
                <span className="h-2 w-2 rounded-full bg-cream/25" />
                <span className="h-2 w-2 rounded-full bg-rust" />
                <span className="eyebrow ml-3 text-cream/40">
                  victor.dev / {current.id}
                </span>
              </div>
              {/* Screen */}
              <div
                key={current.id}
                className="motion-safe:animate-[screenIn_0.5s_var(--ease-swift)] rounded-xl bg-ink-2 p-8"
              >
                <p className="eyebrow text-rust">
                  0{active + 1} {current.title}
                </p>
                <ul className="mt-6 space-y-3">
                  {current.skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center gap-3 font-mono text-sm text-cream/85"
                    >
                      <span aria-hidden className="text-rust">
                        →
                      </span>
                      {skill}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 h-24 rounded-lg bg-gradient-to-br from-rust/25 via-ink-3 to-ink" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
