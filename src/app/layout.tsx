import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { SiteShell } from "@/components/site-templates";
import {
  isIndexableDeployment,
  siteOrigin,
  siteSettings,
} from "@/lib/site-data";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  applicationName: siteSettings.brandName,
  title: {
    default: siteSettings.title,
    template: `%s — ${siteSettings.brandName}`,
  },
  description: siteSettings.description,
  alternates: {
    canonical: siteOrigin,
  },
  robots: {
    index: isIndexableDeployment,
    follow: isIndexableDeployment,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: siteSettings.title,
    description: siteSettings.description,
    url: siteOrigin,
    siteName: siteSettings.brandName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteSettings.title,
    description: siteSettings.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${plexMono.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-white antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
