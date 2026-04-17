import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import Script from "next/script";

import { SiteShell } from "@/components/site-templates";
import {
  analyticsIds,
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
    default: siteSettings.brandName,
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
    title: siteSettings.brandName,
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
    title: siteSettings.brandName,
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
        {analyticsIds.gtm ? (
          <>
            <Script id="stilno-gtm" strategy="afterInteractive">{`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${analyticsIds.gtm}');
            `}</Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${analyticsIds.gtm}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        ) : null}

        {!analyticsIds.gtm && analyticsIds.ga4 ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsIds.ga4}`}
              strategy="afterInteractive"
            />
            <Script id="stilno-ga4" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${analyticsIds.ga4}', { send_page_view: true });
            `}</Script>
          </>
        ) : null}

        {analyticsIds.yandexMetrika ? (
          <Script id="stilno-metrika" strategy="afterInteractive">{`
            window.stilnoMetrikaId = ${Number(analyticsIds.yandexMetrika)};
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${Number(analyticsIds.yandexMetrika)}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });
          `}</Script>
        ) : null}
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
