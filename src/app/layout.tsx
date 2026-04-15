import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { SiteShell } from "@/components/site-templates";
import { featuredProduct, siteOrigin, siteSettings } from "@/lib/site-data";

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

const defaultImage = `${siteOrigin}${featuredProduct.variants[0].image ?? featuredProduct.images[0]}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: `${siteSettings.brandName} v2`,
  description: siteSettings.description,
  alternates: {
    canonical: siteOrigin,
  },
  openGraph: {
    title: `${siteSettings.brandName} v2`,
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
    title: `${siteSettings.brandName} v2`,
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

