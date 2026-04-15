"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  type FormEvent,
  startTransition,
  useEffect,
  useEffectEvent,
  useState,
} from "react";

import type { CtaLink, NavItem, Product, ProductVariant } from "@/lib/site-data";

const AGE_KEY = "stilno:age-gate";
const COOKIE_KEY = "stilno:cookie-consent";

function pushAnalytics(event: string, detail?: Record<string, string>) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    event,
    brand: "STILNO",
    ...detail,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, string>>;
  }
}

function ctaClassName(variant: "primary" | "secondary" | "ghost" = "primary") {
  if (variant === "secondary") {
    return "border border-white/20 bg-white/6 text-white hover:border-white/40 hover:bg-white/12";
  }

  if (variant === "ghost") {
    return "border border-white/12 bg-transparent text-white/78 hover:border-white/28 hover:text-white";
  }

  return "border border-transparent bg-[var(--color-silver)] text-black hover:bg-white";
}

export function SiteHeader({
  navItems,
  utilityCta,
  primaryCta,
}: {
  navItems: NavItem[];
  utilityCta: CtaLink;
  primaryCta: CtaLink;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-black/72 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          data-analytics="nav_logo"
          className="inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.6em] text-white"
        >
          <span className="rounded-full border border-white/14 px-2 py-1 text-[0.55rem] tracking-[0.45em] text-white/58">
            18+
          </span>
          <span>STILNO</span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-analytics={`nav_${item.href.replace(/\W+/g, "_")}`}
              className="text-sm text-white/68 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href={utilityCta.href}
            target={utilityCta.href.endsWith(".pdf") ? "_blank" : undefined}
            rel={utilityCta.href.endsWith(".pdf") ? "noreferrer" : undefined}
            data-analytics="utility_cta"
            className={`rounded-full px-4 py-2 text-sm transition ${ctaClassName(
              utilityCta.variant,
            )}`}
          >
            {utilityCta.label}
          </Link>
          <Link
            href={primaryCta.href}
            data-analytics="primary_cta"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${ctaClassName(
              primaryCta.variant,
            )}`}
          >
            {primaryCta.label}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/4 text-white xl:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-label="Открыть меню"
        >
          <span className="grid gap-1.5">
            <span className="h-px w-5 bg-current" />
            <span className="h-px w-5 bg-current" />
            <span className="h-px w-5 bg-current" />
          </span>
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/8 bg-black px-5 py-5 sm:px-6 xl:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-analytics={`mobile_nav_${item.href.replace(/\W+/g, "_")}`}
                className="rounded-2xl border border-white/8 px-4 py-3 text-white/78 transition hover:border-white/18 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            <Link
              href={utilityCta.href}
              target={utilityCta.href.endsWith(".pdf") ? "_blank" : undefined}
              rel={utilityCta.href.endsWith(".pdf") ? "noreferrer" : undefined}
              data-analytics="mobile_utility_cta"
              className={`rounded-full px-4 py-3 text-center text-sm transition ${ctaClassName(
                utilityCta.variant,
              )}`}
            >
              {utilityCta.label}
            </Link>
            <Link
              href={primaryCta.href}
              data-analytics="mobile_primary_cta"
              className={`rounded-full px-4 py-3 text-center text-sm font-medium transition ${ctaClassName(
                primaryCta.variant,
              )}`}
            >
              {primaryCta.label}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function AnalyticsBridge() {
  const clickHandler = useEffectEvent((event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const tracked = target.closest<HTMLElement>("[data-analytics]");
    if (!tracked) {
      return;
    }

    const eventName = tracked.dataset.analytics;
    if (!eventName) {
      return;
    }

    pushAnalytics(eventName, { href: tracked.getAttribute("href") ?? window.location.pathname });
  });

  useEffect(() => {
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, []);

  return null;
}

export function AgeGate({
  version,
  legalHref,
}: {
  version: string;
  legalHref: string;
}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(AGE_KEY);
    const nextVisible = !pathname.startsWith("/legal/age-18") && storedValue !== version;
    const frame = window.requestAnimationFrame(() => {
      setVisible(nextVisible);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, version]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 px-4">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/12 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_45%),linear-gradient(145deg,#090909,#161616)] p-7 text-white shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:p-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <p className="mb-6 text-xs uppercase tracking-[0.45em] text-white/45">Entry layer / 18+</p>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Контент STILNO предназначен только для совершеннолетней аудитории.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
          Сайт содержит информацию о никотиновых и безникотиновых продуктах, store
          locator, франчайзинге и партнёрских сценариях. Подтвердите возраст, чтобы
          продолжить.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className={`rounded-full px-6 py-3 text-sm font-medium transition ${ctaClassName(
              "primary",
            )}`}
            onClick={() => {
              window.localStorage.setItem(AGE_KEY, version);
              pushAnalytics("age_gate_accept", { version });
              setVisible(false);
            }}
          >
            Мне есть 18
          </button>
          <Link
            href={legalHref}
            className={`rounded-full px-6 py-3 text-center text-sm transition ${ctaClassName(
              "secondary",
            )}`}
            onClick={() => pushAnalytics("age_gate_decline", { version })}
          >
            Выйти
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CookieBanner({
  version,
  legalHref,
}: {
  version: string;
  legalHref: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(COOKIE_KEY);
    const frame = window.requestAnimationFrame(() => {
      setVisible(storedValue !== version);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [version]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 px-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-[1.6rem] border border-white/10 bg-black/92 px-5 py-5 text-white shadow-[0_28px_80px_rgba(0,0,0,0.45)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-white">Cookie consent</p>
          <p className="mt-1 text-sm leading-6 text-white/65">
            Используем cookies для consent-state, аналитических событий и сервисных
            сценариев сайта. Политика описана отдельно и версионируется.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={legalHref}
            className={`rounded-full px-4 py-2 text-center text-sm transition ${ctaClassName(
              "secondary",
            )}`}
          >
            Подробнее
          </Link>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${ctaClassName(
              "primary",
            )}`}
            onClick={() => {
              window.localStorage.setItem(COOKIE_KEY, version);
              pushAnalytics("cookie_accept", { version });
              setVisible(false);
            }}
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}

