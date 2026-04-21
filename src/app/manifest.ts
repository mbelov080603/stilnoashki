import type { MetadataRoute } from "next";

import { siteSettings } from "@/lib/site-data";

const appBasePath = process.env.GITHUB_PAGES === "true" ? "/stilnoashki" : "";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteSettings.brandName,
    short_name: "STILNO",
    description: siteSettings.description,
    start_url: `${appBasePath}/`,
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      {
        src: `${appBasePath}/favicon.ico`,
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
