"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type FormEvent,
  type RefObject,
  startTransition,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import { analyticsIds, isStaticExport } from "@/lib/site-data";
import type { CtaLink, NavItem, Product, ProductVariant } from "@/lib/site-data";

const AGE_KEY = "stilno:age-gate";
const COOKIE_KEY = "stilno:cookie-consent";

type ConsentState = {
  version: string;
  necessary: true;
  ageGate: true;
  analytics: boolean;
};

export type LeadField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  halfWidth?: boolean;
  autoComplete?: string;
};

export type LeadCheckbox = {
  name: string;
  label: string;
  required?: boolean;
};

function trapFocus(event: KeyboardEvent, containerRef: RefObject<HTMLElement | null>) {
  if (event.key !== "Tab") {
    return;
  }

  const container = containerRef.current;
  if (!container) {
    return;
  }

  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((item) => !item.hasAttribute("hidden"));

  if (!focusable.length) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

function readConsent(version: string): ConsentState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(COOKIE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== version) {
      return null;
    }

    return {
      version,
      necessary: true,
      ageGate: true,
      analytics: Boolean(parsed.analytics),
    };
  } catch {
    return null;
  }
}

function writeConsent(consent: ConsentState) {
  window.localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent("stilno:consent-change", { detail: consent }));
}

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

  if (typeof window.gtag === "function") {
    window.gtag("event", event, detail);
  }

  if (typeof window.ym === "function" && window.stilnoMetrikaId) {
    window.ym(window.stilnoMetrikaId, "reachGoal", event, detail);
  }
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, string | number | boolean>>;
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
    stilnoMetrikaId?: number;
    __stilnoAnalyticsLoaded?: boolean;
  }
}

function ctaClassName(variant: "primary" | "secondary" | "ghost" = "primary") {
  if (variant === "secondary") {
    return "border border-white/16 bg-white/4 text-white hover:border-white/32 hover:bg-white/10";
  }

  if (variant === "ghost") {
    return "border border-black/12 bg-black/[0.03] text-black hover:border-black/24 hover:bg-black/[0.05]";
  }

  return "border border-transparent bg-[var(--color-silver)] text-black hover:bg-white";
}

function createScript(src: string, onload?: () => void) {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  if (onload) {
    script.onload = onload;
  }
  document.head.appendChild(script);
  return script;
}

