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
  title: "STILNO",
  description:
    "Официальный сайт STILNO. STILNO CLICK ONE: 10 мл, 850 мАч, Type-C, 10-22 Вт, 20 мг/см3 и до 15000 затяжек. Франчайзинг, оптовые запросы и ответственное потребление.",
  primaryNav: [
    { label: "Магазины", href: "/stores" },
    { label: "О бренде", href: "/about" },
    { label: "Галерея", href: "/gallery" },
    { label: "Продукция", href: "/products" },
    { label: "Партнёры", href: "/partners" },
    { label: "Ответственное потребление", href: "/responsible" },
    { label: "Франчайзинг", href: "/franchise" },
    { label: "Вакансии", href: "/careers" },
    { label: "Контакты", href: "/contacts" },
  ] satisfies NavItem[],
  primaryCta: {
    label: "Стать партнёром",
    href: "/franchise",
    variant: "primary",
  } satisfies CtaLink,
  footerLinks: [
    { label: "Политика конфиденциальности", href: "/legal/privacy" },
    { label: "Пользовательское соглашение", href: "/legal/terms" },
    { label: "Политика cookies", href: "/legal/cookies" },
    { label: "Согласие на обработку данных", href: "/legal/consent" },
    { label: "Вопросы и ответы", href: "/faq" },
    { label: "Материалы", href: "/articles" },
  ] satisfies NavItem[],
  contactLines: [
    { label: "Компания", value: companyDetails.companyName },
    { label: "Юридический адрес", value: companyDetails.legalAddress },
    { label: "Производство", value: companyDetails.productionAddress },
    { label: "Обращения", value: "Розничные, оптовые и франчайзинговые запросы принимаются через формы сайта.", href: "/contacts" },
  ] satisfies ContactLine[],
  socialLinks: [] as SocialLink[],
  ageGateVersion: "1.1",
  consentVersion: "1.1",
  mapProvider: "manual-launch-map",
  exitHref: "https://ya.ru",
};
