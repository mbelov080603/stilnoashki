import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { MediaSlot } from "@/components/media-slot";
import {
  AgeGate,
  AnalyticsBridge,
  AnalyticsLoader,
  CookieBanner,
  FaqAccordion,
  LeadForm,
  SiteHeader,
  VerifyChecker,
  VariantPicker,
  VariantPickerFallback,
} from "@/components/site-client";
import { featuredProduct, galleryItems, productCategories, qualityStandards } from "@/lib/catalog-data";
import { assetUrl, companyDetails, documentLinks, mediaAssets, siteOrigin, siteSettings } from "@/lib/site-config";
import {
  articles,
  brandNarrative,
  cities,
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
  stores,
  storesContent,
  vacancies,
} from "@/lib/site-content";
import {
  getAllStaticPaths,
  getArticlePath,
  getBreadcrumbs,
  getProductCategoryPath,
  getProductPath,
  getStorePath,
  getVacancyPath,
} from "@/lib/site-routing";
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
        ? "border-black bg-black text-white hover:bg-black/82"
        : "border-black bg-black text-white hover:bg-black/82"
      : tone === "dark"
        ? "border-black/14 bg-white text-black hover:border-black/34 hover:bg-[#f4f4f1]"
        : "border-black/14 bg-white text-black hover:border-black/34 hover:bg-[#f4f4f1]";
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
    <div className="min-w-0 max-w-3xl">
      {contract.eyebrow ? (
        <div
          className={classNames(
            "mb-5 flex w-fit max-w-full items-center gap-3 text-[0.72rem] uppercase tracking-[0.18em]",
            tone === "dark" ? "text-black/44" : "text-black/44",
          )}
        >
          <span className="h-px w-10 shrink-0 bg-black/20" />
          <span className="min-w-0 break-words">{contract.eyebrow}</span>
        </div>
      ) : null}
      <TitleTag
        className={classNames(
          "max-w-full break-words text-3xl font-semibold leading-[1.04] tracking-[-0.025em] sm:text-4xl lg:text-5xl",
          tone === "dark" ? "text-black" : "text-black",
        )}
      >
        {contract.title}
      </TitleTag>
      <p
        className={classNames(
          "mt-5 max-w-2xl break-words text-base leading-7 sm:text-lg",
          tone === "dark" ? "text-black/62" : "text-black/62",
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
        "grid min-w-0 gap-10",
        media ? "xl:grid-cols-[0.9fr_1.1fr] xl:items-center" : "",
        compact ? "py-2" : "",
      )}
    >
      <div className="min-w-0">
        {contract.eyebrow ? (
          <div
            className={classNames(
              "mb-5 flex w-fit max-w-full items-center gap-3 text-[0.72rem] uppercase tracking-[0.18em]",
              tone === "dark" ? "text-black/44" : "text-black/44",
            )}
          >
            <span className="h-px w-10 shrink-0 bg-black/20" />
            <span className="min-w-0 break-words">{contract.eyebrow}</span>
          </div>
        ) : null}
        <h1
          className={classNames(
            "max-w-4xl break-words text-4xl font-semibold leading-[1.02] tracking-[-0.025em] sm:text-5xl lg:text-6xl",
            tone === "dark" ? "text-black" : "text-black",
          )}
        >
          {contract.title}
        </h1>
        <p
          className={classNames(
            "mt-6 max-w-2xl break-words text-lg leading-8",
            tone === "dark" ? "text-black/64" : "text-black/64",
          )}
        >
          {contract.body}
        </p>
        {contract.detailLine ? (
          <div
            className={classNames(
              "mt-6 flex max-w-3xl rounded-[1rem] border px-5 py-4 text-sm leading-7 sm:text-base",
              tone === "dark"
                ? "border-black/10 bg-[#f6f6f3] text-black"
                : "border-black/10 bg-white text-black",
            )}
          >
            {contract.detailLine}
          </div>
        ) : null}
        {contract.note ? (
          <p className={classNames("mt-3 text-sm", tone === "dark" ? "text-black/46" : "text-black/46")}>
            {contract.note}
          </p>
        ) : null}
        <ActionGroup actions={contract.actions} tone={tone} />
      </div>
      {media ? <div className="min-w-0">{media}</div> : null}
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
        tone === "dark" ? "text-black/44" : "text-black/44",
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
            <span className={tone === "dark" ? "text-black/70" : "text-black/70"}>{breadcrumb.label}</span>
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
    <div className={classNames("grid gap-4 text-base leading-7", tone === "dark" ? "text-black/68" : "text-black/68")}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function ProductPhotoCard({
  slotId,
  title = "STILNO CLICK ONE",
  note = "Продуктовый визуал STILNO.",
  aspect = "wide",
  className,
}: {
  slotId: string;
  title?: string;
  note?: string;
  aspect?: "square" | "wide";
  className?: string;
}) {
  return <MediaSlot slotId={slotId} title={title} note={note} aspect={aspect} className={className} />;
}

