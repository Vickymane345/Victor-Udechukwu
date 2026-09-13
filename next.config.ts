import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Pin the workspace root (a stray lockfile in the user home dir was
  // making Turbopack infer C:\Users\STRIX as the root).
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  images: {
    // TODO: remove picsum once real project screenshots / portrait are added to /public
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      // Live-site screenshots for the auto-generated Work section
      { protocol: "https", hostname: "api.microlink.io" },
      { protocol: "https", hostname: "image.thum.io" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
    ],
    // Screenshot services are rate-limited; cache each optimized result for a
    // day so visitors never trigger a fresh capture.
    minimumCacheTTL: 60 * 60 * 24,
  },
};

export default nextConfig;
