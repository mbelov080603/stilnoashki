import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { SiteShell } from "@/components/site-templates";
import {
  defaultMetadataImage,
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

const defaultImage = `${siteOrigin}${defaultMetadataImage}`;

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
        url: defaultImage,
        width: 1200,
        height: 1200,
        alt: `${siteSettings.brandName} product render`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteSettings.title,
    description: siteSettings.description,
    images: [defaultImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${plexMono.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-black antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