export function SiteHeader({
  navItems,
  primaryCta,
}: {
  navItems: NavItem[];
  primaryCta: CtaLink;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTarget = menuRef.current?.querySelector<HTMLElement>("a,button");
    focusTarget?.focus();

    function handlePointer(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (
        menuRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }

      setMenuOpen(false);
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        buttonRef.current?.focus();
        return;
      }

      trapFocus(event, menuRef);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-black/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          data-analytics="nav_logo"
          className="inline-flex items-center text-[0.82rem] font-semibold uppercase tracking-[0.6em] text-white"
        >
          STILNO
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-analytics={`nav_${item.href.replace(/\W+/g, "_")}`}
              className="text-sm text-white/72 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href={primaryCta.href}
            data-analytics="primary_cta"
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${ctaClassName(
              primaryCta.variant,
            )}`}
          >
            {primaryCta.label}
          </Link>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/4 text-white xl:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          <span className="grid gap-1.5">
            <span className="h-px w-5 bg-current" />
            <span className="h-px w-5 bg-current" />
            <span className="h-px w-5 bg-current" />
          </span>
        </button>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 bg-black/56 xl:hidden" aria-hidden="true" />
      ) : null}

      {menuOpen ? (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="absolute inset-x-4 top-[calc(100%+0.75rem)] z-50 rounded-[1.9rem] border border-white/10 bg-[#0e0f12] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.42)] xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Мобильное меню"
        >
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-analytics={`mobile_nav_${item.href.replace(/\W+/g, "_")}`}
                className="rounded-2xl border border-white/8 px-4 py-3 text-white/78 transition hover:border-white/18 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href={primaryCta.href}
            data-analytics="mobile_primary_cta"
            className={`mt-4 inline-flex w-full justify-center rounded-full px-4 py-3 text-center text-sm font-medium transition ${ctaClassName(
              primaryCta.variant,
            )}`}
            onClick={() => setMenuOpen(false)}
          >
            {primaryCta.label}
          </Link>
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

export function AnalyticsLoader({ version }: { version: string }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    const update = () => setConsent(readConsent(version));
    update();
    window.addEventListener("stilno:consent-change", update as EventListener);
    return () => window.removeEventListener("stilno:consent-change", update as EventListener);
  }, [version]);

  useEffect(() => {
    if (!consent?.analytics || window.__stilnoAnalyticsLoaded) {
      return;
    }

    window.__stilnoAnalyticsLoaded = true;

    if (analyticsIds.gtm) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      createScript(`https://www.googletagmanager.com/gtm.js?id=${analyticsIds.gtm}`);
    } else if (analyticsIds.ga4) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args as never);
      };
      window.gtag("js", new Date());
      window.gtag("config", analyticsIds.ga4, { send_page_view: true });
      createScript(`https://www.googletagmanager.com/gtag/js?id=${analyticsIds.ga4}`);
    }

    if (analyticsIds.yandexMetrika) {
      window.stilnoMetrikaId = Number(analyticsIds.yandexMetrika);
      if (!window.ym) {
        const ymStub = ((...args: unknown[]) => {
          ymStub.a = ymStub.a || [];
          ymStub.a.push(args);
        }) as ((...args: unknown[]) => void) & { a?: unknown[] };
        window.ym = ymStub;
      }
      createScript("https://mc.yandex.ru/metrika/tag.js", () => {
        if (typeof window.ym === "function" && window.stilnoMetrikaId) {
          window.ym(window.stilnoMetrikaId, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
          });
        }
      });
    }
  }, [consent]);

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
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(AGE_KEY);
    const nextVisible = !pathname.startsWith("/legal/age-18") && storedValue !== version;
    const frame = window.requestAnimationFrame(() => {
      setVisible(nextVisible);
      setDenied(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, version]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();

    function handleKey(event: KeyboardEvent) {
      trapFocus(event, dialogRef);
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [visible, denied]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 px-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/12 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_45%),linear-gradient(145deg,#090909,#161616)] p-7 text-white shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:p-10"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <p className="mb-6 text-xs uppercase tracking-[0.45em] text-white/45">18+</p>
        <h2
          id="age-gate-title"
          className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl"
        >
          Сайт содержит информацию о никотинсодержащей продукции и предназначен только для лиц старше 18 лет.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
          Подтвердите, что вам исполнилось 18 лет.
        </p>

        {denied ? (
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/4 p-5">
            <p className="text-base leading-7 text-white/78">
              Доступ к сайту ограничен. Продажа никотинсодержащей продукции несовершеннолетним запрещена.
            </p>
          </div>
        ) : null}

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
            Мне есть 18 лет
          </button>
          <button
            type="button"
            className={`rounded-full px-6 py-3 text-sm transition ${ctaClassName("secondary")}`}
            onClick={() => {
              pushAnalytics("age_gate_decline", { version });
              setDenied(true);
            }}
          >
            Мне нет 18 лет
          </button>
        </div>
        <p className="mt-5 text-sm leading-6 text-white/45">
          Подробные возрастные ограничения описаны в{" "}
          <Link
            href={legalHref}
            className="underline decoration-white/20 underline-offset-4 transition hover:text-white"
          >
            правовой информации
          </Link>
          .
        </p>
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const stored = readConsent(version);
    const frame = window.requestAnimationFrame(() => {
      setVisible(!stored);
      setAnalyticsEnabled(Boolean(stored?.analytics));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [version]);

  function saveConsent(analytics: boolean) {
    writeConsent({
      version,
      necessary: true,
      ageGate: true,
      analytics,
    });
    pushAnalytics("cookie_consent_save", { analytics: analytics ? "enabled" : "disabled" });
    setVisible(false);
    setSettingsOpen(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 px-4">
      <div className="mx-auto max-w-5xl rounded-[1.6rem] border border-white/10 bg-black/92 px-5 py-5 text-white shadow-[0_28px_80px_rgba(0,0,0,0.45)] sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-white">Cookie-файлы</p>
            <p className="mt-1 text-sm leading-6 text-white/65">
              Мы используем необходимые cookie для работы сайта и сохранения подтверждения возраста.
              Аналитические cookie подключаются только с вашего согласия. Подробнее — в{" "}
              <Link href={legalHref} className="underline decoration-white/20 underline-offset-4">
                Политике cookies
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${ctaClassName(
                "primary",
              )}`}
              onClick={() => saveConsent(true)}
            >
              Принять все
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm transition ${ctaClassName(
                "secondary",
              )}`}
              onClick={() => saveConsent(false)}
            >
              Только необходимые
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm transition ${ctaClassName(
                "secondary",
              )}`}
              onClick={() => setSettingsOpen((current) => !current)}
            >
              Настроить
            </button>
          </div>
        </div>

        {settingsOpen ? (
          <div className="mt-5 grid gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-3">
            <label className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/78">
              <span className="block font-medium text-white">Необходимые cookie</span>
              <span className="mt-2 block text-white/58">Нужны для корректной работы сайта.</span>
              <input type="checkbox" checked disabled className="mt-3" />
            </label>
            <label className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/78">
              <span className="block font-medium text-white">Age-gate cookie</span>
              <span className="mt-2 block text-white/58">Сохраняет подтверждение возраста 18+.</span>
              <input type="checkbox" checked disabled className="mt-3" />
            </label>
            <label className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/78">
              <span className="block font-medium text-white">Аналитика</span>
              <span className="mt-2 block text-white/58">Подключается только после вашего согласия.</span>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                className="mt-3"
              />
            </label>
            <div className="sm:col-span-3">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${ctaClassName(
                  "primary",
                )}`}
                onClick={() => saveConsent(analyticsEnabled)}
              >
                Сохранить настройки
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function LeadForm({
  type,
  title,
  description,
  submitLabel,
  successMessage,
  fields,
  checkboxes,
  disclaimer,
}: {
  type: "retail" | "franchise" | "partner" | "career";
  title: string;
  description: string;
  submitLabel: string;
  successMessage: string;
  fields: LeadField[];
  checkboxes: LeadCheckbox[];
  disclaimer?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successHint, setSuccessHint] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessHint(null);

    if (isStaticExport) {
      setError("На этой публикации формы недоступны. Для отправки заявок используйте серверный хостинг.");
      return;
    }

    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    const fieldsPayload = Object.fromEntries(
      fields.map((field) => [field.name, String(formData.get(field.name) ?? "").trim()]),
    );
    const consentsPayload = Object.fromEntries(
      checkboxes.map((checkbox) => [checkbox.name, formData.get(checkbox.name) === "on"]),
    );

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          pageUrl: pathname,
          website: String(formData.get("website") ?? ""),
          startedAt: Number(formData.get("startedAt") ?? 0),
          fields: fieldsPayload,
          consents: consentsPayload,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Не удалось отправить обращение.");
      }

      form.reset();
      setSuccessHint(successMessage);
      pushAnalytics("lead_submit", { type, page: pathname });
      startTransition(() => {
        router.prefetch(`/thank-you/${type}`);
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Не удалось отправить форму. Повторите попытку чуть позже.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-white/10 bg-black/82 p-6 text-white shadow-[0_18px_60px_rgba(0,0,0,0.25)]"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/65">{description}</p>
      </div>

      <input type="hidden" name="startedAt" value={startedAt} readOnly />
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" className="hidden" />

      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.name}
            className={`grid gap-2 text-sm text-white/72 ${field.halfWidth === false ? "sm:col-span-2" : ""}`}
          >
            {field.label}
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                required={field.required}
                rows={4}
                autoComplete={field.autoComplete}
                className="rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/32"
                placeholder={field.placeholder}
              />
            ) : field.type === "select" ? (
              <select
                name={field.name}
                required={field.required}
                className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none focus:border-white/32"
                defaultValue=""
              >
                <option value="" disabled className="text-black">
                  Выберите вариант
                </option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value} className="text-black">
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={field.name}
                type={field.type ?? "text"}
                required={field.required}
                autoComplete={field.autoComplete}
                className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/32"
                placeholder={field.placeholder}
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        {checkboxes.map((checkbox) => (
          <label key={checkbox.name} className="flex items-start gap-3 text-sm leading-6 text-white/62">
            <input
              type="checkbox"
              required={checkbox.required}
              name={checkbox.name}
              className="mt-1 size-4 rounded border-white/20 bg-transparent"
            />
            <span>{checkbox.label}</span>
          </label>
        ))}
      </div>

      {disclaimer ? <p className="mt-4 text-sm leading-6 text-white/50">{disclaimer}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      {successHint ? <p className="mt-4 text-sm leading-6 text-emerald-300">{successHint}</p> : null}

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeVariant: ProductVariant =
    product.variants.find((variant) => variant.id === searchParams.get("flavor")) ??
    product.variants[0];

  const activeImage = activeVariant.image ?? product.images[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-black/8 bg-[linear-gradient(180deg,#f5f5f4,#e3e4e7)] p-5">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={`${product.title} — ${activeVariant.title}`}
            width={1400}
            height={1400}
            className="mx-auto w-full max-w-[38rem] object-contain"
          />
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_48px_rgba(15,15,15,0.08)]">
        <p className="text-xs uppercase tracking-[0.4em] text-black/38">Вкусовые варианты</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-black">
          {activeVariant.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-black/62">
          Выберите вкус по подтверждённым упаковочным материалам текущей линии STILNO CLICK ONE.
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
                const nextSearch = new URLSearchParams(searchParams.toString());
                nextSearch.set("flavor", variant.id);
                router.replace(`${pathname}?${nextSearch.toString()}`, { scroll: false });
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
                {isOpen ? "Свернуть" : "Открыть"}
              </span>
            </button>
            {isOpen ? <div className="px-5 pb-5 text-sm leading-6 opacity-78">{item.answer}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

export function VariantPickerFallback({ product }: { product: Product }) {
  const firstVariant = useMemo(() => product.variants[0], [product.variants]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-black/8 bg-[linear-gradient(180deg,#f5f5f4,#e3e4e7)] p-5">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            width={1400}
            height={1400}
            className="mx-auto w-full max-w-[38rem] object-contain"
          />
        ) : null}
      </div>
      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_48px_rgba(15,15,15,0.08)]">
        <p className="text-xs uppercase tracking-[0.4em] text-black/38">Вкусовые варианты</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-black">
          {firstVariant?.title}
        </h3>
      </div>
    </div>
  );
}
