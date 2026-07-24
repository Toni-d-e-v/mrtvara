import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile in a parent
  // directory otherwise confuses Turbopack's root inference).
  turbopack: {
    root: path.join(__dirname),
  },
  // OG kartice čitaju loga s diska (data-URI za next/og) — bez ovoga PNG-ovi
  // ne završe u serverless bundleu.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./public/logos/**"],
    "/matches/[id]/opengraph-image": ["./public/logos/**"],
  },
};

export default nextConfig;
