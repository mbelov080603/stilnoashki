import type { MetadataRoute } from "next";

import { isIndexableDeployment, siteOrigin } from "@/lib/site-data";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: isIndexableDeployment ? "/" : undefined,
      disallow: isIndexableDeployment ? ["/thank-you/", "/api/"] : "/",
    },
    sitemap: `${siteOrigin}/sitemap.xml`,
    host: siteOrigin,
  };
}
