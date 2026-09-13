"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Screenshot of a live deployment, with a graceful climb-down to the repo's
 * OpenGraph card when the screenshot service is rate-limited or slow.
 *
 * Pass `key={src}` at the call site so a new src resets the fallback state.
 */
export default function ProjectShot({
  src,
  fallback,
  alt,
  sizes,
  className = "",
}: {
  src: string;
  fallback: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  const [source, setSource] = useState(src);

  return (
    <Image
      src={source}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => {
        if (source !== fallback) setSource(fallback);
      }}
    />
  );
}
