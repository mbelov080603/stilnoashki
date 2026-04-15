import type { MetadataRoute } from "next";

import { getAllStaticPaths } from "@/lib/site-data";
import { siteOrigin } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteOrigin,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...getAllStaticPaths().map((slug) => ({
      url: `${siteOrigin}/${slug.join("/")}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: slug[0] === "franchise" || slug[0] === "products" ? 0.9 : 0.7,
    })),
  ];
}

