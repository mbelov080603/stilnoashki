import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  type City,
  type Product,
  type ResolvedPage,
  type Store,
  articles,
  brandNarrative,
  cities,
  companyDetails,
  documentLinks,
  faqItems,
  featuredProduct,
  franchisePillars,
  galleryItems,
  getAllStaticPaths,
  getArticlePath,
  getBreadcrumbs,
  getCategoryProducts,
  getCityStoreCount,
  getProductCategoryPath,
  getProductPath,
  getStorePath,
  getVacancyPath,
  homeSignals,
  launchMetrics,
  partnershipScenarios,
  productCategories,
  products,
  qualityStandards,
  responsibilityNotes,
  siteOrigin,
  siteSettings,
  vacancies,
} from "@/lib/site-data";
import {
  AgeGate,
  AnalyticsBridge,
  CookieBanner,
  FaqAccordion,
  LeadForm,
  SiteHeader,
  VariantPicker,
} from "@/components/site-client";

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ButtonLink({
  href,
  children,
  variant = "primary",
  analytics,
  target,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  analytics?: string;
  target?: string;
}) {
  const style =
    variant === "primary"
      ? "border-transparent bg-[var(--color-silver)] text-black hover:bg-white"
      : variant === "secondary"
        ? "border-white/16 bg-white/[0.05] text-white hover:border-white/36 hover:bg-white/[0.1]"
        : "border-black/10 bg-black/[0.03] text-black hover:border-black/18 hover:bg-black/[0.06]";

  return (
    <Link
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      data-analytics={analytics}
      className={`inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-medium transition ${style}`}
    >
      {children}
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  body: string;
  tone?: "dark" | "light";
}) {
  const textClass = tone === "dark" ? "text-white" : "text-black";
  const bodyClass = tone === "dark" ? "text-white/65" : "text-black/65";

  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <div
          className={classNames(
            "mb-5 inline-flex items-center gap-3 text-xs uppercase tracking-[0.42em]",
            tone === "dark" ? "text-white/45" : "text-black/40",
          )}
        >
          <span className={classNames("h-px w-12", tone === "dark" ? "bg-white/30" : "bg-black/20")} />
          <span>{eyebrow}</span>
        </div>
      ) : null}
      <h2 className={classNames("text-4xl font-semibold tracking-[-0.05em] sm:text-5xl", textClass)}>
        {title}
      </h2>
      <p className={classNames("mt-5 max-w-2xl text-base leading-7 sm:text-lg", bodyClass)}>{body}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr_0.85fr] lg:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-white/42">STILNO</p>
          <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-[-0.04em] text-white">
            Официальный сайт STILNO с текущей линией STILNO CLICK ONE, партнёрским потоком и правовой информацией.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/60">
            18+. Никотин вызывает зависимость. Сайт публикует подтверждённые сведения о продукте и
            не подменяет инструкцию к продукту.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/12 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/58">
              18+
            </span>
            <span className="rounded-full border border-white/12 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/58">
              STILNO CLICK ONE
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          <p className="text-xs uppercase tracking-[0.35em] text-white/38">Навигация</p>
          <div className="grid gap-2">
            {siteSettings.primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-white/68 transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/38">Контакты</p>
            <div className="mt-3 grid gap-2 text-sm">
              {siteSettings.contactLines.map((line) => (
                line.href ? (
                  <Link key={line.label} href={line.href} className="text-white/68 transition hover:text-white">
                    {line.value}
                  </Link>
                ) : (
                  <p key={line.label} className="text-white/68">
                    {line.value}
                  </p>
                )
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/38">Правовая информация</p>
            <div className="mt-3 grid gap-2 text-sm">
              {siteSettings.footerLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-white/68 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-3 px-5 py-5 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p>© 2026 STILNO. {companyDetails.companyName}.</p>
          {siteSettings.socialLinks.length ? (
            <div className="flex flex-wrap gap-4">
              {siteSettings.socialLinks.map((link) => (
                <Link key={link.label} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
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
    case "store":
      return {
        "@context": "https://schema.org",
        "@type": "Store",
        name: page.store?.title,
        address: page.store?.address,
        telephone: page.store?.phone,
        url: canonicalUrl,
      };
    case "vacancy":
      return {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: page.vacancy?.title,
        description: page.vacancy?.description.join(" "),
        hiringOrganization: {
          "@type": "Organization",
          name: siteSettings.brandName,
        },
        jobLocation: {
          "@type": "Place",
          address: page.city?.name,
        },
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

function BreadcrumbTrail({ pathname, title }: { pathname: string[]; title: string }) {
  const breadcrumbs = getBreadcrumbs(pathname, title);
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-black/42" aria-label="Breadcrumbs">
      <Link href="/" className="transition hover:text-black">
        Главная
      </Link>
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={breadcrumb.href} className="flex items-center gap-2">
          <span>/</span>
          {index === breadcrumbs.length - 1 ? (
            <span className="text-black/72">{breadcrumb.label}</span>
          ) : (
            <Link href={breadcrumb.href} className="transition hover:text-black">
              {breadcrumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

function MetricCard({ value, label, note }: { value: string; label: string; note: string }) {
  return (
    <div className="rounded-[1.6rem] border border-black/10 bg-white p-5 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
      <div className="text-4xl font-semibold tracking-[-0.05em] text-black">{value}</div>
      <div className="mt-2 text-sm font-medium text-black/76">{label}</div>
      <div className="mt-3 text-sm leading-6 text-black/56">{note}</div>
    </div>
  );
}

function MediaTile({
  image,
  title,
  tone = "light",
  aspect = "square",
}: {
  image?: string;
  title: string;
  tone?: "light" | "dark";
  aspect?: "square" | "wide";
}) {
  const isDark = tone === "dark";
  return (
    <div
      className={classNames(
        "relative overflow-hidden rounded-[2rem] border",
        isDark ? "border-white/8 bg-white/[0.04]" : "border-black/8 bg-black/[0.03]",
        aspect === "wide" ? "min-h-[20rem]" : "min-h-[18rem]",
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        <div
          className={classNames(
            "absolute inset-0",
            isDark
              ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_46%),linear-gradient(135deg,#090909,#1d1d1d)]"
              : "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_44%),linear-gradient(135deg,#f5f6f7,#d8dbe0)]",
          )}
        />
      )}
      <div
        className={classNames(
          "absolute inset-0 bg-gradient-to-t from-black/55 via-black/12 to-transparent",
          !image && !isDark && "from-black/20 via-transparent",
        )}
      />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className={classNames("text-base font-medium", isDark || image ? "text-white" : "text-black")}>
          {title}
        </p>
      </div>
    </div>
  );
}

function CoverageMap({}: { activeCity?: City }) {
  return (
    <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_34%),linear-gradient(135deg,#07101a_0%,#101826_55%,#0b1119_100%)] p-6 text-white sm:p-8">
      <div className="absolute inset-y-0 left-[14%] w-px bg-white/8" />
      <div className="absolute inset-y-0 left-[44%] w-px bg-white/8" />
      <div className="absolute inset-y-0 left-[74%] w-px bg-white/8" />
      <div className="absolute inset-x-0 top-[22%] h-px bg-white/8" />
      <div className="absolute inset-x-0 top-[55%] h-px bg-white/8" />
      <div className="absolute left-1/2 top-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(129,169,214,0.18),transparent_68%)] blur-3xl" />

      <div className="relative min-h-[24rem]">
        <div className="absolute left-0 top-0 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/58">
          Москва
        </div>
        <div className="absolute inset-[9%]">
          <svg
            viewBox="0 0 760 520"
            className="h-full w-full"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient id="moscowStroke" x1="100" x2="650" y1="80" y2="440" gradientUnits="userSpaceOnUse">
                <stop stopColor="rgba(255,255,255,0.42)" />
                <stop offset="1" stopColor="rgba(180,207,236,0.82)" />
              </linearGradient>
              <linearGradient id="moscowFill" x1="180" x2="620" y1="120" y2="390" gradientUnits="userSpaceOnUse">
                <stop stopColor="rgba(255,255,255,0.09)" />
                <stop offset="1" stopColor="rgba(130,164,204,0.18)" />
              </linearGradient>
            </defs>
            <path
              d="M146 252L190 198L178 142L238 124L276 82L348 110L402 92L458 122L520 114L562 160L614 182L596 250L628 304L586 360L522 374L482 428L410 412L348 444L290 412L228 424L194 370L134 338L152 282Z"
              fill="url(#moscowFill)"
              stroke="url(#moscowStroke)"
              strokeWidth="3"
            />
            <path
              d="M228 204L308 184L356 148L438 170L486 224L470 292L404 340L332 330L270 300L238 252Z"
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2"
              strokeDasharray="10 12"
            />
            <path
              d="M316 132L352 208L438 176"
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="2"
            />
            <path
              d="M254 286L340 256L424 318"
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="2"
            />
            <circle cx="380" cy="258" r="16" fill="rgba(217,226,236,0.12)" />
            <circle cx="380" cy="258" r="8" fill="rgba(255,255,255,0.88)" />
            <circle cx="380" cy="258" r="4" fill="rgba(11,17,25,1)" />
          </svg>
        </div>
        <div className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-full border border-white/16 bg-black/45 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/76 shadow-[0_20px_50px_rgba(4,10,18,0.35)] backdrop-blur">
            Москва
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreCard({ store }: { store: Store }) {
  return (
    <article className="rounded-[1.7rem] border border-black/10 bg-white p-5 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
      <p className="text-xs uppercase tracking-[0.35em] text-black/38">
        {store.featured ? "Flagship" : "Store"}
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-black">{store.title}</h3>
      <p className="mt-3 text-sm leading-6 text-black/62">{store.address}</p>
      <div className="mt-4 grid gap-2 text-sm text-black/65">
        <p>{store.hours}</p>
        <p>{store.phone}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {store.categories.map((category) => (
          <span key={category} className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/55">
            {category}
          </span>
        ))}
      </div>
      <div className="mt-6">
        <ButtonLink href={getStorePath(store)} variant="ghost" analytics="store_card_open">
          Открыть страницу точки
        </ButtonLink>
      </div>
    </article>
  );
}

function ProductCard({ product }: { product: Product }) {
  const category = productCategories.find((item) => item.id === product.categoryId);

  return (
    <article className="grid gap-4 rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_48px_rgba(10,10,10,0.06)]">
      <MediaTile image={product.images[0]} title={product.title} aspect="wide" />
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.35em] text-black/40">
          {category?.title ?? "Product"}
        </span>
        <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-black/55">
          {product.highlight}
        </span>
      </div>
      <div>
        <h3 className="text-3xl font-semibold tracking-[-0.04em] text-black">{product.title}</h3>
        <p className="mt-3 text-sm leading-6 text-black/62">{product.shortDescription}</p>
      </div>
      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="text-sm text-black/42">{product.availability}</span>
        <ButtonLink href={getProductPath(product)} variant="ghost" analytics="product_card_open">
          Подробнее
        </ButtonLink>
      </div>
    </article>
  );
}

function RichText({ paragraphs, tone = "light" }: { paragraphs: string[]; tone?: "light" | "dark" }) {
  return (
    <div className={classNames("grid gap-4 text-base leading-7", tone === "dark" ? "text-white/68" : "text-black/68")}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function VariantPickerFallback({ product }: { product: Product }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-black/8 bg-[linear-gradient(135deg,#f3f4f6,#d3d6da)] p-5">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            width={1400}
            height={1400}
            className="mx-auto w-full max-w-[36rem] object-contain"
          />
        ) : null}
      </div>
      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_48px_rgba(15,15,15,0.08)]">
        <p className="text-xs uppercase tracking-[0.4em] text-black/38">Вкусы</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-black">
          {product.variants[0]?.title}
        </h3>
      </div>
    </div>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnalyticsBridge />
      <AgeGate
        version={siteSettings.ageGateVersion}
        legalHref="/legal/age-18"
        exitHref={siteSettings.exitHref}
      />
      <CookieBanner version={siteSettings.consentVersion} legalHref="/legal/cookies" />
      <div className="min-h-screen bg-[var(--color-page)] text-white">
        <SiteHeader
          navItems={siteSettings.primaryNav}
          primaryCta={siteSettings.primaryCta}
        />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}

export function HomeTemplate() {
  return (
    <>
      <StructuredData data={buildJsonLd()} />
      <section
        className="relative isolate overflow-hidden border-b border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_36%),linear-gradient(130deg,#050505_0%,#111214_42%,#dedfe1_42%,#f4f4f3_100%)]"
        style={{ minHeight: "calc(100svh - 5rem)" }}
      >
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-20">
          <div className="flex flex-col justify-between">
            <div>
              <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.45em] text-white/45">
                <span className="h-px w-12 bg-white/24" />
                Официальный сайт STILNO
              </p>
              <h1 className="mt-8 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.08em] text-white sm:text-7xl">
                STILNO CLICK ONE
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/68">
                Текущая линия STILNO с фактическими параметрами по упаковке: 10 мл, 850 мАч,
                Type-C, 10-22 Вт, 20 мг/см3 и до 15000 затяжек. Для партнёрских,
                франчайзинговых и розничных запросов работает единый сайт бренда.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/products/stilno-click-one" analytics="hero_product_open">
                  Открыть продукт
                </ButtonLink>
                <ButtonLink
                  href="/franchise"
                  analytics="hero_partner_open"
                  variant="secondary"
                >
                  Франчайзинг и опт
                </ButtonLink>
              </div>
            </div>
            <div className="mt-12 grid gap-3 text-sm text-white/60 sm:grid-cols-2">
              {homeSignals.map((signal) => (
                <div
                  key={signal}
                  className="rounded-[1.4rem] border border-white/14 bg-[#121417]/92 px-4 py-4 text-sm font-medium leading-6 text-white shadow-[0_18px_42px_rgba(4,6,10,0.24)] backdrop-blur"
                >
                  {signal}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[28rem] overflow-hidden rounded-[2.6rem] border border-black/10 bg-black/10 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.2)] sm:min-h-[38rem] lg:min-h-[44rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.75),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(17,17,19,0.04))]" />
            <div className="absolute right-4 top-4 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.35em] text-black/62">
              Текущая модель
            </div>
            <div className="absolute left-[5%] top-[16%] text-[22vw] font-semibold leading-none tracking-[-0.12em] text-black/[0.05] lg:text-[10rem]">
              STILNO
            </div>
            <div className="relative z-10 mx-auto flex h-full max-w-[46rem] items-end justify-center">
              <Image
                src={featuredProduct.variants[0].image ?? featuredProduct.images[0]}
                alt={featuredProduct.title}
                width={1600}
                height={1600}
                priority
                loading="eager"
                className="w-full max-w-[42rem] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.28)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <SectionHeading
                title="Розничный слой запускается честно: без вымышленных адресов и неподтверждённых городов."
                body="Пока карта магазинов не опубликована, сайт показывает текущую продуктовую линию и принимает запросы по городам, франчайзингу и оптовому сотрудничеству."
                tone="light"
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {launchMetrics.map((metric) => (
                  <MetricCard
                    key={metric.label}
                    value={metric.value}
                    label={metric.label}
                    note={metric.note}
                  />
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/stores" variant="ghost" analytics="home_open_stores">
                  Где купить
                </ButtonLink>
                <ButtonLink href="/franchise" variant="ghost" analytics="home_open_franchise">
                  Открыть точку в регионе
                </ButtonLink>
              </div>
            </div>
            <CoverageMap />
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-black">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Партнёры"
              title="Партнёрский раздел описывает форматы сотрудничества без вымышленных логотипов и неподтверждённых кейсов."
              body="Сайт собирает оптовые и франчайзинговые заявки, не имитируя уже существующую сеть партнёров."
              tone="dark"
            />
            <ButtonLink href="/partners" analytics="home_partners_open" variant="secondary">
              Партнёрский сценарий
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {partnershipScenarios.map((scenario) => (
              <article key={scenario.title} className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-6">
                <p className="text-[1.55rem] font-semibold tracking-[-0.05em] text-white">{scenario.title}</p>
                <p className="mt-3 text-sm leading-6 text-white/58">{scenario.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="Продукция"
            title="На главной показана текущая опубликованная линия без каталожного шума и вымышленных SKU."
            body="Публичный релиз сайта строится вокруг STILNO CLICK ONE и вкусовых вариантов, подтверждённых упаковочными материалами."
            tone="light"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="grid gap-4 rounded-[2rem] border border-black/10 bg-black p-5 text-white">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_34%),linear-gradient(135deg,#0d1218,#182232)] p-4">
                <div className="relative flex min-h-[20rem] items-center justify-center rounded-[1.65rem] border border-white/10 bg-[linear-gradient(180deg,#dce8f8,#bfd0e5)] px-4 py-6">
                  <Image
                    src={featuredProduct.variants[0].image ?? featuredProduct.images[0]}
                    alt={featuredProduct.title}
                    width={1400}
                    height={900}
                    className="h-auto w-full max-w-[35rem] object-contain"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.35em] text-white/42">
                  {productCategories[0]?.title}
                </span>
                <span className="rounded-full border border-white/14 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/62">
                  {featuredProduct.highlight}
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-semibold tracking-[-0.05em] text-white">{featuredProduct.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{featuredProduct.shortDescription}</p>
              </div>
              <div>
                <ButtonLink href={getProductPath(featuredProduct)} variant="secondary" analytics="home_featured_product">
                  Открыть STILNO CLICK ONE
                </ButtonLink>
              </div>
            </article>
            <article className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_48px_rgba(10,10,10,0.06)]">
              <p className="text-xs uppercase tracking-[0.35em] text-black/38">Технические параметры</p>
              <div className="mt-5 grid gap-3">
                {featuredProduct.specs.slice(0, 6).map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-black/8 bg-black/[0.03] px-4 py-4">
                    <span className="text-sm text-black/54">{spec.label}</span>
                    <span className="text-sm font-medium text-black">{spec.value}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-black">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-10">
          <div>
            <SectionHeading
              eyebrow="Качество и стандарты"
              title="Один из базовых смысловых блоков STILNO: дисциплина исполнения, контроль и инженерный подход."
              body="Без медицинских заявлений и без хаотичной эстетики вейп-шопа. Только фактические данные о продукте, упаковка и прозрачное разделение категорий."
              tone="dark"
            />
            <div className="mt-10 grid gap-4">
              {qualityStandards.map((item) => (
                <article key={item.title} className="rounded-[1.7rem] border border-white/8 bg-white/[0.03] p-5">
                  <h3 className="text-xl font-medium tracking-[-0.03em] text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/62">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            <MediaTile image="/stilno/products/barbaris.jpg" title="Устройство как главный объект" tone="dark" aspect="wide" />
            <MediaTile image="/stilno/products/fruktoviy-chay.jpg" title="Упаковка и предупреждение" tone="dark" aspect="wide" />
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div>
            <SectionHeading
              eyebrow="О бренде"
              title="STILNO — бренд со строгой упаковкой, продуктовой точностью и взрослой визуальной дисциплиной."
              body="В публичной версии сайта бренд говорит через устройство, упаковочные материалы и правдивые сведения о продукте, а не через агрессивный рекламный шум."
              tone="light"
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/about" analytics="home_about_open" variant="ghost">
                О бренде
              </ButtonLink>
              <ButtonLink href="/gallery" analytics="home_gallery_open" variant="ghost">
                Смотреть галерею
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-[2.4rem] border border-black/10 bg-white p-6 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
            <RichText paragraphs={brandNarrative} />
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-black">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow="Франчайзинг"
              title="Франчайзинговый раздел собран как инструмент продаж без обещаний по окупаемости и выручке."
              body="Сайт объясняет формат партнёрства, документы, текущую продуктовую линию и способ первичного контакта с брендом."
              tone="dark"
            />
            <div className="grid gap-4 md:grid-cols-2">
              {franchisePillars.map((pillar) => (
                <div key={pillar} className="rounded-[1.7rem] border border-white/8 bg-white/[0.03] p-5 text-white/68">
                  {pillar}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/franchise" analytics="home_franchise_open" variant="secondary">
              Открыть франшизу
            </ButtonLink>
            <ButtonLink
              href={documentLinks.franchisePresentation}
              target="_blank"
              analytics="home_partner_materials"
              variant="secondary"
            >
              Материалы для партнёра
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <SectionHeading
              eyebrow="Ответственное потребление"
              title="Предупреждения и сведения о продукте вынесены в отдельный слой, а не спрятаны под рекламным текстом."
              body="STILNO показывает действующие ограничения для никотиновой категории и не смешивает их с неподтверждёнными продуктами."
              tone="light"
            />
          </div>
          <div className="grid gap-4">
            {responsibilityNotes.map((item) => (
              <div key={item} className="rounded-[1.6rem] border border-black/10 bg-white px-5 py-4 text-sm leading-6 text-black/64 shadow-[0_10px_36px_rgba(15,15,15,0.04)]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="forms" className="border-y border-white/8 bg-black">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="Обратная связь"
            title="Основные формы сайта: розничный запрос и франчайзинговый / партнёрский контакт."
            body="Формы подключены к серверной обработке с валидацией, защитой от спама и отдельными страницами подтверждения."
            tone="dark"
          />
          <div className="mt-10 grid gap-5 xl:grid-cols-2">
            <LeadForm
              type="retail"
              title="Розничный запрос"
              description="Вопросы о доступности продукта, городах запуска, наличии и розничных сценариях."
              submitLabel="Отправить запрос"
            />
            <LeadForm
              type="franchise"
              title="Франчайзинг и партнёрство"
              description="Форма для франчайзинга, опта, запуска региона и первичного партнёрского контакта."
              submitLabel="Запросить контакт"
            />
          </div>
        </div>
      </section>

      <section className="bg-black">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <SectionHeading
            eyebrow="Вакансии"
            title="Карьерный поток работает отдельно от маркетинговых призывов и принимает общий отклик на будущие роли."
            body="Если открытые позиции ещё не опубликованы, сайт всё равно принимает резюме и общие карьерные обращения."
            tone="dark"
          />
          <div className="grid gap-4">
            <article className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/36">Карьера</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                Общий отклик в команду STILNO
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                Для операционных, брендовых и розничных ролей сайт принимает общий карьерный
                отклик без публикации вымышленных вакансий.
              </p>
              <div className="mt-6">
                <ButtonLink href="/careers" analytics="careers_open" variant="secondary">
                  Перейти в раздел вакансий
                </ButtonLink>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

function StoresIndexTemplate(page: ResolvedPage) {
  if (cities.length === 0) {
    return (
      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} />
          <SectionHeading
            eyebrow="Где купить"
            title="Розничная карта будет опубликована после подтверждения городов и точек."
            body={page.description}
            tone="light"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-4">
              <article className="rounded-[1.8rem] border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
                <p className="text-xs uppercase tracking-[0.35em] text-black/38">Розничный запуск</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-black">
                  Список точек публикуется без вымышленных адресов и неподтверждённых городов.
                </h3>
                <p className="mt-3 text-sm leading-6 text-black/62">
                  Пока карта не открыта публично, можно отправить запрос по городу,
                  наличию продукта или партнёрскому запуску.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href="/contacts" variant="ghost" analytics="stores_contact_open">
                    Отправить запрос
                  </ButtonLink>
                  <ButtonLink href="/franchise" variant="ghost" analytics="stores_franchise_open">
                    Запросить партнёрство
                  </ButtonLink>
                </div>
              </article>
            </div>
            <CoverageMap />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading
          eyebrow="Где купить"
          title="Подтверждённые города и точки STILNO."
          body={page.description}
          tone="light"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-4">
            {cities.map((city) => (
              <article key={city.id} className="rounded-[1.7rem] border border-black/10 bg-white p-5 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-black/38">{city.region}</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-black">{city.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-black/62">{city.spotlight}</p>
                  </div>
                  <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-black/55">
                    {getCityStoreCount(city.id)} точки
                  </span>
                </div>
                <div className="mt-5">
                  <ButtonLink href={`/stores/${city.slug}`} variant="ghost" analytics="city_page_open">
                    Открыть город
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
          <CoverageMap />
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
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              eyebrow="Город"
              title={`${city.name} в розничной карте STILNO.`}
              body={city.spotlight}
              tone="light"
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <MetricCard value={String(getCityStoreCount(city.id))} label="Точек в городе" note="Все подтверждённые точки подключаются к общей карте и карточкам городов." />
              <MetricCard value={city.featured ? "Flagship" : "Growth"} label="Роль в сети" note="Определяет глубину открытия и локального маркетинга." />
            </div>
          </div>
          <CoverageMap activeCity={city} />
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {(page.stores ?? []).map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StoreTemplate(page: ResolvedPage) {
  const store = page.store;
  const city = page.city;

  if (!store || !city) {
    notFound();
  }

  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Точка" title={store.title} body={store.address} tone="light" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <MetricCard value={store.hours} label="График" note="Подтверждённый график работы точки." />
              <MetricCard value={store.phone} label="Телефон" note="Контакт публикуется в карточке подтверждённой точки." />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {store.services.map((service) => (
                <span key={service} className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/55">
                  {service}
                </span>
              ))}
            </div>
          </div>
          <CoverageMap activeCity={city} />
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/38">Категории в точке</p>
            <div className="mt-5 grid gap-3">
              {store.categories.map((category) => (
                <div key={category} className="rounded-[1.4rem] border border-black/10 bg-black/[0.03] px-4 py-4 text-black/66">
                  {category}
                </div>
              ))}
            </div>
          </div>
          <LeadForm
            type="retail"
            title="Связаться с точкой"
            description="Запрос о наличии, сервисе, открытии или локальном партнёрстве."
            submitLabel="Отправить запрос"
          />
        </div>
      </div>
    </section>
  );
}

function AboutTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <div>
          <BreadcrumbTrail pathname={page.pathname} title={page.title} />
          <SectionHeading eyebrow="О бренде" title="STILNO держит в центре продукт, упаковку и аккуратную визуальную систему." body={page.description} tone="light" />
          <div className="mt-8">
            <RichText paragraphs={brandNarrative} />
          </div>
        </div>
        <div className="grid gap-5">
          <MediaTile image="/stilno/products/myata.jpg" title="Устройство как главный объект" aspect="wide" />
          <MediaTile image="/stilno/products/chernika-klyukva-vishnya.jpg" title="Серийность вкусов и упаковки" aspect="wide" />
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
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading eyebrow="Галерея" title="Редакционная подборка строится вокруг устройства, упаковки и технических плоскостей." body={page.description} tone="light" />
        <div className="mt-10 grid gap-10">
          {galleryGroups.map(([type, label]) => {
            const items = galleryItems.filter((item) => item.type === type);
            if (!items.length) {
              return null;
            }

            return (
              <section key={type}>
                <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-black/38">
                  <span className="h-px w-10 bg-black/18" />
                  <span>{label}</span>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <article key={item.id} className="grid gap-3 rounded-[2rem] border border-black/10 bg-white p-4 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
                      <MediaTile image={item.media} title={item.title} aspect="square" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-black/38">{label}</p>
                        <p className="mt-3 text-sm leading-6 text-black/62">{item.caption}</p>
                      </div>
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

function ProductsIndexTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading eyebrow="Продукция" title="В публичной версии показана подтверждённая текущая линия STILNO." body={page.description} tone="light" />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {productCategories.map((category) => (
            <article key={category.id} className="grid gap-4 rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
              <MediaTile image={category.heroImage} title={category.title} aspect="wide" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.35em] text-black/38">{category.status}</span>
                <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/55">
                  {getCategoryProducts(category.id).length}
                </span>
              </div>
              <p className="text-sm leading-6 text-black/62">{category.shortDescription}</p>
              <ButtonLink href={getProductCategoryPath(category)} variant="ghost" analytics="products_category_open">
                Открыть категорию
              </ButtonLink>
            </article>
          ))}
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <SectionHeading eyebrow="Категория" title={category.heroTitle} body={category.heroBody} tone="light" />
            <div className="mt-6 rounded-[1.7rem] border border-black/10 bg-white p-5 text-sm leading-6 text-black/62 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
              {category.disclaimer}
            </div>
          </div>
          <MediaTile image={category.heroImage} title={category.title} aspect="wide" />
        </div>
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
  const productFaq = faqItems.filter(
    (item) => item.scope === "products" || item.scope === "responsible" || item.scope === "general",
  );

  if (!product) {
    notFound();
  }

  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <StructuredData data={buildJsonLd(page)} />
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <SectionHeading eyebrow="Продукт" title={product.title} body={product.shortDescription} tone="light" />
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-black/55">
                {product.availability}
              </span>
              <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-black/55">
                {product.highlight}
              </span>
            </div>
            <div className="mt-8 rounded-[1.8rem] border border-black/10 bg-white p-5 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
              <RichText paragraphs={[product.longDescription]} />
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/contacts" variant="ghost" analytics="product_contacts_open">
                  Уточнить доступность
                </ButtonLink>
                <ButtonLink href={documentLinks.deviceAndPackage} target="_blank" variant="ghost" analytics="product_device_pack_pdf">
                  PDF: устройство и упаковка
                </ButtonLink>
              </div>
            </div>
          </div>
          <Suspense fallback={<VariantPickerFallback product={product} />}>
            <VariantPicker product={product} />
          </Suspense>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/38">Характеристики</p>
            <div className="mt-5 grid gap-3">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-black/8 bg-black/[0.03] px-4 py-4">
                  <span className="text-sm text-black/54">{spec.label}</span>
                  <span className="text-sm font-medium text-black">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-[0_16px_44px_rgba(10,10,10,0.12)]">
            <p className="text-xs uppercase tracking-[0.35em] text-white/38">Предупреждения и сведения</p>
            <div className="mt-5 grid gap-4">
              {product.facts.map((fact) => (
                <div key={fact} className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white/68">
                  {fact}
                </div>
              ))}
              {product.warnings.map((warning) => (
                <div key={warning} className="rounded-[1.4rem] border border-white/10 bg-white/[0.05] px-4 py-4 text-sm leading-6 text-white">
                  {warning}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/38">Упаковка и серия</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {product.packagingImages.slice(0, 4).map((image) => (
                <MediaTile key={image} image={image} title={product.title} aspect="square" />
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/38">Вопросы и ответы</p>
            <div className="mt-5">
              <FaqAccordion items={productFaq} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnersTemplate(page: ResolvedPage) {
  return (
    <section className="bg-black">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading eyebrow="Партнёры" title="Оптовый и отраслевой слой STILNO без фальшивых логотипов и формальной сетки партнёров." body={page.description} tone="dark" />
        <div className="mt-10 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {partnershipScenarios.map((scenario) => (
              <article key={scenario.title} className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-6">
                <p className="text-[1.6rem] font-semibold tracking-[-0.05em] text-white">{scenario.title}</p>
                <p className="mt-3 text-sm leading-6 text-white/60">{scenario.body}</p>
              </article>
            ))}
          </div>
          <LeadForm
            type="partner"
            title="Опт и дистрибуция"
            description="Оптовый контакт, запуск региона, розничное партнёрство или франчайзинговый запрос."
            submitLabel="Отправить запрос"
          />
        </div>
      </div>
    </section>
  );
}

function ResponsibleTemplate(page: ResolvedPage) {
  const responsibleFaq = faqItems.filter(
    (item) => item.scope === "responsible" || item.scope === "products" || item.scope === "general",
  );

  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="Ответственное потребление" title="Отдельная страница для предупреждений, состава и возрастного ограничения доступа." body={page.description} tone="light" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white">
              <p className="text-xs uppercase tracking-[0.35em] text-white/38">Текущая линия</p>
              <p className="mt-4 text-sm leading-7 text-white/70">
                STILNO CLICK ONE публикуется как никотиновая категория с отдельными предупреждениями, составом и 18+ логикой.
              </p>
            </div>
            <div className="rounded-[2rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-black/38">Публикация новых категорий</p>
              <p className="mt-4 text-sm leading-7 text-black/65">
                Безникотиновые продукты, если будут опубликованы, должны получить отдельные страницы, предупреждения и самостоятельную коммуникацию.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <RichText paragraphs={responsibilityNotes} />
          </div>
          <FaqAccordion items={responsibleFaq} />
        </div>
      </div>
    </section>
  );
}

function FranchiseTemplate(page: ResolvedPage) {
  const franchiseFaq = faqItems.filter(
    (item) => item.scope === "franchise" || item.scope === "general" || item.scope === "stores",
  );

  return (
    <section className="bg-black">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading eyebrow="Франчайзинг" title="Страница франчайзинга объясняет формат партнёрства, документы и способ первого контакта." body={page.description} tone="dark" />
        <div className="mt-10 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4">
            {franchisePillars.map((pillar) => (
              <div key={pillar} className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-6 text-sm leading-6 text-white/68">
                {pillar}
              </div>
            ))}
            <div className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/38">Документы</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink
                  href={documentLinks.franchisePresentation}
                  target="_blank"
                  analytics="franchise_materials_open"
                  variant="secondary"
                >
                  Материалы для партнёра
                </ButtonLink>
                <ButtonLink
                  href={documentLinks.deviceAndPackage}
                  target="_blank"
                  analytics="franchise_device_deck"
                  variant="secondary"
                >
                  Устройство и упаковка
                </ButtonLink>
              </div>
            </div>
          </div>
          <LeadForm
            type="franchise"
            title="Франчайзинговый запрос"
            description="Укажите город, опыт в рознице, формат помещения и желаемый срок запуска."
            submitLabel="Отправить запрос"
          />
        </div>
        <div className="mt-10">
          <FaqAccordion items={franchiseFaq} />
        </div>
      </div>
    </section>
  );
}

function CareersTemplate(page: ResolvedPage) {
  if (!vacancies.length) {
    return (
      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} />
          <SectionHeading eyebrow="Вакансии" title="Открытые роли публикуются по мере расширения команды и запусков STILNO." body={page.description} tone="light" />
          <div className="mt-10 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
              <p className="text-xs uppercase tracking-[0.35em] text-black/38">Карьера</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-black">
                Можно отправить общий отклик в команду STILNO.
              </h3>
              <p className="mt-3 text-sm leading-6 text-black/62">
                Это подходит для будущих ролей в рознице, операционном управлении, развитии сети и
                операционных задачах запуска.
              </p>
            </div>
            <LeadForm
              type="career"
              title="Общий карьерный отклик"
              description="Оставьте контакты и коротко расскажите о своём опыте."
              submitLabel="Отправить резюме"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading eyebrow="Вакансии" title="Карьерный поток STILNO." body={page.description} tone="light" />
        <div className="mt-10 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4">
            {vacancies.map((vacancy) => (
              <article key={vacancy.id} className="rounded-[1.8rem] border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-black/38">{vacancy.department}</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-black">{vacancy.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-black/62">{vacancy.description[0]}</p>
                  </div>
                  <ButtonLink href={getVacancyPath(vacancy)} variant="ghost" analytics="careers_vacancy_open">
                    Откликнуться
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
          <LeadForm
            type="career"
              title="Общий карьерный отклик"
            description="Если роль ещё не опубликована, можно отправить общий карьерный отклик."
            submitLabel="Отправить резюме"
          />
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
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <StructuredData data={buildJsonLd(page)} />
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-5">
            <SectionHeading eyebrow="Вакансия" title={vacancy.title} body={vacancy.description[0]} tone="light" />
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
                <p className="text-xs uppercase tracking-[0.35em] text-black/38">Что предстоит делать</p>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-black/65">
                  {vacancy.description.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
                <p className="text-xs uppercase tracking-[0.35em] text-black/38">Требования</p>
                <ul className="mt-4 grid gap-3 text-sm leading-6 text-black/65">
                  {vacancy.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white">
              <p className="text-xs uppercase tracking-[0.35em] text-white/38">Условия</p>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-white/70">
                {vacancy.conditions.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>
          <LeadForm
            type="career"
            title="Отклик на вакансию"
            description="Форма отклика направляет заявку в карьерный поток STILNO."
            submitLabel="Отправить отклик"
            vacancyTitle={vacancy.title}
          />
        </div>
      </div>
    </section>
  );
}

function ContactsTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading eyebrow="Контакты" title="Общий контактный слой бренда, продукта и партнёрских сценариев." body={page.description} tone="light" />
            <div className="mt-8 grid gap-3">
              {siteSettings.contactLines.map((item) => (
                item.href ? (
                  <Link key={item.label} href={item.href} className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 text-black shadow-[0_10px_30px_rgba(10,10,10,0.05)]">
                    <div className="text-xs uppercase tracking-[0.35em] text-black/38">{item.label}</div>
                    <div className="mt-2 text-lg font-medium">{item.value}</div>
                  </Link>
                ) : (
                  <div key={item.label} className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 text-black shadow-[0_10px_30px_rgba(10,10,10,0.05)]">
                    <div className="text-xs uppercase tracking-[0.35em] text-black/38">{item.label}</div>
                    <div className="mt-2 text-lg font-medium">{item.value}</div>
                  </div>
                )
              ))}
            </div>
            <div className="mt-8">
              <CoverageMap />
            </div>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <LeadForm
              type="retail"
              title="Розница и поддержка"
              description="Наличие продукта, города запуска, вопросы по сайту и общие обращения."
              submitLabel="Отправить обращение"
            />
            <LeadForm
              type="partner"
              title="Опт и партнёрство"
              description="Оптовый контакт, франчайзинг и запуск региона."
              submitLabel="Отправить запрос"
            />
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
        <div className="mx-auto max-w-[76rem] px-5 py-16 sm:px-6 lg:px-10">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} />
          <SectionHeading eyebrow="Новости" title="Редакционный раздел будет пополняться по мере публикации новых материалов STILNO." body={page.description} tone="light" />
          <div className="mt-10 rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <p className="text-base leading-7 text-black/68">
              Сейчас сайт сфокусирован на продукте, партнёрском потоке и правовой
              информации. Новые материалы появятся здесь после их утверждения.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading eyebrow="Новости" title="Материалы и публикации STILNO." body={page.description} tone="light" />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {articles.map((article) => (
            <article key={article.id} className="grid gap-4 rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
              <MediaTile image={article.coverImage} title={article.title} aspect="wide" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.35em] text-black/38">{article.category}</span>
                <span className="text-sm text-black/45">{article.publishedAt}</span>
              </div>
              <p className="text-sm leading-6 text-black/62">{article.excerpt}</p>
              <ButtonLink href={getArticlePath(article)} variant="ghost" analytics="article_open">
                Читать
              </ButtonLink>
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
      <div className="mx-auto max-w-[68rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <StructuredData data={buildJsonLd(page)} />
        <p className="text-xs uppercase tracking-[0.35em] text-black/38">{article.category}</p>
        <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-black">{article.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-black/65">{article.excerpt}</p>
        <div className="mt-4 text-sm text-black/45">
          {article.publishedAt} / {article.author}
        </div>
        <div className="mt-10">
          <MediaTile image={article.coverImage} title={article.title} aspect="wide" />
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
      <div className="mx-auto max-w-[76rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <StructuredData data={buildJsonLd(page)} />
        <SectionHeading eyebrow="Вопросы и ответы" title="Частые вопросы о продукте, правовых ограничениях и партнёрских сценариях." body={page.description} tone="light" />
        <div className="mt-10">
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </section>
  );
}

function ThankYouTemplate(page: ResolvedPage) {
  const labels: Record<string, string> = {
    retail: "Розничное обращение принято.",
    franchise: "Франчайзинговый запрос принят.",
    partner: "Партнёрский запрос принят.",
    career: "Карьерный отклик принят.",
  };

  const nextSteps: Record<string, string> = {
    retail: "Команда свяжется по указанным контактам после первичной маршрутизации обращения.",
    franchise: "Запрос попадёт во франчайзинговую обработку и будет сопоставлен с городом, форматом и стадией запуска.",
    partner: "Команда по партнёрству вернётся с дальнейшим шагом после первичной квалификации.",
    career: "Команда по подбору просмотрит отклик и вернётся со следующим этапом.",
  };

  const key = page.thankYouType ?? "retail";

  return (
    <section className="grid min-h-[70svh] place-items-center bg-black px-5 py-16 sm:px-6 lg:px-10">
      <div className="w-full max-w-3xl rounded-[2.6rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_42%),linear-gradient(145deg,#0a0a0a,#17181b)] p-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.45em] text-white/38">Спасибо</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em]">{labels[key]}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">{nextSteps[key]}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" analytics="thankyou_home" variant="secondary">
            На главную
          </ButtonLink>
          <ButtonLink href="/contacts" analytics="thankyou_contacts" variant="secondary">
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
      <div className="mx-auto max-w-[68rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <p className="text-xs uppercase tracking-[0.35em] text-black/38">
          Версия {legalPage.version} / {legalPage.effectiveDate}
        </p>
        <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-black">{legalPage.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-black/65">{legalPage.summary}</p>
        <div className="mt-10 rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
          <RichText paragraphs={legalPage.body} />
        </div>
      </div>
    </section>
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
      title: siteSettings.brandName,
      description: siteSettings.description,
      canonical: siteOrigin,
      image: `${siteOrigin}${featuredProduct.variants[0].image ?? featuredProduct.images[0]}`,
    };
  }

  const image =
    page.product?.images[0] ??
    page.category?.heroImage ??
    page.article?.coverImage ??
    featuredProduct.variants[0].image ??
    featuredProduct.images[0];

  return {
    title: page.title,
    description: page.description,
    canonical: `${siteOrigin}/${page.pathname.join("/")}`,
    image: image ? `${siteOrigin}${image}` : undefined,
  };
}
