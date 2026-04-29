import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = "/stilnoashki";
const githubPagesSiteUrl = "https://mbelov080603.github.io/stilnoashki";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  env: {
    NEXT_PUBLIC_STATIC_EXPORT:
      process.env.NEXT_PUBLIC_STATIC_EXPORT ?? (isGithubPages ? "true" : ""),
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? (isGithubPages ? githubPagesBasePath : ""),
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? (isGithubPages ? githubPagesSiteUrl : ""),
  },
  ...(isGithubPages
    ? {
        output: "export",
        basePath: githubPagesBasePath,
        assetPrefix: githubPagesBasePath,
        images: {
          unoptimized: true,
        },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
