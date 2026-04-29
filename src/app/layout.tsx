import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { SiteShell } from "@/components/site-templates";
import {
  assetUrl,
  isIndexableDeployment,
  mediaAssets,
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

const defaultOgImage = assetUrl(mediaAssets.og);

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
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteSettings.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteSettings.title,
    description: siteSettings.description,
    images: [defaultOgImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" className={`${manrope.variable} ${plexMono.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-white antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
