import type { ContactLine, CtaLink, NavItem, SocialLink } from "@/lib/site-types";

function normalizeUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) {
    return undefined;
  }

  if (/^https?:\/\//.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function resolveSiteOrigin() {
  return (
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeUrl(process.env.VERCEL_URL) ??
    "http://localhost:3000"
  );
}

export const siteOrigin = resolveSiteOrigin();
export const isIndexableDeployment = Boolean(
  normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL),
);
export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export const analyticsIds = {
  gtm: process.env.NEXT_PUBLIC_GTM_ID?.trim() || "",
  ga4: process.env.NEXT_PUBLIC_GA4_ID?.trim() || "",
  yandexMetrika: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() || "",
};

export const documentLinks = {
  franchisePresentation: "/stilno/docs/stilno-business-presentation.pdf",
  deviceAndPackage: "/stilno/docs/stilno-click-one-device-package.pdf",
};

export const companyDetails = {
  brandName: "STILNO",
  companyName: 'ООО "ВОСТОК ИМПОРТ ПРОМ"',
  legalAddress:
    "117335, Россия, г. Москва, вн. тер. г. муниципальный округ Ломоносовский, ул. Вавилова, д. 69/75.",
  productionAddress:
    "142631, Московская область, г. Орехово-Зуево, д. Ожерелки, влд. 2/6, стр. 6.",
  storageConditions: "Хранить при температуре от 0°C до 30°C в недоступном для детей месте.",
  shelfLife: "4 года",
  gost: "ГОСТ Р 58109-2018",
};

export const siteSettings = {
  brandName: companyDetails.brandName,
  title: "STILNO CLICK ONE | официальный сайт бренда 18+",
  description:
    "STILNO CLICK ONE: официальный сайт бренда 18+ с информацией о продукте, партнёрстве, франчайзинге, розничных запросах и правовых ограничениях категории.",
  primaryNav: [
    { label: "Продукт", href: "/products/stilno-click-one" },
    { label: "Партнёрам", href: "/partners" },
    { label: "Где купить", href: "/stores" },
    { label: "Франчайзинг", href: "/franchise" },
    { label: "Контакты", href: "/contacts" },
  ] satisfies NavItem[],
  primaryCta: {
    label: "Стать партнёром",
    href: "/franchise",
    variant: "primary",
  } satisfies CtaLink,
  footerLinks: [
    { label: "Галерея", href: "/gallery" },
    { label: "Вакансии", href: "/careers" },
    { label: "Материалы", href: "/articles" },
    { label: "Вопросы и ответы", href: "/faq" },
    { label: "Политика обработки данных", href: "/legal/privacy" },
    { label: "Согласие на обработку данных", href: "/legal/consent" },
    { label: "Политика cookies", href: "/legal/cookies" },
    { label: "Пользовательское соглашение", href: "/legal/terms" },
    { label: "Не является публичной офертой", href: "/legal/not-public-offer" },
  ] satisfies NavItem[],
  contactLines: [
    { label: "Компания", value: companyDetails.companyName },
    { label: "Юридический адрес", value: companyDetails.legalAddress },
    { label: "Производство", value: companyDetails.productionAddress },
    {
      label: "Обращения",
      value:
        "Розничные, партнёрские и франчайзинговые запросы принимаются через формы сайта.",
      href: "/contacts",
    },
  ] satisfies ContactLine[],
  socialLinks: [] as SocialLink[],
  ageGateVersion: "2.0",
  consentVersion: "2.0",
  mapProvider: "manual-launch-map",
  exitHref: "https://ya.ru",
};