export function LeadForm({
  type,
  title,
  description,
  submitLabel,
  vacancyTitle,
}: {
  type: "retail" | "franchise" | "partner" | "career";
  title: string;
  description: string;
  submitLabel: string;
  vacancyTitle?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      type,
      pageUrl: pathname,
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      city: String(formData.get("city") ?? ""),
      comment: String(formData.get("comment") ?? ""),
      consent: formData.get("consent") === "on",
      vacancyTitle,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lead request failed");
      }

      pushAnalytics("lead_submit", { type, page: pathname });
      startTransition(() => {
        router.push(`/thank-you/${type}`);
      });
    } catch {
      setError("Не удалось отправить форму. Повторите попытку чуть позже.");
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-white/10 bg-black/70 p-6 text-white shadow-[0_18px_60px_rgba(0,0,0,0.25)]"
    >
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.45em] text-white/45">{type}</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/65">{description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-white/70">
          Имя
          <input
            required
            name="name"
            className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-white/32 focus:border-white/32"
            placeholder="Как к вам обращаться"
          />
        </label>
        <label className="grid gap-2 text-sm text-white/70">
          Телефон
          <input
            required
            name="phone"
            className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-white/32 focus:border-white/32"
            placeholder="+7 (___) ___-__-__"
          />
        </label>
        <label className="grid gap-2 text-sm text-white/70">
          Email
          <input
            required
            name="email"
            type="email"
            className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-white/32 focus:border-white/32"
            placeholder="you@example.com"
          />
        </label>
        <label className="grid gap-2 text-sm text-white/70">
          Город
          <input
            required
            name="city"
            className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-white/32 focus:border-white/32"
            placeholder="Москва"
          />
        </label>
      </div>

      <label className="mt-3 grid gap-2 text-sm text-white/70">
        Комментарий
        <textarea
          required
          name="comment"
          rows={4}
          className="rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-white/32 focus:border-white/32"
          placeholder={
            vacancyTitle
              ? `Расскажите, почему вам интересна роль ${vacancyTitle}.`
              : "Кратко опишите запрос, формат сотрудничества или вопрос."
          }
        />
      </label>

      <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-white/62">
        <input type="checkbox" required name="consent" className="mt-1 size-4 rounded border-white/20 bg-transparent" />
        <span>
          Даю согласие на обработку персональных данных и понимаю, что сайт работает
          как lead-generation платформа бренда.
        </span>
      </label>

      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-5 w-full rounded-full px-5 py-3 text-sm font-medium transition disabled:cursor-wait disabled:opacity-70 ${ctaClassName(
          "primary",
        )}`}
      >
        {isSubmitting ? "Отправляем..." : submitLabel}
      </button>
    </form>
  );
}

export function VariantPicker({ product }: { product: Product }) {
  const [activeVariant, setActiveVariant] = useState<ProductVariant>(product.variants[0]);

  const activeImage = activeVariant.image ?? product.images[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-black/8 bg-[linear-gradient(135deg,#f3f4f6,#d3d6da)] p-5">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={`${product.title} — ${activeVariant.title}`}
            width={1400}
            height={1400}
            className="mx-auto w-full max-w-[36rem] object-contain"
          />
        ) : (
          <div className="grid min-h-[25rem] place-items-center rounded-[1.5rem] border border-black/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),rgba(186,190,196,0.55))] text-center">
            <div className="max-w-md px-6">
              <p className="text-xs uppercase tracking-[0.45em] text-black/45">Template ready</p>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-black">
                Графический слот под будущий product render.
              </h3>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_48px_rgba(15,15,15,0.08)]">
        <p className="text-xs uppercase tracking-[0.4em] text-black/38">Variant selector</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-black">
          {activeVariant.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-black/62">
          В текущем шаблоне вариативность строится на вкусе, nicotine strength и
          стабильной модульной упаковке.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-black/55">
            {activeVariant.nicotineStrength}
          </span>
          <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-black/55">
            {activeVariant.status}
          </span>
        </div>
        <div className="mt-6 grid gap-2">
          {product.variants.map((variant) => (
            <button
              type="button"
              key={variant.id}
              className={`rounded-[1.2rem] border px-4 py-3 text-left transition ${
                activeVariant.id === variant.id
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-black/[0.02] text-black/70 hover:border-black/24"
              }`}
              onClick={() => {
                setActiveVariant(variant);
                pushAnalytics("product_variant_select", { product: product.slug, variant: variant.id });
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{variant.title}</span>
                <span className="text-xs uppercase tracking-[0.22em] opacity-60">
                  {variant.nicotineStrength}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({
  items,
}: {
  items: Array<{ id: string; question: string; answer: string }>;
}) {
  const [openId, setOpenId] = useState(items[0]?.id ?? "");

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`overflow-hidden rounded-[1.6rem] border transition ${
              isOpen ? "border-black bg-black text-white" : "border-black/10 bg-white"
            }`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenId((current) => (current === item.id ? "" : item.id))}
            >
              <span className="text-lg font-medium tracking-[-0.02em]">{item.question}</span>
              <span className="text-xs uppercase tracking-[0.28em] opacity-55">
                {isOpen ? "Close" : "Open"}
              </span>
            </button>
            {isOpen ? (
              <div className="px-5 pb-5 text-sm leading-6 opacity-78">{item.answer}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
