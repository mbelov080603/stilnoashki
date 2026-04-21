import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  type Product,
  type ResolvedPage,
  articles,
  brandNarrative,
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
  getProductCategoryPath,
  getProductPath,
  getVacancyPath,
  homeSignals,
  launchMetrics,
  partnershipScenarios,
  productCategories,
  products,
  responsibilityNotes,
  siteOrigin,
  siteSettings,
  vacancies,
} from "@/lib/site-data";
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
  type LeadCheckbox,
  type LeadField,
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
  tone = "dark",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  analytics?: string;
  target?: string;
  tone?: "dark" | "light";
}) {
  const style =
    variant === "primary"
      ? "border-transparent bg-[var(--color-silver)] text-black hover:bg-white"
      : tone === "dark"
        ? "border-white/16 bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/[0.08]"
        : "border-black/12 bg-black/[0.03] text-black hover:border-black/22 hover:bg-black/[0.06]";

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
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  body: string;
  tone?: "dark" | "light";
}) {
  const textClass = tone === "dark" ? "text-white" : "text-black";
  const bodyClass = tone === "dark" ? "text-white/68" : "text-black/66";

  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <div
          className={classNames(
            "mb-5 inline-flex items-center gap-3 text-xs uppercase tracking-[0.42em]",
            tone === "dark" ? "text-white/45" : "text-black/40",
          )}
        >
          <span className={classNames("h-px w-12", tone === "dark" ? "bg-white/26" : "bg-black/20")} />
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
    <div className="rounded-[1.7rem] border border-black/10 bg-white p-5 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
      <div className="text-3xl font-semibold tracking-[-0.05em] text-black">{value}</div>
      <div className="mt-2 text-sm font-medium text-black/76">{label}</div>
      <div className="mt-3 text-sm leading-6 text-black/56">{note}</div>
    </div>
  );
}

function RichText({ paragraphs, tone = "light" }: { paragraphs: string[]; tone?: "dark" | "light" }) {
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
  return <Image src={src} alt={alt} width={1600} height={900} unoptimized className={className} />;
}

