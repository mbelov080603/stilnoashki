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
  b2bValueItems,
  brandFaceItems,
  brandNarrative,
  contactRouteCards,
  contactsPageContent,
  faqItems,
  faqPageGroups,
  formSchemas,
  franchiseContent,
  franchisePillars,
  homeContent,
  launchMetrics,
  partnersPageContent,
  partnerValueItems,
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
import type { CtaLink, PageHeroContract, PageStat, Product, ResolvedPage, SectionContract } from "@/lib/site-types";

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
        ? "border-[#e7c89f] bg-[#e7c89f] text-black hover:border-[#f0d8b8] hover:bg-[#f0d8b8]"
        : "border-black bg-black text-white hover:bg-black/82"
      : variant === "ghost"
        ? tone === "dark"
          ? "border-transparent bg-transparent text-white/76 hover:text-white"
          : "border-transparent bg-transparent text-black/66 hover:text-black"
        : tone === "dark"
          ? "border-white/18 bg-white/[0.07] text-white hover:border-white/34 hover:bg-white/[0.12]"
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
            "mb-5 flex w-fit max-w-full items-center gap-3 text-[0.68rem] uppercase tracking-[0.18em]",
            tone === "dark" ? "text-white/44" : "text-black/44",
          )}
        >
          <span className={classNames("h-px w-10 shrink-0", tone === "dark" ? "bg-white/22" : "bg-black/20")} />
          <span className="min-w-0 break-words">{contract.eyebrow}</span>
        </div>
      ) : null}
      <TitleTag
        className={classNames(
          "max-w-full break-words text-3xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-4xl lg:text-5xl",
          tone === "dark" ? "text-white" : "text-black",
        )}
      >
        {contract.title}
      </TitleTag>
      <p
        className={classNames(
          "mt-5 max-w-2xl break-words text-base leading-7 sm:text-lg",
          tone === "dark" ? "text-white/62" : "text-black/62",
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
        "grid min-w-0 gap-8",
        media ? "xl:grid-cols-[0.84fr_1.16fr] xl:items-center" : "",
        compact ? "py-2" : "",
      )}
    >
      <div className={classNames("min-w-0", media ? "order-2 xl:order-1" : "")}>
        {contract.eyebrow ? (
          <div
            className={classNames(
              "mb-5 flex w-fit max-w-full items-center gap-3 text-[0.68rem] uppercase tracking-[0.18em]",
              tone === "dark" ? "text-white/44" : "text-black/44",
            )}
          >
            <span className={classNames("h-px w-10 shrink-0", tone === "dark" ? "bg-white/24" : "bg-black/20")} />
            <span className="min-w-0 break-words">{contract.eyebrow}</span>
          </div>
        ) : null}
        <h1
          className={classNames(
            "max-w-4xl break-words text-[2.35rem] font-semibold leading-[1.06] sm:text-[3.35rem] sm:leading-[1.03] lg:text-[4.65rem] lg:leading-[1]",
            tone === "dark" ? "text-white" : "text-black",
          )}
        >
          {contract.title}
        </h1>
        <p
          className={classNames(
            "mt-6 max-w-[38rem] break-words text-base leading-7 sm:text-lg sm:leading-8",
            tone === "dark" ? "text-white/64" : "text-black/64",
          )}
        >
          {contract.body}
        </p>
        {contract.detailItems?.length ? (
          <dl
            className={classNames(
              "mt-6 grid max-w-3xl grid-cols-2 overflow-hidden rounded-[1.15rem] border sm:grid-cols-3",
              tone === "dark" ? "border-white/12 bg-white/[0.07]" : "border-black/10 bg-white",
            )}
          >
            {contract.detailItems.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className={classNames(
                  "min-w-0 border-t px-4 py-3 sm:px-5 [&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(-n+3)]:border-t-0",
                  tone === "dark" ? "border-white/10" : "border-black/10",
                )}
              >
                <dt className={classNames("text-[0.62rem] uppercase tracking-[0.18em]", tone === "dark" ? "text-white/42" : "text-black/42")}>
                  {item.label}
                </dt>
                <dd className={classNames("mt-1 text-sm font-semibold leading-5 sm:text-base", tone === "dark" ? "text-white/88" : "text-black/86")}>
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : contract.detailLine ? (
          <div
            className={classNames(
              "mt-6 flex max-w-3xl rounded-[1.15rem] border px-5 py-4 text-sm leading-7 sm:text-base",
              tone === "dark"
                ? "border-white/12 bg-white/[0.08] text-white/86"
                : "border-black/10 bg-white text-black",
            )}
          >
            {contract.detailLine}
          </div>
        ) : null}
        {contract.note ? (
          <p className={classNames("mt-3 text-sm", tone === "dark" ? "text-white/42" : "text-black/46")}>
            {contract.note}
          </p>
        ) : null}
        <ActionGroup actions={contract.actions} tone={tone} />
      </div>
      {media ? <div className="order-1 min-w-0 xl:order-2">{media}</div> : null}
    </div>
  );
}

function EditorialHero({
  contract,
  media,
  children,
}: {
  contract: PageHeroContract;
  media: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#080807] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(231,200,159,0.18),transparent_34%),linear-gradient(140deg,rgba(255,255,255,0.05),transparent_32%)]" />
      <div className="relative mx-auto max-w-[90rem] px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PageHero contract={contract} tone="dark" media={media} />
        {children}
      </div>
    </section>
  );
}

