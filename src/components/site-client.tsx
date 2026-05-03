"use client";

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

import { MediaSlot } from "@/components/media-slot";
import { analyticsIds, companyDetails, isStaticExport } from "@/lib/site-data";
import type {
  CtaLink,
  LeadFormSchema,
  NavItem,
  Product,
  ProductVariant,
} from "@/lib/site-data";
import {
  verifyCodeLocally,
  type VerificationRecord,
  type VerificationStatus,
} from "@/lib/verification";

const AGE_KEY = "stilno:age-gate";
const COOKIE_KEY = "stilno:cookie-consent";

type ConsentState = {
  version: string;
  necessary: true;
  ageGate: true;
  analytics: boolean;
};

type VerificationDetailsRecord = Pick<
  VerificationRecord,
  "product" | "flavor" | "batch" | "expiresAt" | "checks"
>;

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
    return "border border-black/14 bg-white text-black hover:border-black/34 hover:bg-[#f4f4f1]";
  }

  if (variant === "ghost") {
    return "border border-black/10 bg-transparent text-black hover:border-black/24 hover:bg-black/[0.03]";
  }

  return "border border-black bg-black text-white hover:bg-black/82";
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

function fieldClass(theme: "light" | "dark") {
  return theme === "dark"
    ? "border-black/12 bg-white text-black placeholder:text-black/34 focus:border-black/36"
    : "border-black/12 bg-white text-black placeholder:text-black/34 focus:border-black/36";
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

      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) {
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
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#fbfaf7]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-5 px-5 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          data-analytics="nav_logo"
          className="inline-flex items-center text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-black"
        >
          STILNO
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-analytics={`nav_${item.href.replace(/\W+/g, "_")}`}
            className="text-[0.92rem] text-black/58 transition hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href={primaryCta.href}
            data-analytics="primary_cta"
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition shadow-[0_10px_30px_rgba(0,0,0,0.12)] ${ctaClassName(
              primaryCta.variant,
            )}`}
          >
            {primaryCta.label}
          </Link>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-[0_10px_28px_rgba(0,0,0,0.06)] xl:hidden"
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

      {menuOpen ? <div className="fixed inset-0 z-40 bg-black/20 xl:hidden" aria-hidden="true" /> : null}

      {menuOpen ? (
        <div
          id="mobile-menu"
          ref={menuRef}
        className="absolute inset-x-4 top-[calc(100%+0.75rem)] z-50 rounded-[1.25rem] border border-black/10 bg-[#fbfaf7] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.16)] xl:hidden"
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
                className="rounded-[0.9rem] border border-black/10 bg-white px-4 py-3 text-black/70 transition hover:border-black/24 hover:text-black"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080807]/86 px-4 backdrop-blur-xl">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="relative w-full max-w-5xl overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#11100e] p-5 text-white shadow-[0_40px_110px_rgba(0,0,0,0.5)] sm:p-7 lg:p-8"
      >
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="flex min-w-0 flex-col p-2 sm:p-3">
            <div className="mb-6 inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.22em] text-white/44">
              <span className="h-px w-10 bg-white/24" />
              <span>18+</span>
            </div>
            <h2
              id="age-gate-title"
              className="max-w-2xl text-3xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl"
            >
              STILNO доступен только совершеннолетним пользователям.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
              Сайт содержит справочную информацию о никотинсодержащей продукции. Подтвердите, что вам исполнилось 18 лет.
            </p>

            {denied ? (
              <div className="mt-7 rounded-[1.15rem] border border-white/12 bg-white/[0.08] p-5">
                <p className="text-base leading-7 text-white/76">
                  Доступ к сайту ограничен. Продажа никотинсодержащей продукции несовершеннолетним запрещена.
                </p>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rounded-full border border-[#e7c89f] bg-[#e7c89f] px-6 py-3 text-sm font-medium text-black transition hover:bg-[#f0d8b8]"
                onClick={() => {
                  window.localStorage.setItem(AGE_KEY, version);
                  window.dispatchEvent(new Event("stilno:age-accepted"));
                  pushAnalytics("age_gate_accept", { version });
                  setVisible(false);
                }}
              >
                Мне есть 18 лет
              </button>
              <button
                type="button"
                className="rounded-full border border-white/18 bg-white/[0.07] px-6 py-3 text-sm text-white transition hover:border-white/34 hover:bg-white/[0.12]"
                onClick={() => {
                  pushAnalytics("age_gate_decline", { version });
                  setDenied(true);
                }}
              >
                Мне нет 18 лет
              </button>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/46">
              Подробные возрастные ограничения описаны в{" "}
              <Link
                href={legalHref}
                className="underline decoration-white/24 underline-offset-4 transition hover:text-white"
              >
                правовой информации
              </Link>
              .
            </p>
          </div>
          <MediaSlot
            slotId="age-gate-product"
            title="STILNO CLICK ONE"
            note="Визуал продукта STILNO в возрастном подтверждении."
            aspect="portrait"
            className="hidden min-h-[34rem] border-white/10 lg:block"
          />
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    function syncVisible() {
      const stored = readConsent(version);
      const ageAccepted = window.localStorage.getItem(AGE_KEY) === version;
      setVisible(ageAccepted && !stored);
      setAnalyticsEnabled(Boolean(stored?.analytics));
    }

    const frame = window.requestAnimationFrame(() => {
      syncVisible();
    });

    window.addEventListener("stilno:age-accepted", syncVisible);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("stilno:age-accepted", syncVisible);
    };
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
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[70] px-4">
      <div className="pointer-events-auto mx-auto max-w-4xl rounded-[1.2rem] border border-white/12 bg-[#11100e] px-5 py-5 text-white shadow-[0_28px_85px_rgba(0,0,0,0.28)] sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-white">Cookie-файлы</p>
            <p className="mt-1 text-sm leading-6 text-white/62">
              Мы используем необходимые cookie для работы сайта и сохранения подтверждения возраста.
              Аналитические cookie подключаются только с вашего согласия. Подробнее — в{" "}
              <Link href={legalHref} className="underline decoration-white/24 underline-offset-4 hover:text-white">
                Политике cookies
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="rounded-full border border-[#e7c89f] bg-[#e7c89f] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#f0d8b8]"
              onClick={() => saveConsent(true)}
            >
              Принять все
            </button>
            <button
              type="button"
              className="rounded-full border border-white/18 bg-white/[0.07] px-4 py-2 text-sm text-white transition hover:border-white/34 hover:bg-white/[0.12]"
              onClick={() => saveConsent(false)}
            >
              Только необходимые
            </button>
            <button
              type="button"
              className="rounded-full border border-white/18 bg-white/[0.07] px-4 py-2 text-sm text-white transition hover:border-white/34 hover:bg-white/[0.12]"
              onClick={() => setSettingsOpen((current) => !current)}
            >
              Настроить
            </button>
          </div>
        </div>

        {settingsOpen ? (
          <div className="mt-5 grid gap-3 rounded-[1rem] border border-white/12 bg-white/[0.06] p-4 sm:grid-cols-3">
            <label className="rounded-[0.85rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/74">
              <span className="block font-medium text-white">Необходимые cookie</span>
              <span className="mt-2 block text-white/54">Нужны для корректной работы сайта.</span>
              <input type="checkbox" checked disabled className="mt-3" />
            </label>
            <label className="rounded-[0.85rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/74">
              <span className="block font-medium text-white">Age-gate cookie</span>
              <span className="mt-2 block text-white/54">Сохраняет подтверждение возраста 18+.</span>
              <input type="checkbox" checked disabled className="mt-3" />
            </label>
            <label className="rounded-[0.85rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/74">
              <span className="block font-medium text-white">Аналитика</span>
              <span className="mt-2 block text-white/54">Подключается только после вашего согласия.</span>
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
                className="rounded-full border border-[#e7c89f] bg-[#e7c89f] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#f0d8b8]"
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
  schema,
}: {
  type: "retail" | "franchise" | "partner" | "career";
  schema: LeadFormSchema;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successHint, setSuccessHint] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const theme = schema.theme ?? "dark";

  useEffect(() => {
    setStartedAt(Date.now());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessHint(null);

    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    const fieldsPayload = Object.fromEntries(
      schema.fields.map((field) => [field.name, String(formData.get(field.name) ?? "").trim()]),
    );
    const consentsPayload = Object.fromEntries(
      schema.checkboxes.map((checkbox) => [checkbox.name, formData.get(checkbox.name) === "on"]),
    );

    if (isStaticExport) {
      setError(
        `Эта статическая версия сайта не принимает заявки напрямую. Напишите на ${companyDetails.contactEmail} или используйте production-версию сайта.`,
      );
      pushAnalytics("lead_submit_static_blocked", { type, page: pathname });
      setIsSubmitting(false);
      return;
    }

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
      setSuccessHint(schema.successMessage);
      pushAnalytics("lead_submit", { type, page: pathname });
      startTransition(() => {
        router.push(`/thank-you/${type}`);
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
      className={`rounded-[1rem] border p-6 ${
        theme === "dark"
          ? "border-black/10 bg-white text-black"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-semibold tracking-[-0.04em]">{schema.title}</h3>
        <p className={`mt-3 text-sm leading-6 ${theme === "dark" ? "text-black/62" : "text-black/62"}`}>
          {schema.description}
        </p>
      </div>

      <input type="hidden" name="startedAt" value={startedAt} readOnly />
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" className="hidden" />

      <div className="grid gap-3 sm:grid-cols-2">
        {schema.fields.map((field) => (
          <label
            key={field.name}
            className={`grid gap-2 text-sm ${field.halfWidth === false ? "sm:col-span-2" : ""} ${
              theme === "dark" ? "text-black/70" : "text-black/70"
            }`}
          >
            {field.label}
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                required={field.required}
                rows={4}
                autoComplete={field.autoComplete}
                className={`rounded-[1rem] border px-4 py-3 outline-none transition ${fieldClass(theme)}`}
                placeholder={field.placeholder}
              />
            ) : field.type === "select" ? (
              <select
                name={field.name}
                required={field.required}
                className={`rounded-[1rem] border px-4 py-3 outline-none transition ${fieldClass(theme)}`}
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
                className={`rounded-[1rem] border px-4 py-3 outline-none transition ${fieldClass(theme)}`}
                placeholder={field.placeholder}
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        {schema.checkboxes.map((checkbox) => (
          <label
            key={checkbox.name}
            className={`flex items-start gap-3 text-sm leading-6 ${
              theme === "dark" ? "text-black/60" : "text-black/60"
            }`}
          >
            <input
              type="checkbox"
              required={checkbox.required}
              name={checkbox.name}
              className={`mt-1 h-4 w-4 shrink-0 rounded accent-black ${
                theme === "dark" ? "border-black/20 bg-transparent" : "border-black/20 bg-transparent"
              }`}
            />
            <span className="min-w-0 flex-1">{checkbox.label}</span>
          </label>
        ))}
      </div>

      {schema.disclaimer ? (
        <p className={`mt-4 text-sm leading-6 ${theme === "dark" ? "text-black/50" : "text-black/50"}`}>
          {schema.disclaimer}
        </p>
      ) : null}
      <div aria-live="polite">
        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
        {successHint ? (
          <p className={`mt-4 text-sm leading-6 ${theme === "dark" ? "text-emerald-700" : "text-emerald-700"}`}>
            {successHint}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-5 inline-flex rounded-full px-5 py-3 text-sm font-medium transition disabled:cursor-wait disabled:opacity-70 ${
          theme === "dark"
            ? ctaClassName("primary")
            : "border border-transparent bg-black text-white hover:bg-black/86"
        }`}
      >
        {isSubmitting ? "Отправляем..." : schema.submitLabel}
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

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <MediaSlot
        slotId={`product-variant-${activeVariant.id}`}
        title={activeVariant.title}
        note="Визуал выбранного вкуса STILNO CLICK ONE."
        aspect="square"
        className="min-h-[21rem] sm:min-h-[30rem] xl:min-h-[34rem]"
      />

      <div className="rounded-[1.2rem] border border-black/10 bg-[#11100e] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
        <p className="text-xs uppercase tracking-[0.18em] text-white/44">Вкусовая серия</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-white">{activeVariant.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/60">
          Подтверждённые варианты текущей линии STILNO CLICK ONE. Выберите вкус, чтобы обновить визуал и собрать позицию для запроса.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/64">
            {activeVariant.nicotineStrength}
          </span>
          <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/64">
            {activeVariant.status}
          </span>
        </div>
        <div className="mt-6 grid gap-2">
          {product.variants.map((variant) => (
            <button
              type="button"
              key={variant.id}
              className={`rounded-[1.15rem] border px-4 py-3 text-left transition ${
                activeVariant.id === variant.id
                  ? "border-[#e7c89f] bg-[#e7c89f] text-black"
                  : "border-white/12 bg-white/[0.06] text-white/72 hover:border-white/28 hover:bg-white/[0.1]"
              }`}
              onClick={() => {
                const nextSearch = new URLSearchParams(searchParams.toString());
                nextSearch.set("flavor", variant.id);
                router.replace(`${pathname}?${nextSearch.toString()}`, { scroll: false });
                pushAnalytics("product_variant_select", {
                  product: product.slug,
                  variant: variant.id,
                });
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{variant.title}</span>
                <span className="text-xs uppercase tracking-[0.22em] opacity-58">
                  {variant.nicotineStrength}
                </span>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-[1rem] border border-[#e7c89f]/28 bg-[#e7c89f]/10 p-4">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#e7c89f]/70">
            В листе ассортимента
          </p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold leading-tight text-white">{activeVariant.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/42">
                выбранный вкус
              </p>
            </div>
            <span className="rounded-full border border-[#e7c89f]/24 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#e7c89f]/82">
              {activeVariant.nicotineStrength}
            </span>
          </div>
          <p className="mt-3 text-xs leading-5 text-white/46">
            Выбор помогает сформировать запрос. Сайт не оформляет дистанционную розничную продажу.
          </p>
          <Link
            href="/partners#partner-form"
            className="mt-4 inline-flex rounded-full bg-[#e7c89f] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#f0d6b4]"
            onClick={() =>
              pushAnalytics("product_assortment_request", {
                product: product.slug,
                variant: activeVariant.id,
              })
            }
          >
            Запросить позицию
          </Link>
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({
  items,
  tone = "light",
}: {
  items: Array<{ id: string; question: string; answer: string }>;
  tone?: "light" | "dark";
}) {
  const [openId, setOpenId] = useState(items[0]?.id ?? "");

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const closedClass =
          tone === "dark"
            ? "border-white/12 bg-white/[0.06] text-white"
            : "border-black/10 bg-white text-black";

        return (
          <div
            key={item.id}
            className={`overflow-hidden rounded-[1rem] border transition ${
              isOpen
                ? tone === "dark"
                  ? "border-white/22 bg-white/[0.1] text-white"
                  : "border-black bg-white text-black"
                : closedClass
            }`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenId((current) => (current === item.id ? "" : item.id))}
            >
              <span className="text-lg font-medium tracking-[-0.02em]">{item.question}</span>
              <span className="text-xs uppercase tracking-[0.18em] opacity-55">
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

export function VerifyChecker() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{
    tone: "idle" | "success" | "warning" | "danger";
    title: string;
    body: string;
    details?: Array<{ label: string; value: string }>;
  }>({
    tone: "idle",
    title: "Введите код с упаковки",
    body: "Код проверяется без передачи персональных данных. Если упаковка повреждена, обратитесь в поддержку STILNO.",
  });
  const [isChecking, setIsChecking] = useState(false);

  function normalizeCode(value: string) {
    return value.trim().replace(/\s+/g, "").toUpperCase();
  }

  function getTone(status: VerificationStatus) {
    if (status === "valid") {
      return "success";
    }

    if (status === "revoked") {
      return "danger";
    }

    return "warning";
  }

  function getDetails({
    normalizedCode,
    record,
    checkId,
  }: {
    normalizedCode: string;
    record?: VerificationDetailsRecord;
    checkId?: string;
  }) {
    return [
      { label: "Код", value: normalizedCode },
      record ? { label: "Продукт", value: record.product } : undefined,
      record ? { label: "Вкус", value: record.flavor } : undefined,
      record ? { label: "Партия", value: record.batch } : undefined,
      record ? { label: "Срок годности", value: record.expiresAt } : undefined,
      record ? { label: "Проверок", value: String(record.checks) } : undefined,
      checkId ? { label: "ID проверки", value: checkId } : undefined,
    ].filter((item): item is { label: string; value: string } => Boolean(item));
  }

  async function handleCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeCode(code);

    if (normalized.length < 8) {
      setResult({
        tone: "warning",
        title: "Код слишком короткий",
        body: "Проверьте защитную наклейку или QR-код на упаковке STILNO CLICK ONE и повторите ввод.",
      });
      pushAnalytics("verify_code_invalid_length");
      return;
    }

    if (!/^STILNO-[A-Z0-9-]{4,}$/.test(normalized)) {
      setResult({
        tone: "warning",
        title: "Код не похож на код STILNO",
        body:
          "Не используйте продукт из сомнительного источника. Отправьте фото упаковки и код в поддержку для ручной проверки.",
      });
      pushAnalytics("verify_code_unknown_format");
      return;
    }

    if (isStaticExport) {
      const staticResult = verifyCodeLocally(normalized);
      setResult({
        tone: getTone(staticResult.status),
        title: staticResult.title,
        body: staticResult.message,
        details: getDetails({
          normalizedCode: staticResult.normalizedCode,
          record: staticResult.record,
          checkId: `STATIC-${staticResult.normalizedCode}`,
        }),
      });
      pushAnalytics("verify_code_result", { mode: "static", status: staticResult.status });
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: normalized }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        status?: VerificationStatus;
        title?: string;
        message?: string;
        checkedAt?: string;
        checkId?: string;
        normalizedCode?: string;
        record?: {
          product: string;
          flavor: string;
          batch: string;
          manufacturedAt: string;
          expiresAt: string;
          checks: number;
        };
      };

      if (!response.ok || !data.ok || !data.status) {
        throw new Error(data.message ?? "Не удалось проверить код.");
      }

      setResult({
        tone: getTone(data.status),
        title: data.title ?? "Результат проверки",
        body: data.message ?? "Проверка завершена.",
        details: getDetails({
          normalizedCode: data.normalizedCode ?? normalized,
          record: data.record,
          checkId: data.checkId,
        }),
      });
      pushAnalytics("verify_code_result", { status: data.status });
    } catch (checkError) {
      setResult({
        tone: "warning",
        title: "Проверка временно недоступна",
        body:
          checkError instanceof Error
            ? checkError.message
            : "Повторите попытку позже или обратитесь в поддержку STILNO.",
      });
      pushAnalytics("verify_code_failed");
    } finally {
      setIsChecking(false);
    }
  }

  const toneClass =
    result.tone === "success"
      ? "border-emerald-700/20 bg-emerald-50 text-emerald-950"
      : result.tone === "danger"
        ? "border-red-700/20 bg-red-50 text-red-950"
      : result.tone === "warning"
        ? "border-amber-700/20 bg-amber-50 text-amber-950"
        : "border-black/10 bg-[#f6f6f3] text-black";

  return (
    <div className="rounded-[1rem] border border-black/10 bg-white p-6">
      <form onSubmit={handleCheck} className="grid gap-4">
        <label className="grid gap-2 text-sm text-black/68">
          Код проверки
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="STILNO-XXXX-XXXX"
            className="rounded-[1rem] border border-black/12 bg-white px-4 py-3 text-black outline-none transition placeholder:text-black/34 focus:border-black/36"
            autoComplete="off"
            inputMode="text"
          />
        </label>
        <button
          type="submit"
          className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${ctaClassName(
            "primary",
          )}`}
        >
          {isChecking ? "Проверяем..." : "Проверить код"}
        </button>
      </form>
      <div className={`mt-5 rounded-[1rem] border p-5 ${toneClass}`} aria-live="polite">
        <p className="text-lg font-semibold tracking-[-0.03em]">{result.title}</p>
        <p className="mt-2 text-sm leading-6 opacity-75">{result.body}</p>
        {result.details?.length ? (
          <dl className="mt-5 grid gap-3 rounded-[0.9rem] border border-current/10 bg-white/40 p-4 text-sm sm:grid-cols-2">
            {result.details.map((item) => (
              <div key={item.label}>
                <dt className="text-xs uppercase tracking-[0.16em] opacity-55">{item.label}</dt>
                <dd className="mt-1 font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </div>
  );
}

export function VariantPickerFallback({ product }: { product: Product }) {
  const firstVariant = useMemo(() => product.variants[0], [product.variants]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
      <MediaSlot
        slotId="product-variant-fallback"
        title={product.title}
        note="Визуал продукта STILNO CLICK ONE."
        aspect="square"
      />
      <div className="rounded-[1rem] border border-black/10 bg-white p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-black/44">Вкусовая серия</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-black">{firstVariant?.title}</h3>
        <p className="mt-3 text-sm leading-6 text-black/56">Выбор вкуса загружается в лист ассортимента.</p>
      </div>
    </div>
  );
}
