import type { ContactLine, CtaLink, FooterGroup, NavItem, SocialLink } from "@/lib/site-types";

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
    (process.env.GITHUB_PAGES === "true"
      ? "https://mbelov080603.github.io/stilnoashki"
      : undefined) ??
    normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeUrl(process.env.VERCEL_URL) ??
    "http://localhost:3000"
  );
}

export const siteOrigin = resolveSiteOrigin();
export const isIndexableDeployment = Boolean(
  normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    (process.env.GITHUB_PAGES === "true"
      ? "https://mbelov080603.github.io/stilnoashki"
      : undefined) ??
    normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL),
);
export const isStaticExport =
  process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" || process.env.GITHUB_PAGES === "true";
export const siteBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH?.trim() ||
  (process.env.GITHUB_PAGES === "true" ? "/stilnoashki" : "");

export function assetPath(path: string) {
  if (!path || /^https?:\/\//.test(path) || !path.startsWith("/")) {
    return path;
  }

  if (!siteBasePath || path === siteBasePath || path.startsWith(`${siteBasePath}/`)) {
    return path;
  }

  return `${siteBasePath}${path}`;
}

export function assetUrl(path: string) {
  const resolvedPath = assetPath(path);
  if (/^https?:\/\//.test(resolvedPath)) {
    return resolvedPath;
  }

  return `${new URL(siteOrigin).origin}${resolvedPath}`;
}

export const analyticsIds = {
  gtm: process.env.NEXT_PUBLIC_GTM_ID?.trim() || "",
  ga4: process.env.NEXT_PUBLIC_GA4_ID?.trim() || "",
  yandexMetrika: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() || "",
};

export const documentLinks = {
  franchisePresentation: "/stilno/docs/stilno-business-presentation.pdf",
};

export const mediaAssets = {
  homeHeroDesktop: "/stilno/photos/home-click-one-hero.png",
  homeHeroPortrait: "/stilno/photos/home-click-one-hero-portrait.png",
  product: "/stilno/photos/product-pack-ananas-mango.jpg",
  productCloseVishnya: "/stilno/photos/product-close-vishnya.webp",
  lobbyProduct: "/stilno/photos/lobby-product.webp",
  lifestyleHand: "/stilno/photos/lifestyle-hand-car.webp",
  production: "/stilno/photos/production-line.webp",
  stores: "/stilno/photos/retail-counter.webp",
  storesPoint: "/stilno/photos/retail-counter.webp",
  partner: "/stilno/photos/business-desk.webp",
  franchise: "/stilno/redesign/franchise-process.svg",
  responsible: "/stilno/redesign/legal-18-footer-strip.svg",
  og: "/stilno/redesign/og-stilno.svg",
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
  contactEmail: "partners@stilno.ru",
  supportEmail: "support@stilno.ru",
  responseSla: "Ответ по заявке: до 1 рабочего дня",
};

export const siteSettings = {
  brandName: companyDetails.brandName,
  title: "STILNO | официальный сайт бренда 18+",
  description:
    "Официальный сайт STILNO: бренд 18+, качество, каталог, проверка оригинальности и отдельная страница заявки.",
  primaryNav: [
    { label: "Качество", href: "/quality" },
    { label: "Каталог", href: "/stores" },
    { label: "Карта магазинов", href: "/stores/map" },
    { label: "География партнёров", href: "/partners/geography" },
    { label: "Проверка", href: "/verify" },
  ] satisfies NavItem[],
  primaryCta: {
    label: "Оставить заявку",
    href: "/request",
    variant: "primary",
  } satisfies CtaLink,
  footerLinks: [
    { label: "Галерея", href: "/gallery" },
    { label: "Вакансии", href: "/careers" },
    { label: "Материалы", href: "/articles" },
    { label: "Инструкция", href: "/verify" },
    { label: "Поддержка", href: "/support" },
    { label: "Вопросы и ответы", href: "/faq" },
    { label: "Политика обработки данных", href: "/legal/privacy" },
    { label: "Согласие на обработку данных", href: "/legal/consent" },
    { label: "Политика cookies", href: "/legal/cookies" },
    { label: "Пользовательское соглашение", href: "/legal/terms" },
    { label: "Не является публичной офертой", href: "/legal/not-public-offer" },
  ] satisfies NavItem[],
  footerGroups: [
    {
      label: "Бренд",
      links: [
        { label: "STILNO", href: "/" },
        { label: "Качество", href: "/quality" },
        { label: "Каталог", href: "/stores" },
      ],
    },
    {
      label: "Обращения",
      links: [
        { label: "Оставить заявку", href: "/request" },
        { label: "Карта магазинов", href: "/stores/map" },
        { label: "География партнёров", href: "/partners/geography" },
        { label: "Контакты", href: "/contacts" },
        { label: "Франчайзинг", href: "/franchise#franchise-form" },
      ],
    },
    {
      label: "Информация",
      links: [
        { label: "Инструкция", href: "/verify" },
        { label: "Поддержка", href: "/support" },
        { label: "Ответственное потребление", href: "/responsible" },
      ],
    },
    {
      label: "Legal",
      links: [
        { label: "Политика обработки данных", href: "/legal/privacy" },
        { label: "Согласие на обработку данных", href: "/legal/consent" },
        { label: "Политика cookies", href: "/legal/cookies" },
        { label: "Пользовательское соглашение", href: "/legal/terms" },
        { label: "Не является публичной офертой", href: "/legal/not-public-offer" },
      ],
    },
  ] satisfies FooterGroup[],
  contactLines: [
    { label: "Компания", value: companyDetails.companyName },
    { label: "Юридический адрес", value: companyDetails.legalAddress },
    { label: "Производство", value: companyDetails.productionAddress },
    {
      label: "Обращения",
      value:
        "Страница заявки помогает оставить обращение по партнёрству, дистрибуции, розничной точке или другому запросу.",
      href: "/request",
    },
    {
      label: "B2B email",
      value: companyDetails.contactEmail,
      href: `mailto:${companyDetails.contactEmail}`,
    },
    {
      label: "Поддержка",
      value: companyDetails.supportEmail,
      href: `mailto:${companyDetails.supportEmail}`,
    },
    {
      label: "Регламент ответа",
      value: companyDetails.responseSla,
    },
  ] satisfies ContactLine[],
  socialLinks: [] as SocialLink[],
  ageGateVersion: "2.0",
  consentVersion: "2.0",
  mapProvider: "manual-launch-map",
  exitHref: "https://ya.ru",
};