function FeatureRail({
  items,
  tone = "light",
}: {
  items: Array<{ value: string; label: string; note: string }>;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={classNames(
        "grid overflow-hidden rounded-[1.2rem] border md:grid-cols-3",
        tone === "dark" ? "border-white/12 bg-white/[0.06]" : "border-black/10 bg-white",
      )}
    >
      {items.map((item, index) => (
        <div
          key={`${item.value}-${item.label}`}
          className={classNames(
            "p-5",
            index > 0 && (tone === "dark" ? "border-t border-white/10 md:border-l md:border-t-0" : "border-t border-black/10 md:border-l md:border-t-0"),
          )}
        >
          <p className={classNames("text-xl font-semibold tracking-[-0.04em]", tone === "dark" ? "text-white" : "text-black")}>
            {item.value}
          </p>
          <p className={classNames("mt-2 text-xs uppercase tracking-[0.16em]", tone === "dark" ? "text-white/42" : "text-black/42")}>
            {item.label}
          </p>
          <p className={classNames("mt-3 text-sm leading-6", tone === "dark" ? "text-white/58" : "text-black/56")}>
            {item.note}
          </p>
        </div>
      ))}
    </div>
  );
}

function ValueGrid({
  items,
  tone = "light",
}: {
  items: PageStat[];
  tone?: "light" | "dark";
}) {
  return (
    <div className={classNames("grid gap-4 md:grid-cols-2", tone === "dark" ? "text-white" : "text-black")}>
      {items.map((item) => (
        <article
          key={`${item.value}-${item.label}`}
          className={classNames(
            "min-w-0 rounded-[1.15rem] border p-5 sm:p-6",
            tone === "dark" ? "border-white/12 bg-white/[0.06]" : "border-black/10 bg-white",
          )}
        >
          <p className={classNames("text-2xl font-semibold leading-none tracking-[-0.045em]", tone === "dark" ? "text-white" : "text-black")}>
            {item.value}
          </p>
          <p className={classNames("mt-3 text-xs font-semibold uppercase tracking-[0.16em]", tone === "dark" ? "text-white/42" : "text-black/42")}>
            {item.label}
          </p>
          <p className={classNames("mt-4 text-sm leading-7", tone === "dark" ? "text-white/58" : "text-black/60")}>
            {item.note}
          </p>
        </article>
      ))}
    </div>
  );
}

function SalesCtaBand({
  eyebrow,
  title,
  body,
  actions,
}: {
  eyebrow: string;
  title: string;
  body: string;
  actions: CtaLink[];
}) {
  return (
    <section className="bg-[#080807] text-white">
      <div className="mx-auto max-w-[90rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionIntro tone="dark" contract={{ eyebrow, title, body }} />
          <ActionGroup actions={actions} tone="dark" analyticsPrefix={`cta_${eyebrow}`} />
        </div>
      </div>
    </section>
  );
}

