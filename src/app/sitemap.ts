import type { MetadataRoute } from "next";

import { getAllStaticPaths } from "@/lib/site-data";
import { siteOrigin } from "@/lib/site-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const excludedSections = new Set(["thank-you"]);

  return [
    {
      url: siteOrigin,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...getAllStaticPaths()
      .filter((slug) => !excludedSections.has(slug[0] ?? ""))
      .map((slug) => ({
        url: `${siteOrigin}/${slug.join("/")}`,
        lastModified: now,
        changeFrequency: slug[0] === "legal" ? ("yearly" as const) : ("weekly" as const),
        priority: slug[0] === "franchise" || slug[0] === "products" ? 0.9 : 0.7,
      })),
  ];
}
