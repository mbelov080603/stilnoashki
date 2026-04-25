import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  AgeGate,
  AnalyticsBridge,
  AnalyticsLoader,
  CookieBanner,
  FaqAccordion,
  LeadForm,
  SiteHeader,
  VariantPicker,
  VariantPickerFallback,
} from "@/components/site-client";
import { featuredProduct, galleryItems, productCategories, qualityStandards } from "@/lib/catalog-data";
import { assetPath, companyDetails, documentLinks, siteOrigin, siteSettings } from "@/lib/site-config";
import {
  articles,
  brandNarrative,
  contactsPageContent,
  faqItems,
  faqPageGroups,
  formSchemas,
  franchiseContent,
  franchisePillars,
  homeContent,
  launchMetrics,
  partnersPageContent,
  partnershipScenarios,
  productPageContent,
  responsibilityNotes,
  storesContent,
  vacancies,
} from "@/lib/site-content";
import { defaultMetadataImage, getAllStaticPaths, getArticlePath, getBreadcrumbs, getProductCategoryPath, getProductPath, getVacancyPath } from "@/lib/site-routing";
import type { CtaLink, PageHeroContract, Product, ResolvedPage, SectionContract } from "@/lib/site-types";

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ButtonLink({
  href,
  children,
  variant = "primary",
  analytics,
  target,
  tone = "light",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  analytics?: string;
  target?: string;
  tone?: "dark" | "light";
}) {
  const style =
    variant === "primary"
      ? tone === "dark"
        ? "border-white/14 bg-white/[0.06] text-white hover:border-white/28 hover:bg-white/[0.1]"
        : "border-transparent bg-black text-white hover:bg-black/86"
      : tone === "dark"
        ? "border-white/12 bg-white/[0.04] text-white hover:border-white/22 hover:bg-white/[0.08]"
        : "border-black/16 bg-[#e8e8e5] text-[#0B1018] hover:border-black/28 hover:bg-white";
  const inlineStyle =
    variant !== "primary" && tone === "light"
      ? {
          color: "#0B1018",
        }
      : undefined;

  return (
    <Link
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      style={inlineStyle}
      data-analytics={analytics}
      className={`inline-flex min-h-11 max-w-full items-center justify-center rounded-full border px-5 py-3 text-center text-sm font-medium leading-5 transition ${style}`}
    >
      {children}
    </Link>
  );
}

function ActionGroup({
  actions,
  tone = "light",
  analyticsPrefix,
}: {
  actions?: CtaLink[];
  tone?: "dark" | "light";
  analyticsPrefix?: string;
}) {
  if (!actions?.length) {
    return null;
  }

  return (
    <div className="mt-8 flex max-w-full flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
      {actions.map((action, index) => (
        <ButtonLink
          key={`${action.label}-${action.href}`}
          href={action.href}
          target={action.target}
          variant={action.variant ?? (index === 0 ? "primary" : "secondary")}
          analytics={analyticsPrefix ? `${analyticsPrefix}_${index + 1}` : undefined}
          tone={tone}
        >
          {action.label}
        </ButtonLink>
      ))}
    </div>
  );
}

function SectionIntro({
  contract,
  tone = "light",
  as = "h2",
}: {
  contract: SectionContract;
  tone?: "dark" | "light";
  as?: "h1" | "h2";
}) {
  const TitleTag = as;

  return (
    <div className="max-w-3xl">
      {contract.eyebrow ? (
        <div
          className={classNames(
            "mb-5 inline-flex max-w-full items-center gap-3 text-[0.72rem] uppercase tracking-[0.28em]",
            tone === "dark" ? "text-white/42" : "text-black/36",
          )}
        >
          <span className={classNames("h-px w-12", tone === "dark" ? "bg-white/22" : "bg-black/18")} />
          <span>{contract.eyebrow}</span>
        </div>
      ) : null}
      <TitleTag
        className={classNames(
          "text-4xl font-semibold leading-[1] tracking-[-0.035em] sm:text-5xl lg:text-[3.25rem]",
          tone === "dark" ? "text-white" : "text-black",
        )}
      >
        {contract.title}
      </TitleTag>
      <p
        className={classNames(
          "mt-5 max-w-2xl text-base leading-7 sm:text-lg",
          tone === "dark" ? "text-white/66" : "text-black/62",
        )}
      >
        {contract.body}
      </p>
      <ActionGroup actions={contract.actions} tone={tone} />
    </div>
  );
}

function PageHero({
  contract,
  tone = "light",
  media,
  compact = false,
}: {
  contract: PageHeroContract;
  tone?: "dark" | "light";
  media?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={classNames(
        "grid gap-10",
        media ? "xl:grid-cols-[0.9fr_1.1fr] xl:items-center" : "",
        compact ? "py-2" : "",
      )}
    >
      <div>
        {contract.eyebrow ? (
          <div
            className={classNames(
              "mb-5 inline-flex max-w-full items-center gap-3 text-[0.72rem] uppercase tracking-[0.28em]",
              tone === "dark" ? "text-white/42" : "text-black/36",
            )}
          >
            <span className={classNames("h-px w-12", tone === "dark" ? "bg-white/22" : "bg-black/18")} />
            <span>{contract.eyebrow}</span>
          </div>
        ) : null}
        <h1
          className={classNames(
            "max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.035em] sm:text-6xl lg:text-[4.35rem]",
            tone === "dark" ? "text-white" : "text-black",
          )}
        >
          {contract.title}
        </h1>
        <p
          className={classNames(
            "mt-6 max-w-2xl text-lg leading-8",
            tone === "dark" ? "text-white/68" : "text-black/64",
          )}
        >
          {contract.body}
        </p>
        {contract.detailLine ? (
          <div
            className={classNames(
              "mt-6 inline-flex max-w-3xl rounded-[1.5rem] border px-5 py-4 text-sm leading-7 sm:text-base",
              tone === "dark"
                ? "border-white/10 bg-white/[0.04] text-white/84"
                : "border-black/10 bg-white text-black",
            )}
          >
            {contract.detailLine}
          </div>
        ) : null}
        {contract.note ? (
          <p className={classNames("mt-3 text-sm", tone === "dark" ? "text-white/44" : "text-black/42")}>
            {contract.note}
          </p>
        ) : null}
        <ActionGroup actions={contract.actions} tone={tone} />
      </div>
      {media ? <div>{media}</div> : null}
    </div>
  );
}

function StructuredData({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function buildJsonLd(page?: ResolvedPage) {
  if (!page) {
    return [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteSettings.brandName,
        legalName: companyDetails.companyName,
        description: siteSettings.description,
        url: siteOrigin,
        address: {
          "@type": "PostalAddress",
          streetAddress: companyDetails.legalAddress,
          addressCountry: "RU",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteSettings.brandName,
        url: siteOrigin,
      },
    ];
  }

  const canonicalUrl = `${siteOrigin}/${page.pathname.join("/")}`;

  switch (page.kind) {
    case "product":
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: page.product?.title,
        description: page.product?.shortDescription,
        brand: {
          "@type": "Brand",
          name: siteSettings.brandName,
        },
        manufacturer: {
          "@type": "Organization",
          name: companyDetails.companyName,
        },
        image: page.product?.images[0] ? `${siteOrigin}${page.product.images[0]}` : undefined,
        url: canonicalUrl,
        additionalProperty: page.product?.specs.map((spec) => ({
          "@type": "PropertyValue",
          name: spec.label,
          value: spec.value,
        })),
      };
    case "faq":
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      };
    case "article":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: page.article?.title,
        description: page.article?.excerpt,
        datePublished: page.article?.publishedAt,
        author: {
          "@type": "Organization",
          name: page.article?.author,
        },
        mainEntityOfPage: canonicalUrl,
      };
    default:
      return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: page.title,
        description: page.description,
        url: canonicalUrl,
      };
  }
}