function SpecPanel({
  eyebrow,
  title,
  specs,
  tone = "light",
  className,
}: {
  eyebrow: string;
  title: string;
  specs: Array<{ label: string; value: string }>;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "rounded-[1.2rem] border p-5 sm:p-6",
        tone === "dark" ? "border-white/12 bg-white/[0.06] text-white" : "border-black/10 bg-white text-black",
        className,
      )}
    >
      <p className={classNames("text-xs uppercase tracking-[0.22em]", tone === "dark" ? "text-white/42" : "text-black/36")}>
        {eyebrow}
      </p>
      <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.04em]">{title}</h3>
      <div className={classNames("mt-5 divide-y", tone === "dark" ? "divide-white/10" : "divide-black/10")}>
        {specs.map((spec) => (
          <div key={`${spec.label}-${spec.value}`} className="grid gap-2 py-3 sm:grid-cols-[0.8fr_1.2fr] sm:items-start">
            <p className={classNames("text-sm", tone === "dark" ? "text-white/46" : "text-black/48")}>{spec.label}</p>
            <p className={classNames("text-sm font-medium leading-6", tone === "dark" ? "text-white/84" : "text-black/82")}>{spec.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaSpread({
  primarySlot,
  secondarySlot,
  title,
  body,
  reverse = false,
}: {
  primarySlot: string;
  secondarySlot?: string;
  title: string;
  body: string;
  reverse?: boolean;
}) {
  return (
    <div className={classNames("grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-stretch", reverse && "xl:grid-cols-[0.85fr_1.15fr]")}>
      <div className={classNames("min-w-0", reverse && "xl:order-2")}>
        <MediaSlot
          slotId={primarySlot}
          title={title}
          note={body}
          aspect="wide"
          className="min-h-[20rem] sm:min-h-[26rem] lg:aspect-[16/9]"
        />
      </div>
      <div className={classNames("grid gap-5", reverse && "xl:order-1")}>
        <div className="rounded-[1.2rem] border border-black/10 bg-white p-6">
          <h3 className="text-3xl font-semibold leading-tight tracking-[-0.045em] text-black">{title}</h3>
          <p className="mt-4 text-sm leading-7 text-black/62">{body}</p>
        </div>
        {secondarySlot ? (
          <MediaSlot
            slotId={secondarySlot}
            title={title}
            note={body}
            aspect="square"
            className="min-h-[14rem] sm:min-h-[18rem]"
          />
        ) : null}
      </div>
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
        tone === "dark" ? "text-white/44" : "text-black/44",
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
    body: "Команда оставляет контакты, город и текущий статус проекта.",
  },
  {
    title: "Первичный контакт",
    body: "Менеджер уточняет задачу, формат запуска и готовность региона к категории 18+.",
  },
  {
    title: "Город",
    body: "Обсуждаются регион, команда, возможная зона запуска и роль действующей точки.",
  },
  {
    title: "Формат",
    body: "Фиксируем запуск под брендом, запуск на базе действующей точки или региональный запуск.",
  },
  {
    title: "Условия",
    body: "Условия обсуждаются индивидуально, без публичной оферты и обещаний доходности.",
  },
  {
    title: "Документы",
    body: "Фиксируется правовая рамка, обязанности сторон и порядок работы с бренд-материалами.",
  },
  {
    title: "Подготовка",
    body: "Передаются продуктовая база, презентация, визуальная система и рабочий контакт.",
  },
  {
    title: "Старт",
    body: "Старт проходит после согласования формата и готовности команды соблюдать стандарты 18+.",
  },
];

const franchiseSupportItems = [
  {
    title: "Визуальная система",
    body: "Силуэт, упаковка, вкусовые метки и правила брендовой подачи STILNO.",
  },
  {
    title: "Продуктовая база",
    body: "Подтверждённые характеристики, вкусы и упаковочные материалы STILNO CLICK ONE.",
  },
  {
    title: "Презентация",
    body: "Материалы для первичного знакомства с брендом, продуктом и форматом запуска.",
  },
  {
    title: "Legal 18+",
    body: "Предупреждения, правила категории, отсутствие медицинских и финансовых обещаний.",
  },
];

const franchiseHeroSignals = [
  { label: "Категория", value: "18+" },
  { label: "Старт", value: "город + команда" },
  { label: "Материалы", value: "visual + product" },
  { label: "Условия", value: "индивидуально" },
];

function FranchiseProductLineup({ priority = false, compact = false }: { priority?: boolean; compact?: boolean }) {
  void priority;

  return (
    <MediaSlot
      slotId={compact ? "franchise-lineup-compact" : "franchise-lineup"}
      title="Продуктовая линейка STILNO"
      note="Групповая подача продукта, упаковки и брендовых материалов."
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
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-black/44">STILNO / region launch</p>
          <h3 className="mt-4 max-w-[24rem] text-3xl font-semibold leading-[1.03] tracking-[-0.025em] text-black sm:text-4xl">
            Город получает готовое лицо бренда
          </h3>
          <p className="mt-5 max-w-[24rem] text-sm leading-6 text-black/62">
            Сначала фиксируем город, команду и статус проекта. Затем переходим к презентации, продуктовой базе,
            документам и условиям.
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
  const heroVariant = featuredProduct.variants[0];
  const showcaseVariants = featuredProduct.variants;

  return (
    <div className="mt-8 grid gap-8 xl:grid-cols-[0.72fr_1.28fr] xl:items-stretch">
      <aside className="border-y border-black/10 py-6 text-black">
        <div className="flex h-full flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/44">Витрина</p>
          <h3 className="mt-4 text-3xl font-semibold leading-tight">STILNO CLICK ONE</h3>
          <p className="mt-4 text-sm leading-6 text-black/62">
            Вкусы и параметры вынесены в компактный B2B-лист: без имитации интернет-каталога и без
            дистанционной продажи.
          </p>
          <div className="mt-6">
            <FranchiseProductLineup compact />
          </div>
          <div className="mt-auto divide-y divide-black/10 pt-6">
            {partnerMarketplaceSpecs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-[0.8fr_1.2fr] gap-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-black/42">{spec.label}</p>
                <p className="text-sm font-medium text-black">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
        <ProductPhotoCard
          slotId={`partner-variant-${heroVariant?.id ?? "fallback"}`}
          title={heroVariant?.title ?? featuredProduct.title}
          note="Крупный B2B-визуал STILNO CLICK ONE."
          aspect="wide"
          className="min-h-[22rem] lg:aspect-[4/5] xl:min-h-[34rem]"
        />
        <div className="flex min-w-0 flex-col border-y border-black/10 py-1">
          <div className="py-5">
            <p className="text-xs uppercase tracking-[0.18em] text-black/38">Ассортимент</p>
            <h4 className="mt-3 text-2xl font-semibold leading-tight text-black">Вкусы текущей линии</h4>
          </div>
          <div className="divide-y divide-black/10">
            {showcaseVariants.map((variant, index) => (
              <div key={variant.id} className="grid gap-3 py-4 sm:grid-cols-[2.5rem_1fr_auto] sm:items-start">
                <span className="text-sm font-medium text-black/34">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-base font-semibold leading-snug text-black">{variant.title}</p>
                  <p className="mt-1 text-sm leading-5 text-black/54">{variant.flavor}</p>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/56">
                    {variant.nicotineStrength}
                  </span>
                  <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/56">
                    {variant.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-6">
            <Link
              href="#partner-form"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-black bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/82"
            >
              Запросить ассортимент
            </Link>
          </div>
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
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto grid max-w-[86rem] gap-8 px-5 py-12 sm:px-6 md:grid-cols-3 lg:grid-cols-5 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.22em] text-black/42">Бренд</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-black">STILNO</h2>
          <p className="mt-4 text-sm leading-6 text-black/62">
            Информация о бренде, продукте, розничной точке и B2B-маршрутах STILNO для аудитории 18+.
          </p>
          <div className="mt-5 grid gap-3 text-xs leading-5 text-black/58">
            {siteSettings.contactLines.slice(0, 2).map((line) => (
              <p key={line.label}>
                <span className="block text-black/38">{line.label}</span>
                <span className="mt-1 block">{line.value}</span>
              </p>
            ))}
          </div>
        </div>

        {siteSettings.footerGroups.map((group) => (
          <div key={group.label} className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-black/42">{group.label}</p>
            <div className="mt-4 grid gap-2 text-sm">
              {group.links.map((item) => (
                <Link key={item.href} href={item.href} className="text-black/68 transition hover:text-black">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-black/10">
        <div className="mx-auto grid max-w-[86rem] gap-4 px-5 py-5 text-[0.72rem] leading-5 text-black/42 sm:px-6 md:grid-cols-3 lg:px-8">
          <p>
            <span className="font-medium text-black/58">18+.</span> Никотин вызывает зависимость. Продажа
            несовершеннолетним запрещена.
          </p>
          <p>Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции.</p>
          <p>Информация на сайте носит справочный характер. Условия обсуждаются индивидуально.</p>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="mx-auto flex max-w-[86rem] flex-col gap-2 px-5 py-4 text-xs leading-5 text-black/38 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 STILNO. Все права защищены.</p>
          <p>ООО &quot;ВОСТОК ИМПОРТ ПРОМ&quot;</p>
        </div>
      </div>
    </footer>
  );
}

export function HomeTemplate() {
  const heroActions = homeContent.hero.actions;
  const retailStore = stores[0];

  return (
    <>
      <StructuredData data={buildJsonLd()} />

      <EditorialHero
        contract={{ ...homeContent.hero, actions: heroActions }}
        media={
          <MediaSlot
            slotId="home-hero"
            title="STILNO CLICK ONE"
            note="Продукт, упаковка и маркировка в первом экране."
            aspect="wide"
            className="min-h-[19rem] border-white/10 sm:min-h-[28rem] lg:aspect-[16/11] xl:min-h-[34rem]"
          />
        }
      >
        <div className="mt-8 lg:mt-10">
          <FeatureRail items={launchMetrics.slice(0, 3)} tone="dark" />
        </div>
      </EditorialHero>

      <section className="border-y border-black/10 bg-[#fbfaf7]">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 xl:grid-cols-[0.82fr_1.18fr] xl:items-start">
            <div>
              <SectionIntro contract={homeContent.partnersSection} />
              <div className="mt-8">
                <MediaSlot
                  slotId="home-partners"
                  title="B2B-визуал STILNO"
                  note="B2B-визуал маршрута STILNO."
                  aspect="wide"
                  className="min-h-[20rem] lg:aspect-[16/10]"
                />
              </div>
            </div>
            <ValueGrid items={brandFaceItems} />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
            <div>
              <SectionIntro contract={homeContent.partnerValueSection} />
              <div className="mt-9">
                <ValueGrid items={partnerValueItems} />
              </div>
            </div>
            <MediaSlot
              slotId="home-partners"
              title="STILNO в B2B-среде"
              note="Премиальная B2B-подача продукта STILNO."
              aspect="wide"
              className="min-h-[24rem] lg:aspect-[4/5] xl:min-h-[34rem]"
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-22">
          <div className="grid gap-8 xl:grid-cols-[0.78fr_1.22fr] xl:items-end">
            <SectionIntro contract={homeContent.productSection} />
            <div className="hidden h-px bg-black/10 xl:block" />
          </div>
          <div className="mt-10">
            <MediaSpread
              primarySlot="home-product"
              secondarySlot="product-close-vishnya"
              title="Устройство, упаковка и маркировка в одном продукте."
              body="Визуальная подача строится вокруг реального устройства STILNO CLICK ONE, упаковки, вкусовой метки и читаемого предупреждения 18+."
            />
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3 lg:items-stretch">
            <SpecPanel
              eyebrow="Ключевые параметры"
              title="Без лишнего рекламного шума."
              specs={featuredProduct.specs.slice(0, 6)}
              className="h-full"
            />
            {qualityStandards.slice(0, 2).map((item) => (
              <article key={item.title} className="flex h-full flex-col rounded-[1.2rem] border border-black/10 bg-white p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-black/36">STILNO</p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.04em] text-black">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-black/60">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080807] text-white">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 xl:grid-cols-[0.88fr_1.12fr] xl:items-center">
            <div>
              <SectionIntro tone="dark" contract={homeContent.responsibleSection} />
              <div className="mt-9">
                <FeatureRail
                  tone="dark"
                  items={[
                    { value: "Код", label: "проверка", note: "Проверка оригинальности через код с упаковки." },
                    { value: "18+", label: "режим", note: "Возрастная рамка не маскируется под мелкий legal." },
                    { value: "Support", label: "качество", note: "Спорный код, качество и утилизация вынесены в поддержку." },
                  ]}
                />
              </div>
            </div>
            <div className="grid gap-5">
              <MediaSlot
                slotId="verify-product"
                title="Проверка оригинальности STILNO"
                note="Продуктовый визуал рядом с trust-блоком."
                aspect="wide"
                className="border-white/10"
              />
              <LegalWarningStrip />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 xl:grid-cols-[0.86fr_1.14fr] xl:items-start">
            <div>
              <SectionIntro contract={homeContent.storesSection} />
              <div className="mt-8 rounded-[1.2rem] border border-black/10 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-black/36">Текущая точка</p>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-black">
                  {retailStore.title} · Москва
                </h3>
                <p className="mt-3 text-sm leading-7 text-black/62">{retailStore.address}</p>
                <p className="mt-1 text-sm leading-7 text-black/62">Телефон: {retailStore.phone}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href={retailStore.directionsHref ?? "/stores"} target="_blank" variant="secondary" tone="light" analytics="home_store_route">
                    Построить маршрут
                  </ButtonLink>
                  <ButtonLink href="/stores#stores-request" variant="secondary" tone="light" analytics="home_store_request">
                    Уточнить наличие
                  </ButtonLink>
                </div>
              </div>
            </div>
            <MediaSlot
              slotId="home-stores"
              title="Розничный визуал STILNO"
              note="Визуал опубликованной точки и розничных запросов."
              aspect="wide"
              className="min-h-[24rem] lg:aspect-[16/9]"
            />
          </div>
        </div>
      </section>

      <SalesCtaBand
        eyebrow="STILNO для бизнеса"
        title="Хотите поставить STILNO на полку или обсудить запуск в регионе?"
        body="Выберите B2B-запрос для опта и действующей розницы или отдельный маршрут запуска под брендом. Мы сохраним коммерческий фокус и legal-рамку 18+."
        actions={[
          { label: "Оставить B2B-запрос", href: "/partners#partner-form", variant: "primary" },
          { label: "Запуск под брендом", href: "/franchise#franchise-form", variant: "secondary" },
        ]}
      />

    </>
  );
}

function StoresIndexTemplate(page: ResolvedPage) {
  const store = stores[0];
  if (!store) {
    notFound();
  }

  return (
    <>
      <StructuredData data={buildJsonLd(page)} />
      <EditorialHero
        contract={storesContent.hero}
        media={
          <MediaSlot
            slotId="stores-hero"
            title="Фото для страницы розницы"
            note="Визуал точки STILNO в Москве."
            aspect="wide"
            className="min-h-[20rem] border-white/10 sm:min-h-[28rem] lg:aspect-[16/11] xl:min-h-[34rem]"
          />
        }
      />

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 xl:grid-cols-[0.8fr_1.2fr] xl:items-start">
          <div>
            <SectionIntro contract={storesContent.statusSection} />
            <div className="mt-8">
              <FeatureRail items={storesContent.statusCards} />
            </div>
          </div>
          <div className="rounded-[1.2rem] border border-black/10 bg-white p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-black/36">Текущая точка</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.05em] text-black">
              {store.title}
            </h2>
            <div className="mt-6 divide-y divide-black/10">
              <p className="py-4 text-sm leading-6 text-black/64">Город: Москва</p>
              <p className="py-4 text-sm leading-6 text-black/64">Адрес: {store.address}</p>
              <p className="py-4 text-sm leading-6 text-black/64">Телефон: {store.phone}</p>
              <p className="py-4 text-sm leading-6 text-black/64">{store.inventoryStatus}</p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {store.directionsHref ? (
                <ButtonLink href={store.directionsHref} target="_blank" variant="secondary" tone="light" analytics="stores_route">
                  Построить маршрут
                </ButtonLink>
              ) : null}
              <ButtonLink href={`tel:${store.phone.replace(/[^\d+]/g, "")}`} variant="secondary" tone="light" analytics="stores_call">
                Позвонить
              </ButtonLink>
              <ButtonLink href="#stores-request" tone="light" analytics="stores_request">
                Оставить запрос
              </ButtonLink>
            </div>
          </div>
          </div>

        <div id="stores-request" className="mt-14 grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
          <LeadForm type="retail" schema={formSchemas.retailBase} />
          <div className="grid gap-4">
            <MediaSlot
              slotId="stores-request"
              title="Фото для формы запроса"
              note="Визуал формы розничного запроса."
              aspect="wide"
              className="min-h-[18rem]"
            />
            <div className="rounded-[1.2rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-black/36">{storesContent.supportTitle}</p>
              <p className="mt-4 text-sm leading-7 text-black/64">{storesContent.supportBody}</p>
            </div>
            <div className="rounded-[1.2rem] border border-black/10 bg-[#fbfaf7] p-6 text-black">
              <p className="text-xs uppercase tracking-[0.22em] text-black/42">Дисклеймер</p>
              <p className="mt-4 text-sm leading-7 text-black/64">{storesContent.disclaimer}</p>
              <div className="mt-6">
                <ButtonLink href="/partners" variant="secondary" tone="light" analytics="stores_partner_redirect">
                  Для бизнеса
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
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
    <>
      <StructuredData data={buildJsonLd(page)} />
      <EditorialHero
        contract={{
          title: "STILNO",
          body: "Взрослая визуальная система для категории 18+: чёрный силуэт, чистая упаковка, вкусовая линия и B2B-first подача без лишнего шума.",
          actions: [
            { label: "Смотреть продукт", href: "/products/stilno-click-one", variant: "primary" },
            { label: "B2B-запрос", href: "/partners#partner-form", variant: "secondary" },
          ],
        }}
        media={
          <MediaSlot
            slotId="about-primary"
            title="Лицо бренда STILNO"
            note="Основной визуальный код бренда STILNO."
            aspect="wide"
            className="min-h-[20rem] border-white/10 sm:min-h-[28rem] lg:aspect-[16/11] xl:min-h-[34rem]"
          />
        }
      />
      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} />
          <div className="grid gap-10 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
            <div className="rounded-[1rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-black/36">Brand manifesto</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] text-black">
                STILNO выглядит как бренд, а не как справочник по категории.
              </h2>
              <div className="mt-6">
                <RichText paragraphs={brandNarrative} />
              </div>
            </div>
            <ValueGrid items={brandFaceItems} />
          </div>
          <div className="mt-10 grid gap-5 xl:grid-cols-2">
            <EditorialImageCard
              slotId="about-secondary"
              title="Материалы и производство STILNO"
              note="Производственный и операционный контекст бренда."
              className="min-h-[20rem]"
            />
            <EditorialImageCard
              slotId="gallery-packaging-series"
              title="Вкусовая серия STILNO"
              note="Полочная узнаваемость вкусовой линии."
              className="min-h-[20rem]"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function GalleryTemplate(page: ResolvedPage) {
  return (
    <>
      <StructuredData data={buildJsonLd(page)} />
      <EditorialHero
        contract={{
          title: "Визуальный код STILNO",
          body: "Корпус, упаковка, вкусовые метки, предупреждение 18+ и retail-среда показывают лицо бренда до того, как пользователь откроет характеристики.",
          actions: [{ label: "Смотреть продукт", href: "/products/stilno-click-one", variant: "primary" }],
        }}
        media={
          <MediaSlot
            slotId="gallery-hero"
            title="Фото галереи"
            note="Главный визуал галереи STILNO."
            aspect="wide"
            className="min-h-[20rem] border-white/10 sm:min-h-[28rem] lg:aspect-[16/11] xl:min-h-[34rem]"
          />
        }
      />

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-12 grid gap-8 xl:grid-cols-[0.78fr_1.22fr] xl:items-start">
            <SectionIntro
              contract={{
                eyebrow: "Лицо бренда",
                title: "STILNO держится на нескольких узнаваемых сигналах.",
                body: "Сайт показывает не просто фотографии продукта, а систему: корпус, упаковку, вкус, legal 18+ и среду, где продукт должен выглядеть уверенно.",
              }}
            />
            <ValueGrid items={brandFaceItems} />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="xl:row-span-2">
              <ProductPhotoCard
                slotId={`gallery-${galleryItems[0].id}`}
                title={galleryItems[0].title}
                note={galleryItems[0].caption}
                aspect="wide"
                className="min-h-[24rem] lg:aspect-[16/10]"
              />
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-black">{galleryItems[0].title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/62">{galleryItems[0].caption}</p>
            </article>
            {galleryItems.slice(1, 3).map((item) => (
              <article key={item.id}>
                <ProductPhotoCard
                  slotId={`gallery-${item.id}`}
                  title={item.title}
                  note={item.caption}
                  aspect="square"
                  className="min-h-[16rem]"
                />
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.035em] text-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{item.caption}</p>
              </article>
            ))}
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {galleryItems.slice(3).map((item, index) => (
              <article
                key={item.id}
                className={classNames(
                  "min-w-0",
                  index === 1 || index === 4 ? "xl:col-span-2" : "",
                )}
              >
                <ProductPhotoCard
                  slotId={`gallery-${item.id}`}
                  title={item.title}
                  note={item.caption}
                  aspect={index === 1 || index === 4 ? "wide" : "square"}
                  className={classNames(index === 1 || index === 4 ? "min-h-[18rem] lg:aspect-[16/9]" : "min-h-[16rem]")}
                />
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.035em] text-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{item.caption}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
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

  const heroActions = productPageContent.hero.actions?.slice(0, 2);

  return (
    <>
      <StructuredData data={buildJsonLd(page)} />
      <EditorialHero
        contract={{ ...productPageContent.hero, actions: heroActions }}
        media={
          <MediaSlot
            slotId="product-hero"
            title="STILNO CLICK ONE"
            note="Главный продуктовый визуал STILNO CLICK ONE."
            aspect="wide"
            className="min-h-[20rem] border-white/10 sm:min-h-[28rem] lg:aspect-[16/11] xl:min-h-[34rem]"
          />
        }
      >
        <div className="mt-8">
          <FeatureRail items={launchMetrics.slice(0, 3)} tone="dark" />
        </div>
      </EditorialHero>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 xl:grid-cols-[1.02fr_0.98fr] xl:items-start">
            <div className="xl:sticky xl:top-28">
              <Suspense fallback={<VariantPickerFallback product={product} />}>
                <VariantPicker product={product} />
              </Suspense>
            </div>
            <div className="grid gap-6">
              <SectionIntro contract={productPageContent.detailSection} />
              <SpecPanel
                eyebrow="Характеристики"
                title="Подтверждённые параметры текущей линии."
                specs={product.specs}
              />
              <div className="rounded-[1.2rem] border border-black/10 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-black/36">Факты и маркировка</p>
                <div className="mt-5 divide-y divide-black/10">
                  {product.facts.map((fact) => (
                    <p key={fact} className="py-3 text-sm leading-6 text-black/64">
                      {fact}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <MediaSpread
              primarySlot="product-packaging-spread"
              secondarySlot="product-detail-lifestyle"
              title="Полка считывает STILNO по силуэту и упаковке."
              body="Подача продукта строится на реальной маркировке: фронт упаковки, устройство, вкусовая метка и предупреждение остаются читаемыми."
              reverse
            />
          </div>

          <div className="mt-14 grid gap-10 xl:grid-cols-[0.78fr_1.22fr] xl:items-start">
            <SectionIntro contract={productPageContent.visualSection} />
            <ValueGrid items={brandFaceItems} />
          </div>

          <div className="mt-14">
            <SectionIntro contract={productPageContent.packagingSection} />
            <div className="mt-8 grid gap-7 xl:grid-cols-[0.78fr_1.22fr] xl:items-start">
              <ProductPhotoCard
                slotId={`variant-${product.variants[0]?.id ?? "fallback"}`}
                title={product.variants[0]?.title ?? product.title}
                note="Крупный визуал вкусовой линейки STILNO CLICK ONE."
                aspect="wide"
                className="min-h-[22rem] lg:aspect-[4/5] xl:min-h-[33rem]"
              />
              <div className="border-y border-black/10">
                {product.variants.map((variant, index) => (
                  <article
                    key={variant.id}
                    className="grid gap-3 border-b border-black/10 py-4 last:border-b-0 sm:grid-cols-[3rem_1fr_auto] sm:items-start"
                  >
                    <span className="text-sm font-medium text-black/34">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-xl font-semibold leading-tight text-black">{variant.title}</h3>
                      <p className="mt-1 text-sm leading-5 text-black/54">{variant.flavor}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/56">
                        {variant.nicotineStrength}
                      </span>
                      <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/56">
                        {variant.status}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 rounded-[1.2rem] border border-black/10 bg-white p-6 text-black sm:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-black/36">Дальнейшие действия</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.05em]">
              Продукт продаёт образ, заявки уходят в свои маршруты.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-black/62">
              Здесь остаётся продуктовая подача STILNO CLICK ONE. Запрос наличия, B2B-заявка и проверка кода
              обрабатываются в своих разделах.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/stores#stores-request" tone="light" analytics="product_retail_request">
                Оставить розничный запрос
              </ButtonLink>
              <ButtonLink href="/verify" tone="light" variant="secondary" analytics="product_verify">
                Проверить оригинальность
              </ButtonLink>
              <ButtonLink href="/partners" tone="light" variant="secondary" analytics="product_partner_request">
                Оставить B2B-запрос
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#080807] text-white">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 xl:grid-cols-[0.88fr_1.12fr]">
            <SectionIntro
              tone="dark"
              contract={{
                eyebrow: "18+",
                title: "Короткая правовая рамка рядом с продуктом.",
                body: "Полные политики, согласия и разъяснения находятся в legal-разделе. На продуктовой странице остаются предупреждения, состав и фактическая маркировка.",
                actions: [{ label: "Правовая информация", href: "/responsible", variant: "secondary" }],
              }}
            />
            <div className="grid gap-3">
              {product.warnings.map((warning) => (
                <div key={warning} className="rounded-[1.1rem] border border-white/12 bg-white/[0.06] px-4 py-4 text-sm leading-6 text-white/68">
                  {warning}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PartnersTemplate(page: ResolvedPage) {
  const partnerResources = [
    ["B2B-пакет", "Презентация, продуктовая база и визуальная система для первичного B2B-знакомства.", "/partners/media-kit"],
    ["Retail 18+", "Возрастная проверка, выкладка и корректная консультация для действующих точек.", "/responsible"],
    ["Проверка", "Оригинальность и спорный код остаются в отдельном trust-разделе.", "/verify"],
    ["Support", "Качество, хранение и утилизация вынесены в поддержку.", "/support"],
  ];

  return (
    <>
      <StructuredData data={buildJsonLd(page)} />
      <EditorialHero
        contract={{
          ...partnersPageContent.hero,
          actions: [
            { label: "Оставить B2B-запрос", href: "#partner-form", variant: "primary" },
            { label: "B2B-пакет", href: "/partners/media-kit", variant: "secondary" },
            { label: "Запуск под брендом", href: "/franchise", variant: "secondary" },
          ],
        }}
        media={
          <MediaSlot
            slotId="partners-hero"
            title="Фото для партнёров"
            note="B2B-визуал запроса."
            aspect="wide"
            className="min-h-[20rem] border-white/10 sm:min-h-[28rem] lg:aspect-[16/11] xl:min-h-[34rem]"
          />
        }
      />

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 xl:grid-cols-[0.82fr_1.18fr] xl:items-start">
            <div>
              <SectionIntro contract={partnersPageContent.contactFlowSection} />
              <div className="mt-8">
                <ButtonLink href="#partner-form" variant="primary" tone="light" analytics="partners_value_b2b_request">
                  Оставить B2B-запрос
                </ButtonLink>
              </div>
            </div>
            <ValueGrid items={b2bValueItems} />
          </div>

          <div className="mt-14">
            <SectionIntro contract={partnersPageContent.directionsSection} />
            <PartnerProductShowcase />
          </div>

          <div className="mt-14 grid gap-6 xl:grid-cols-[0.78fr_1.22fr] xl:items-start">
            <div className="rounded-[1.2rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-black/36">Как проходит B2B-контакт</p>
              <div className="mt-5 divide-y divide-black/10">
                {partnersPageContent.contactFlow.map((step) => (
                  <p key={step} className="py-3 text-sm leading-6 text-black/64">
                    {step}
                  </p>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {partnersPageContent.directions.map((direction) => (
                <article key={direction.title} className="rounded-[1.2rem] border border-black/10 bg-white p-6">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-black">{direction.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/62">{direction.body}</p>
                  <div className="mt-5">
                    <ButtonLink href="#partner-form" variant="secondary" tone="light" analytics={`partners_direction_${direction.title}`}>
                      Оставить B2B-запрос
                    </ButtonLink>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {partnerResources.map(([title, body, href]) => (
              <article key={title} className="border-t border-black/10 pt-5">
                <h3 className="text-2xl font-semibold tracking-[-0.045em] text-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/62">{body}</p>
                <div className="mt-5">
                  <ButtonLink href={href} variant="secondary" tone="light" analytics={`partners_resource_${title}`}>
                    Открыть
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>

          <div id="partner-form" className="mt-14 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <LeadForm type="partner" schema={formSchemas.partnerBase} />
            <div className="grid gap-4">
              <MediaSlot
                slotId="partner-media-kit"
                title="B2B-пакет STILNO"
                note="Материалы для B2B-запросов STILNO."
                aspect="wide"
                className="min-h-[18rem]"
              />
              <div className="rounded-[1.2rem] border border-black/10 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-black/36">Что важно</p>
                <p className="mt-4 text-sm leading-7 text-black/62">
                  Эта форма закреплена за B2B-запросами: опт, региональный B2B-контакт и действующая розничная
                  точка. Запуск под брендом оформляется на отдельной странице.
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-black/10 bg-[#fbfaf7] p-6 text-black">
                <p className="text-xs uppercase tracking-[0.22em] text-black/42">Нужен запуск под брендом?</p>
                <p className="mt-4 text-sm leading-7 text-black/64">
                  Маршрут запуска под брендом вынесен отдельно: там описаны этапы, документы и своя заявка.
                </p>
                <div className="mt-6">
                  <ButtonLink href="/franchise" tone="light" variant="secondary" analytics="partners_to_franchise">
                    Открыть запуск под брендом
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ResponsibleTemplate(page: ResolvedPage) {
  const responsibleFaq = faqItems.filter((item) => item.scope === "responsible");

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
  const franchiseFaq = faqItems.filter((item) => item.scope === "franchise");

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-[#080807] text-white">
        <StructuredData data={buildJsonLd(page)} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(231,200,159,0.16),transparent_32%)]" />
        <div className="relative mx-auto max-w-[90rem] px-5 py-12 sm:px-6 lg:px-8 lg:pb-14 lg:pt-16">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} tone="dark" />
          <div className="grid gap-10 py-8 xl:grid-cols-[0.82fr_1.18fr] xl:items-center">
            <div>
              <div className="mb-5 inline-flex max-w-full items-center gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-white/44">
                <span className="h-px w-12 bg-white/24" />
                <span>{franchiseContent.hero.eyebrow}</span>
              </div>
              <h1 className="max-w-4xl text-[2.65rem] font-semibold leading-[1.03] text-white sm:text-[3.75rem] sm:leading-[1] lg:text-[4.65rem] lg:leading-[0.98]">
                {franchiseContent.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/64">{franchiseContent.hero.body}</p>
              <ActionGroup actions={franchiseContent.hero.actions?.slice(0, 2)} tone="dark" analyticsPrefix="franchise_hero" />
              <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-5 border-y border-white/10 py-5 sm:grid-cols-4">
                {franchiseHeroSignals.map((signal) => (
                  <div key={signal.label}>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/38">
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
                  eyebrow: "Маршрут запуска",
                  title: "Запуск под брендом начинается с города и команды.",
                  body: "Опт, региональный B2B-контакт и действующая розничная точка остаются в разделе «Партнёрам». Здесь фокус на регионе, формате запуска, бренд-материалах, документах и подготовке старта.",
                }}
              />
              <div className="mt-9 border-y border-black/10 py-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/34">Премиум-драйв без обещаний доходности</p>
                <p className="mt-4 text-sm leading-7 text-black/62">
                  STILNO должен выглядеть в регионе как взрослая брендовая система: сильный продуктовый силуэт,
                  чистая упаковка, вкусовая серия и legal-рамка 18+ без финансовых обещаний.
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
  const supportFaq = faqItems.filter((item) => item.scope === "support");

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
    "презентация бренда и B2B-маршрута",
    "характеристики STILNO CLICK ONE и карточки вкусов",
    "предупреждения 18+ и правовая рамка коммуникации",
    "правила визуальной подачи, POSM и материалов точки",
  ];
  const mediaKitCards = [
    ["Для опта", "SKU, характеристики, предупреждения и контактный маршрут B2B-заявки."],
    ["Для розницы", "Краткая продуктовая база и правила первичного B2B-запроса от действующей точки."],
    ["Для действующей розничной точки", "Материалы точки, выкладка, возрастная проверка и корректная консультация 18+."],
    ["Retail 18+", "Юридически аккуратная коммуникация без медицинских заявлений и обещаний доходности."],
  ];
  const relatedRoutes = [
    ["Франчайзинг", "Запуск под брендом STILNO находится в отдельном разделе.", "/franchise"],
    ["Поддержка", "Спорный код, качество, хранение и утилизация вынесены в сервисный раздел.", "/support"],
  ];

  return (
    <section className="bg-[var(--color-page)]">
      <StructuredData data={buildJsonLd(page)} />
      <div className="mx-auto max-w-[86rem] px-5 py-16 sm:px-6 lg:px-8">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <PageHero
          contract={{
            eyebrow: "Media kit",
            title: "B2B-пакет STILNO",
            body:
              "Материалы для оптовых B2B-запросов и действующих розничных точек: презентация, продуктовая база, правила 18+ и B2B-маршрут.",
            actions: [
              {
                label: "Оставить B2B-запрос",
                href: "/partners#partner-form",
                variant: "primary",
              },
              {
                label: "Скачать презентацию",
                href: documentLinks.franchisePresentation,
                variant: "secondary",
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
          media={<EditorialImageCard slotId="partner-media-kit" title="B2B-материалы STILNO" />}
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
            {mediaKitCards.map(([title, body]) => (
              <article key={title} className="rounded-[1rem] border border-black/10 bg-white p-6">
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-black">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-black/62">{body}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {relatedRoutes.map(([title, body, href]) => (
            <article key={title} className="rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-6 text-black">
              <p className="text-xs uppercase tracking-[0.22em] text-black/42">Отдельный раздел</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-black/62">{body}</p>
              <div className="mt-5">
                <ButtonLink href={href} variant="secondary" tone="light" analytics={`media_kit_related_${title}`}>
                  Открыть
                </ButtonLink>
              </div>
            </article>
          ))}
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
                <p>Розничные запросы идут через страницу «Где купить».</p>
                <p>Оптовые B2B-обращения и запросы действующих розничных точек идут через страницу «Партнёрам».</p>
                <p>Запуск под брендом STILNO обрабатывается через отдельный раздел.</p>
                <p>Карьерные отклики остаются в разделе вакансий.</p>
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
          <div className="grid gap-4 md:grid-cols-2">
            {contactRouteCards.map((route) => (
              <article key={route.title} className="rounded-[1rem] border border-black/10 bg-white p-6">
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-black">{route.title}</h2>
                <p className="mt-3 text-sm leading-6 text-black/62">{route.body}</p>
                <div className="mt-5">
                  <ButtonLink href={route.href} variant="secondary" tone="light" analytics={`contacts_route_${route.title}`}>
                    {route.label}
                  </ButtonLink>
                </div>
              </article>
            ))}
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
              Сейчас сайт сосредоточен на продукте, B2B-запросах, запуске под брендом и правовой информации.
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
            title: "Частые вопросы о продукте, B2B, запуске под брендом, рознице и правовой информации.",
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
      "Мы свяжемся с вами по указанным контактам. Условия запуска под брендом обсуждаются индивидуально и не являются публичной офертой.",
    partner: "Мы свяжемся с вами по указанным контактам для уточнения B2B-формата.",
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
    product: "STILNO CLICK ONE | силуэт, вкусы и упаковка 18+",
    franchise: "Запуск STILNO в регионе | бренд 18+",
    partners: "STILNO для опта и действующей розницы | B2B 18+",
    "media-kit": "B2B-пакет STILNO | материалы 18+",
    verify: "Проверка оригинальности STILNO | код упаковки 18+",
    support: "Поддержка STILNO | качество, оригинальность и утилизация",
    responsible: "Ответственное потребление STILNO | информация 18+",
    contacts: "Контакты STILNO | официальный сайт бренда 18+",
    faq: "FAQ STILNO | продукт, B2B, запуск под брендом и правовая информация 18+",
  };

  const descriptionMap: Partial<Record<ResolvedPage["kind"], string>> = {
    "stores-index":
      "Опубликованная точка STILNO в Москве, телефон, маршрут и форма для розничного запроса без дистанционной продажи.",
    product:
      "STILNO CLICK ONE: чёрный силуэт, Type-C, десять вкусов, упаковка, факты и предупреждения 18+.",
    franchise:
      "Запуск STILNO в регионе: город, команда, бренд-материалы, продуктовая база, legal 18+ и отдельная заявка.",
    partners:
      "STILNO для опта и действующей розницы: продуктовая база, media kit, визуальная система, правила 18+ и B2B-заявка.",
    "media-kit":
      "B2B-пакет STILNO: презентация, продуктовая база, правила 18+ и материалы для опта и действующих розничных точек.",
    verify:
      "Проверка оригинальности STILNO: ввод кода с упаковки, подсказки по спорному результату и переход в поддержку.",
    support:
      "Поддержка STILNO: оригинальность, качество, правила хранения, утилизация устройства и контакты поддержки.",
    contacts:
      "Контакты STILNO: маршрутизация обращений по розничным запросам, B2B-запросам, запуску под брендом и карьере, а также юридические данные бренда.",
    faq:
      "FAQ STILNO: ответы о продукте, B2B-запросах, запуске под брендом, рознице, поддержке и правовой информации 18+.",
  };

  return {
    title: titleMap[page.kind] ?? page.title,
    description: descriptionMap[page.kind] ?? page.description,
    canonical: `${siteOrigin}/${page.pathname.join("/")}`,
    image: defaultImage,
  };
}
