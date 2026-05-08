import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MediaSlot } from "@/components/media-slot";
import {
  AgeGate,
  AnalyticsBridge,
  AnalyticsLoader,
  CookieBanner,
  FaqAccordion,
  CatalogAssortmentCards,
  LeadForm,
  PartnersGeographyMap,
  SiteFooter,
  SiteHeader,
  StoresMap,
  VerifyChecker,
} from "@/components/site-client";
import { featuredProduct } from "@/lib/catalog-data";
import { assetPath, assetUrl, companyDetails, documentLinks, mediaAssets, siteOrigin, siteSettings } from "@/lib/site-config";
import {
  articles,
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
  partnersLandingContent,
  responsibilityNotes,
  stores,
  storesContent,
  vacancies,
} from "@/lib/site-content";
import {
  getAllStaticPaths,
  getArticlePath,
  getBreadcrumbs,
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
        ? "border-[#ff6da8] bg-[#ff6da8] text-black hover:border-[#ff8fc5] hover:bg-[#ff8fc5]"
        : "border-black bg-black text-white hover:bg-black/82"
      : variant === "ghost"
        ? tone === "dark"
          ? "border-transparent bg-transparent text-white/76 hover:text-white"
          : "border-transparent bg-transparent text-black/66 hover:text-black"
        : tone === "dark"
          ? "border-white/18 bg-white/[0.07] text-white hover:border-white/34 hover:bg-white/[0.12]"
          : "border-black/14 bg-white text-black hover:border-black/34 hover:bg-black/[0.04]";
  const inlineStyle =
    variant !== "primary" && tone === "light"
      ? {
          color: "#000000",
        }
      : undefined;
  const plainAnchor =
    href.startsWith("#") ||
    Boolean(target) ||
    /^https?:\/\//.test(href) ||
    /\.(pdf|jpe?g|png|webp|svg|ico|txt|xml)$/i.test(href);
  const resolvedHref = plainAnchor ? assetPath(href) : href;

  if (plainAnchor) {
    return (
      <a
        href={resolvedHref}
        target={target}
        rel={target === "_blank" ? "noreferrer" : undefined}
        style={inlineStyle}
        data-analytics={analytics}
        className={`inline-flex min-h-11 max-w-full items-center justify-center rounded-full border px-5 py-3 text-center text-sm font-medium leading-5 transition ${style}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={resolvedHref}
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
    <section className="relative overflow-hidden border-b border-white/10 bg-[#000000] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.05),transparent_34%),linear-gradient(140deg,rgba(255,255,255,0.05),transparent_32%)]" />
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
    <section className="bg-[#000000] text-white">
      <div className="mx-auto max-w-[90rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionIntro tone="dark" contract={{ eyebrow, title, body }} />
          <ActionGroup actions={actions} tone="dark" analyticsPrefix={`cta_${eyebrow}`} />
        </div>
      </div>
    </section>
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

  const canonicalPath = page.canonicalPath ?? page.pathname;
  const canonicalUrl = `${siteOrigin}/${canonicalPath.join("/")}`;

  switch (page.kind) {
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
  title = "STILNO",
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
    body: "Передаются презентация, визуальная система, ссылка на каталог и рабочий контакт.",
  },
  {
    title: "Старт",
    body: "Старт проходит после согласования формата и готовности команды соблюдать стандарты 18+.",
  },
];

const franchiseSupportItems = [
  {
    title: "Визуальная система",
    body: "Правила брендовой подачи STILNO, материалы точки и обязательный 18+ слой.",
  },
  {
    title: "Каталог",
    body: "Каталог открыт отдельным маршрутом и не дублируется в материалах запуска.",
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
  { label: "Материалы", value: "visual + catalog" },
  { label: "Условия", value: "индивидуально" },
];

function FranchiseProductLineup({ priority = false, compact = false }: { priority?: boolean; compact?: boolean }) {
  void priority;

  return (
    <MediaSlot
      slotId={compact ? "franchise-lineup-compact" : "franchise-lineup"}
      title="Материалы STILNO"
      note="Групповая подача брендовых материалов."
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
            Сначала фиксируем город, команду и статус проекта. Затем переходим к презентации, каталогу,
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
                href="/stores"
                tone="light"
                variant="secondary"
                analytics="franchise_download_product_pack"
              >
                Открыть каталог
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

function LandingSectionIntro({
  eyebrow,
  title,
  body,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  body: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="max-w-3xl">
      <p className={classNames("text-xs uppercase tracking-[0.24em]", tone === "dark" ? "text-white/42" : "text-black/42")}>
        {eyebrow}
      </p>
      <h2
        className={classNames(
          "mt-4 text-3xl font-semibold leading-[1.03] sm:text-4xl lg:text-5xl",
          tone === "dark" ? "text-white" : "text-black",
        )}
      >
        {title}
      </h2>
      <p className={classNames("mt-5 text-base leading-7 sm:text-lg", tone === "dark" ? "text-white/62" : "text-black/62")}>
        {body}
      </p>
    </div>
  );
}

function ProductVisual({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure
      className={classNames(
        "relative min-h-[18rem] overflow-hidden rounded-[0.75rem] border border-white/10 bg-[#000000] shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:min-h-[26rem]",
        className,
      )}
    >
      <Image
        src={assetPath(src)}
        alt={alt}
        fill
        sizes="(min-width: 1280px) 42rem, 100vw"
        className="object-contain p-4 sm:p-7"
        loading="eager"
        unoptimized
      />
      {caption ? (
        <figcaption className="absolute inset-x-4 bottom-4 rounded-[0.6rem] border border-white/10 bg-black/56 px-4 py-3 text-xs leading-5 text-white/68 backdrop-blur">
          {caption}
        </figcaption>
      ) : null}
    </figure>
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
        <div className="inline-flex h-16 w-28 items-center justify-center rounded-full border border-black/12 bg-white text-3xl font-semibold tracking-[0.08em] text-black">
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

export function HomeTemplate() {
  const heroActions = homeContent.hero.actions;
  const overviewCards = [
    {
      title: "Бренд",
      body: "Подробный рассказ о взрослом характере, сдержанной визуальной системе и премиальной подаче STILNO.",
      href: "/brand",
      cta: "Открыть бренд",
    },
    {
      title: "Каталог",
      body: "Единственный раздел с подробным каталогом STILNO.",
      href: "/stores",
      cta: "Открыть каталог",
    },
    {
      title: "Качество",
      body: "Отдельная страница о фабричной сборке, контроле комплектующих, упаковки, маркировки и партии.",
      href: "/quality",
      cta: "Открыть качество",
    },
    {
      title: "Заявка",
      body: "Отдельная форма для партнёрства, дистрибуции, розничной точки или другого обращения.",
      href: "/request",
      cta: "Оставить заявку",
    },
  ];
  const routeCards = [
    {
      title: "Где купить",
      body: "Опубликованная розничная точка, телефон, маршрут и розничный запрос находятся внутри каталога.",
      href: "/stores",
      cta: "Открыть каталог",
    },
    {
      title: "Проверка",
      body: "Проверка оригинальности работает через код с упаковки и не смешивается с каталогом или заявкой.",
      href: "/verify",
      cta: "Проверить код",
    },
    {
      title: "Поддержка",
      body: "Вопросы по качеству, оригинальности, хранению и обращению вынесены в поддержку.",
      href: "/support",
      cta: "Открыть поддержку",
    },
  ];

  return (
    <>
      <StructuredData data={buildJsonLd()} />

      <EditorialHero
        contract={{ ...homeContent.hero, actions: heroActions }}
        media={
          <MediaSlot
            slotId="home-hero"
            title="STILNO"
            note="Брендовая подача и маркировка в первом экране."
            aspect="wide"
            className="min-h-[19rem] border-white/10 sm:min-h-[28rem] lg:aspect-[16/11] xl:min-h-[34rem]"
          />
        }
      />

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-[90rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="grid gap-8 xl:grid-cols-[0.78fr_1.22fr] xl:items-start">
            <SectionIntro contract={homeContent.routingSection} />
            <div className="grid gap-4 md:grid-cols-2">
              {overviewCards.map((card) => (
                <article key={card.title} className="flex min-h-[15rem] flex-col rounded-[1rem] border border-black/10 bg-white p-5 sm:p-6">
                  <h2 className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-black">{card.title}</h2>
                  <p className="mt-4 flex-1 text-sm leading-7 text-black/60">{card.body}</p>
                  <div className="mt-5">
                    <ButtonLink href={card.href} variant="secondary" tone="light" analytics={`home_overview_${card.title}`}>
                      {card.cta}
                    </ButtonLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 xl:grid-cols-[0.78fr_1.22fr] xl:items-start">
            <SectionIntro contract={homeContent.storesSection} />
            <div className="grid gap-4 lg:grid-cols-3">
              {routeCards.map((card) => (
                <article key={card.title} className="flex min-h-[15rem] flex-col rounded-[1rem] border border-black/10 bg-white p-5 sm:p-6">
                  <h2 className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-black">{card.title}</h2>
                  <p className="mt-4 flex-1 text-sm leading-7 text-black/60">{card.body}</p>
                  <div className="mt-5">
                    <ButtonLink href={card.href} variant="secondary" tone="light" analytics={`home_route_${card.title}`}>
                      {card.cta}
                    </ButtonLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <LegalWarningStrip />
          </div>
        </div>
      </section>

      <SalesCtaBand
        eyebrow="STILNO"
        title="Оставьте заявку на отдельной странице"
        body="Форма не находится на главной странице. Для партнёрства, дистрибуции, розничной точки или другого обращения используйте единый маршрут заявки."
        actions={[
          { label: "Оставить заявку", href: "/request", variant: "primary" },
        ]}
      />

    </>
  );
}

function StoresCatalogSection({ product }: { product: Product }) {
  const primaryWarnings = product.warnings.slice(0, 4);

  return (
    <section id="catalog-details" className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
          <div className="grid gap-4 xl:sticky xl:top-28">
            <CatalogProductImage src={mediaAssets.product} alt="Упаковка STILNO CLICK ONE" priority />
            <div className="grid gap-3 sm:grid-cols-3">
              {[mediaAssets.product, mediaAssets.lobbyProduct, mediaAssets.productCloseVishnya].map((src, index) => (
                <div key={src} className="relative min-h-[8rem] overflow-hidden rounded-[0.85rem] border border-black/10 bg-[#000000]">
                  <Image
                    src={assetPath(src)}
                    alt={index === 0 ? "Упаковка STILNO CLICK ONE" : "Продуктовая подача STILNO CLICK ONE"}
                    fill
                    sizes="12rem"
                    className="object-contain p-3"
                    loading={index === 0 ? "eager" : "lazy"}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[1rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.06)] sm:p-8">
              <p className="text-xs uppercase tracking-[0.22em] text-black/36">Ассортимент</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-black sm:text-5xl">
                Картриджи и устройство в сборе
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-black/62">
                {product.longDescription} В каталоге показаны две карточки ассортимента STILNO CLICK ONE с выбором вкуса внутри каждой карточки.
              </p>
            </div>

            <CatalogAssortmentCards variants={product.variants} />

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-[1rem] border border-black/10 bg-white p-6 sm:p-7">
                <p className="text-xs uppercase tracking-[0.22em] text-black/36">Факты</p>
                <div className="mt-5 divide-y divide-black/10">
                  {product.facts.map((fact) => (
                    <p key={fact} className="py-3 text-sm leading-6 text-black/62">
                      {fact}
                    </p>
                  ))}
                </div>
              </article>
              <article className="rounded-[1rem] border border-black/10 bg-white p-6 sm:p-7">
                <p className="text-xs uppercase tracking-[0.22em] text-black/36">Предупреждения</p>
                <div className="mt-5 divide-y divide-black/10">
                  {primaryWarnings.map((warning) => (
                    <p key={warning} className="py-3 text-sm leading-6 text-black/62">
                      {warning}
                    </p>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
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
            title="Каталог STILNO"
            note="Визуал каталога и розничного маршрута STILNO."
            aspect="wide"
            className="min-h-[20rem] border-white/10 sm:min-h-[28rem] lg:aspect-[16/11] xl:min-h-[34rem]"
          />
        }
      />

      <StoresCatalogSection product={featuredProduct} />

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
            <div className="rounded-[1.2rem] border border-black/10 bg-white p-6 text-black">
              <p className="text-xs uppercase tracking-[0.22em] text-black/42">Дисклеймер</p>
              <p className="mt-4 text-sm leading-7 text-black/64">{storesContent.disclaimer}</p>
              <div className="mt-6">
                <ButtonLink href="/request" variant="secondary" tone="light" analytics="stores_request_redirect">
                  Оставить заявку
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

function StoresMapTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[#050505] text-white">
      <StructuredData data={buildJsonLd(page)} />
      <StoresMap />
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
    <>
      <StructuredData data={buildJsonLd(page)} />
      <EditorialHero
        contract={{
          title: "STILNO",
          body: "Взрослая визуальная система для категории 18+: сдержанная подача, чистая маркировка и спокойный тон без лишнего шума.",
          actions: [
            { label: "Смотреть каталог", href: "/stores", variant: "primary" },
            { label: "Оставить заявку", href: "/request", variant: "secondary" },
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
              slotId="about-brand-system"
              title="Брендовая система STILNO"
              note="Визуальная дисциплина бренда без раскрытия каталожных деталей."
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
          body: "Галерея показывает общий брендовый контекст. Каталог открыт отдельной страницей.",
          actions: [{ label: "Смотреть каталог", href: "/stores", variant: "primary" }],
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
                body: "Сайт показывает визуальную дисциплину бренда и оставляет каталог отдельным маршрутом.",
              }}
            />
            <ValueGrid items={brandFaceItems} />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["Брендовая подача", "Общий визуальный контекст STILNO без справочной продуктовой подачи.", "gallery-brand"],
              ["Retail-среда", "Материалы показывают настроение точки и не заменяют каталог.", "gallery-retail"],
              ["Legal 18+", "Предупреждения и возрастная рамка остаются заметной частью коммуникации.", "gallery-legal"],
            ].map(([title, body, slotId]) => (
              <article key={title}>
                <EditorialImageCard slotId={slotId} title={title} note={body} className="min-h-[18rem]" />
                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-black">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-black/62">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function BrandTemplate(page: ResolvedPage) {
  const { hero, heroFacts, brand, quality, product } = partnersLandingContent;
  const nextSections = [
    {
      title: "Качество",
      body: "Фабричное производство, комплектующие, сборка, упаковка, маркировка и контроль партии вынесены в отдельный раздел.",
      href: "/quality",
      cta: "Открыть качество",
    },
    {
      title: "Каталог",
      body: "Подробный каталог STILNO собран в отдельном разделе.",
      href: "/stores",
      cta: "Открыть каталог",
    },
    {
      title: "Заявка",
      body: "Партнёрство, дистрибуция, розничная точка или другой запрос оформляются через отдельную страницу заявки.",
      href: "/request",
      cta: "Оставить заявку",
    },
  ];

  return (
    <>
      <StructuredData data={buildJsonLd(page)} />
      <div className="bg-[#000000] text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
          <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-12 sm:px-6 lg:px-8 lg:py-20 xl:grid-cols-[0.98fr_1.02fr] xl:items-center">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.24em] text-white/44">{hero.eyebrow}</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.98] text-white sm:text-5xl lg:text-6xl">
                {hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/66 sm:text-lg">{hero.body}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href="/stores" tone="dark" analytics="brand_catalog">
                  Смотреть каталог
                </ButtonLink>
                <ButtonLink href="/request" tone="dark" variant="secondary" analytics="brand_request">
                  Оставить заявку
                </ButtonLink>
              </div>
              <div className="mt-10 grid gap-px overflow-hidden rounded-[0.75rem] border border-white/10 bg-white/10 sm:grid-cols-3">
                {heroFacts.map((fact) => (
                  <div key={fact} className="bg-white/[0.045] px-4 py-4 text-sm font-medium leading-5 text-white/78">
                    {fact}
                  </div>
                ))}
              </div>
            </div>

            <ProductVisual
              src={mediaAssets.partner}
              alt="STILNO в сдержанной премиальной подаче"
              caption={hero.note}
              className="min-h-[20rem] sm:min-h-[30rem] xl:min-h-[35rem]"
            />
          </div>
        </section>

        <section className="bg-white text-black">
          <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
            <LandingSectionIntro eyebrow={brand.eyebrow} title={brand.title} body={brand.body} />
            <div className="mt-10 grid gap-px overflow-hidden rounded-[0.85rem] border border-black/10 bg-black/10 md:grid-cols-2 xl:grid-cols-4">
              {brand.cards.map((card, index) => (
                <article key={card.title} className="min-w-0 bg-white p-6 sm:p-7">
                  <p className="text-xs uppercase tracking-[0.22em] text-black/34">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-8 text-2xl font-semibold leading-tight text-black">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-black/60">{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#000000] text-white">
          <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-10 xl:grid-cols-[0.88fr_1.12fr] xl:items-start">
              <div className="min-w-0">
                <LandingSectionIntro tone="dark" eyebrow={product.eyebrow} title={product.title} body={product.body} />
                <div className="mt-9 grid gap-4 md:grid-cols-3">
                  {product.designCards.map((card) => (
                    <article key={card.title} className="border-t border-white/12 pt-5">
                      <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/60">{card.text}</p>
                    </article>
                  ))}
                </div>
              </div>

              <ProductVisual
                src={mediaAssets.partner}
                alt="Брендовая подача STILNO"
                className="xl:min-h-[32rem]"
              />
            </div>
          </div>
        </section>

        <section className="bg-white text-black">
          <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
            <LandingSectionIntro
              eyebrow="Структура сайта"
              title="Подробности разнесены по отдельным страницам"
              body={`${quality.title} находится в разделе «Качество». Каталог и заявка не смешиваются с брендовым рассказом.`}
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {nextSections.map((section) => (
                <article key={section.title} className="flex min-h-[15rem] flex-col rounded-[0.85rem] border border-black/10 bg-white p-6">
                  <h3 className="text-2xl font-semibold leading-tight text-black">{section.title}</h3>
                  <p className="mt-4 flex-1 text-sm leading-7 text-black/60">{section.body}</p>
                  <div className="mt-6">
                    <ButtonLink href={section.href} tone="light" variant="secondary" analytics={`brand_next_${section.title}`}>
                      {section.cta}
                    </ButtonLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function QualityTemplate(page: ResolvedPage) {
  const { quality } = partnersLandingContent;

  return (
    <>
      <StructuredData data={buildJsonLd(page)} />
      <section className="bg-[#000000] text-white">
        <div className="mx-auto max-w-[90rem] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} tone="dark" />
          <PageHero
            tone="dark"
            compact
            contract={{
              eyebrow: quality.eyebrow,
              title: quality.title,
              body: quality.body,
              actions: [{ label: "Оставить заявку", href: "/request", variant: "primary" }],
            }}
            media={
              <ProductVisual
                src={mediaAssets.production}
                alt="Фабричная среда производства STILNO"
                className="min-h-[20rem] sm:min-h-[28rem] xl:min-h-[32rem]"
              />
            }
          />
        </div>
      </section>

      <section className="bg-[#000000] text-white">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {quality.steps.map((step, index) => (
              <article
                key={step.title}
                className="flex min-h-[17rem] flex-col rounded-[0.85rem] border border-white/12 bg-white/[0.055] p-5 sm:p-6"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-white/34">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-6 text-2xl font-semibold leading-tight text-white">{step.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/60">{step.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[0.85rem] border border-[#ff6da8]/24 bg-white/[0.06] p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#ff6da8]/70">Proof</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">{quality.proofTitle}</h2>
              </div>
              <p className="text-sm leading-7 text-white/68">{quality.proofText}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CatalogProductImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative min-h-[16rem] overflow-hidden rounded-[0.95rem] border border-black/10 bg-[#000000] sm:min-h-[24rem]">
      <Image
        src={assetPath(src)}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 36rem, 100vw"
        className="object-contain p-4 sm:p-7"
        loading={priority ? "eager" : "lazy"}
        unoptimized
      />
    </div>
  );
}

function RequestTemplate(page: ResolvedPage) {
  return (
    <>
      <StructuredData data={buildJsonLd(page)} />
      <section className="bg-[#000000] text-white">
        <div className="mx-auto max-w-[90rem] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} tone="dark" />
          <PageHero
            tone="dark"
            compact
            contract={{
              eyebrow: "Заявка",
              title: "Оставить заявку STILNO",
              body:
                "Оставьте контакты, чтобы команда STILNO связалась с вами и уточнила формат сотрудничества или другого обращения.",
              detailItems: [
                { label: "Форма", value: "одна страница" },
                { label: "Категория", value: "18+" },
                { label: "Продажа онлайн", value: "не осуществляется" },
              ],
            }}
          />
        </div>
      </section>

      <section id="request-form" className="bg-white text-black">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
            <div id="partner-form" className="scroll-mt-24">
              <LeadForm type="partner" schema={formSchemas.partnerBase} />
            </div>
            <aside className="rounded-[0.85rem] border border-black/10 bg-white p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.22em] text-black/38">После заявки</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-black">
                Что происходит после отправки
              </h2>
              <div className="mt-6 divide-y divide-black/10 text-sm leading-7 text-black/62">
                <p className="py-3">Мы получаем ваше обращение.</p>
                <p className="py-3">Связываемся по указанному контакту.</p>
                <p className="py-3">Уточняем формат запроса и следующие шаги.</p>
              </div>
              <p className="mt-6 text-sm leading-7 text-black/50">
                Заявка не является заказом. Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции.
              </p>
            </aside>
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
            <div className="rounded-[1rem] border border-black/10 bg-white p-4">
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
      <section className="relative overflow-hidden border-b border-white/10 bg-[#000000] text-white">
        <StructuredData data={buildJsonLd(page)} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(255,255,255,0.05),transparent_32%)]" />
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
                  body: "Опт и обращения действующих розничных точек идут через страницу «Заявка». Здесь фокус на городе, команде, бренд-материалах, документах и подготовке старта.",
                }}
              />
              <div className="mt-9 border-y border-black/10 py-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/34">Премиум-драйв без обещаний доходности</p>
                <p className="mt-4 text-sm leading-7 text-black/62">
                  STILNO должен выглядеть в регионе как взрослая брендовая система: сдержанная визуальная подача,
                  чистые материалы и legal-рамка 18+ без финансовых обещаний.
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
              "Введите код с упаковки STILNO. Проверка помогает отличить подтверждённый продукт и быстро перейти в поддержку при спорном результате.",
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
            <div className="rounded-[1rem] border border-black/10 bg-white p-6 text-black">
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
              "Здесь собраны действия по спорному коду, претензии к качеству, правила хранения, утилизация и контакты поддержки.",
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
            ["Утилизация", "Использованные изделия с электронными компонентами сдавайте в пункты приёма электроники."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-[1rem] border border-black/10 bg-white p-6">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-black">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-black/62">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <div className="rounded-[1rem] border border-black/10 bg-white p-6 text-black">
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
    "ссылка на отдельный каталог STILNO",
    "предупреждения 18+ и правовая рамка коммуникации",
    "правила визуальной подачи, POSM и материалов точки",
  ];
  const mediaKitCards = [
    ["Для опта", "Контактный маршрут B2B-заявки и ссылка на единый каталог."],
    ["Для розницы", "Правила первичной заявки от действующей точки без дублирования каталога."],
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
              "Материалы для оптовых обращений и действующих розничных точек: презентация, ссылка на каталог, правила 18+ и следующий шаг.",
            actions: [
              {
                label: "Оставить заявку",
                href: "/request",
                variant: "primary",
              },
              {
                label: "Скачать презентацию",
                href: documentLinks.franchisePresentation,
                variant: "secondary",
                target: "_blank",
              },
              {
                label: "Открыть каталог",
                href: "/stores",
                variant: "secondary",
              },
            ],
          }}
          media={<EditorialImageCard slotId="partner-media-kit" title="B2B-материалы STILNO" />}
          compact
        />

        <div className="mt-12 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-[1rem] border border-black/10 bg-[#000000] p-6 text-white">
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
            <article key={title} className="rounded-[1rem] border border-black/10 bg-white p-6 text-black">
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

function PartnersGeographyTemplate(page: ResolvedPage) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#000000] text-white">
        <StructuredData data={buildJsonLd(page)} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(255,255,255,0.05),transparent_30%)]" />
        <div className="relative mx-auto max-w-[90rem] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} tone="dark" />
          <PageHero
            contract={{
              eyebrow: "Партнёрам",
              title: "География партнёров",
              body:
                "Интерактивная карта регионов России для партнёрской сети STILNO. Сейчас опубликован один контакт в Москве, остальные регионы оставлены без адресов для дальнейшего заполнения.",
              detailItems: [
                { label: "регион", value: "Москва" },
                { label: "контакт", value: "Михаил" },
                { label: "телефон", value: "+7 999 244-28-36" },
              ],
              actions: [
                { label: "Оставить заявку", href: "/request", variant: "primary" },
                { label: "B2B-пакет", href: "/partners/media-kit", variant: "secondary" },
              ],
            }}
            tone="dark"
            compact
          />

          <div className="mt-12">
            <PartnersGeographyMap />
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[var(--color-page)]">
        <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-[1rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-black/38">Москва</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-black">ул. Вавилова, 69/75</h2>
              <p className="mt-3 text-sm leading-6 text-black/62">
                Опубликованная карточка партнёрского контакта: Михаил, Москва, 117335.
              </p>
            </article>
            <article className="rounded-[1rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-black/38">Регионы</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-black">Карта готова к заполнению</h2>
              <p className="mt-3 text-sm leading-6 text-black/62">
                Все регионы реагируют на наведение розовой подсветкой, но карточки с адресами пока не добавлены.
              </p>
            </article>
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
              <div className="rounded-[1rem] border border-black/10 bg-white p-6 text-black">
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
                <p>Оптовые обращения и запросы действующих розничных точек идут через страницу «Заявка».</p>
                <p>Запуск под брендом STILNO обрабатывается через отдельный раздел.</p>
                <p>Карьерные отклики остаются в разделе вакансий.</p>
              </div>
            </div>
            <div className="rounded-[1rem] border border-black/10 bg-white p-6 text-black">
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
        <SiteFooter footerGroups={siteSettings.footerGroups} contactLines={siteSettings.contactLines} />
      </div>
    </>
  );
}

export function PageRenderer({ page }: { page: ResolvedPage }) {
  switch (page.kind) {
    case "stores-index":
      return StoresIndexTemplate(page);
    case "stores-map":
      return StoresMapTemplate(page);
    case "city":
      return CityTemplate(page);
    case "store":
      return StoreTemplate(page);
    case "brand":
      return BrandTemplate(page);
    case "about":
      return AboutTemplate(page);
    case "gallery":
      return GalleryTemplate(page);
    case "quality":
      return QualityTemplate(page);
    case "request":
      return RequestTemplate(page);
    case "media-kit":
      return MediaKitTemplate(page);
    case "partners-geography":
      return PartnersGeographyTemplate(page);
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
      title: "STILNO | официальный сайт бренда 18+",
      description: siteSettings.description,
      canonical: siteOrigin,
      image: defaultImage,
      openGraphTitle: undefined,
      openGraphDescription: undefined,
    };
  }

  const titleMap: Partial<Record<ResolvedPage["kind"], string>> = {
    "stores-index": "Каталог STILNO | характеристики и розничные запросы 18+",
    "stores-map": "Карта магазинов STILNO | интерактивная карта точек",
    brand: "Бренд STILNO | премиальный бренд электронных сигарет 18+",
    franchise: "Запуск STILNO в регионе | бренд 18+",
    quality: "Качество STILNO | фабричное производство и контроль",
    request: "Оставить заявку STILNO | официальный сайт бренда 18+",
    "media-kit": "B2B-пакет STILNO | материалы 18+",
    "partners-geography": "География партнёров STILNO | карта регионов",
    verify: "Проверка оригинальности STILNO | код упаковки 18+",
    support: "Поддержка STILNO | качество, оригинальность и утилизация",
    responsible: "Ответственное потребление STILNO | информация 18+",
    contacts: "Контакты STILNO | официальный сайт бренда 18+",
    faq: "FAQ STILNO | B2B, запуск под брендом и правовая информация 18+",
  };

  const descriptionMap: Partial<Record<ResolvedPage["kind"], string>> = {
    "stores-index":
      "Каталог STILNO с характеристиками, вкусами, предупреждениями, опубликованной точкой и формой розничного запроса без дистанционной продажи.",
    "stores-map":
      "Интерактивная карта магазинов и партнёрских точек STILNO с центральным офисом по адресу Ulitsa Vavilova, 69/75, Moscow, 117335.",
    brand:
      "STILNO — премиальный бренд электронных сигарет для взрослой аудитории 18+: сдержанный дизайн, фабричное производство, контроль качества и ответственная коммуникация.",
    franchise:
      "Запуск STILNO в регионе: город, команда, бренд-материалы, legal 18+ и отдельная заявка.",
    quality:
      "Качество STILNO: фабричное производство, контроль комплектующих, сборки, упаковки, маркировки и готовой партии для аудитории 18+.",
    request:
      "Оставьте заявку STILNO для партнёрства, дистрибуции, розничной точки или другого обращения без дистанционной продажи продукции.",
    "media-kit":
      "B2B-пакет STILNO: презентация, ссылка на каталог, правила 18+ и материалы для опта и действующих розничных точек.",
    "partners-geography":
      "Интерактивная карта географии партнёров STILNO: регионы России, розовая подсветка и опубликованный контакт в Москве.",
    verify:
      "Проверка оригинальности STILNO: ввод кода с упаковки, подсказки по спорному результату и переход в поддержку.",
    support:
      "Поддержка STILNO: оригинальность, качество, правила хранения, утилизация и контакты поддержки.",
    contacts:
      "Контакты STILNO: маршрутизация обращений по розничным запросам, B2B-запросам, запуску под брендом и карьере, а также юридические данные бренда.",
    faq:
      "FAQ STILNO: ответы о каталоге, B2B-запросах, запуске под брендом, рознице, поддержке и правовой информации 18+.",
  };

  const canonicalPath = page.canonicalPath ?? page.pathname;

  return {
    title: titleMap[page.kind] ?? page.title,
    description: descriptionMap[page.kind] ?? page.description,
    canonical: `${siteOrigin}/${canonicalPath.join("/")}`,
    image: defaultImage,
    openGraphTitle:
      page.kind === "brand" ? "STILNO — премиальный бренд электронных сигарет" : undefined,
    openGraphDescription:
      page.kind === "brand"
        ? "Фабричное производство, контроль качества, взрослый сдержанный дизайн и отдельный каталог."
        : undefined,
  };
}
