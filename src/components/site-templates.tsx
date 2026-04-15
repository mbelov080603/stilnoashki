import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  type City,
  type Product,
  type ResolvedPage,
  type Store,
  articles,
  brandNarrative,
  cities,
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
  homeStats,
  partners,
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
  eyebrow: string;
  title: string;
  body: string;
  tone?: "dark" | "light";
}) {
  const textClass = tone === "dark" ? "text-white" : "text-black";
  const bodyClass = tone === "dark" ? "text-white/65" : "text-black/65";

  return (
    <div className="max-w-3xl">
      <div
        className={classNames(
          "mb-5 inline-flex items-center gap-3 text-xs uppercase tracking-[0.42em]",
          tone === "dark" ? "text-white/45" : "text-black/40",
        )}
      >
        <span className={classNames("h-px w-12", tone === "dark" ? "bg-white/30" : "bg-black/20")} />
        <span>{eyebrow}</span>
      </div>
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
            Premium-tech бренд с digital-системой под магазины, продукт и franchise.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/60">
            {siteSettings.demoNote}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/12 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/58">
              18+
            </span>
            <span className="rounded-full border border-white/12 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/58">
              Nicotine / Nicotine-free split
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          <p className="text-xs uppercase tracking-[0.35em] text-white/38">Navigation</p>
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
            <p className="text-xs uppercase tracking-[0.35em] text-white/38">Contacts</p>
            <div className="mt-3 grid gap-2 text-sm">
              {siteSettings.contactLines.map((line) => (
                <Link key={line.label} href={line.href} className="text-white/68 transition hover:text-white">
                  {line.value}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/38">Legal</p>
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
          <p>© 2026 STILNO. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {siteSettings.socialLinks.map((link) => (
              <Link key={link.label} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
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
        description: siteSettings.description,
        url: siteOrigin,
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
        brand: siteSettings.brandName,
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

function CoverageMap({ activeCity }: { activeCity?: City }) {
  return (
    <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_42%),linear-gradient(135deg,#060606,#151515)] p-6 text-white sm:p-8">
      <div className="absolute inset-y-0 left-[14%] w-px bg-white/10" />
      <div className="absolute inset-y-0 left-[44%] w-px bg-white/10" />
      <div className="absolute inset-y-0 left-[74%] w-px bg-white/10" />
      <div className="absolute inset-x-0 top-[22%] h-px bg-white/10" />
      <div className="absolute inset-x-0 top-[55%] h-px bg-white/10" />

      <div className="relative min-h-[24rem]">
        <div className="absolute left-[8%] top-[17%] text-[10rem] font-semibold tracking-[-0.12em] text-white/[0.035]">
          RU
        </div>
        {cities.map((city) => {
          const isActive = activeCity ? city.id === activeCity.id : city.featured;
          return (
            <div
              key={city.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: city.networkX, top: city.networkY }}
            >
              <div
                className={classNames(
                  "relative rounded-full border px-3 py-2 text-xs uppercase tracking-[0.28em] transition",
                  isActive
                    ? "border-white/45 bg-white text-black"
                    : "border-white/16 bg-white/[0.05] text-white/72",
                )}
              >
                <span className="absolute -left-3 top-1/2 size-2 -translate-y-1/2 rounded-full bg-[var(--color-silver)]" />
                {city.name}
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-0 left-0 max-w-sm rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.38em] text-white/45">Coverage / demo-ready</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
            Система городов уже заложена как future route map.
          </h3>
          <p className="mt-3 text-sm leading-6 text-white/68">
            Карту можно заменить на Yandex Maps или 2GIS слой без смены секции, потому что
            здесь уже отделены network data, UI и legal-safe пояснения.
          </p>
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

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnalyticsBridge />
      <AgeGate version={siteSettings.ageGateVersion} legalHref="/legal/age-18" />
      <CookieBanner version={siteSettings.consentVersion} legalHref="/legal/cookies" />
      <div className="min-h-screen bg-[var(--color-page)] text-white">
        <SiteHeader
          navItems={siteSettings.primaryNav}
          utilityCta={siteSettings.utilityCta}
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
                STILNO v2 / premium electronics
              </p>
              <h1 className="mt-8 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.08em] text-white sm:text-7xl">
                Премиальная digital-система бренда электронных устройств.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/68">
                Строгий контроль качества, product-first подача, отдельная логика для
                nicotine и nicotine-free категорий и инфраструктура под федеральную сеть.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/stores" analytics="hero_where_to_buy">
                  Где купить
                </ButtonLink>
                <ButtonLink
                  href="/stilno/docs/franchise-presentation.pdf"
                  target="_blank"
                  analytics="hero_get_presentation"
                  variant="secondary"
                >
                  Получить презентацию
                </ButtonLink>
              </div>
            </div>
            <div className="mt-12 grid gap-3 text-sm text-white/60 sm:grid-cols-2">
              {homeSignals.map((signal) => (
                <div key={signal} className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] px-4 py-4">
                  {signal}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[28rem] overflow-hidden rounded-[2.6rem] border border-black/10 bg-black/10 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.2)] sm:min-h-[38rem] lg:min-h-[44rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.75),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(17,17,19,0.04))]" />
            <div className="absolute right-4 top-4 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.35em] text-black/62">
              Hero / product-first
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
                eyebrow="Магазины / покрытие"
                title="Сетевой блок идёт сразу после hero, чтобы бренд считывался как федеральная система."
                body="Цифры ниже не фальсифицируются: они собраны из demo-ready dataset и готовы к прямой замене на production data."
                tone="light"
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <MetricCard value={String(homeStats.cities)} label="Городов в модели" note="Все city pages уже маршрутизированы." />
                <MetricCard value={String(homeStats.stores)} label="Точек в структуре" note="Store pages и locator готовы к наполнению." />
                <MetricCard value={String(homeStats.featuredCities)} label="Приоритетных кластеров" note="Маршруты под rollout и franchise scouting." />
                <MetricCard value={String(homeStats.partnerMarks)} label="B2B marks" note="Тёмный партнёрский слой заложен отдельно." />
              </div>
              <p className="mt-6 text-sm leading-6 text-black/55">{homeStats.note}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/stores" variant="ghost" analytics="home_open_stores">
                  Смотреть магазины
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
              title="Отдельный тёмный блок для B2B, отраслевого доверия и будущих интеграций."
              body="Вместо чужих логотипов используются demo-ready partner marks. Блок уже умеет жить как полноценная grid-секция большого бренда."
              tone="dark"
            />
            <ButtonLink href="/partners" analytics="home_partners_open" variant="secondary">
              Партнёрский сценарий
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {partners.map((partner) => (
              <article key={partner.id} className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-6">
                <p className="text-[1.55rem] font-semibold tracking-[-0.05em] text-white">{partner.name}</p>
                <p className="mt-3 text-sm leading-6 text-white/58">{partner.note}</p>
                <div className="mt-5 text-xs uppercase tracking-[0.3em] text-white/36">{partner.region}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="Продукция"
            title="На главной не маркетплейс, а премиальный preview product-матрицы."
            body="Категории разделены заранее: nicotine devices, nicotine-free architecture и future line. Это даёт чистый рост без визуального шума."
            tone="light"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {productCategories.map((category, index) => (
              <article
                key={category.id}
                className={classNames(
                  "grid gap-4 rounded-[2rem] border p-5",
                  index === 0
                    ? "border-black/10 bg-black text-white"
                    : "border-black/10 bg-white text-black shadow-[0_18px_48px_rgba(10,10,10,0.06)]",
                )}
              >
                <MediaTile
                  image={category.heroImage}
                  title={category.title}
                  tone={index === 0 ? "dark" : "light"}
                  aspect="wide"
                />
                <div className="flex items-center justify-between gap-4">
                  <span className={classNames("text-xs uppercase tracking-[0.35em]", index === 0 ? "text-white/42" : "text-black/38")}>
                    {category.status}
                  </span>
                  <span
                    className={classNames(
                      "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em]",
                      index === 0
                        ? "border-white/14 text-white/62"
                        : "border-black/10 text-black/52",
                    )}
                  >
                    {category.type}
                  </span>
                </div>
                <p className={classNames("text-sm leading-6", index === 0 ? "text-white/65" : "text-black/62")}>
                  {category.shortDescription}
                </p>
                <div>
                  <ButtonLink
                    href={getProductCategoryPath(category)}
                    variant={index === 0 ? "secondary" : "ghost"}
                    analytics={`category_${category.slug}`}
                  >
                    Подробнее
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-black">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-10">
          <div>
            <SectionHeading
              eyebrow="Качество и стандарты"
              title="Один из базовых смысловых блоков STILNO: дисциплина исполнения, контроль и инженерный подход."
              body="Без медицинских claims и без хаотичного vapeshop UI. Только product facts, упаковка и прозрачное разделение категорий."
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
            <MediaTile image="/stilno/products/barbaris.jpg" title="Device renders / premium-tech surface" tone="dark" aspect="wide" />
            <MediaTile image="/stilno/products/fruktoviy-chay.jpg" title="Packaging flats / warning discipline" tone="dark" aspect="wide" />
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div>
            <SectionHeading
              eyebrow="О бренде"
              title="STILNO — это не случайный шаблонный магазин, а база для масштабируемой product и retail сети."
              body="Бренд строится вокруг качества, форм-фактора устройства и чистого визуального языка. В digital это выражается через крупные поверхности, ритм секций и отсутствие декоративного шума."
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
              title="Сильный конверсионный блок без выдуманных финансовых показателей."
              body="Value proposition собирается из брендового потенциала, стандартов запуска, retail playbook и готовой digital-архитектуры под новые регионы."
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
              href="/stilno/docs/franchise-presentation.pdf"
              target="_blank"
              analytics="home_franchise_pdf"
              variant="secondary"
            >
              Скачать презентацию
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <SectionHeading
              eyebrow="Ответственное потребление"
              title="Смысловой аналог educational-блока, но в зрелом и юридически безопасном формате."
              body="STILNO не прячет предупреждения и не драматизирует их. Бренд спокойно разделяет категории и не делает псевдонаучных заявлений."
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
            title="Два основных form-сценария: retail feedback и franchise / partner lead."
            body="Lead capture встроен в бренд-сайт как системная часть продукта, а не как случайный блок внизу страницы."
            tone="dark"
          />
          <div className="mt-10 grid gap-5 xl:grid-cols-2">
            <LeadForm
              type="retail"
              title="Retail feedback"
              description="Вопросы о магазинах, ассортименте, доступности и сервисных сценариях."
              submitLabel="Отправить retail запрос"
            />
            <LeadForm
              type="franchise"
              title="Franchise / partner lead"
              description="Запрос на франшизу, запуск точки, B2B или региональное партнёрство."
              submitLabel="Запросить партнёрский контакт"
            />
          </div>
        </div>
      </section>

      <section className="bg-black">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <SectionHeading
            eyebrow="Вакансии"
            title="Recruitment-сценарий заложен как самостоятельный ростовой слой бренда."
            body="У STILNO есть отдельная вакансийная витрина, detail templates и формы отклика, чтобы найм не выглядел вторичным приложением к маркетинговой странице."
            tone="dark"
          />
          <div className="grid gap-4">
            {vacancies.map((vacancy) => (
              <article key={vacancy.id} className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/36">{vacancy.department}</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{vacancy.title}</h3>
                    <p className="mt-2 text-sm text-white/60">{vacancy.salaryText}</p>
                  </div>
                  <ButtonLink href={getVacancyPath(vacancy)} analytics="vacancy_open" variant="secondary">
                    Откликнуться
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function StoresIndexTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading
          eyebrow="Stores list"
          title="Store locator как часть федеральной структуры, а не как отдельная микро-страница."
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
              eyebrow="City template"
              title={`${city.name} как самостоятельный узел сети STILNO.`}
              body={city.spotlight}
              tone="light"
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <MetricCard value={String(getCityStoreCount(city.id))} label="Точек в городе" note="Store pages подключены к общему locator flow." />
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
            <SectionHeading eyebrow="Store page" title={store.title} body={store.address} tone="light" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <MetricCard value={store.hours} label="График" note="Работает как store fact в CMS." />
              <MetricCard value={store.phone} label="Телефон" note="Контакт уходит в routing и schema layer." />
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
          <SectionHeading eyebrow="About STILNO" title="Бренд, который ставит форму, контроль и системность выше шума." body={page.description} tone="light" />
          <div className="mt-8">
            <RichText paragraphs={brandNarrative} />
          </div>
        </div>
        <div className="grid gap-5">
          <MediaTile image="/stilno/products/myata.jpg" title="Device as hero object" aspect="wide" />
          <MediaTile image="/stilno/products/chernika-klyukva-vishnya.jpg" title="Серийность вкусов и упаковки" aspect="wide" />
        </div>
      </div>
    </section>
  );
}

function GalleryTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading eyebrow="Gallery" title="Галерея построена вокруг объекта, упаковки и close-up деталей." body={page.description} tone="light" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {galleryItems.map((item) => (
            <article key={item.id} className="grid gap-3 rounded-[2rem] border border-black/10 bg-white p-4 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
              <MediaTile image={item.media} title={item.title} aspect="square" />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-black/38">{item.type}</p>
                <p className="mt-3 text-sm leading-6 text-black/62">{item.caption}</p>
              </div>
            </article>
          ))}
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
        <SectionHeading eyebrow="Products" title="Каталог STILNO строится как система категорий и product templates." body={page.description} tone="light" />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {productCategories.map((category) => (
            <article key={category.id} className="grid gap-4 rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
              <MediaTile image={category.heroImage} title={category.title} aspect="wide" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.35em] text-black/38">{category.status}</span>
                <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/55">
                  {getCategoryProducts(category.id).length || "Template"}
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
            <SectionHeading eyebrow="Product category" title={category.heroTitle} body={category.heroBody} tone="light" />
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
            <SectionHeading eyebrow="Product detail" title={product.title} body={product.shortDescription} tone="light" />
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
            </div>
          </div>
          <VariantPicker product={product} />
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/38">Specs</p>
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
            <p className="text-xs uppercase tracking-[0.35em] text-white/38">Warnings & facts</p>
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
      </div>
    </section>
  );
}

function PartnersTemplate(page: ResolvedPage) {
  return (
    <section className="bg-black">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading eyebrow="Partners" title="B2B и отраслевой слой сайта STILNO." body={page.description} tone="dark" />
        <div className="mt-10 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {partners.map((partner) => (
              <article key={partner.id} className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-6">
                <p className="text-[1.6rem] font-semibold tracking-[-0.05em] text-white">{partner.name}</p>
                <p className="mt-3 text-sm leading-6 text-white/60">{partner.note}</p>
                <div className="mt-4 text-xs uppercase tracking-[0.3em] text-white/35">{partner.type}</div>
              </article>
            ))}
          </div>
          <LeadForm
            type="partner"
            title="B2B / partner lead"
            description="Запуск региона, оптовый контакт, real estate sourcing или distribution partnership."
            submitLabel="Отправить B2B запрос"
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
          <SectionHeading eyebrow="Responsible consumption" title="Отдельная страница для зрелой и legal-safe позиции бренда." body={page.description} tone="light" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white">
              <p className="text-xs uppercase tracking-[0.35em] text-white/38">Nicotine</p>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Отдельная категория с предупреждениями, product pages и 18+ логикой.
              </p>
            </div>
            <div className="rounded-[2rem] border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-black/38">Nicotine-free</p>
              <p className="mt-4 text-sm leading-7 text-black/65">
                Независимый раздел с собственной терминологией, FAQ и планом наполнения.
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
        <SectionHeading eyebrow="Franchise landing" title="Франчайзинговый сценарий собирает value proposition, support layer и lead capture." body={page.description} tone="dark" />
        <div className="mt-10 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4">
            {franchisePillars.map((pillar) => (
              <div key={pillar} className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-6 text-sm leading-6 text-white/68">
                {pillar}
              </div>
            ))}
            <div className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/38">Download</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink
                  href="/stilno/docs/franchise-presentation.pdf"
                  target="_blank"
                  analytics="franchise_pdf_open"
                  variant="secondary"
                >
                  Скачать презентацию
                </ButtonLink>
                <ButtonLink
                  href="/stilno/docs/device-and-package.pdf"
                  target="_blank"
                  analytics="franchise_device_deck"
                  variant="secondary"
                >
                  Device & package deck
                </ButtonLink>
              </div>
            </div>
          </div>
          <LeadForm
            type="franchise"
            title="Franchise lead"
            description="Город, формат помещения, опыт в retail и ожидаемый таймлайн запуска."
            submitLabel="Запросить контакт"
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
  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading eyebrow="Careers" title="Сценарий найма встроен в общую brand system." body={page.description} tone="light" />
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
            title="General talent form"
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
            <SectionHeading eyebrow="Vacancy page" title={vacancy.title} body={vacancy.description[0]} tone="light" />
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
            description="Форма отклика с thank-you route и analytics hook."
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
            <SectionHeading eyebrow="Contacts" title="Общий контактный слой бренда и сервисных сценариев." body={page.description} tone="light" />
            <div className="mt-8 grid gap-3">
              {siteSettings.contactLines.map((item) => (
                <Link key={item.label} href={item.href} className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 text-black shadow-[0_10px_30px_rgba(10,10,10,0.05)]">
                  <div className="text-xs uppercase tracking-[0.35em] text-black/38">{item.label}</div>
                  <div className="mt-2 text-lg font-medium">{item.value}</div>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <CoverageMap />
            </div>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <LeadForm
              type="retail"
              title="Retail / support"
              description="Наличие, сервис, вопросы по магазинам и общие обращения."
              submitLabel="Отправить обращение"
            />
            <LeadForm
              type="partner"
              title="B2B / partner"
              description="Оптовый контакт, franchise scouting, real estate и партнёрские запросы."
              submitLabel="Отправить запрос"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticlesIndexTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading eyebrow="Articles" title="Редакционный слой про brand system, rollout и compliance." body={page.description} tone="light" />
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
        <SectionHeading eyebrow="FAQ" title="Частые вопросы по продукции, сети, franchise и legal-safe логике." body={page.description} tone="light" />
        <div className="mt-10">
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </section>
  );
}

function ThankYouTemplate(page: ResolvedPage) {
  const labels: Record<string, string> = {
    retail: "Retail запрос принят.",
    franchise: "Франчайзинговый запрос принят.",
    partner: "B2B запрос принят.",
    career: "Карьерный отклик принят.",
  };

  const nextSteps: Record<string, string> = {
    retail: "Команда свяжется по указанным контактам после первичной маршрутизации обращения.",
    franchise: "Запрос попадёт в franchise pipeline и будет сопоставлен с городом, форматом и стадией запуска.",
    partner: "B2B команда вернётся с дальнейшим шагом после первичной квалификации.",
    career: "HR и hiring manager просмотрят отклик и вернутся со следующим этапом.",
  };

  const key = page.thankYouType ?? "retail";

  return (
    <section className="grid min-h-[70svh] place-items-center bg-black px-5 py-16 sm:px-6 lg:px-10">
      <div className="w-full max-w-3xl rounded-[2.6rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_42%),linear-gradient(145deg,#0a0a0a,#17181b)] p-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.45em] text-white/38">Thank-you page</p>
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
          Version {legalPage.version} / {legalPage.effectiveDate}
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
      title: `${siteSettings.brandName} v2`,
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
    title: `${page.title} — ${siteSettings.brandName}`,
    description: page.description,
    canonical: `${siteOrigin}/${page.pathname.join("/")}`,
    image: image ? `${siteOrigin}${image}` : undefined,
  };
}
