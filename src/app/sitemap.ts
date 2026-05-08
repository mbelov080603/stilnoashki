import type { MetadataRoute } from "next";

import { getAllStaticPaths, resolvePage } from "@/lib/site-data";
import { siteOrigin } from "@/lib/site-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const excludedSections = new Set([
    "articles",
    "careers",
    "faq",
    "franchise",
    "gallery",
    "partners",
    "responsible",
    "thank-you",
  ]);

  return [
    {
      url: siteOrigin,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...getAllStaticPaths()
      .filter((slug) => !excludedSections.has(slug[0] ?? ""))
      .filter((slug) => !resolvePage(slug)?.canonicalPath)
      .map((slug) => ({
        url: `${siteOrigin}/${slug.join("/")}`,
        lastModified: now,
        changeFrequency: slug[0] === "legal" ? ("yearly" as const) : ("weekly" as const),
        priority: slug[0] === "stores" || slug[0] === "brand" || slug[0] === "quality" ? 0.9 : 0.7,
      })),
  ];
}