function ProductPhotoCard({
  src,
  alt,
  aspect = "wide",
}: {
  src: string;
  alt: string;
  aspect?: "square" | "wide";
}) {
  return (
    <div
      className={classNames(
        "overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,#f7f7f6,#e3e5e8)] p-5",
        aspect === "wide" ? "min-h-[18rem]" : "min-h-[16rem]",
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1200}
        className="mx-auto h-full w-full object-contain"
      />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black">
      <div className="border-b border-white/8">
        <div className="mx-auto max-w-[90rem] px-5 py-5 sm:px-6 lg:px-10">
          <SvgAsset
            src="/stilno/redesign/legal-18-footer-strip.svg"
            alt="18+ и правовые предупреждения STILNO"
            className="w-full rounded-[1.4rem] border border-white/8 bg-white/[0.02]"
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-14 sm:px-6 lg:grid-cols-5 lg:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-white/42">Бренд</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">STILNO</h2>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Официальный сайт бренда STILNO. Информация предназначена для лиц старше 18 лет.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-white/42">Предупреждение</p>
          <p className="mt-4 text-sm leading-6 text-white/60">
            18+. Никотин вызывает зависимость. Продажа несовершеннолетним запрещена. Дистанционная розничная продажа никотинсодержащей продукции не осуществляется.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-white/42">Навигация</p>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/products/stilno-click-one" className="text-white/68 transition hover:text-white">
              Продукт
            </Link>
            <Link href="/partners" className="text-white/68 transition hover:text-white">
              Партнёрам
            </Link>
            <Link href="/franchise" className="text-white/68 transition hover:text-white">
              Франчайзинг
            </Link>
            <Link href="/stores" className="text-white/68 transition hover:text-white">
              Где купить
            </Link>
            <Link href="/responsible" className="text-white/68 transition hover:text-white">
              Ответственное потребление
            </Link>
            <Link href="/faq" className="text-white/68 transition hover:text-white">
              FAQ
            </Link>
            <Link href="/contacts" className="text-white/68 transition hover:text-white">
              Контакты
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-white/42">Контакты</p>
          <div className="mt-4 grid gap-3 text-sm text-white/68">
            <p>{companyDetails.companyName}</p>
            <p>{companyDetails.legalAddress}</p>
            <p>{companyDetails.productionAddress}</p>
            <p>Обращения принимаются через формы сайта.</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-white/42">Legal</p>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/legal/privacy" className="text-white/68 transition hover:text-white">
              Политика обработки персональных данных
            </Link>
            <Link href="/legal/consent" className="text-white/68 transition hover:text-white">
              Согласие на обработку персональных данных
            </Link>
            <Link href="/legal/cookies" className="text-white/68 transition hover:text-white">
              Политика cookies
            </Link>
            <Link href="/legal/terms" className="text-white/68 transition hover:text-white">
              Пользовательское соглашение
            </Link>
            <Link href="/legal/not-public-offer" className="text-white/68 transition hover:text-white">
              Не является публичной офертой
            </Link>
            <Link href="/gallery" className="text-white/68 transition hover:text-white">
              Галерея
            </Link>
            <Link href="/careers" className="text-white/68 transition hover:text-white">
              Вакансии
            </Link>
            <Link href="/articles" className="text-white/68 transition hover:text-white">
              Материалы
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-3 px-5 py-5 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p>© 2026 STILNO. Все права защищены.</p>
          <p>Информация на сайте носит справочный характер.</p>
        </div>
      </div>
    </footer>
  );
}

const retailFields: LeadField[] = [
  {
    name: "city",
    label: "Город",
    required: true,
    placeholder: "Укажите ваш город",
    autoComplete: "address-level2",
  },
  {
    name: "name",
    label: "Имя",
    required: true,
    placeholder: "Как к вам обращаться",
    autoComplete: "name",
  },
  {
    name: "phone",
    label: "Телефон",
    type: "tel",
    placeholder: "+7 (___) ___-__-__",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "name@company.ru",
    autoComplete: "email",
  },
  {
    name: "requestType",
    label: "Тип запроса",
    type: "select",
    required: true,
    options: [
      { value: "availability", label: "наличие в городе" },
      { value: "retail-point", label: "розничная точка" },
      { value: "partnership", label: "партнёрство" },
      { value: "other", label: "другое" },
    ],
    halfWidth: false,
  },
  {
    name: "comment",
    label: "Комментарий",
    type: "textarea",
    placeholder: "При необходимости уточните запрос.",
    halfWidth: false,
  },
];

const retailCheckboxes: LeadCheckbox[] = [
  {
    name: "ageConfirmed",
    required: true,
    label: "Подтверждаю, что мне исполнилось 18 лет.",
  },
  {
    name: "personalData",
    required: true,
    label:
      "Даю согласие ООО “ВОСТОК ИМПОРТ ПРОМ” на обработку персональных данных в соответствии с Политикой обработки персональных данных и Согласием на обработку персональных данных.",
  },
];

const franchiseFields: LeadField[] = [
  {
    name: "name",
    label: "Имя / ФИО",
    required: true,
    placeholder: "Как к вам обращаться",
    autoComplete: "name",
  },
  {
    name: "phone",
    label: "Телефон",
    type: "tel",
    required: true,
    placeholder: "+7 (___) ___-__-__",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "name@company.ru",
    autoComplete: "email",
  },
  {
    name: "city",
    label: "Город / регион",
    required: true,
    placeholder: "Москва / Московская область",
  },
  {
    name: "businessStatus",
    label: "Статус",
    type: "select",
    required: true,
    options: [
      { value: "legal-entity", label: "есть ИП/юрлицо" },
      { value: "planning", label: "планирую открыть" },
      { value: "existing-store", label: "действующий магазин" },
      { value: "distributor", label: "дистрибьютор" },
      { value: "other", label: "другое" },
    ],
  },
  {
    name: "retailExperience",
    label: "Опыт в рознице",
    type: "select",
    required: true,
    options: [
      { value: "yes", label: "есть" },
      { value: "no", label: "нет" },
      { value: "other", label: "другое" },
    ],
  },
  {
    name: "interestFormat",
    label: "Интересующий формат",
    type: "select",
    required: true,
    options: [
      { value: "franchise", label: "франчайзинг" },
      { value: "wholesale", label: "опт" },
      { value: "regional", label: "региональное партнёрство" },
      { value: "retail", label: "розничная точка" },
      { value: "other", label: "другое" },
    ],
  },
  {
    name: "projectStage",
    label: "Стадия проекта",
    type: "select",
    required: true,
    options: [
      { value: "research", label: "изучаю" },
      { value: "location", label: "есть помещение" },
      { value: "ready", label: "готов к запуску" },
      { value: "existing-business", label: "действующий бизнес" },
    ],
  },
  {
    name: "comment",
    label: "Комментарий",
    type: "textarea",
    placeholder: "Опишите запрос, город или формат сотрудничества.",
    halfWidth: false,
  },
];

const franchiseCheckboxes: LeadCheckbox[] = [
  {
    name: "ageConfirmed",
    required: true,
    label: "Подтверждаю, что мне исполнилось 18 лет.",
  },
  {
    name: "personalData",
    required: true,
    label:
      "Даю согласие ООО “ВОСТОК ИМПОРТ ПРОМ” на обработку персональных данных в соответствии с Политикой обработки персональных данных и Согласием на обработку персональных данных.",
  },
  {
    name: "marketing",
    label: "Согласен получать информационные сообщения по моему запросу о партнёрстве.",
  },
];

const partnerFields: LeadField[] = [
  {
    name: "name",
    label: "Имя / ФИО",
    required: true,
    placeholder: "Как к вам обращаться",
    autoComplete: "name",
  },
  {
    name: "phone",
    label: "Телефон",
    type: "tel",
    required: true,
    placeholder: "+7 (___) ___-__-__",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "name@company.ru",
    autoComplete: "email",
  },
  {
    name: "city",
    label: "Город / регион",
    required: true,
    placeholder: "Укажите регион работы",
  },
  {
    name: "requestType",
    label: "Направление",
    type: "select",
    required: true,
    options: [
      { value: "wholesale", label: "опт" },
      { value: "regional", label: "регион" },
      { value: "retail", label: "розница" },
      { value: "franchise", label: "франчайзинг" },
      { value: "other", label: "другое" },
    ],
  },
  {
    name: "comment",
    label: "Комментарий",
    type: "textarea",
    placeholder: "Опишите формат сотрудничества или задачу.",
    halfWidth: false,
  },
];

const careerFields: LeadField[] = [
  { name: "name", label: "Имя / ФИО", required: true, placeholder: "Как к вам обращаться" },
  { name: "phone", label: "Телефон", type: "tel", placeholder: "+7 (___) ___-__-__", autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "name@company.ru", autoComplete: "email" },
  { name: "city", label: "Город", required: true, placeholder: "Город проживания" },
  {
    name: "comment",
    label: "Комментарий",
    type: "textarea",
    placeholder: "Кратко расскажите о своём опыте и интересе к STILNO.",
    halfWidth: false,
  },
];

const careerCheckboxes: LeadCheckbox[] = [
  {
    name: "personalData",
    required: true,
    label:
      "Даю согласие ООО “ВОСТОК ИМПОРТ ПРОМ” на обработку персональных данных в соответствии с Политикой обработки персональных данных и Согласием на обработку персональных данных.",
  },
];

export function HomeTemplate() {
  const homeFaq = faqItems.filter((item) => item.scope === "general" || item.scope === "products" || item.scope === "franchise");

  return (
    <>
      <StructuredData data={buildJsonLd()} />
      <section className="border-b border-white/8 bg-[linear-gradient(180deg,#050505_0%,#101113_54%,#f4f3f1_54%,#f4f3f1_100%)]">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.45em] text-white/45">
              <span className="h-px w-12 bg-white/24" />
              Официальный сайт STILNO · 18+
            </p>
            <h1 className="mt-8 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.08em] text-white sm:text-7xl">
              STILNO CLICK ONE
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Никотинсодержащая линия для совершеннолетних пользователей. Сайт содержит справочную информацию о продукте, партнёрстве и франчайзинге.
            </p>
            <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/78">
              10 мл · 850 мА·ч · Type-C · 10–22 Вт · 20 мг/см³ · до 15 000 затяжек*
              <div className="mt-2 text-white/48">*Показатель зависит от режима использования.</div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/products/stilno-click-one" analytics="home_product_open">
                Смотреть продукт
              </ButtonLink>
              <ButtonLink href="/franchise" analytics="home_franchise_open" variant="secondary" tone="dark">
                Стать партнёром
              </ButtonLink>
              <ButtonLink
                href={documentLinks.franchisePresentation}
                target="_blank"
                analytics="home_presentation_open"
                variant="secondary"
                tone="dark"
              >
                Скачать презентацию для партнёров
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[2.4rem] border border-black/10 bg-[#ecebea] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-5">
              <Image
                src={featuredProduct.variants[0].image ?? featuredProduct.images[0]}
                alt="STILNO CLICK ONE"
                width={1600}
                height={1600}
                priority
                loading="eager"
                className="mx-auto w-full max-w-[42rem] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <SectionHeading
                eyebrow="Продукт"
                title="Подтверждённая линия STILNO CLICK ONE без каталожного шума и спорных заявлений."
                body="Сайт показывает только ту продуктовую информацию, которая подтверждена текущими упаковочными материалами и документами бренда."
                tone="light"
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {launchMetrics.map((metric) => (
                  <MetricCard key={metric.label} value={metric.value} label={metric.label} note={metric.note} />
                ))}
              </div>
            </div>
            <div className="grid gap-5">
              <article className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
                <ProductPhotoCard src={featuredProduct.images[0]} alt={featuredProduct.title} />
                <div className="mt-5 flex flex-wrap gap-2">
                  {homeSignals.map((signal) => (
                    <span key={signal} className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/55">
                      {signal}
                    </span>
                  ))}
                </div>
                <h3 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-black">{featuredProduct.title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/64">{featuredProduct.longDescription}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href="/products/stilno-click-one" analytics="home_product_detail" variant="secondary" tone="light">
                    Смотреть продукт
                  </ButtonLink>
                  <ButtonLink
                    href={documentLinks.deviceAndPackage}
                    target="_blank"
                    analytics="home_packaging_pdf"
                    variant="secondary"
                    tone="light"
                  >
                    Скачать презентацию для партнёров
                  </ButtonLink>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-black">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
            <SectionHeading
              eyebrow="Партнёрам"
              title="Отдельный сценарий для опта, регионального сотрудничества и франчайзинга."
              body="STILNO не обещает доходность и не заменяет переговоры витринными цифрами. Сайт помогает быстро понять формат сотрудничества и отправить корректный запрос."
              tone="dark"
            />
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <SvgAsset
                src="/stilno/redesign/partner-support-system.svg"
                alt="Система поддержки партнёра STILNO"
                className="w-full rounded-[1.4rem] border border-white/8 bg-white"
              />
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {partnershipScenarios.map((scenario) => (
              <article key={scenario.title} className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-6">
                <p className="text-[1.45rem] font-semibold tracking-[-0.05em] text-white">{scenario.title}</p>
                <p className="mt-3 text-sm leading-6 text-white/60">{scenario.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/partners" analytics="home_partners_page" variant="secondary" tone="dark">
              Партнёрам STILNO
            </ButtonLink>
            <ButtonLink href="/franchise" analytics="home_franchise_page" variant="secondary" tone="dark">
              Франчайзинг STILNO
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr]">
            <div>
              <SectionHeading
                eyebrow="Где купить"
                title="Розничная карта публикуется после подтверждения городов и партнёрских точек."
                body="До публикации списка можно отправить запрос по вашему городу, уточнить наличие или обсудить партнёрский запуск."
                tone="light"
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/stores#stores-request" analytics="home_stores_request" variant="secondary" tone="light">
                  Оставить запрос
                </ButtonLink>
                <ButtonLink href="/franchise" analytics="home_stores_partner" variant="secondary" tone="light">
                  Стать партнёром
                </ButtonLink>
              </div>
            </div>
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
              <SvgAsset
                src="/stilno/redesign/stores-coverage-empty.svg"
                alt="Статус покрытия STILNO"
                className="w-full rounded-[1.4rem] border border-black/8"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-black">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
            <SectionHeading
              eyebrow="Ответственное потребление"
              title="Сайт отделяет продуктовую информацию от правовых ограничений и не маскирует предупреждения рекламным текстом."
              body="Информация о STILNO CLICK ONE адресована совершеннолетним пользователям и не заменяет инструкцию к продукту."
              tone="dark"
            />
            <div className="grid gap-4">
              {responsibilityNotes.map((item) => (
                <div key={item} className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] px-5 py-4 text-sm leading-6 text-white/70">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-page)]">
        <div className="mx-auto max-w-[76rem] px-5 py-20 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="FAQ"
            title="Частые вопросы о продукте, розничных запросах и партнёрстве."
            body="Краткие ответы на базовые вопросы, которые должен закрывать официальный сайт STILNO."
            tone="light"
          />
          <div className="mt-10">
            <FaqAccordion items={homeFaq} />
          </div>
        </div>
      </section>

      <section id="forms" className="border-y border-white/8 bg-black">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="Форма заявки"
            title="Основные обращения принимаются через сайт: розничный запрос и заявка на партнёрство."
            body="Формы разделены по сценариям и не смешивают розничный запрос с партнёрским запуском."
            tone="dark"
          />
          <div className="mt-10 grid gap-5 xl:grid-cols-2">
            <LeadForm
              type="retail"
              title="Розничный запрос"
              description="Запрос о наличии в городе, розничной точке или партнёрском контакте."
              submitLabel="Отправить запрос"
              successMessage="Запрос отправлен. Мы свяжемся с вами по указанным контактам. Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции."
              fields={retailFields}
              checkboxes={retailCheckboxes}
              disclaimer="Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции."
            />
            <LeadForm
              type="franchise"
              title="Заявка на франчайзинг"
              description="Форма для франчайзинга, опта и партнёрского запуска в регионе."
              submitLabel="Отправить заявку"
              successMessage="Заявка отправлена. Мы свяжемся с вами по указанным контактам. Обращаем внимание: условия партнёрства обсуждаются индивидуально и не являются публичной офертой."
              fields={franchiseFields}
              checkboxes={franchiseCheckboxes}
              disclaimer="Информация на сайте носит справочный характер. Условия партнёрства обсуждаются индивидуально."
            />
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
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h1 className="text-5xl font-semibold tracking-[-0.06em] text-black sm:text-6xl">
              Где купить STILNO
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/66">
              Розничная карта STILNO будет опубликована после подтверждения городов и партнёрских точек. До публикации списка вы можете оставить запрос по вашему городу или обсудить партнёрский запуск.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#stores-request" analytics="stores_request_anchor" variant="secondary" tone="light">
                Оставить запрос
              </ButtonLink>
              <ButtonLink href="/franchise" analytics="stores_franchise_open" variant="secondary" tone="light">
                Стать партнёром
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
            <SvgAsset
              src="/stilno/redesign/stores-empty-illustration.svg"
              alt="Иллюстрация пустой розничной карты STILNO"
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.84fr_1.16fr]">
          <div>
            <SectionHeading
              eyebrow="Статус"
              title="Текущий статус покрытия"
              body="Мы не публикуем неподтверждённые адреса. Если вы хотите уточнить наличие в городе или предложить партнёрский запуск, отправьте запрос через форму."
              tone="light"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard value="Розничные точки" label="список готовится к публикации" note="Публикация происходит только после подтверждения." />
            <MetricCard value="Города" label="публикуются только после подтверждения" note="Сайт не показывает неподтверждённые локации." />
            <MetricCard value="Запросы" label="город · розница · опт · партнёрство" note="Все обращения маршрутизируются через единую форму." />
          </div>
        </div>

        <div id="stores-request" className="mt-16 grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
          <LeadForm
            type="retail"
            title="Оставить розничный запрос"
            description="Уточните наличие в городе, розничную точку или оставьте запрос на партнёрский запуск."
            submitLabel="Отправить запрос"
            successMessage="Запрос отправлен. Мы свяжемся с вами по указанным контактам. Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции."
            fields={retailFields}
            checkboxes={retailCheckboxes}
            disclaimer="Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции. Информация предназначена для лиц старше 18 лет."
          />
          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
              <p className="text-xs uppercase tracking-[0.35em] text-black/38">Розничные запросы</p>
              <p className="mt-4 text-sm leading-7 text-black/65">
                Эта страница не заменяет карту подтверждённых точек. Она помогает собрать корректный запрос по городу и не вводит посетителя в заблуждение фейковыми адресами.
              </p>
            </div>
            <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-[0_14px_40px_rgba(10,10,10,0.12)]">
              <p className="text-xs uppercase tracking-[0.35em] text-white/38">Дисклеймер</p>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции. Информация предназначена для лиц старше 18 лет.
              </p>
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
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading
          eyebrow="Город"
          title={`${city.name}`}
          body="Страница города публикуется только после подтверждения розничных точек и контактных данных."
          tone="light"
        />
        <div className="mt-10 rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
          <p className="text-sm leading-7 text-black/65">
            Данные по городу временно недоступны. Для уточнения наличия или розничного запуска используйте форму на странице «Где купить».
          </p>
          <div className="mt-6">
            <ButtonLink href="/stores#stores-request" analytics="city_request_back" variant="secondary" tone="light">
              Оставить запрос
            </ButtonLink>
          </div>
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
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading
          eyebrow="Точка"
          title={store.title}
          body="Карточка точки публикуется только после подтверждения адреса, графика и контактных данных."
          tone="light"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
            <RichText
              paragraphs={[
                store.address,
                store.hours,
                store.phone,
              ]}
            />
          </div>
          <LeadForm
            type="retail"
            title="Запрос по розничной точке"
            description="Используйте форму для уточнения наличия, подтверждения статуса точки или партнёрского запроса."
            submitLabel="Отправить запрос"
            successMessage="Запрос отправлен. Мы свяжемся с вами по указанным контактам. Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции."
            fields={retailFields}
            checkboxes={retailCheckboxes}
            disclaimer="Информация предназначена для лиц старше 18 лет."
          />
        </div>
      </div>
    </section>
  );
}

function AboutTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
        <div>
          <BreadcrumbTrail pathname={page.pathname} title={page.title} />
          <SectionHeading
            eyebrow="О бренде"
            title="STILNO — официальный сайт бренда с продуктовой, партнёрской и франчайзинговой логикой."
            body={page.description}
            tone="light"
          />
          <div className="mt-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
            <RichText paragraphs={brandNarrative} />
          </div>
        </div>
        <div className="grid gap-5">
          <ProductPhotoCard src="/stilno/products/barbaris.jpg" alt="STILNO CLICK ONE" />
          <ProductPhotoCard src="/stilno/products/fruktoviy-chay.jpg" alt="Упаковка STILNO CLICK ONE" />
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
        <SectionHeading
          eyebrow="Галерея"
          title="Редакционная подборка: устройство, упаковка, технические плоскости и крупные планы."
          body={page.description}
          tone="light"
        />
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
                      <ProductPhotoCard src={item.media ?? "/stilno/products/ananas-mango.jpg"} alt={item.alt} aspect="square" />
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

function ProductCard({ product }: { product: Product }) {
  const category = productCategories.find((item) => item.id === product.categoryId);

  return (
    <article className="grid gap-4 rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_48px_rgba(10,10,10,0.06)]">
      <ProductPhotoCard src={product.images[0]} alt={product.title} />
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.35em] text-black/40">
          {category?.title ?? "Продукт"}
        </span>
        <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-black/55">
          {product.highlight}
        </span>
      </div>
      <div>
        <h3 className="text-3xl font-semibold tracking-[-0.04em] text-black">{product.title}</h3>
        <p className="mt-3 text-sm leading-6 text-black/62">{product.shortDescription}</p>
      </div>
      <ButtonLink href={getProductPath(product)} variant="secondary" tone="light" analytics="product_card_open">
        Смотреть продукт
      </ButtonLink>
    </article>
  );
}

function ProductsIndexTemplate(page: ResolvedPage) {
  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <SectionHeading
          eyebrow="Продукт"
          title="Линейка STILNO строится вокруг подтверждённого продукта STILNO CLICK ONE."
          body={page.description}
          tone="light"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {productCategories.map((category) => (
            <article key={category.id} className="grid gap-4 rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
              <ProductPhotoCard src={category.heroImage ?? featuredProduct.images[0]} alt={category.title} />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.35em] text-black/38">{category.status}</span>
                <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/55">
                  {getCategoryProducts(category.id).length}
                </span>
              </div>
              <p className="text-sm leading-6 text-black/62">{category.shortDescription}</p>
              <ButtonLink href={getProductCategoryPath(category)} variant="secondary" tone="light" analytics="products_category_open">
                Смотреть категорию
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
          <ProductPhotoCard src={category.heroImage ?? featuredProduct.images[0]} alt={category.title} />
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

  const productFaq = faqItems.filter((item) => item.scope === "products" || item.scope === "responsible");

  return (
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <StructuredData data={buildJsonLd(page)} />

        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionHeading
              eyebrow="Продукт"
              title="STILNO CLICK ONE"
              body="STILNO CLICK ONE — никотинсодержащая продуктовая линия для совершеннолетних пользователей. Характеристики указаны по подтверждённым упаковочным материалам. Показатель количества затяжек зависит от режима использования."
              tone="light"
            />
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-black/55">
                18+
              </span>
              <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-black/55">
                до 15 000 затяжек*
              </span>
              <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-black/55">
                Type-C
              </span>
            </div>
            <div className="mt-8 rounded-[1.8rem] border border-black/10 bg-white p-5 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
              <RichText paragraphs={[product.longDescription, "Перезаряжаемое устройство STILNO CLICK ONE. Точная формулировка формата должна быть сверена с упаковкой и документацией перед релизом."]} />
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/stores#stores-request" variant="secondary" tone="light" analytics="product_retail_request">
                  Оставить розничный запрос
                </ButtonLink>
                <ButtonLink href="/partners" variant="secondary" tone="light" analytics="product_partner_request">
                  Запросить партнёрство
                </ButtonLink>
                <ButtonLink
                  href={documentLinks.franchisePresentation}
                  target="_blank"
                  variant="secondary"
                  tone="light"
                  analytics="product_presentation_download"
                >
                  Скачать презентацию для партнёров
                </ButtonLink>
              </div>
            </div>
          </div>

          <Suspense fallback={<VariantPickerFallback product={product} />}>
            <VariantPicker product={product} />
          </Suspense>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/38">Характеристики</p>
            <div className="mt-5 grid gap-3">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-black/8 bg-black/[0.03] px-4 py-4">
                  <span className="text-sm text-black/54">{spec.label}</span>
                  <span className="text-sm font-medium text-right text-black">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-[0_16px_44px_rgba(10,10,10,0.12)]">
            <p className="text-xs uppercase tracking-[0.35em] text-white/38">Предупреждения 18+</p>
            <div className="mt-5 grid gap-4">
              {product.warnings.map((warning) => (
                <div key={warning} className="rounded-[1.4rem] border border-white/10 bg-white/[0.05] px-4 py-4 text-sm leading-6 text-white">
                  {warning}
                </div>
              ))}
              {product.facts.map((fact) => (
                <div key={fact} className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white/68">
                  {fact}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/38">Упаковка и вкусовые варианты</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {product.variants.slice(0, 4).map((variant) => (
                <ProductPhotoCard key={variant.id} src={variant.packaging ?? variant.image ?? product.images[0]} alt={`${product.title} — ${variant.title}`} aspect="square" />
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <p className="text-xs uppercase tracking-[0.35em] text-black/38">FAQ</p>
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
    <section className="bg-[var(--color-page)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <SectionHeading
              eyebrow="Партнёрам"
              title="Партнёрам STILNO"
              body="Оптовые, региональные и партнёрские запросы по бренду STILNO принимаются через форму сайта. Условия обсуждаются индивидуально."
              tone="light"
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { title: "Опт", body: "Запросы по оптовым поставкам и B2B-взаимодействию." },
                { title: "Регион", body: "Работа по конкретному городу или региону после первичного контакта." },
                { title: "Розница", body: "Подключение действующей точки или обсуждение формата присутствия." },
                { title: "Франчайзинг", body: "Отдельный сценарий запуска под брендом STILNO." },
              ].map((item) => (
                <article key={item.title} className="rounded-[1.7rem] border border-black/10 bg-white p-5 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/62">{item.body}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 rounded-[2rem] border border-black/10 bg-black p-6 text-white">
              <p className="text-xs uppercase tracking-[0.35em] text-white/38">Как проходит контакт</p>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-white/72">
                <p>1. Вы оставляете запрос через форму сайта.</p>
                <p>2. Менеджер STILNO связывается по указанным контактам.</p>
                <p>3. Уточняется формат: опт, регион, розница или франчайзинг.</p>
                <p>4. Следующий этап обсуждается индивидуально.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
              <SvgAsset
                src="/stilno/redesign/partner-support-system.svg"
                alt="Система поддержки партнёра STILNO"
                className="w-full rounded-[1.4rem] border border-black/8"
              />
            </div>
            <LeadForm
              type="partner"
              title="Партнёрский запрос"
              description="Форма для оптовых, региональных и B2B-обращений по бренду STILNO."
              submitLabel="Отправить запрос"
              successMessage="Запрос отправлен. Мы свяжемся с вами по указанным контактам для уточнения формата сотрудничества."
              fields={partnerFields}
              checkboxes={franchiseCheckboxes}
              disclaimer="Информация на сайте носит справочный характер. Условия обсуждаются индивидуально."
            />
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
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Ответственное потребление"
            title="Информация о никотинсодержащей продукции публикуется с отдельными предупреждениями и возрастным ограничением 18+."
            body={page.description}
            tone="light"
          />
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
            <SvgAsset
              src="/stilno/redesign/legal-18-footer-strip.svg"
              alt="18+ и правовые предупреждения STILNO"
              className="w-full rounded-[1.4rem] border border-black/8"
            />
          </div>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4">
            {responsibilityNotes.map((item) => (
              <div key={item} className="rounded-[1.6rem] border border-black/10 bg-white px-5 py-4 text-sm leading-6 text-black/64 shadow-[0_10px_36px_rgba(15,15,15,0.04)]">
                {item}
              </div>
            ))}
          </div>
          <FaqAccordion items={responsibleFaq} />
        </div>
      </div>
    </section>
  );
}

function FranchiseTemplate(page: ResolvedPage) {
  const franchiseFaq = faqItems.filter((item) => item.scope === "franchise" || item.scope === "stores");

  return (
    <section className="bg-black">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Франчайзинг"
              title="Франчайзинг STILNO"
              body="Партнёрский запуск бренда STILNO в регионах. Условия обсуждаются индивидуально после заявки и не являются публичной офертой."
              tone="dark"
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#franchise-form" analytics="franchise_form_anchor">
                Оставить заявку
              </ButtonLink>
              <ButtonLink
                href={documentLinks.franchisePresentation}
                target="_blank"
                analytics="franchise_presentation_open"
                variant="secondary"
                tone="dark"
              >
                Скачать презентацию для партнёров
              </ButtonLink>
              <ButtonLink href="/contacts" analytics="franchise_question_open" variant="secondary" tone="dark">
                Задать вопрос
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <SvgAsset
              src="/stilno/redesign/franchise-process.svg"
              alt="Этапы франчайзинга STILNO"
              className="w-full rounded-[1.4rem] border border-white/8 bg-white"
            />
          </div>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/38">Что получает партнёр</p>
            <div className="mt-5 grid gap-4">
              <SvgAsset
                src="/stilno/redesign/partner-support-system.svg"
                alt="Система поддержки партнёра STILNO"
                className="w-full rounded-[1.4rem] border border-white/8 bg-white"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "брендовые материалы",
                  "продуктовая база",
                  "запуск",
                  "документы",
                  "контакт с менеджером",
                  "18+ дисциплина",
                ].map((item) => (
                  <div key={item} className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white/70">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/38">Кому подходит</p>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-white/72">
                <p>• предпринимателям с опытом в рознице;</p>
                <p>• владельцам действующих точек в смежных категориях;</p>
                <p>• региональным партнёрам;</p>
                <p>• оптовым компаниям;</p>
                <p>• предпринимателям, готовым соблюдать правила категории 18+.</p>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/38">Что важно</p>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-white/72">
                {franchisePillars.map((pillar) => (
                  <p key={pillar}>{pillar}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div id="franchise-form" className="mt-14 grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
          <LeadForm
            type="franchise"
            title="Заявка на франчайзинг"
            description="Укажите город, формат и стадию проекта. Условия обсуждаются индивидуально после заявки."
            submitLabel="Отправить заявку"
            successMessage="Заявка отправлена. Мы свяжемся с вами по указанным контактам. Обращаем внимание: условия партнёрства обсуждаются индивидуально и не являются публичной офертой."
            fields={franchiseFields}
            checkboxes={franchiseCheckboxes}
            disclaimer="Информация на сайте носит справочный характер. Условия партнёрства и франчайзинга обсуждаются индивидуально."
          />
          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/38">Этапы запуска</p>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-white/72">
                {[
                  "1. Заявка.",
                  "2. Первичный контакт.",
                  "3. Обсуждение города.",
                  "4. Выбор формата.",
                  "5. Согласование условий.",
                  "6. Договор.",
                  "7. Подготовка запуска.",
                  "8. Старт работы.",
                ].map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
            <FaqAccordion items={franchiseFaq} />
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
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 lg:px-10">
          <BreadcrumbTrail pathname={page.pathname} title={page.title} />
          <SectionHeading
            eyebrow="Вакансии"
            title="Открытые роли публикуются по мере развития команды STILNO."
            body={page.description}
            tone="light"
          />
          <div className="mt-10 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(10,10,10,0.05)]">
              <p className="text-sm leading-7 text-black/65">
                Если открытые вакансии ещё не опубликованы, вы можете отправить общий карьерный отклик в команду STILNO.
              </p>
            </div>
            <LeadForm
              type="career"
              title="Карьерный отклик"
              description="Оставьте контакты и кратко расскажите о своём опыте."
              submitLabel="Отправить отклик"
              successMessage="Отклик отправлен. Мы свяжемся с вами, если ваш профиль подойдёт под текущие или будущие задачи команды."
              fields={careerFields}
              checkboxes={careerCheckboxes}
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
        <SectionHeading eyebrow="Вакансии" title="Карьерные возможности STILNO." body={page.description} tone="light" />
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
                  <ButtonLink href={getVacancyPath(vacancy)} variant="secondary" tone="light" analytics="careers_vacancy_open">
                    Откликнуться
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
          <LeadForm
            type="career"
            title="Общий карьерный отклик"
            description="Если нужная роль ещё не опубликована, можно отправить общий отклик."
            submitLabel="Отправить отклик"
            successMessage="Отклик отправлен. Мы свяжемся с вами, если ваш профиль подойдёт под текущие или будущие задачи команды."
            fields={careerFields}
            checkboxes={careerCheckboxes}
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
            description="Оставьте контакты и коротко расскажите о своём опыте."
            submitLabel="Отправить отклик"
            successMessage="Отклик отправлен. Мы свяжемся с вами, если ваш профиль подойдёт под задачу."
            fields={careerFields}
            checkboxes={careerCheckboxes}
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
        <SectionHeading
          eyebrow="Контакты"
          title="Обратиться в STILNO можно через формы сайта и подтверждённые юридические данные."
          body={page.description}
          tone="light"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          <MetricCard value="Компания" label={companyDetails.companyName} note="Юридическое лицо бренда." />
          <MetricCard value="Юридический адрес" label="подтверждён" note={companyDetails.legalAddress} />
          <MetricCard value="Производство" label="подтверждённый адрес" note={companyDetails.productionAddress} />
          <MetricCard value="Формы сайта" label="розница · партнёрство · франчайзинг" note="Основной способ первичного контакта." />
        </div>
        <div className="mt-10 grid gap-5 xl:grid-cols-2">
          <LeadForm
            type="retail"
            title="Розничный запрос"
            description="Наличие в городе, розничная точка, вопросы по продукту."
            submitLabel="Отправить запрос"
            successMessage="Запрос отправлен. Мы свяжемся с вами по указанным контактам. Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции."
            fields={retailFields}
            checkboxes={retailCheckboxes}
            disclaimer="Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции."
          />
          <LeadForm
            type="partner"
            title="Партнёрский запрос"
            description="Опт, региональное сотрудничество, франчайзинг и B2B-вопросы."
            submitLabel="Отправить запрос"
            successMessage="Запрос отправлен. Мы свяжемся с вами по указанным контактам для уточнения формата сотрудничества."
            fields={partnerFields}
            checkboxes={franchiseCheckboxes}
            disclaimer="Информация на сайте носит справочный характер. Условия обсуждаются индивидуально."
          />
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
          <SectionHeading eyebrow="Материалы" title="Раздел материалов будет пополняться по мере публикации документов и новостей." body={page.description} tone="light" />
          <div className="mt-10 rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_16px_44px_rgba(10,10,10,0.05)]">
            <p className="text-base leading-7 text-black/68">
              Сейчас сайт сосредоточен на продукте, партнёрских сценариях, франчайзинге и правовой информации.
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
        <SectionHeading eyebrow="Материалы" title="Публикации и документы STILNO." body={page.description} tone="light" />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {articles.map((article) => (
            <article key={article.id} className="grid gap-4 rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_48px_rgba(10,10,10,0.05)]">
              <ProductPhotoCard src={article.coverImage ?? featuredProduct.images[0]} alt={article.title} />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.35em] text-black/38">{article.category}</span>
                <span className="text-sm text-black/45">{article.publishedAt}</span>
              </div>
              <p className="text-sm leading-6 text-black/62">{article.excerpt}</p>
              <ButtonLink href={getArticlePath(article)} variant="secondary" tone="light" analytics="article_open">
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
      <div className="mx-auto max-w-[76rem] px-5 py-16 sm:px-6 lg:px-10">
        <BreadcrumbTrail pathname={page.pathname} title={page.title} />
        <StructuredData data={buildJsonLd(page)} />
        <SectionHeading eyebrow="FAQ" title="Частые вопросы о продукте, розничных запросах, партнёрстве и правовой информации." body={page.description} tone="light" />
        <div className="mt-10">
          <FaqAccordion items={faqItems} />
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
    retail: "Мы свяжемся с вами по указанным контактам. Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции.",
    franchise: "Мы свяжемся с вами по указанным контактам. Условия партнёрства обсуждаются индивидуально и не являются публичной офертой.",
    partner: "Мы свяжемся с вами по указанным контактам для уточнения формата сотрудничества.",
    career: "Мы свяжемся с вами, если ваш профиль подойдёт под текущие или будущие задачи команды.",
  };

  const key = page.thankYouType ?? "retail";

  return (
    <section className="grid min-h-[70svh] place-items-center bg-black px-5 py-16 sm:px-6 lg:px-10">
      <div className="w-full max-w-3xl rounded-[2.6rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_42%),linear-gradient(145deg,#0a0a0a,#17181b)] p-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.45em] text-white/38">Спасибо</p>
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
      image: `${siteOrigin}${featuredProduct.images[0]}`,
    };
  }

  const image =
    page.product?.images[0] ??
    page.category?.heroImage ??
    page.article?.coverImage ??
    featuredProduct.images[0];

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
  };

  return {
    title: titleMap[page.kind] ?? page.title,
    description: descriptionMap[page.kind] ?? page.description,
    canonical: `${siteOrigin}/${page.pathname.join("/")}`,
    image: image ? `${siteOrigin}${image}` : undefined,
  };
}
