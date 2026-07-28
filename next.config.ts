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
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