function EditorialImageCard({
  slotId,
  title = "STILNO",
  note = "Визуальная система STILNO.",
  className,
}: {
  slotId: string;
  title?: string;
  note?: string;
  className?: string;
}) {
  return <MediaSlot slotId={slotId} title={title} note={note} aspect="wide" className={className} />;
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

const franchiseHeroSignals = [
  { label: "Возрастная рамка", value: "18+" },
  { label: "Коммуникация", value: "заявка -> контакт" },
  { label: "Материалы", value: "презентация и база" },
  { label: "Условия", value: "индивидуально" },
];

function FranchiseProductLineup({ priority = false, compact = false }: { priority?: boolean; compact?: boolean }) {
  void priority;

  return (
    <MediaSlot
      slotId={compact ? "franchise-lineup-compact" : "franchise-lineup"}
      title="Продуктовая линейка STILNO"
      note="Групповая подача продукта, упаковки и партнёрских материалов."
      aspect={compact ? "square" : "wide"}
      className={compact ? "min-h-[13rem] sm:min-h-[16rem]" : "min-h-[21rem] sm:min-h-[28rem]"}
    />
  );
}

function FranchiseHeroScene({ priority = false }: { priority?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[1rem] border border-black/10 bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-black/46">STILNO / launch file</p>
          <span className="rounded-full border border-black/10 px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-black/54">
            18+
          </span>
        </div>

        <div className="relative z-10 mt-8 grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-black/44">Не публичная оферта</p>
            <h3 className="mt-4 max-w-[24rem] text-3xl font-semibold leading-[1.03] tracking-[-0.025em] text-black sm:text-4xl">
              Запуск обсуждается после заявки
            </h3>
            <p className="mt-5 max-w-[24rem] text-sm leading-6 text-black/62">
              Сначала фиксируем город, формат и статус проекта. Затем переходим к материалам, документам и условиям.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-4 border-y border-black/10 py-5">
              {franchiseHeroSignals.map((signal) => (
                <div key={signal.label}>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-black/42">
                    {signal.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-black/78">{signal.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:-translate-x-8">
            <FranchiseProductLineup priority={priority} />
            <div className="absolute bottom-5 right-0 hidden w-[13rem] rounded-[1rem] border border-black/10 bg-white/92 p-4 md:block">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-black/44">Пакет</p>
              <p className="mt-2 text-sm leading-5 text-black/68">брендовые материалы · продуктовая база · рабочий контакт</p>
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
        <SectionIntro contract={franchiseContent.supportSection} />
        <div className="mt-10 grid border-y border-black/10 lg:grid-cols-2">
          {franchiseSupportItems.map((item, index) => (
            <article
              key={item.title}
              className={classNames(
                "border-b border-black/10 py-6 lg:p-6",
                index % 2 === 0 && "lg:border-r",
                index > 1 && "lg:border-b-0",
              )}
            >
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-black/42">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-black">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/62">{item.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-8">
        <div>
          <SectionIntro contract={franchiseContent.audienceSection} />
          <div className="mt-7 divide-y divide-black/10 border-y border-black/10">
            {franchiseContent.audienceItems.map((item, index) => (
              <div key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 py-4">
                <span className="text-sm font-semibold text-black/42">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-sm leading-6 text-black/68">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1rem] border border-black/10 bg-white p-5">
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/44">Документы и материалы</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink
                href={documentLinks.franchisePresentation}
                target="_blank"
                tone="light"
                variant="secondary"
                analytics="franchise_download_presentation"
              >
                Скачать презентацию
              </ButtonLink>
              <ButtonLink
                href={documentLinks.deviceAndPackage}
                target="_blank"
                tone="light"
                variant="secondary"
                analytics="franchise_download_product_pack"
              >
                Материалы по продукту
              </ButtonLink>
            </div>
            <div className="mt-7 grid gap-3">
              {franchisePillars.map((pillar) => (
                <p key={pillar} className="border-t border-black/10 pt-3 text-sm leading-6 text-black/62">
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
      <div className="relative overflow-hidden rounded-[1rem] border border-black/10 bg-white p-6 text-black">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/44">Перед заявкой</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.025em]">Заполните короткую заявку</h3>
          <p className="mt-4 text-sm leading-6 text-black/62">
            Достаточно контактов, города, формата запроса и комментария. Остальные детали уточняются в разговоре.
          </p>
          <FranchiseProductLineup compact />
          <div className="mt-5 divide-y divide-black/10 border-y border-black/10">
            {["ФИО", "телефон и email", "город", "для себя / опт", "комментарий"].map((item) => (
              <p key={item} className="py-3 text-sm text-black/70">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-[1rem] border border-black/10 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/36">Не является публичной офертой</p>
        <p className="mt-4 text-sm leading-7 text-black/62">
          Информация на сайте носит справочный характер. Условия партнёрства и франчайзинга обсуждаются
          индивидуально. Заявка через форму не создаёт договорных обязательств.
        </p>
      </div>
      <div className="rounded-[1rem] border border-black/10 bg-white p-6">
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
      <aside className="relative overflow-hidden rounded-[1rem] border border-black/10 bg-white p-6 text-black">
        <div className="relative z-10 flex h-full flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/44">Витрина</p>
          <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em]">STILNO CLICK ONE</h3>
          <p className="mt-4 text-sm leading-6 text-black/62">
            Вкусы, параметры и карточки для первичного партнёрского запроса.
          </p>
          <div className="mt-6">
            <FranchiseProductLineup compact />
          </div>
          <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
            {partnerMarketplaceSpecs.slice(0, 4).map((spec) => (
              <div key={spec.label} className="rounded-[0.85rem] border border-black/10 bg-[#f6f6f3] p-3">
                <p className="text-[0.62rem] uppercase tracking-[0.12em] text-black/42">{spec.label}</p>
                <p className="mt-2 text-sm font-medium text-black">{spec.value}</p>
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
              className="min-w-[17rem] snap-start rounded-[1rem] border border-black/10 bg-white p-4 sm:min-w-[19rem]"
              data-product-showcase-card
            >
              <ProductPhotoCard
                slotId={`partner-variant-${variant.id}`}
                title={variant.title}
                note="Карточка вкуса STILNO CLICK ONE."
                aspect="square"
                className="min-h-[14rem] rounded-[1.25rem] p-3"
              />
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/44">STILNO CLICK ONE</p>
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
                  <div key={`${variant.id}-${spec.label}`} className="rounded-[0.75rem] bg-[#f6f6f3] px-3 py-2">
                    <p className="text-[0.58rem] uppercase tracking-[0.12em] text-black/42">{spec.label}</p>
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
}: {
  value: string;
  label: string;
  note: string;
}) {
  return (
    <div
      className={classNames(
        "rounded-[1rem] border border-black/10 bg-white p-5",
      )}
    >
      <div className="text-2xl font-semibold tracking-[-0.04em] text-black">
        {value}
      </div>
      <div className="mt-2 text-sm font-medium text-black/80">
        {label}
      </div>
      <div className="mt-3 text-sm leading-6 text-black/56">
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
          className="flex items-start justify-between gap-5 rounded-[1rem] border border-black/10 bg-white px-4 py-4"
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
    <div className="relative overflow-hidden rounded-[1rem] border border-black/10 bg-white p-5 sm:p-6">
      <div className="relative grid gap-5 sm:grid-cols-[7.5rem_1fr] lg:items-center">
        <div className="inline-flex h-16 w-28 items-center justify-center rounded-full border border-black/12 bg-[#f6f6f3] text-3xl font-semibold tracking-[0.08em] text-black">
          18+
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-semibold tracking-[-0.025em] text-black sm:text-2xl">Ответственное потребление</h3>
          <p className="mt-3 text-sm leading-6 text-black/62">
            Никотин вызывает зависимость. Продажа несовершеннолетним запрещена.
          </p>
          <p className="mt-1 text-sm leading-6 text-black/62">
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
    <footer className="border-t border-black/10 bg-white">
      <div className="border-b border-black/10">
        <div className="mx-auto max-w-[86rem] px-5 py-5 sm:px-6 lg:px-8">
          <LegalWarningStrip />
        </div>
      </div>

      <div className="mx-auto grid max-w-[86rem] gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr_0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-black/42">Бренд</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-black">STILNO</h2>
          <p className="mt-4 text-sm leading-6 text-black/62">
            Официальный сайт бренда STILNO. Информация предназначена для лиц старше 18 лет.
          </p>
          <Link href="/responsible" className="mt-5 inline-flex text-sm font-medium text-black transition hover:text-black/62">
            Правовая информация
          </Link>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-black/42">Предупреждение</p>
          <p className="mt-4 text-sm leading-6 text-black/62">
            18+. Никотин вызывает зависимость. Продажа несовершеннолетним запрещена. Дистанционная
            розничная продажа никотинсодержащей продукции не осуществляется.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-black/42">Навигация</p>
          <div className="mt-4 grid gap-2 text-sm">
            {siteSettings.primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="text-black/68 transition hover:text-black">
                {item.label}
              </Link>
            ))}
            <Link href="/responsible" className="text-black/68 transition hover:text-black">
              Ответственное потребление
            </Link>
            <Link href="/faq" className="text-black/68 transition hover:text-black">
              FAQ
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-black/42">Контакты</p>
            <div className="mt-4 grid gap-3 text-sm text-black/68">
              {siteSettings.contactLines.map((line) => (
                <p key={line.label}>
                  <span className="block text-black/38">{line.label}</span>
                  {line.href ? (
                    <Link href={line.href} className="mt-1 block transition hover:text-black">
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
            <p className="text-xs uppercase tracking-[0.22em] text-black/42">Материалы и legal</p>
            <div className="mt-4 grid gap-2 text-sm">
              {utilityLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-black/68 transition hover:text-black">
                  {item.label}
                </Link>
              ))}
              {legalLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-black/68 transition hover:text-black">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="mx-auto flex max-w-[86rem] flex-col gap-3 px-5 py-5 text-sm text-black/42 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
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

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <PageHero
            contract={homeContent.hero}
            media={
              <EditorialImageCard
                slotId="home-hero"
                title="STILNO CLICK ONE"
                note="Продукт, упаковка и маркировка в первом экране."
              />
            }
          />
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[86rem] px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[0.82fr_1.18fr]">
            <SectionIntro contract={homeContent.productSection} />
            <div className="rounded-[1rem] border border-black/10 bg-white p-6">
              <div className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
                <EditorialImageCard
                  slotId="home-product"
                  title="STILNO CLICK ONE"
                  note="Продуктовая подача STILNO CLICK ONE."
                  className="min-h-[24rem]"
                />
                <div>
                  <div className="rounded-[1rem] border border-black/10 bg-black/[0.02] p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-black/36">Ключевые параметры</p>
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
                  <article key={item.title} className="rounded-[1rem] border border-black/10 bg-[#f5f5f4] p-5">
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-black">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-black/60">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-[86rem] px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[0.86fr_1.14fr]">
            <SectionIntro contract={homeContent.partnersSection} />
            <div className="rounded-[1rem] border border-black/10 bg-white p-5">
              <EditorialImageCard
                slotId="home-partners"
                title="Фото для партнёрского блока"
                note="B2B-визуал партнёрского маршрута STILNO."
                className="w-full"
              />
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {partnershipScenarios.map((scenario) => (
              <article key={scenario.title} className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-5">
                <h3 className="text-[1.35rem] font-semibold tracking-[-0.035em] text-black">{scenario.title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/62">{scenario.body}</p>
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
            <div className="rounded-[1rem] border border-black/10 bg-white p-6">
              <EditorialImageCard
                slotId="home-stores"
                title="Фото для розничного блока"
                note="Визуал опубликованной точки и retail-запросов."
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-[86rem] px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[0.84fr_1.16fr] xl:items-start">
            <SectionIntro contract={homeContent.responsibleSection} />
            <div className="grid gap-4">
              <div className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-4">
                <LegalWarningStrip />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {responsibilityNotes.map((item) => (
                  <article key={item} className="rounded-[1rem] border border-black/10 bg-white p-5">
                    <p className="text-sm leading-6 text-black/64">{item}</p>
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
                slotId="home-faq-side"
                title="Партнёрский контакт"
                note="Поддерживающий визуал рядом с FAQ."
                className="min-h-[18rem]"
              />
              <div className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-6 text-black">
                <p className="text-xs uppercase tracking-[0.22em] text-black/42">Форма заявки</p>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
                  Основной партнёрский контакт через сайт.
                </h3>
                <p className="mt-4 text-sm leading-6 text-black/62">
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
            <div className="rounded-[1rem] border border-black/10 bg-white p-4">
              <EditorialImageCard
                slotId="stores-hero"
                title="Фото для страницы розницы"
                note="Визуал точки STILNO в Москве."
                className="w-full"
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
          <div className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-6 text-black">
            <p className="text-xs uppercase tracking-[0.22em] text-black/42">Статус</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
              Опубликована одна московская точка 18+.
            </h2>
            <p className="mt-4 text-sm leading-7 text-black/62">
              Сайт не продаёт продукт дистанционно. Он показывает опубликованную точку, телефон и маршрут, а наличие
              нужно уточнить перед визитом.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {storesContent.statusCards.map((card) => (
                <div key={card.label} className="rounded-[1rem] border border-black/10 bg-white p-4">
                  <p className="text-xl font-semibold tracking-[-0.04em]">{card.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-black/42">{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-col justify-between gap-5 border-y border-black/10 py-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-black/36">Текущая точка</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-black">
                Москва: STILNO, Бизнес центр Вавилон.
              </h2>
            </div>
            <ButtonLink href="#stores-request" variant="secondary" tone="light" analytics="stores_city_request">
              Оставить запрос
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cities.map((city) => {
              const cityStores = stores.filter((store) => store.cityId === city.id);
              return (
                <article key={city.id} className="rounded-[1rem] border border-black/10 bg-white p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/36">{city.region}</p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-black">{city.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/62">{city.spotlight}</p>
                  <div className="mt-5 grid gap-2">
                    {cityStores.map((store) => (
                      <Link
                        key={store.id}
                        href={getStorePath(store)}
                        className="rounded-[0.85rem] border border-black/10 px-3 py-3 text-sm text-black/70 transition hover:border-black/28 hover:text-black"
                      >
                        {store.title} · {store.address}
                      </Link>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div id="stores-request" className="mt-16 grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
          <LeadForm type="retail" schema={formSchemas.retailBase} />
          <div className="grid gap-4">
            <EditorialImageCard
              slotId="stores-request"
              title="Фото для формы запроса"
              note="Визуал формы розничного запроса."
              className="min-h-[18rem]"
            />
            <div className="rounded-[1rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-black/36">{storesContent.supportTitle}</p>
              <p className="mt-4 text-sm leading-7 text-black/64">{storesContent.supportBody}</p>
            </div>
            <div className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-6 text-black">
              <p className="text-xs uppercase tracking-[0.22em] text-black/42">Дисклеймер</p>
              <p className="mt-4 text-sm leading-7 text-black/64">{storesContent.disclaimer}</p>
              <div className="mt-6">
                <ButtonLink href="/franchise" variant="secondary" tone="light" analytics="stores_partner_redirect">
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
            body: city.spotlight,
            actions: [{ label: "Оставить запрос", href: "/stores#stores-request", variant: "primary" }],
          }}
          compact
        />
        <div className="mt-8 grid gap-5">
          {(page.stores ?? []).map((store) => (
            <article key={store.id} className="rounded-[1rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-black/36">Опубликованная точка</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-black">{store.title}</h2>
              <p className="mt-3 text-sm leading-6 text-black/62">{store.address}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href={getStorePath(store)} variant="secondary" tone="light" analytics="city_store_open">
                  Подробнее
                </ButtonLink>
                <ButtonLink href="/stores#stores-request" tone="light" analytics="city_store_request">
                  Уточнить наличие
                </ButtonLink>
              </div>
            </article>
          ))}
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
  const storeDetails = [
    store.address,
    store.inventoryStatus ?? "Наличие уточняйте перед визитом.",
    store.hours,
    `Телефон: ${store.phone}.`,
    `Сервисы: ${store.services.join(", ")}.`,
    store.verifiedAt ? `Статус точки обновлён: ${store.verifiedAt}.` : undefined,
  ].filter((item): item is string => Boolean(item));

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Точка",
            title: store.title,
            body:
              "Карточка описывает подтверждённый контактный маршрут. Сайт не оформляет дистанционную розничную продажу никотинсодержащей продукции.",
          }}
          compact
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[1rem] border border-black/10 bg-white p-6">
            <RichText paragraphs={storeDetails} />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {store.directionsHref ? (
                <ButtonLink href={store.directionsHref} target="_blank" tone="light" analytics="store_directions">
                  Построить маршрут
                </ButtonLink>
              ) : null}
              <ButtonLink
                href={`tel:${store.phone.replace(/[^\d+]/g, "")}`}
                variant="secondary"
                tone="light"
                analytics="store_call"
              >
                Позвонить
              </ButtonLink>
            </div>
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
          <div className="rounded-[1rem] border border-black/10 bg-white p-6">
            <RichText paragraphs={brandNarrative} />
          </div>
          <div className="grid gap-5">
            <EditorialImageCard
              slotId="about-primary"
              title="Фото бренда"
              note="Основной визуал бренда STILNO."
            />
            <EditorialImageCard
              slotId="about-secondary"
              title="Фото производства"
              note="Сюда можно поставить новый производственный кадр."
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
              slotId="gallery-hero"
              title="Фото галереи"
              note="Главный визуал галереи STILNO."
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
                <div className="mb-5 inline-flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.22em] text-black/36">
                  <span className="h-px w-12 bg-black/18" />
                  <span>{label}</span>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <article key={item.id} className="rounded-[1rem] border border-black/10 bg-white p-5">
                      <ProductPhotoCard
                        slotId={`gallery-${item.id}`}
                        title={item.title}
                        note="Галерейный визуал STILNO CLICK ONE."
                        aspect="square"
                      />
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
    <article className="rounded-[1rem] border border-black/10 bg-white p-5">
      <ProductPhotoCard
        slotId={`product-card-${product.slug}`}
        title={product.title}
        note="Карточка готова к новому продуктовому фото."
      />
      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.22em] text-black/36">{category?.title ?? "Продукт"}</span>
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
              slotId="products-hero"
              title="Фото линейки"
              note="Общий визуал продуктовой линейки STILNO."
            />
          }
          compact
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ProductCard product={featuredProduct} />
          <div className="rounded-[1rem] border border-black/10 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-black/36">Категория</p>
            <div className="mt-5 grid gap-4">
              {productCategories.map((category) => (
                <article key={category.id} className="rounded-[1rem] border border-black/10 bg-[#f5f5f4] p-5">
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
          media={
            <ProductPhotoCard
              slotId={`category-${category.slug}`}
              title={category.title}
              note="Визуал категории STILNO."
            />
          }
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
              slotId="product-hero"
              title="STILNO CLICK ONE"
              note="Главный продуктовый визуал STILNO CLICK ONE."
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
            <div className="mt-6 rounded-[1rem] border border-black/10 bg-[#f1f2f1] p-5">
              <SpecsList product={product} />
            </div>
          </div>
          <div className="grid gap-5">
            <div className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-6 text-black">
              <p className="text-xs uppercase tracking-[0.22em] text-black/42">Предупреждения 18+</p>
              <div className="mt-5 grid gap-3">
                {product.warnings.map((warning) => (
                  <div key={warning} className="rounded-[1rem] border border-black/10 bg-white px-4 py-4 text-sm leading-6 text-black/66">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-black/36">Факты и маркировка</p>
              <div className="mt-5 grid gap-3">
                {product.facts.map((fact) => (
                  <div key={fact} className="rounded-[1rem] border border-black/10 bg-[#f5f5f4] px-4 py-4 text-sm leading-6 text-black/64">
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
              <article key={variant.id} className="rounded-[1rem] border border-black/10 bg-white p-4">
                <ProductPhotoCard
                  slotId={`variant-${variant.id}`}
                  title={variant.title}
                  note="Карточка вкуса STILNO CLICK ONE."
                  aspect="square"
                  className="min-h-[13rem]"
                />
                <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-black">{variant.title}</h3>
                <p className="mt-2 text-sm text-black/52">{variant.nicotineStrength}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-6 text-black">
          <p className="text-xs uppercase tracking-[0.22em] text-black/42">Дальнейшие действия</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">Розничный запрос, партнёрство и материалы.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-black/62">
            Сайт не продаёт продукт дистанционно. Дальнейшие действия по наличию, B2B-контакту и партнёрству проходят
            через отдельные формы и документы.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/stores#stores-request" tone="light" analytics="product_retail_request">
              Оставить розничный запрос
            </ButtonLink>
            <ButtonLink href="/partners" tone="light" variant="secondary" analytics="product_partner_request">
              Запросить партнёрство
            </ButtonLink>
            <ButtonLink
              href={documentLinks.franchisePresentation}
              target="_blank"
              tone="light"
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
              slotId="partners-hero"
              title="Фото для партнёров"
              note="B2B-визуал партнёрского запроса."
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
            <div className="rounded-[1rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-black/36">Что важно</p>
              <p className="mt-4 text-sm leading-7 text-black/62">
                Страница «Партнёрам» не обещает доходность и не дублирует франчайзинговый раздел. Она нужна для опта,
                регионального B2B-контакта и действующей розницы.
              </p>
            </div>
            <div className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-6 text-black">
              <p className="text-xs uppercase tracking-[0.22em] text-black/42">Нужен запуск под брендом?</p>
              <p className="mt-4 text-sm leading-7 text-black/64">
                Для запуска под брендом STILNO используйте отдельную страницу франчайзинга и соответствующую
                заявку.
              </p>
              <div className="mt-6">
                <ButtonLink href="/franchise" tone="light" variant="secondary" analytics="partners_to_franchise">
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
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Ответственное потребление",
            title: "Правовые ограничения и продуктовая коммуникация STILNO",
            body: page.description,
          }}
          media={
            <div className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-4">
              <LegalWarningStrip />
            </div>
          }
          compact
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {responsibilityNotes.map((item) => (
            <article key={item} className="rounded-[1rem] border border-black/10 bg-white p-5">
              <p className="text-sm leading-6 text-black/64">{item}</p>
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
          />
          <div className="mt-8">
            <FaqAccordion items={responsibleFaq} />
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
      <section className="border-b border-black/10 bg-white">
        <StructuredData data={buildJsonLd(page)} />
        <div className="mx-auto max-w-[86rem] px-5 py-12 sm:px-6 lg:px-8 lg:pb-14 lg:pt-16">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} />
          <div className="grid gap-10 py-8 xl:grid-cols-[0.82fr_1.18fr] xl:items-center">
            <div>
              <div className="mb-5 inline-flex max-w-full items-center gap-3 text-[0.72rem] uppercase tracking-[0.18em] text-black/44">
                <span className="h-px w-12 bg-black/20" />
                <span>{franchiseContent.hero.eyebrow}</span>
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.04em] text-black sm:text-6xl lg:text-[4.6rem]">
                {franchiseContent.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-black/64">{franchiseContent.hero.body}</p>
              <ActionGroup actions={franchiseContent.hero.actions} analyticsPrefix="franchise_hero" />
              <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-5 border-y border-black/10 py-5 sm:grid-cols-4">
                {franchiseHeroSignals.map((signal) => (
                  <div key={signal.label}>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-black/38">
                      {signal.label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-black/78">{signal.value}</p>
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

      <section className="border-y border-black/10 bg-white">
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

function VerifyTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Проверка",
            title: "Проверка оригинальности STILNO",
            body:
              "Введите код с упаковки STILNO CLICK ONE. Проверка помогает отличить подтверждённый продукт и быстро перейти в поддержку при спорном результате.",
            actions: [
              { label: "Проверить код", href: "#verify-checker", variant: "primary" },
              { label: "Поддержка", href: "/support", variant: "secondary" },
            ],
          }}
          media={<ProductPhotoCard slotId="verify-product" title="Проверка кода STILNO" />}
          compact
        />

        <div id="verify-checker" className="mt-12 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="grid gap-5">
            <VerifyChecker />
            <div className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-6 text-black">
              <p className="text-xs uppercase tracking-[0.22em] text-black/42">Где искать код</p>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-black/64">
                <p>Код расположен на защитной зоне упаковки или рядом с QR-маркировкой.</p>
                <p>Не передавайте код третьим лицам до проверки и сохраняйте упаковку при обращении в поддержку.</p>
                <p>Если код повреждён, отправьте фото упаковки через страницу поддержки.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              ["01", "Введите код", "Используйте код с упаковки без пробелов и лишних символов."],
              ["02", "Сравните статус", "Сайт подскажет, похож ли код на формат STILNO и какой следующий шаг выбрать."],
              ["03", "Обратитесь в поддержку", "При сомнительном результате сохраните упаковку и отправьте фото защитной зоны."],
            ].map(([index, title, body]) => (
              <article key={index} className="rounded-[1rem] border border-black/10 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-black/36">{index}</p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-black">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-black/62">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SupportTemplate(page: ResolvedPage) {
  const supportFaq = faqItems.filter((item) => item.scope === "support" || item.scope === "responsible");

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Поддержка",
            title: "Качество, оригинальность и ответственный сервис STILNO",
            body:
              "Здесь собраны действия по спорному коду, претензии к качеству, правила хранения, утилизация устройства и контакты поддержки.",
            actions: [
              { label: "Проверить код", href: "/verify", variant: "primary" },
              { label: "Написать в поддержку", href: `mailto:${companyDetails.supportEmail}`, variant: "secondary" },
            ],
          }}
          media={<EditorialImageCard slotId="support-system" title="Сервис STILNO" />}
          compact
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Оригинальность", "Проверка кода, QR-зоны и ручная проверка упаковки при спорном статусе."],
            ["Качество", "Фиксация партии, фото упаковки и описание проблемы без передачи лишних данных."],
            ["Хранение", companyDetails.storageConditions],
            ["Утилизация", "Использованное устройство с аккумулятором сдавайте в пункты приёма электроники."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-[1rem] border border-black/10 bg-white p-6">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-black">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-black/62">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <div className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-6 text-black">
            <p className="text-xs uppercase tracking-[0.22em] text-black/42">Что приложить к обращению</p>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-black/64">
              <p>Фото лицевой стороны упаковки и защитной зоны с кодом.</p>
              <p>Город, дата покупки и канал, через который вы получили продукт.</p>
              <p>Описание проблемы без медицинских заявлений и без публикации персональных данных.</p>
            </div>
          </div>
          <FaqAccordion items={supportFaq} />
        </div>
      </div>
    </section>
  );
}

function MediaKitTemplate(page: ResolvedPage) {
  const kitItems = [
    "презентация бренда и партнёрского маршрута",
    "характеристики STILNO CLICK ONE и карточки вкусов",
    "предупреждения 18+ и правовая рамка коммуникации",
    "правила визуальной подачи, POSM и материалов точки",
  ];

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Media kit",
            title: "Партнёрский пакет STILNO",
            body:
              "Материалы для оптовых, региональных и retail-запросов: презентация, продуктовая база, правила 18+ и маршрут запуска.",
            actions: [
              {
                label: "Скачать презентацию",
                href: documentLinks.franchisePresentation,
                variant: "primary",
                target: "_blank",
              },
              {
                label: "Материалы по продукту",
                href: documentLinks.deviceAndPackage,
                variant: "secondary",
                target: "_blank",
              },
            ],
          }}
          media={<EditorialImageCard slotId="partner-media-kit" title="Партнёрские материалы STILNO" />}
          compact
        />

        <div className="mt-12 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-[1rem] border border-black/10 bg-[#0b1018] p-6 text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/42">Состав пакета</p>
            <div className="mt-6 grid gap-4">
              {kitItems.map((item, index) => (
                <div key={item} className="border-t border-white/12 pt-4">
                  <p className="text-xs text-white/36">{String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-2 text-sm leading-6 text-white/74">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["Для опта", "SKU, характеристики, предупреждения и контактный маршрут B2B-заявки."],
              ["Для розницы", "Правила выкладки, возрастная проверка, материалы точки и запрос наличия."],
              ["Для франчайзинга", "Этапы запуска, документы, роли сторон и подготовка региона."],
              ["Для поддержки", "Проверка оригинальности, качество, хранение и утилизация устройства."],
            ].map(([title, body]) => (
              <article key={title} className="rounded-[1rem] border border-black/10 bg-white p-6">
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-black">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-black/62">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
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
              title: "Открытые роли STILNO",
              body: page.description,
            }}
            compact
          />
          <div className="mt-10 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
            <div className="rounded-[1rem] border border-black/10 bg-white p-6">
              <p className="text-base leading-7 text-black/64">
                Вы можете отправить общий карьерный отклик в команду STILNO или выбрать открытую роль из списка.
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
              <article key={vacancy.id} className="rounded-[1rem] border border-black/10 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-black/36">{vacancy.department}</p>
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
            <div className="rounded-[1rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-black/36">Что предстоит делать</p>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-black/64">
                {vacancy.description.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1rem] border border-black/10 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-black/36">Требования</p>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-black/64">
                  {vacancy.requirements.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
              <div className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-6 text-black">
                <p className="text-xs uppercase tracking-[0.22em] text-black/42">Условия</p>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-black/64">
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

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {siteSettings.contactLines.map((line) => (
            <div key={line.label} className="rounded-[1rem] border border-black/10 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-black/36">{line.label}</p>
              {line.href ? (
                <Link href={line.href} className="mt-3 block text-sm leading-6 text-black/70 underline decoration-black/14 underline-offset-4">
                  {line.value}
                </Link>
              ) : (
                <p className="mt-3 text-sm leading-6 text-black/62">{line.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="grid gap-5">
            <div className="rounded-[1rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-black/36">Маршрутизация обращений</p>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-black/64">
                <p>Розничные запросы идут через страницу «Где купить» и общую розничную форму.</p>
                <p>Оптовые и региональные обращения идут через страницу «Партнёрам».</p>
                <p>Запуск под брендом STILNO обрабатывается через отдельный раздел франчайзинга.</p>
              </div>
            </div>
            <div className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-6 text-black">
              <p className="text-xs uppercase tracking-[0.22em] text-black/42">Юридические данные</p>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-black/64">
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
              title: "Публикации и документы STILNO",
              body: page.description,
            }}
            compact
          />
          <div className="mt-8 rounded-[1rem] border border-black/10 bg-white p-8">
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
            <article key={article.id} className="rounded-[1rem] border border-black/10 bg-white p-5">
              <ProductPhotoCard
                slotId={`article-card-${article.slug}`}
                title={article.title}
                note="Обложка материала STILNO."
              />
              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.22em] text-black/36">{article.category}</span>
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
          <ProductPhotoCard
            slotId={`article-${article.slug}`}
            title={article.title}
            note="Сюда можно добавить новую обложку материала."
          />
        </div>
        <div className="mt-10 rounded-[1rem] border border-black/10 bg-white p-8">
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
                <div className="mb-5 inline-flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.22em] text-black/36">
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
    career: "Мы свяжемся с вами, если ваш профиль подойдёт под текущие задачи команды.",
  };

  const key = page.thankYouType ?? "retail";

  return (
    <section className="grid min-h-[70svh] place-items-center bg-white px-5 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl rounded-[1rem] border border-black/10 bg-white p-8 text-black sm:p-10">
        <p className="text-xs uppercase tracking-[0.22em] text-black/42">Спасибо</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em]">{labels[key]}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-black/64">{nextSteps[key]}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" analytics="thankyou_home" variant="secondary" tone="light">
            На главную
          </ButtonLink>
          <ButtonLink href="/contacts" analytics="thankyou_contacts" variant="secondary" tone="light">
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
        <div className="mt-10 rounded-[1rem] border border-black/10 bg-white p-8">
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
      <div className="min-h-screen bg-[var(--color-page)] text-black">
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
    case "media-kit":
      return MediaKitTemplate(page);
    case "verify":
      return VerifyTemplate(page);
    case "support":
      return SupportTemplate(page);
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
  const defaultImage = assetUrl(mediaAssets.og);

  if (!page) {
    return {
      title: "STILNO CLICK ONE | официальный сайт бренда 18+",
      description: siteSettings.description,
      canonical: siteOrigin,
      image: defaultImage,
    };
  }

  const titleMap: Partial<Record<ResolvedPage["kind"], string>> = {
    "stores-index": "Где купить STILNO | розничные запросы 18+",
    product: "STILNO CLICK ONE | характеристики продукта 18+",
    franchise: "Франчайзинг STILNO | партнёрство и запуск в регионах 18+",
    partners: "Партнёрам STILNO | оптовые и региональные запросы 18+",
    "media-kit": "Партнёрский пакет STILNO | B2B материалы 18+",
    verify: "Проверка оригинальности STILNO | код упаковки 18+",
    support: "Поддержка STILNO | качество, оригинальность и утилизация",
    responsible: "Ответственное потребление STILNO | информация 18+",
    contacts: "Контакты STILNO | официальный сайт бренда 18+",
    faq: "FAQ STILNO | продукт, партнёрство и правовая информация 18+",
  };

  const descriptionMap: Partial<Record<ResolvedPage["kind"], string>> = {
    "stores-index":
      "Опубликованная точка STILNO в Москве, телефон, маршрут и форма для розничного запроса без дистанционной продажи.",
    product:
      "STILNO CLICK ONE: подтверждённые характеристики продукта, вкусовые варианты, предупреждения 18+ и партнёрские CTA.",
    franchise:
      "Франчайзинг STILNO: партнёрский запуск бренда в регионах без публичной оферты и без обещаний доходности.",
    partners:
      "Партнёрам STILNO: оптовые, региональные и B2B-запросы по бренду принимаются через форму сайта и обсуждаются индивидуально.",
    "media-kit":
      "Партнёрский пакет STILNO: презентация, продуктовая база, правила 18+ и материалы для оптовых и региональных запросов.",
    verify:
      "Проверка оригинальности STILNO: ввод кода с упаковки, подсказки по спорному результату и переход в поддержку.",
    support:
      "Поддержка STILNO: оригинальность, качество, правила хранения, утилизация устройства и контакты поддержки.",
    contacts:
      "Контакты STILNO: формы обратной связи, данные об изготовителе и направления для розничных, оптовых и франчайзинговых запросов.",
  };

  return {
    title: titleMap[page.kind] ?? page.title,
    description: descriptionMap[page.kind] ?? page.description,
    canonical: `${siteOrigin}/${page.pathname.join("/")}`,
    image: defaultImage,
  };
}