function BreadcrumbTrail({ pathname, title, tone = "light" }: { pathname: string[]; title: string; tone?: "dark" | "light" }) {
  const breadcrumbs = getBreadcrumbs(pathname, title);
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav
      className={classNames(
        "mb-8 flex flex-wrap items-center gap-2 text-sm",
        tone === "dark" ? "text-white/42" : "text-black/40",
      )}
      aria-label="Breadcrumbs"
    >
      <Link href="/" className="transition hover:text-current">
        Главная
      </Link>
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={breadcrumb.href} className="flex items-center gap-2">
          <span>/</span>
          {index === breadcrumbs.length - 1 ? (
            <span className={tone === "dark" ? "text-white/70" : "text-black/70"}>{breadcrumb.label}</span>
          ) : (
            <Link href={breadcrumb.href} className="transition hover:text-current">
              {breadcrumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

function RichText({
  paragraphs,
  tone = "light",
}: {
  paragraphs: string[];
  tone?: "dark" | "light";
}) {
  return (
    <div className={classNames("grid gap-4 text-base leading-7", tone === "dark" ? "text-white/68" : "text-black/68")}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function SvgAsset({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return <Image src={assetPath(src)} alt={alt} width={1600} height={900} unoptimized className={className} />;
}

function ProductPhotoCard({
  src,
  alt,
  aspect = "wide",
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  aspect?: "square" | "wide";
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_62%_18%,rgba(255,255,255,0.24),transparent_36%),linear-gradient(145deg,#1d2025,#050607_68%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        aspect === "wide" ? "min-h-[18rem]" : "min-h-[15rem]",
        className,
      )}
    >
      <div className="absolute inset-5 rounded-[1.55rem] border border-white/12 bg-[radial-gradient(circle_at_34%_18%,rgba(255,255,255,0.76),rgba(190,195,198,0.56)_34%,rgba(35,39,44,0.26)_68%),linear-gradient(145deg,rgba(232,234,234,0.38),rgba(24,26,29,0.16))]" />
      <Image
        src={assetPath(src)}
        alt={alt}
        width={1600}
        height={1200}
        priority={priority}
        unoptimized
        className="relative z-10 mx-auto h-full w-full object-contain drop-shadow-[0_30px_48px_rgba(0,0,0,0.58)]"
      />
    </div>
  );
}

function EditorialImageCard({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={classNames(
        "overflow-hidden rounded-[2.2rem] border border-black/10 bg-black shadow-[0_22px_66px_rgba(10,10,10,0.14)]",
        className,
      )}
    >
      <Image
        src={assetPath(src)}
        alt={alt}
        width={1800}
        height={1200}
        priority={priority}
        unoptimized
        className="h-full min-h-[22rem] w-full object-cover"
      />
    </div>
  );
}

const franchiseProcessDetails = [
  {
    title: "Заявка",
    body: "Партнёр оставляет контакты, город и текущий статус проекта.",
  },
  {
    title: "Первичный контакт",
    body: "Менеджер уточняет задачу, формат и релевантность региона.",
  },
  {
    title: "Город и локация",
    body: "Обсуждаются регион, потенциальная зона запуска и ограничения категории 18+.",
  },
  {
    title: "Формат",
    body: "Разделяем опт, региональное партнёрство, розничную точку и запуск под брендом.",
  },
  {
    title: "Условия",
    body: "Условия обсуждаются индивидуально, без публичной оферты и витринных обещаний.",
  },
  {
    title: "Документы",
    body: "Фиксируется правовая рамка, обязанности сторон и порядок работы с материалами.",
  },
  {
    title: "Подготовка",
    body: "Передаются продуктовая база, брендовые материалы и рабочий контакт.",
  },
  {
    title: "Старт",
    body: "Запуск проходит после согласования формата и готовности партнёра соблюдать стандарты.",
  },
];

const franchiseSupportItems = [
  {
    title: "Материалы бренда",
    body: "Презентация, визуальные правила и аккуратная B2B-коммуникация.",
  },
  {
    title: "Продуктовая база",
    body: "Подтверждённые характеристики линии STILNO CLICK ONE и упаковочных материалов.",
  },
  {
    title: "Маршрут запуска",
    body: "Понятная последовательность от заявки до подготовки старта.",
  },
  {
    title: "Контакт менеджера",
    body: "Один канал для уточнения региона, документов и следующих шагов.",
  },
];

const franchiseVisualDevices = [
  {
    src: "/stilno/products-cutout/myata.png",
    className: "z-10 w-[clamp(5.8rem,18vw,11rem)] opacity-80",
    compactClassName: "z-10 w-[clamp(3.8rem,15vw,6.7rem)] opacity-80",
  },
  {
    src: "/stilno/products-cutout/barbaris.png",
    className: "z-20 w-[clamp(6.7rem,20vw,13rem)]",
    compactClassName: "z-20 w-[clamp(4.5rem,17vw,7.8rem)]",
  },
  {
    src: "/stilno/products-cutout/yagodniy-energetik.png",
    className: "z-30 w-[clamp(7.6rem,22vw,15rem)]",
    compactClassName: "z-30 w-[clamp(5.2rem,19vw,8.8rem)]",
  },
  {
    src: "/stilno/products-cutout/vishnya-limon-persik.png",
    className: "z-20 w-[clamp(6.7rem,20vw,13rem)]",
    compactClassName: "z-20 w-[clamp(4.5rem,17vw,7.8rem)]",
  },
  {
    src: "/stilno/products-cutout/fruktoviy-chay.png",
    className: "z-10 w-[clamp(5.8rem,18vw,11rem)] opacity-90",
    compactClassName: "z-10 w-[clamp(3.8rem,15vw,6.7rem)] opacity-90",
  },
];

const franchiseHeroSignals = [
  { label: "Возрастная рамка", value: "18+" },
  { label: "Коммуникация", value: "заявка -> контакт" },
  { label: "Материалы", value: "презентация и база" },
  { label: "Условия", value: "индивидуально" },
];

function FranchiseProductLineup({ priority = false, compact = false }: { priority?: boolean; compact?: boolean }) {
  return (
    <div
      className={classNames(
        "pointer-events-none relative mx-auto flex w-full items-end justify-center",
        compact
          ? "min-h-[13rem] max-w-[28rem] -space-x-9 sm:min-h-[16rem] sm:-space-x-12"
          : "min-h-[21rem] max-w-[48rem] -space-x-14 sm:min-h-[28rem] sm:-space-x-28",
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-x-8 bottom-0 h-24 rounded-full bg-black/78 blur-2xl" />
      {franchiseVisualDevices.map((device) => (
        <Image
          key={device.src}
          src={assetPath(device.src)}
          alt=""
          width={1181}
          height={1700}
          priority={priority}
          unoptimized
          className={classNames(
            "relative h-auto shrink-0 object-contain drop-shadow-[0_28px_38px_rgba(0,0,0,0.62)]",
            compact ? device.compactClassName : device.className,
          )}
        />
      ))}
    </div>
  );
}

function FranchiseHeroScene({ priority = false }: { priority?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#0c0d0e] p-px shadow-[0_30px_90px_rgba(0,0,0,0.34)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_28%,rgba(255,255,255,0.06)_72%,transparent)]" />
      <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[#101113] p-5 ring-1 ring-white/8 sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(255,255,255,0.11),transparent_34%)]" />
        <div className="absolute -right-24 bottom-0 h-56 w-72 bg-white/[0.03] blur-3xl" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/52">STILNO / launch file</p>
          <span className="rounded-full border border-white/12 px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/58">
            18+
          </span>
        </div>

        <div className="relative z-10 mt-8 grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/42">Не публичная оферта</p>
            <h3 className="mt-4 max-w-[24rem] text-3xl font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl">
              Запуск обсуждается после заявки
            </h3>
            <p className="mt-5 max-w-[24rem] text-sm leading-6 text-white/62">
              Сначала фиксируем город, формат и статус проекта. Затем переходим к материалам, документам и условиям.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-4 border-y border-white/10 py-5">
              {franchiseHeroSignals.map((signal) => (
                <div key={signal.label}>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/34">
                    {signal.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/82">{signal.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:-translate-x-8">
            <FranchiseProductLineup priority={priority} />
            <div className="absolute bottom-5 right-0 hidden w-[13rem] rounded-[1.4rem] border border-white/12 bg-black/48 p-4 backdrop-blur md:block">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/42">Пакет</p>
              <p className="mt-2 text-sm leading-5 text-white/76">брендовые материалы · продуктовая база · рабочий контакт</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FranchiseRoadmap() {
  return (
    <div className="relative">
      <div className="absolute bottom-6 left-5 top-6 hidden w-px bg-black/10 sm:block" aria-hidden="true" />
      {franchiseProcessDetails.map((item, index) => (
        <article
          key={item.title}
          className="relative grid gap-4 border-b border-black/10 py-5 last:border-b-0 sm:grid-cols-[3.25rem_0.68fr_1fr] sm:items-start"
        >
          <div className="flex items-center gap-3 sm:block">
            <span className="relative z-10 inline-flex size-10 items-center justify-center rounded-full border border-black/10 bg-[var(--color-page)] text-xs font-semibold text-black/46">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-black">{item.title}</h3>
          <p className="text-sm leading-7 text-black/60 sm:text-base">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function FranchisePartnerKit() {
  return (
    <div className="grid gap-10 xl:grid-cols-[1fr_0.92fr] xl:items-start">
      <div>
        <SectionIntro contract={franchiseContent.supportSection} tone="dark" />
        <div className="mt-10 grid border-y border-white/10 lg:grid-cols-2">
          {franchiseSupportItems.map((item, index) => (
            <article
              key={item.title}
              className={classNames(
                "border-b border-white/10 py-6 lg:p-6",
                index % 2 === 0 && "lg:border-r",
                index > 1 && "lg:border-b-0",
              )}
            >
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-white/34">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{item.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-8">
        <div>
          <SectionIntro contract={franchiseContent.audienceSection} tone="dark" />
          <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
            {franchiseContent.audienceItems.map((item, index) => (
              <div key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 py-4">
                <span className="text-sm font-semibold text-white/34">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-sm leading-6 text-white/68">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0c0e] p-5">
          <div className="absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.04)_0_16%,transparent_16%_28%,rgba(255,255,255,0.07)_28%_40%,transparent_40%_100%)]" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">Документы и материалы</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink
                href={documentLinks.franchisePresentation}
                target="_blank"
                tone="dark"
                variant="secondary"
                analytics="franchise_download_presentation"
              >
                Скачать презентацию
              </ButtonLink>
              <ButtonLink
                href={documentLinks.deviceAndPackage}
                target="_blank"
                tone="dark"
                variant="secondary"
                analytics="franchise_download_product_pack"
              >
                Материалы по продукту
              </ButtonLink>
            </div>
            <div className="mt-7 grid gap-3">
              {franchisePillars.map((pillar) => (
                <p key={pillar} className="border-t border-white/10 pt-3 text-sm leading-6 text-white/58">
                  {pillar}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FranchiseFormAside({ items }: { items: typeof faqItems }) {
  return (
    <div className="grid gap-5">
      <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[#0b0c0e] p-6 text-white shadow-[0_18px_54px_rgba(10,10,10,0.12)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(255,255,255,0.15),transparent_30%)]" />
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/42">Перед заявкой</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">Заполните короткую заявку</h3>
          <p className="mt-4 text-sm leading-6 text-white/62">
            Достаточно контактов, города, формата запроса и комментария. Остальные детали уточняются в разговоре.
          </p>
          <FranchiseProductLineup compact />
          <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
            {["ФИО", "телефон и email", "город", "для себя / опт", "комментарий"].map((item) => (
              <p key={item} className="py-3 text-sm text-white/70">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/36">Не является публичной офертой</p>
        <p className="mt-4 text-sm leading-7 text-black/62">
          Информация на сайте носит справочный характер. Условия партнёрства и франчайзинга обсуждаются
          индивидуально. Заявка через форму не создаёт договорных обязательств.
        </p>
      </div>
      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/36">FAQ</p>
        <div className="mt-5">
          <FaqAccordion items={items} />
        </div>
      </div>
    </div>
  );
}

const partnerMarketplaceSpecs = [
  { label: "формат", value: "устройство + картридж" },
  { label: "объём", value: "10 мл" },
  { label: "никотин", value: "20 мг/см³" },
  { label: "аккумулятор", value: "850 мА·ч" },
  { label: "порт", value: "Type-C" },
  { label: "мощность", value: "10–22 Вт" },
];

function PartnerProductShowcase() {
  const showcaseVariants = featuredProduct.variants.slice(0, 8);

  return (
    <div className="mt-8 grid gap-5 xl:grid-cols-[0.34fr_0.66fr] xl:items-stretch">
      <aside className="relative overflow-hidden rounded-[2rem] bg-[#0c0d0f] p-6 text-white shadow-[0_20px_70px_rgba(10,10,10,0.14)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.14),transparent_32%)]" />
        <div className="relative z-10 flex h-full flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/42">Витрина</p>
          <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em]">STILNO CLICK ONE</h3>
          <p className="mt-4 text-sm leading-6 text-white/62">
            Вкусы, параметры и карточки для первичного партнёрского запроса.
          </p>
          <div className="mt-6">
            <FranchiseProductLineup compact />
          </div>
          <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
            {partnerMarketplaceSpecs.slice(0, 4).map((spec) => (
              <div key={spec.label} className="rounded-[1rem] border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-white/34">{spec.label}</p>
                <p className="mt-2 text-sm font-medium text-white">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div
        className="-mx-5 overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0"
        aria-label="Карусель вариантов STILNO"
        data-product-showcase-carousel
      >
        <div className="flex min-w-full snap-x gap-4">
          {showcaseVariants.map((variant) => (
            <article
              key={variant.id}
              className="min-w-[17rem] snap-start rounded-[1.6rem] border border-black/10 bg-white p-4 shadow-[0_16px_46px_rgba(10,10,10,0.06)] sm:min-w-[19rem]"
              data-product-showcase-card
            >
              <ProductPhotoCard
                src={variant.packaging ?? variant.image ?? featuredProduct.images[0]}
                alt={`${featuredProduct.title} — ${variant.title}`}
                aspect="square"
                className="min-h-[14rem] rounded-[1.25rem] p-3"
              />
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/34">STILNO CLICK ONE</p>
                  <h3 className="mt-2 text-xl font-semibold leading-tight tracking-[-0.035em] text-black">
                    {variant.title}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/56">
                  18+
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {partnerMarketplaceSpecs.slice(1, 5).map((spec) => (
                  <div key={`${variant.id}-${spec.label}`} className="rounded-[0.9rem] bg-black/[0.035] px-3 py-2">
                    <p className="text-[0.58rem] uppercase tracking-[0.16em] text-black/34">{spec.label}</p>
                    <p className="mt-1 text-sm font-medium text-black/78">{spec.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3 border-t border-black/10 pt-4">
                <p className="text-sm font-medium text-black">Условия по запросу</p>
                <Link href="#partner-form" className="inline-flex min-h-10 items-center justify-center rounded-full border border-black bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/82">
                  Запросить
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  note,
  tone = "light",
}: {
  value: string;
  label: string;
  note: string;
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={classNames(
        "rounded-[1.7rem] border p-5",
        tone === "dark" ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-white",
      )}
    >
      <div className={classNames("text-2xl font-semibold tracking-[-0.05em]", tone === "dark" ? "text-white" : "text-black")}>
        {value}
      </div>
      <div className={classNames("mt-2 text-sm font-medium", tone === "dark" ? "text-white/80" : "text-black/80")}>
        {label}
      </div>
      <div className={classNames("mt-3 text-sm leading-6", tone === "dark" ? "text-white/56" : "text-black/56")}>
        {note}
      </div>
    </div>
  );
}

function SpecsList({ product }: { product: Product }) {
  return (
    <div className="grid gap-3">
      {product.specs.map((spec) => (
        <div
          key={spec.label}
          className="flex items-start justify-between gap-5 rounded-[1.35rem] border border-black/10 bg-white px-4 py-4"
        >
          <span className="text-sm text-black/54">{spec.label}</span>
          <span className="max-w-[22rem] text-right text-sm font-medium text-black">{spec.value}</span>
        </div>
      ))}
    </div>
  );
}

function LegalWarningStrip() {
  return (
    <div className="relative overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#080a0d] p-5 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(255,255,255,0.09),transparent_30%)]" />
      <div className="relative grid gap-5 sm:grid-cols-[7.5rem_1fr] lg:items-center">
        <div className="inline-flex h-16 w-28 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] text-3xl font-semibold tracking-[0.12em] text-white">
          18+
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-semibold tracking-[-0.04em] text-white sm:text-2xl">Ответственное потребление</h3>
          <p className="mt-3 text-sm leading-6 text-white/62">
            Никотин вызывает зависимость. Продажа несовершеннолетним запрещена.
          </p>
          <p className="mt-1 text-sm leading-6 text-white/62">
            Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции.
          </p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const utilityLinks = siteSettings.footerLinks.slice(0, 4);
  const legalLinks = siteSettings.footerLinks.slice(4);

  return (
    <footer className="border-t border-white/8 bg-black">
      <div className="border-b border-white/8">
        <div className="mx-auto max-w-[86rem] px-5 py-5 sm:px-6 lg:px-8">
          <LegalWarningStrip />
        </div>
      </div>

      <div className="mx-auto grid max-w-[86rem] gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr_0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/38">Бренд</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">STILNO</h2>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Официальный сайт бренда STILNO. Информация предназначена для лиц старше 18 лет.
          </p>
          <Link href="/responsible" className="mt-5 inline-flex text-sm font-medium text-white transition hover:text-white/72">
            Правовая информация
          </Link>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/38">Предупреждение</p>
          <p className="mt-4 text-sm leading-6 text-white/60">
            18+. Никотин вызывает зависимость. Продажа несовершеннолетним запрещена. Дистанционная
            розничная продажа никотинсодержащей продукции не осуществляется.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/38">Навигация</p>
          <div className="mt-4 grid gap-2 text-sm">
            {siteSettings.primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="text-white/68 transition hover:text-white">
                {item.label}
              </Link>
            ))}
            <Link href="/responsible" className="text-white/68 transition hover:text-white">
              Ответственное потребление
            </Link>
            <Link href="/faq" className="text-white/68 transition hover:text-white">
              FAQ
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/38">Контакты</p>
            <div className="mt-4 grid gap-3 text-sm text-white/68">
              {siteSettings.contactLines.map((line) => (
                <p key={line.label}>
                  <span className="block text-white/36">{line.label}</span>
                  {line.href ? (
                    <Link href={line.href} className="mt-1 block transition hover:text-white">
                      {line.value}
                    </Link>
                  ) : (
                    <span className="mt-1 block">{line.value}</span>
                  )}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/38">Материалы и legal</p>
            <div className="mt-4 grid gap-2 text-sm">
              {utilityLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-white/68 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
              {legalLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-white/68 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-[86rem] flex-col gap-3 px-5 py-5 text-sm text-white/42 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 STILNO. Все права защищены.</p>
          <p>Информация на сайте носит справочный характер.</p>
        </div>
      </div>
    </footer>
  );
}

export function HomeTemplate() {
  const homeFaq = faqItems.filter((item) =>
    ["products", "stores", "franchise", "responsible"].includes(item.scope),
  );

  return (
    <>
      <StructuredData data={buildJsonLd()} />

      <section className="border-b border-white/8 bg-black">
        <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <PageHero
            contract={homeContent.hero}
            tone="dark"
            media={
              <EditorialImageCard
                src="/stilno/generated/home-hero-product.jpg"
                alt="STILNO CLICK ONE на тёмной продуктовой сцене"
                priority
              />
            }
          />
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[86rem] px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[0.82fr_1.18fr]">
            <SectionIntro contract={homeContent.productSection} />
            <div className="rounded-[2.2rem] border border-black/10 bg-white p-6 shadow-[0_18px_54px_rgba(10,10,10,0.06)]">
              <div className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
                <EditorialImageCard
                  src="/stilno/generated/product-snapshot.jpg"
                  alt="STILNO CLICK ONE в нескольких вкусах"
                  className="min-h-[24rem]"
                />
                <div>
                  <div className="rounded-[1.6rem] border border-black/10 bg-black/[0.02] p-5">
                    <p className="text-xs uppercase tracking-[0.34em] text-black/36">Ключевые параметры</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {launchMetrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-[1.15rem] border border-black/8 bg-white p-4"
                        >
                          <p className="text-base font-semibold leading-6 text-black">{metric.value}</p>
                          <p className="mt-1 text-sm text-black/58">{metric.label}</p>
                          <p className="mt-3 text-sm leading-6 text-black/50">{metric.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {qualityStandards.map((item) => (
                  <article key={item.title} className="rounded-[1.6rem] border border-black/10 bg-[#f5f5f4] p-5">
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-black">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-black/60">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-black">
        <div className="mx-auto max-w-[86rem] px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[0.86fr_1.14fr]">
            <SectionIntro contract={homeContent.partnersSection} tone="dark" />
            <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-6">
              <SvgAsset
                src="/stilno/generated/partner-kit-visual.jpg"
                alt="Партнёрский комплект STILNO"
                className="w-full rounded-[1.4rem] border border-white/8"
              />
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {partnershipScenarios.map((scenario) => (
              <article key={scenario.title} className="rounded-[1.7rem] border border-white/8 bg-white/[0.03] p-5">
                <h3 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-white">{scenario.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{scenario.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[86rem] px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[0.88fr_1.12fr] xl:items-center">
            <div>
              <SectionIntro contract={homeContent.storesSection} />
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {storesContent.statusCards.map((card) => (
                  <StatCard key={card.value} value={card.value} label={card.label} note={card.note} />
                ))}
              </div>
            </div>
            <div className="rounded-[2.2rem] border border-black/10 bg-white p-6 shadow-[0_18px_54px_rgba(10,10,10,0.06)]">
              <SvgAsset
                src="/stilno/generated/retail-request-visual.jpg"
                alt="Розничный запрос STILNO без неподтверждённых точек"
                className="w-full rounded-[1.4rem] border border-black/8"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-black">
        <div className="mx-auto max-w-[86rem] px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[0.84fr_1.16fr] xl:items-start">
            <SectionIntro contract={homeContent.responsibleSection} tone="dark" />
            <div className="grid gap-4">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                <LegalWarningStrip />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {responsibilityNotes.map((item) => (
                  <article key={item} className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5">
                    <p className="text-sm leading-6 text-white/66">{item}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[86rem] px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[0.94fr_1.06fr]">
            <div>
              <SectionIntro contract={homeContent.faqSection} />
              <div className="mt-8">
                <FaqAccordion items={homeFaq} />
              </div>
            </div>
            <div className="grid gap-5">
              <EditorialImageCard
                src="/stilno/generated/partner-kit-visual.jpg"
                alt="Партнёрские материалы STILNO"
                className="min-h-[18rem]"
              />
              <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white">
                <p className="text-xs uppercase tracking-[0.34em] text-white/36">Форма заявки</p>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                  Основной партнёрский контакт через сайт.
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/66">
                  Для розничного запроса используйте страницу «Где купить». Для B2B-обращений и запуска под
                  брендом используйте форму ниже.
                </p>
              </div>
              <LeadForm type="partner" schema={formSchemas.partnerBase} />
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/stores#stores-request" variant="secondary" tone="light" analytics="home_retail_page">
                  Розничный запрос
                </ButtonLink>
                <ButtonLink href="/franchise#franchise-form" variant="secondary" tone="light" analytics="home_franchise_form">
                  Заявка на франчайзинг
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StoresIndexTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={storesContent.hero}
          media={
            <div className="rounded-[2.2rem] border border-black/10 bg-black p-4 shadow-[0_18px_54px_rgba(10,10,10,0.10)]">
              <SvgAsset
                src="/stilno/generated/retail-request-visual.jpg"
                alt="Статус розничной карты STILNO"
                className="w-full rounded-[1.7rem]"
              />
            </div>
          }
        />

        <div className="mt-16 grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
          <div>
            <SectionIntro contract={storesContent.statusSection} />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {storesContent.statusCards.map((card) => (
                <StatCard key={card.value} value={card.value} label={card.label} note={card.note} />
              ))}
            </div>
          </div>
          <div className="rounded-[2.2rem] border border-black/10 bg-black p-6 text-white shadow-[0_18px_54px_rgba(10,10,10,0.10)]">
            <p className="text-xs uppercase tracking-[0.34em] text-white/36">Статус</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
              Розничная карта появится после подтверждения точек.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/64">
              Пока список не опубликован, форма на странице собирает запросы по городам, розничным точкам и
              партнёрскому запуску.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {storesContent.statusCards.map((card) => (
                <div key={card.label} className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xl font-semibold tracking-[-0.04em]">{card.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/42">{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="stores-request" className="mt-16 grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
          <LeadForm type="retail" schema={formSchemas.retailBase} />
          <div className="grid gap-4">
            <EditorialImageCard
              src="/stilno/generated/stores-inquiry-visual.jpg"
              alt="Официальный розничный запрос STILNO"
              className="min-h-[18rem]"
            />
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
              <p className="text-xs uppercase tracking-[0.34em] text-black/36">{storesContent.supportTitle}</p>
              <p className="mt-4 text-sm leading-7 text-black/64">{storesContent.supportBody}</p>
            </div>
            <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-[0_14px_40px_rgba(10,10,10,0.12)]">
              <p className="text-xs uppercase tracking-[0.34em] text-white/36">Дисклеймер</p>
              <p className="mt-4 text-sm leading-7 text-white/70">{storesContent.disclaimer}</p>
              <div className="mt-6">
                <ButtonLink href="/franchise" variant="secondary" tone="dark" analytics="stores_partner_redirect">
                  Стать партнёром
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CityTemplate(page: ResolvedPage) {
  const city = page.city;
  if (!city) {
    notFound();
  }

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[76rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Город",
            title: city.name,
            body: "Страница города публикуется только после подтверждения розничных точек и контактных данных.",
            actions: [{ label: "Оставить запрос", href: "/stores#stores-request", variant: "primary" }],
          }}
          compact
        />
        <div className="mt-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
          <p className="text-base leading-7 text-black/64">
            Данные по городу временно недоступны. Для уточнения наличия или розничного запуска используйте форму на
            странице «Где купить».
          </p>
        </div>
      </div>
    </section>
  );
}

function StoreTemplate(page: ResolvedPage) {
  const store = page.store;
  if (!store) {
    notFound();
  }

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Точка",
            title: store.title,
            body: "Карточка точки публикуется только после подтверждения адреса, графика и контактных данных.",
          }}
          compact
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <RichText paragraphs={[store.address, store.hours, store.phone]} />
          </div>
          <LeadForm type="retail" schema={formSchemas.retailBase} />
        </div>
      </div>
    </section>
  );
}

function AboutTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "О бренде",
            title: "STILNO",
            body: page.description,
          }}
          compact
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <RichText paragraphs={brandNarrative} />
          </div>
          <div className="grid gap-5">
            <EditorialImageCard
              src="/stilno/generated/about-product-duo.jpg"
              alt="STILNO CLICK ONE в тёмной брендовой композиции"
            />
            <EditorialImageCard
              src="/stilno/generated/quality-production.jpg"
              alt="Производственная линия STILNO"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function GalleryTemplate(page: ResolvedPage) {
  const galleryGroups = [
    ["device", "Устройство"],
    ["packaging", "Упаковка"],
    ["technical-flat", "Техническая плоскость"],
    ["close-up", "Крупный план"],
  ] as const;

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Галерея",
            title: "Editorial-галерея STILNO CLICK ONE",
            body: page.description,
          }}
          media={
            <EditorialImageCard
              src="/stilno/generated/gallery-editorial-board.jpg"
              alt="Устройство, упаковка и продуктовая серия STILNO CLICK ONE"
              priority
            />
          }
          compact
        />
        <div className="mt-12 grid gap-12">
          {galleryGroups.map(([type, label]) => {
            const items = galleryItems.filter((item) => item.type === type);
            if (!items.length) {
              return null;
            }

            return (
              <section key={type}>
                <div className="mb-5 inline-flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.38em] text-black/36">
                  <span className="h-px w-12 bg-black/18" />
                  <span>{label}</span>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <article key={item.id} className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
                      <ProductPhotoCard src={item.media ?? featuredProduct.images[0]} alt={item.alt} aspect="square" />
                      <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-black">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-black/62">{item.caption}</p>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const category = productCategories.find((item) => item.id === product.categoryId);

  return (
    <article className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
      <ProductPhotoCard src={product.images[0]} alt={product.title} />
      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.34em] text-black/36">{category?.title ?? "Продукт"}</span>
        <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/54">
          {product.highlight}
        </span>
      </div>
      <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-black">{product.title}</h3>
      <p className="mt-3 text-sm leading-6 text-black/62">{product.shortDescription}</p>
      <div className="mt-5">
        <ButtonLink href={getProductPath(product)} variant="secondary" tone="light" analytics="product_card_open">
          Смотреть продукт
        </ButtonLink>
      </div>
    </article>
  );
}

function ProductsIndexTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Продукт",
            title: "Текущая линейка STILNO",
            body: page.description,
          }}
          media={
            <EditorialImageCard
              src="/stilno/generated/product-hero-lineup.jpg"
              alt="Линейка STILNO CLICK ONE"
              priority
            />
          }
          compact
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ProductCard product={featuredProduct} />
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <p className="text-xs uppercase tracking-[0.34em] text-black/36">Категория</p>
            <div className="mt-5 grid gap-4">
              {productCategories.map((category) => (
                <article key={category.id} className="rounded-[1.6rem] border border-black/10 bg-[#f5f5f4] p-5">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-black">{category.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/60">{category.shortDescription}</p>
                  <div className="mt-4">
                    <ButtonLink
                      href={getProductCategoryPath(category)}
                      variant="secondary"
                      tone="light"
                      analytics="products_category_open"
                    >
                      Смотреть категорию
                    </ButtonLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCategoryTemplate(page: ResolvedPage) {
  const category = page.category;
  if (!category) {
    notFound();
  }

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Категория",
            title: category.heroTitle,
            body: category.heroBody,
            note: category.disclaimer,
          }}
          media={<ProductPhotoCard src={category.heroImage ?? featuredProduct.images[0]} alt={category.title} />}
          compact
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {(page.products ?? []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductTemplate(page: ResolvedPage) {
  const product = page.product;
  if (!product) {
    notFound();
  }

  const productFaq = faqItems.filter((item) => item.scope === "products" || item.scope === "responsible");

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={productPageContent.hero}
          media={
            <EditorialImageCard
              src="/stilno/generated/product-hero-lineup.jpg"
              alt="STILNO CLICK ONE и вкусовая серия"
              priority
            />
          }
          compact
        />

        <div className="mt-10">
          <Suspense fallback={<VariantPickerFallback product={product} />}>
            <VariantPicker product={product} />
          </Suspense>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <div>
            <SectionIntro contract={productPageContent.detailSection} />
            <div className="mt-6 rounded-[2rem] border border-black/10 bg-[#f1f2f1] p-5">
              <SpecsList product={product} />
            </div>
          </div>
          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-[0_16px_44px_rgba(10,10,10,0.12)]">
              <p className="text-xs uppercase tracking-[0.34em] text-white/36">Предупреждения 18+</p>
              <div className="mt-5 grid gap-3">
                {product.warnings.map((warning) => (
                  <div key={warning} className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] px-4 py-4 text-sm leading-6 text-white/82">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
              <p className="text-xs uppercase tracking-[0.34em] text-black/36">Факты и маркировка</p>
              <div className="mt-5 grid gap-3">
                {product.facts.map((fact) => (
                  <div key={fact} className="rounded-[1.35rem] border border-black/10 bg-[#f5f5f4] px-4 py-4 text-sm leading-6 text-black/64">
                    {fact}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <SectionIntro contract={productPageContent.packagingSection} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {product.variants.map((variant) => (
              <article key={variant.id} className="rounded-[1.7rem] border border-black/10 bg-white p-4 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
                <ProductPhotoCard
                  src={variant.packaging ?? variant.image ?? product.images[0]}
                  alt={`${product.title} — ${variant.title}`}
                  aspect="square"
                  className="min-h-[13rem]"
                />
                <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-black">{variant.title}</h3>
                <p className="mt-2 text-sm text-black/52">{variant.nicotineStrength}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-[2.2rem] border border-white/10 bg-black p-6 text-white">
          <p className="text-xs uppercase tracking-[0.34em] text-white/36">Дальнейшие действия</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Розничный запрос, партнёрство и материалы.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/66">
            Сайт не продаёт продукт дистанционно. Дальнейшие действия по наличию, B2B-контакту и партнёрству проходят
            через отдельные формы и документы.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/stores#stores-request" tone="dark" analytics="product_retail_request">
              Оставить розничный запрос
            </ButtonLink>
            <ButtonLink href="/partners" tone="dark" variant="secondary" analytics="product_partner_request">
              Запросить партнёрство
            </ButtonLink>
            <ButtonLink
              href={documentLinks.franchisePresentation}
              target="_blank"
              tone="dark"
              variant="secondary"
              analytics="product_presentation_download"
            >
              Скачать презентацию для партнёров
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12">
          <SectionIntro
            contract={{
              eyebrow: "FAQ",
              title: "Короткие ответы по продукту и правовым ограничениям.",
              body: "Базовые вопросы о характеристиках, предупреждениях и продуктовой логике STILNO CLICK ONE.",
            }}
          />
          <div className="mt-8">
            <FaqAccordion items={productFaq} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnersTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            ...partnersPageContent.hero,
            actions: [
              { label: "Оставить запрос", href: "#partner-form", variant: "primary" },
              { label: "Франчайзинг STILNO", href: "/franchise", variant: "secondary" },
            ],
          }}
          media={
            <EditorialImageCard
              src="/stilno/generated/partner-kit-visual.jpg"
              alt="Партнёрские материалы STILNO"
              priority
            />
          }
          compact
        />

        <div className="mt-12">
          <SectionIntro contract={partnersPageContent.directionsSection} />
          <PartnerProductShowcase />
        </div>

        <div id="partner-form" className="mt-12 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <LeadForm type="partner" schema={formSchemas.partnerBase} />
          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
              <p className="text-xs uppercase tracking-[0.34em] text-black/36">Что важно</p>
              <p className="mt-4 text-sm leading-7 text-black/62">
                Страница «Партнёрам» не обещает доходность и не дублирует франчайзинговый раздел. Она нужна для опта,
                регионального B2B-контакта и действующей розницы.
              </p>
            </div>
            <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white">
              <p className="text-xs uppercase tracking-[0.34em] text-white/36">Нужен запуск под брендом?</p>
              <p className="mt-4 text-sm leading-7 text-white/68">
                Для запуска под брендом STILNO используйте отдельную страницу франчайзинга и соответствующую
                заявку.
              </p>
              <div className="mt-6">
                <ButtonLink href="/franchise" tone="dark" variant="secondary" analytics="partners_to_franchise">
                  Открыть франчайзинг
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResponsibleTemplate(page: ResolvedPage) {
  const responsibleFaq = faqItems.filter((item) => item.scope === "responsible" || item.scope === "products");

  return (
    <section className="bg-black">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} tone="dark" />
        <PageHero
          contract={{
            eyebrow: "Ответственное потребление",
            title: "Правовые ограничения и продуктовая коммуникация STILNO",
            body: page.description,
          }}
          tone="dark"
          media={
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <LegalWarningStrip />
            </div>
          }
          compact
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {responsibilityNotes.map((item) => (
            <article key={item} className="rounded-[1.7rem] border border-white/8 bg-white/[0.03] p-5">
              <p className="text-sm leading-6 text-white/66">{item}</p>
            </article>
          ))}
        </div>
        <div className="mt-12">
          <SectionIntro
            contract={{
              eyebrow: "FAQ",
              title: "Частые вопросы по возрастным ограничениям и правовой подаче.",
              body: "Блок собран отдельно от продуктового hero, чтобы предупреждения не терялись в визуальном слое.",
            }}
            tone="dark"
          />
          <div className="mt-8">
            <FaqAccordion items={responsibleFaq} tone="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FranchiseTemplate(page: ResolvedPage) {
  const franchiseFaq = faqItems.filter((item) => item.scope === "franchise" || item.scope === "stores");

  return (
    <>
      <section className="border-b border-white/8 bg-black">
        <StructuredData data={buildJsonLd(page)} />
        <div className="mx-auto max-w-[86rem] px-5 py-12 sm:px-6 lg:px-8 lg:pb-14 lg:pt-16">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} tone="dark" />
          <div className="grid gap-10 py-8 xl:grid-cols-[0.82fr_1.18fr] xl:items-center">
            <div>
              <div className="mb-5 inline-flex max-w-full items-center gap-3 text-[0.72rem] uppercase tracking-[0.28em] text-white/42">
                <span className="h-px w-12 bg-white/22" />
                <span>{franchiseContent.hero.eyebrow}</span>
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.8rem]">
                {franchiseContent.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">{franchiseContent.hero.body}</p>
              <ActionGroup actions={franchiseContent.hero.actions} tone="dark" analyticsPrefix="franchise_hero" />
              <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-5 border-y border-white/10 py-5 sm:grid-cols-4">
                {franchiseHeroSignals.map((signal) => (
                  <div key={signal.label}>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/32">
                      {signal.label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/78">{signal.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <FranchiseHeroScene priority />
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[86rem] px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 xl:grid-cols-[0.72fr_1.28fr] xl:items-start">
            <div>
              <SectionIntro
                contract={{
                  eyebrow: "Принципы",
                  title: "Премиальный бренд строится на бескомпромиссном качестве.",
                  body: "Мы работаем над тем, чтобы потребитель получал удовольствие от каждой затяжки, а процесс парения оставался максимально комфортным, стабильным и предсказуемым.",
                }}
              />
              <div className="mt-9 border-y border-black/10 py-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/34">Подход к запуску</p>
                <p className="mt-4 text-sm leading-7 text-black/62">
                  В партнёрском запуске для нас важны не громкие обещания, а аккуратная продуктовая подача, понятные
                  материалы, правовая чистота и готовность партнёра соблюдать стандарты категории 18+.
                </p>
              </div>
            </div>
            <FranchiseRoadmap />
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-black">
        <div className="mx-auto max-w-[86rem] px-5 py-20 sm:px-6 lg:px-8">
          <FranchisePartnerKit />
        </div>
      </section>

      <section id="franchise-form" className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[86rem] px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-start">
            <LeadForm type="franchise" schema={formSchemas.franchiseBase} />
            <FranchiseFormAside items={franchiseFaq} />
          </div>
        </div>
      </section>
    </>
  );
}

function CareersTemplate(page: ResolvedPage) {
  if (!vacancies.length) {
    return (
      <section className="bg-[var(--color-page)]">
        <StructuredData data={buildJsonLd(page)} />
        <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} />
          <PageHero
            contract={{
              eyebrow: "Вакансии",
              title: "Открытые роли публикуются по мере развития команды STILNO.",
              body: page.description,
            }}
            compact
          />
          <div className="mt-10 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
              <p className="text-base leading-7 text-black/64">
                Если открытые вакансии ещё не опубликованы, вы можете отправить общий карьерный отклик в команду
                STILNO.
              </p>
            </div>
            <LeadForm type="career" schema={formSchemas.careerBase} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Вакансии",
            title: "Карьерные возможности STILNO",
            body: page.description,
          }}
          compact
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4">
            {vacancies.map((vacancy) => (
              <article key={vacancy.id} className="rounded-[1.8rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
                <p className="text-xs uppercase tracking-[0.34em] text-black/36">{vacancy.department}</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-black">{vacancy.title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/62">{vacancy.description[0]}</p>
                <div className="mt-5">
                  <ButtonLink href={getVacancyPath(vacancy)} variant="secondary" tone="light" analytics="careers_vacancy_open">
                    Откликнуться
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
          <LeadForm type="career" schema={formSchemas.careerBase} />
        </div>
      </div>
    </section>
  );
}

function VacancyTemplate(page: ResolvedPage) {
  const vacancy = page.vacancy;
  if (!vacancy) {
    notFound();
  }

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Вакансия",
            title: vacancy.title,
            body: vacancy.description[0],
          }}
          compact
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
              <p className="text-xs uppercase tracking-[0.34em] text-black/36">Что предстоит делать</p>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-black/64">
                {vacancy.description.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
                <p className="text-xs uppercase tracking-[0.34em] text-black/36">Требования</p>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-black/64">
                  {vacancy.requirements.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-[0_16px_44px_rgba(10,10,10,0.12)]">
                <p className="text-xs uppercase tracking-[0.34em] text-white/36">Условия</p>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-white/70">
                  {vacancy.conditions.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <LeadForm type="career" schema={formSchemas.careerBase} />
        </div>
      </div>
    </section>
  );
}

function ContactsTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero contract={contactsPageContent.hero} compact />

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contactsPageContent.routingCards.map((card) => (
            <StatCard key={card.value} value={card.value} label={card.label} note={card.note} />
          ))}
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
              <p className="text-xs uppercase tracking-[0.34em] text-black/36">Маршрутизация обращений</p>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-black/64">
                <p>Розничные запросы идут через страницу «Где купить» и общую розничную форму.</p>
                <p>Оптовые и региональные обращения идут через страницу «Партнёрам».</p>
                <p>Запуск под брендом STILNO обрабатывается через отдельный раздел франчайзинга.</p>
              </div>
            </div>
            <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-[0_16px_44px_rgba(10,10,10,0.12)]">
              <p className="text-xs uppercase tracking-[0.34em] text-white/36">Юридические данные</p>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-white/68">
                <p>{companyDetails.companyName}</p>
                <p>{companyDetails.legalAddress}</p>
                <p>{companyDetails.productionAddress}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-5">
            <div id="contacts-retail">
              <LeadForm type="retail" schema={formSchemas.retailBase} />
            </div>
            <div id="contacts-partner">
              <LeadForm type="partner" schema={formSchemas.partnerBase} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticlesIndexTemplate(page: ResolvedPage) {
  if (!articles.length) {
    return (
      <section className="bg-[var(--color-page)]">
        <StructuredData data={buildJsonLd(page)} />
        <div className="mx-auto max-w-[76rem] px-5 py-16 sm:px-6 lg:px-8">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} />
          <PageHero
            contract={{
              eyebrow: "Материалы",
              title: "Раздел материалов будет пополняться по мере публикации документов и новостей.",
              body: page.description,
            }}
            compact
          />
          <div className="mt-8 rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <p className="text-base leading-7 text-black/68">
              Сейчас сайт сосредоточен на продукте, партнёрских обращениях, франчайзинге и правовой информации.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Материалы",
            title: "Публикации и документы STILNO",
            body: page.description,
          }}
          compact
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {articles.map((article) => (
            <article key={article.id} className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
              <ProductPhotoCard src={article.coverImage ?? featuredProduct.images[0]} alt={article.title} />
              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.34em] text-black/36">{article.category}</span>
                <span className="text-sm text-black/42">{article.publishedAt}</span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-black">{article.title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/62">{article.excerpt}</p>
              <div className="mt-5">
                <ButtonLink href={getArticlePath(article)} variant="secondary" tone="light" analytics="article_open">
                  Читать
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleTemplate(page: ResolvedPage) {
  const article = page.article;
  if (!article) {
    notFound();
  }

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[70rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: article.category,
            title: article.title,
            body: article.excerpt,
          }}
          compact
        />
        <div className="mt-4 text-sm text-black/44">
          {article.publishedAt} / {article.author}
        </div>
        <div className="mt-10">
          <ProductPhotoCard src={article.coverImage ?? featuredProduct.images[0]} alt={article.title} />
        </div>
        <div className="mt-10 rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
          <RichText paragraphs={article.body} />
        </div>
      </div>
    </section>
  );
}

function FaqTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "FAQ",
            title: "Частые вопросы о продукте, розничных запросах, партнёрстве и правовой информации.",
            body: page.description,
          }}
          compact
        />
        <div className="mt-12 grid gap-8">
          {faqPageGroups.map((group) => {
            const groupItems = faqItems.filter((item) => group.scopes.includes(item.scope));
            if (!groupItems.length) {
              return null;
            }

            return (
              <section key={group.id}>
                <div className="mb-5 inline-flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.38em] text-black/36">
                  <span className="h-px w-12 bg-black/18" />
                  <span>{group.title}</span>
                </div>
                <FaqAccordion items={groupItems} />
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ThankYouTemplate(page: ResolvedPage) {
  const labels: Record<string, string> = {
    retail: "Запрос отправлен.",
    franchise: "Заявка отправлена.",
    partner: "Запрос отправлен.",
    career: "Отклик отправлен.",
  };

  const nextSteps: Record<string, string> = {
    retail:
      "Мы свяжемся с вами по указанным контактам. Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции.",
    franchise:
      "Мы свяжемся с вами по указанным контактам. Условия партнёрства обсуждаются индивидуально и не являются публичной офертой.",
    partner: "Мы свяжемся с вами по указанным контактам для уточнения формата сотрудничества.",
    career: "Мы свяжемся с вами, если ваш профиль подойдёт под текущие или будущие задачи команды.",
  };

  const key = page.thankYouType ?? "retail";

  return (
    <section className="grid min-h-[70svh] place-items-center bg-black px-5 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl rounded-[2.4rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_42%),linear-gradient(145deg,#090909,#17181b)] p-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.42em] text-white/38">Спасибо</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em]">{labels[key]}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">{nextSteps[key]}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" analytics="thankyou_home" variant="secondary" tone="dark">
            На главную
          </ButtonLink>
          <ButtonLink href="/contacts" analytics="thankyou_contacts" variant="secondary" tone="dark">
            Контакты
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function LegalTemplate(page: ResolvedPage) {
  const legalPage = page.legalPage;
  if (!legalPage) {
    notFound();
  }

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[70rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: `Версия ${legalPage.version} · ${legalPage.effectiveDate}`,
            title: legalPage.title,
            body: legalPage.summary,
          }}
          compact
        />
        <div className="mt-10 rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
          <RichText paragraphs={legalPage.body} />
        </div>
      </div>
    </section>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnalyticsBridge />
      <AnalyticsLoader version={siteSettings.consentVersion} />
      <AgeGate version={siteSettings.ageGateVersion} legalHref="/legal/age-18" />
      <CookieBanner version={siteSettings.consentVersion} legalHref="/legal/cookies" />
      <div className="min-h-screen bg-[var(--color-page)] text-white">
        <SiteHeader navItems={siteSettings.primaryNav} primaryCta={siteSettings.primaryCta} />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}

export function PageRenderer({ page }: { page: ResolvedPage }) {
  switch (page.kind) {
    case "stores-index":
      return StoresIndexTemplate(page);
    case "city":
      return CityTemplate(page);
    case "store":
      return StoreTemplate(page);
    case "about":
      return AboutTemplate(page);
    case "gallery":
      return GalleryTemplate(page);
    case "products-index":
      return ProductsIndexTemplate(page);
    case "product-category":
      return ProductCategoryTemplate(page);
    case "product":
      return ProductTemplate(page);
    case "partners":
      return PartnersTemplate(page);
    case "responsible":
      return ResponsibleTemplate(page);
    case "franchise":
      return FranchiseTemplate(page);
    case "careers-index":
      return CareersTemplate(page);
    case "vacancy":
      return VacancyTemplate(page);
    case "contacts":
      return ContactsTemplate(page);
    case "articles-index":
      return ArticlesIndexTemplate(page);
    case "article":
      return ArticleTemplate(page);
    case "faq":
      return FaqTemplate(page);
    case "thank-you":
      return ThankYouTemplate(page);
    case "legal":
      return LegalTemplate(page);
    default:
      notFound();
  }
}

export function getStaticParams() {
  return getAllStaticPaths().map((slug) => ({ slug }));
}

export function getMetadataPayload(page?: ResolvedPage) {
  if (!page) {
    return {
      title: "STILNO CLICK ONE | официальный сайт бренда 18+",
      description: siteSettings.description,
      canonical: siteOrigin,
      image: `${siteOrigin}${defaultMetadataImage}`,
    };
  }

  const image =
    page.product?.images[0] ??
    page.category?.heroImage ??
    page.article?.coverImage ??
    defaultMetadataImage;

  const titleMap: Partial<Record<ResolvedPage["kind"], string>> = {
    "stores-index": "Где купить STILNO | розничные запросы 18+",
    product: "STILNO CLICK ONE | характеристики продукта 18+",
    franchise: "Франчайзинг STILNO | партнёрство и запуск в регионах 18+",
    partners: "Партнёрам STILNO | оптовые и региональные запросы 18+",
    responsible: "Ответственное потребление STILNO | информация 18+",
    contacts: "Контакты STILNO | официальный сайт бренда 18+",
    faq: "FAQ STILNO | продукт, партнёрство и правовая информация 18+",
  };

  const descriptionMap: Partial<Record<ResolvedPage["kind"], string>> = {
    "stores-index":
      "Розничная карта STILNO публикуется после подтверждения городов и партнёрских точек. До публикации списка можно оставить запрос по городу.",
    product:
      "STILNO CLICK ONE: подтверждённые характеристики продукта, вкусовые варианты, предупреждения 18+ и партнёрские CTA.",
    franchise:
      "Франчайзинг STILNO: партнёрский запуск бренда в регионах без публичной оферты и без обещаний доходности.",
    partners:
      "Партнёрам STILNO: оптовые, региональные и B2B-запросы по бренду принимаются через форму сайта и обсуждаются индивидуально.",
    contacts:
      "Контакты STILNO: формы обратной связи, данные об изготовителе и направления для розничных, оптовых и франчайзинговых запросов.",
  };

  return {
    title: titleMap[page.kind] ?? page.title,
    description: descriptionMap[page.kind] ?? page.description,
    canonical: `${siteOrigin}/${page.pathname.join("/")}`,
    image: image ? `${siteOrigin}${image}` : undefined,
  };
}
