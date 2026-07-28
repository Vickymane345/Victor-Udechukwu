"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { PROJECTS, POSTS } from "@/lib/data";

/**
 * Selected Work — editorial index.
 * Desktop: numbered rows; hovering a row floats its preview beside the cursor.
 * Mobile: each row carries its own inline preview, no hover dependency.
 */
export default function Work() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".work-heading .line", {
          yPercent: 110,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });

        gsap.utils.toArray<HTMLElement>(".work-row").forEach((row) => {
          gsap.from(row, {
            autoAlpha: 0,
            y: 28,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 88%" },
          });
        });

        gsap.utils.toArray<HTMLElement>(".post-card").forEach((card, i) => {
          gsap.from(card, {
            autoAlpha: 0,
            y: 36,
            duration: 0.9,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".posts-grid", start: "top 85%" },
          });
        });
      });

      // Cursor-following preview (desktop pointer devices only)
      mm.add("(hover: hover) and (min-width: 1024px)", () => {
        const move = (e: MouseEvent) => {
          gsap.to(preview.current, {
            x: e.clientX + 32,
            y: e.clientY - 140,
            duration: 0.7,
            ease: "power3.out",
          });
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="work"
      aria-labelledby="work-heading"
      className="bg-ink py-20 text-cream sm:py-28 md:py-36"
    >
      <div className="px-5 sm:px-8 md:px-10">
        <p className="eyebrow mb-5 text-rust">Selected work</p>
        <h2 id="work-heading" className="work-heading display text-huge">
          <span className="mask">
            <span className="line">Things I</span>
          </span>
          <span className="mask">
            <span className="line">have built</span>
          </span>
        </h2>
      </div>

      {/* Project index */}
      <ol className="mt-14 px-5 sm:px-8 md:mt-20 md:px-10">
        {PROJECTS.map((project, i) => {
          const Row = project.url ? "a" : "div";
          return (
            <li key={project.id} className="work-row border-t rule-light last:border-b">
              <Row
                {...(project.url
                  ? {
                      href: project.url,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : {})}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="group flex flex-col gap-4 py-7 transition-colors duration-500 hover:text-rust md:flex-row md:items-center md:gap-8 md:py-10"
              >
                <span className="eyebrow w-8 shrink-0 text-cream/40">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Name with its tech stack directly beside it */}
                <div className="flex flex-col gap-2 md:flex-1 md:flex-row md:items-baseline md:gap-6">
                  <h3 className="display text-[clamp(1.75rem,6vw,4rem)] leading-none">
                    {project.title}
                  </h3>
                  <p className="font-mono text-xs leading-relaxed text-cream/55">
                    {project.stack}
                  </p>
                </div>

                {/* Inline preview on mobile only */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg md:hidden">
                  <Image
                    src={`https://picsum.photos/seed/${project.seed}/900/600`}
                    alt={`${project.title} preview`}
                    fill
                    sizes="100vw"
                    className="object-cover grayscale"
                  />
                </div>

                <span className="eyebrow shrink-0 text-rust md:w-24 md:text-right">
                  {project.url ? "Visit ↗" : project.note ?? project.tag}
                </span>
              </Row>
            </li>
          );
        })}
      </ol>

      {/* Floating cursor preview (desktop) */}
      <div
        ref={preview}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden h-72 w-[26rem] overflow-hidden rounded-xl transition-opacity duration-500 lg:block ${
          active === null ? "opacity-0" : "opacity-100"
        }`}
      >
        {active !== null && (
          <Image
            src={`https://picsum.photos/seed/${PROJECTS[active].seed}/1000/700`}
            alt=""
            fill
            sizes="416px"
            className="object-cover grayscale contrast-110"
          />
        )}
        <div className="absolute inset-0 bg-rust/20 mix-blend-multiply" />
      </div>

      {/* Writing — LinkedIn embeds */}
      <div className="mt-24 px-5 sm:px-8 md:mt-36 md:px-10">
        <div className="flex flex-col gap-2 border-t rule-light pt-8 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="display text-[clamp(1.75rem,5vw,3.5rem)]">
            Writing on React Native
          </h3>
          <p className="eyebrow text-cream/50">Published on LinkedIn</p>
        </div>

        <div className="posts-grid mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {POSTS.map((post) => (
            <article key={post.id} className="post-card flex flex-col">
              <div className="mb-4">
                <h4 className="display text-xl sm:text-2xl">{post.title}</h4>
                <p className="mt-1.5 font-mono text-xs leading-relaxed text-cream/55">
                  {post.blurb}
                </p>
              </div>
              <div className="relative aspect-[504/620] w-full overflow-hidden rounded-lg bg-ink-2 ring-1 ring-cream/10">
                <iframe
                  src={`https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${post.urn}`}
                  title={post.title}
                  loading="lazy"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
