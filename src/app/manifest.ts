import type { MetadataRoute } from "next";

import { siteSettings } from "@/lib/site-data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteSettings.brandName,
    short_name: "STILNO",
    description: siteSettings.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
