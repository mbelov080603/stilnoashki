"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type FormEvent,
  type RefObject,
  type ReactNode,
  startTransition,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import { MediaSlot } from "@/components/media-slot";
import { russiaMapViewBox, russiaRegionPaths } from "@/lib/russia-map-data";
import { analyticsIds, companyDetails, isStaticExport } from "@/lib/site-data";
import type {
  ContactLine,
  CtaLink,
  FooterGroup,
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

type YandexMapInstance = {
  geoObjects: {
    add: (object: unknown) => void;
  };
  setCenter: (coordinates: [number, number], zoom?: number, options?: Record<string, unknown>) => void;
  destroy: () => void;
};

type YandexPlacemarkInstance = {
  events?: {
    add: (eventName: string, handler: () => void) => void;
  };
};

type YandexMapsApi = {
  ready: (handler: () => void) => void;
  Map: new (
    container: HTMLElement | string,
    state: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => YandexMapInstance;
  Placemark: new (
    coordinates: [number, number],
    properties: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => YandexPlacemarkInstance;
};

type StoreMapPoint = {
  id: string;
  title: string;
  type: "own" | "partner";
  address: string;
  city: string;
  phone: string;
  hours: string;
  coordinates: [number, number];
  directionsHref: string;
};

type VerificationDetailsRecord = Pick<
  VerificationRecord,
  "batch" | "expiresAt" | "checks"
>;

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

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
    ymaps?: YandexMapsApi;
    __stilnoYandexMapsPromise?: Promise<YandexMapsApi>;
  }
}

function ctaClassName(variant: "primary" | "secondary" | "ghost" = "primary") {
  if (variant === "secondary") {
    return "border border-black/14 bg-white text-black hover:border-black/34 hover:bg-black/[0.04]";
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

type PartnerGeographyContact = {
  id: string;
  regionIds: string[];
  regionName: string;
  city: string;
  name: string;
  phone: string;
  address: string;
  tags: string[];
  pin: { x: number; y: number };
};

const partnerGeographyContacts: PartnerGeographyContact[] = [
  {
    id: "moscow-vavilova",
    regionIds: ["RU-MOS"],
    regionName: "Москва",
    city: "Москва",
    name: "Михаил",
    phone: "+7 999 244-28-36",
    address: "ул. Вавилова, 69/75, Москва, 117335",
    tags: ["VAPE", "B2B"],
    pin: { x: 128.1, y: 487.8 },
  },
];

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("ru-RU");
}

function phoneHref(value: string) {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

const storeMapPoints: StoreMapPoint[] = [
  {
    id: "central-office-vavilova",
    title: "Центральный офис",
    type: "own",
    city: "Москва",
    address: "Ulitsa Vavilova, 69/75, Moscow, 117335",
    phone: "+7 999 244-28-36",
    hours: "Визит и наличие уточняйте по телефону",
    coordinates: [55.6829, 37.5515],
    directionsHref: "https://yandex.ru/maps/?rtext=~55.6829%2C37.5515&rtt=auto",
  },
];

const storeMapMarkerIcon = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="76" viewBox="0 0 64 76">
  <filter id="shadow" x="-35%" y="-25%" width="170%" height="170%">
    <feDropShadow dx="0" dy="12" stdDeviation="9" flood-color="#000000" flood-opacity="0.34"/>
  </filter>
  <g filter="url(#shadow)">
    <path d="M32 72C24.2 60.8 13 47.2 13 31.8C13 20.9 21.5 12 32 12C42.5 12 51 20.9 51 31.8C51 47.2 39.8 60.8 32 72Z" fill="#050505" stroke="#ffffff" stroke-width="3"/>
    <circle cx="32" cy="32" r="15" fill="#ffffff"/>
    <text x="32" y="36.5" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="800" fill="#050505">ST</text>
  </g>
</svg>
`)}`;

function getYandexMapsScriptSrc() {
  const params = new URLSearchParams({ lang: "ru_RU" });
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

  if (apiKey) {
    params.set("apikey", apiKey);
  }

  return `https://api-maps.yandex.ru/2.1/?${params.toString()}`;
}

function loadYandexMaps() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Yandex Maps can be loaded only in a browser."));
  }

  if (window.ymaps) {
    return Promise.resolve(window.ymaps);
  }

  if (window.__stilnoYandexMapsPromise) {
    return window.__stilnoYandexMapsPromise;
  }

  window.__stilnoYandexMapsPromise = new Promise<YandexMapsApi>((resolve, reject) => {
    const script = createScript(getYandexMapsScriptSrc(), () => {
      if (window.ymaps) {
        resolve(window.ymaps);
        return;
      }

      reject(new Error("Yandex Maps script loaded without ymaps."));
    });

    script.onerror = () => {
      window.__stilnoYandexMapsPromise = undefined;
      reject(new Error("Yandex Maps script failed to load."));
    };
  });

  return window.__stilnoYandexMapsPromise;
}

function escapeMapText(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "\"":
        return "&quot;";
      default:
        return "&#039;";
    }
  });
}

function buildStoreBalloon(point: StoreMapPoint) {
  return [
    '<div style="max-width:240px;font-family:Arial,sans-serif;color:#090909;">',
    '<div style="font-size:11px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#7a7a7a;">STILNO</div>',
    `<div style="margin-top:8px;font-size:18px;font-weight:700;line-height:1.18;">${escapeMapText(point.title)}</div>`,
    `<div style="margin-top:8px;font-size:13px;line-height:1.5;color:#4a4a4a;">${escapeMapText(point.address)}</div>`,
    `<div style="margin-top:8px;font-size:13px;font-weight:700;">${escapeMapText(point.phone)}</div>`,
    "</div>",
  ].join("");
}

export function StoresMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<YandexMapInstance | null>(null);
  const [selectedPointId, setSelectedPointId] = useState(storeMapPoints[0]?.id ?? "");
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">("loading");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const selectedPoint = storeMapPoints.find((point) => point.id === selectedPointId) ?? storeMapPoints[0];

  useEffect(() => {
    let cancelled = false;

    loadYandexMaps()
      .then((ymaps) => {
        ymaps.ready(() => {
          const container = mapContainerRef.current;
          const firstPoint = storeMapPoints[0];

          if (cancelled || !container || !firstPoint) {
            return;
          }

          const map = new ymaps.Map(
            container,
            {
              center: firstPoint.coordinates,
              zoom: 16,
              controls: ["zoomControl", "fullscreenControl"],
            },
            {
              suppressMapOpenBlock: true,
              yandexMapDisablePoiInteractivity: true,
            },
          );

          for (const point of storeMapPoints) {
            const placemark = new ymaps.Placemark(
              point.coordinates,
              {
                hintContent: `${point.title} STILNO`,
                balloonContent: buildStoreBalloon(point),
              },
              {
                iconLayout: "default#image",
                iconImageHref: storeMapMarkerIcon,
                iconImageSize: [64, 76],
                iconImageOffset: [-32, -70],
              },
            );

            placemark.events?.add("click", () => setSelectedPointId(point.id));
            map.geoObjects.add(placemark);
          }

          mapInstanceRef.current = map;
          setMapStatus("ready");
        });
      })
      .catch(() => {
        if (!cancelled) {
          setMapStatus("error");
        }
      });

    return () => {
      cancelled = true;
      mapInstanceRef.current?.destroy();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapStatus !== "ready" || !selectedPoint) {
      return;
    }

    mapInstanceRef.current?.setCenter(selectedPoint.coordinates, 16, { duration: 300 });
  }, [mapStatus, selectedPoint]);

  if (!selectedPoint) {
    return null;
  }

  return (
    <div className="relative bg-[#050505] lg:min-h-screen">
      <div className="stilno-store-map relative h-[26.375rem] overflow-hidden bg-[#0a0a0a] shadow-[0_38px_120px_rgba(0,0,0,0.42)] lg:absolute lg:inset-0 lg:h-auto">
        <div ref={mapContainerRef} className="absolute inset-0" aria-label="Интерактивная карта магазинов STILNO" />

        <div className="pointer-events-none absolute left-[5.25rem] top-5 z-10 rounded-[0.65rem] border border-white/12 bg-black/72 px-4 py-3 text-white shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur sm:left-[5.75rem] sm:top-6 lg:top-28">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/56">STILNO</p>
          <p className="mt-1 text-sm font-semibold leading-5">Москва (1)</p>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex flex-wrap gap-2 sm:bottom-5 sm:left-5 lg:bottom-8 lg:left-8">
          <span className="rounded-full border border-white/16 bg-black/74 px-3 py-1.5 text-xs font-semibold text-white/82 backdrop-blur">
            Наши точки
          </span>
          <span className="rounded-full border border-white/12 bg-white/12 px-3 py-1.5 text-xs font-semibold text-white/58 backdrop-blur">
            Партнёры
          </span>
        </div>

        {mapStatus !== "ready" ? (
          <div className="absolute inset-0 z-20 grid place-items-center bg-[#090909] px-6 text-center text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                {mapStatus === "error" ? "Карта временно недоступна" : "Загрузка карты"}
              </p>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/62">
                {mapStatus === "error"
                  ? "Проверьте подключение к Yandex Maps. Адрес центрального офиса доступен в карточке справа."
                  : "Подключаем интерактивную карту и точку центрального офиса."}
              </p>
            </div>
          </div>
        ) : null}

        <style>{`
          .stilno-store-map [class*="ground-pane"] {
            filter: grayscale(1) invert(1) contrast(0.88) brightness(0.58);
          }

          .stilno-store-map [class*="places-pane"],
          .stilno-store-map [class*="labels-pane"] {
            filter: grayscale(1) contrast(0.82) brightness(0.86);
            opacity: 0.72;
          }

          .stilno-store-map [class*="controls-pane"] {
            filter: grayscale(1);
          }

          .stilno-store-map [class*="copyright"],
          .stilno-store-map [class*="map-copyrights"] {
            filter: grayscale(1);
            opacity: 0.44;
          }

          .stilno-store-map [class*="balloon__content"] {
            background: #ffffff;
          }
        `}</style>
      </div>

      <aside className="relative z-20 mx-[15px] mb-20 mt-5 rounded-[0.65rem] border border-[#292929] bg-[rgba(18,18,18,0.92)] p-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur sm:p-6 lg:absolute lg:right-[30px] lg:top-[124px] lg:mx-0 lg:mb-0 lg:mt-0 lg:w-[300px] xl:w-[320px]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-white/42">STILNO</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] xl:text-3xl">Карта магазинов</h1>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedPointId(selectedPoint.id);
              mapInstanceRef.current?.setCenter(selectedPoint.coordinates, 16, { duration: 300 });
            }}
            className="min-w-0 rounded-[0.55rem] border border-white/12 bg-black/26 px-4 py-3 text-left text-sm font-semibold text-white transition hover:border-white/26"
          >
            Москва (1)
          </button>
          <div className="grid grid-cols-2 rounded-[0.55rem] border border-white/12 bg-black/24 p-1">
            {(["map", "list"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={viewMode === mode}
                onClick={() => setViewMode(mode)}
                className={classNames(
                  "min-h-9 rounded-[0.42rem] px-3 text-xs font-semibold transition",
                  viewMode === mode ? "bg-white text-black" : "text-white/58 hover:text-white",
                )}
              >
                {mode === "map" ? "Карта" : "Список"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <span className="rounded-[0.55rem] border border-white/16 bg-white px-3 py-2 text-center text-xs font-semibold text-black">
            Наши
          </span>
          <span className="rounded-[0.55rem] border border-white/10 bg-black/20 px-3 py-2 text-center text-xs font-semibold text-white/48">
            Партнёры
          </span>
        </div>

        <article className="mt-5 rounded-[0.6rem] border border-white/10 bg-black/18 p-4 transition hover:border-white/32 hover:bg-white hover:text-black">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.18em] opacity-48">{selectedPoint.city}</p>
              <h2 className="mt-2 text-xl font-semibold leading-tight">{selectedPoint.title}</h2>
            </div>
            <span className="shrink-0 rounded-full border border-current/16 px-2.5 py-1 text-[0.66rem] font-semibold opacity-72">
              {selectedPoint.type === "own" ? "Наша" : "Партнёр"}
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 opacity-72">{selectedPoint.address}</p>
          <p className="mt-3 text-sm leading-6 opacity-64">{selectedPoint.hours}</p>
          <a href={phoneHref(selectedPoint.phone)} className="mt-4 inline-flex text-sm font-semibold transition hover:text-[#cf3f7d]">
            {selectedPoint.phone}
          </a>
        </article>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={selectedPoint.directionsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ff6da8] bg-[#ff6da8] px-5 py-3 text-center text-sm font-semibold text-black transition hover:border-[#ff8fc5] hover:bg-[#ff8fc5]"
          >
            Построить маршрут
          </a>
          <button
            type="button"
            onClick={() => {
              setSelectedPointId(selectedPoint.id);
              mapInstanceRef.current?.setCenter(selectedPoint.coordinates, 16, { duration: 300 });
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/16 bg-white/[0.06] px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-white/34 hover:bg-white/[0.12]"
          >
            Показать на карте
          </button>
        </div>
      </aside>
    </div>
  );
}

export function PartnersGeographyMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [tooltip, setTooltip] = useState<{
    regionId: string;
    x: number;
    y: number;
    pinned: boolean;
  } | null>(null);

  const activeRegionIds = useMemo(
    () => new Set(partnerGeographyContacts.flatMap((contact) => contact.regionIds)),
    [],
  );

  const contactByRegionId = useMemo(() => {
    const contacts = new Map<string, PartnerGeographyContact>();
    for (const contact of partnerGeographyContacts) {
      for (const regionId of contact.regionIds) {
        contacts.set(regionId, contact);
      }
    }
    return contacts;
  }, []);

  const normalizedQuery = normalizeSearch(query);
  const tooltipRegion = tooltip
    ? russiaRegionPaths.find((region) => region.id === tooltip.regionId)
    : undefined;
  const tooltipContact = tooltipRegion ? contactByRegionId.get(tooltipRegion.id) : undefined;

  const filteredContacts = partnerGeographyContacts.filter((contact) => {
    if (!normalizedQuery) {
      return true;
    }

    return [contact.regionName, contact.city, contact.name, contact.phone, contact.address]
      .some((item) => normalizeSearch(item).includes(normalizedQuery));
  });

  useEffect(() => {
    if (!tooltip?.pinned) {
      return;
    }

    function closePinnedTooltip(event: globalThis.PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (mapRef.current?.contains(target)) {
        return;
      }

      setTooltip(null);
    }

    document.addEventListener("pointerdown", closePinnedTooltip);
    return () => document.removeEventListener("pointerdown", closePinnedTooltip);
  }, [tooltip?.pinned]);

  function resolvePointerPosition(event: { clientX: number; clientY: number }) {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) {
      return { x: 0, y: 0 };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function showTooltip(regionId: string, event: { clientX: number; clientY: number }, pinned: boolean) {
    const position = resolvePointerPosition(event);
    setTooltip({
      regionId,
      x: position.x,
      y: position.y,
      pinned,
    });
  }

  function handleRegionKeyDown(regionId: string, event: ReactKeyboardEvent<SVGElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    const region = russiaRegionPaths.find((item) => item.id === regionId);
    setTooltip({
      regionId,
      x: region?.centroid.x ?? 500,
      y: region?.centroid.y ?? 300,
      pinned: true,
    });
  }

  return (
    <div className="grid gap-7">
      <div
        ref={mapRef}
        className="relative overflow-hidden rounded-[1rem] border border-white/10 bg-black px-2 py-6 shadow-[0_34px_110px_rgba(0,0,0,0.34)] sm:px-6 sm:py-8"
        onPointerLeave={() => {
          setTooltip((current) => (current?.pinned ? current : null));
        }}
      >
        <svg
          viewBox={russiaMapViewBox}
          role="img"
          aria-label="Интерактивная карта регионов России"
          className="h-auto w-full"
        >
          <defs>
            <filter id="partner-map-pin-shadow" x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#ff6da8" floodOpacity="0.34" />
            </filter>
          </defs>
          <rect width="1000" height="633" fill="transparent" />
          {russiaRegionPaths.map((region) => {
            const active = activeRegionIds.has(region.id);
            const selected = tooltip?.regionId === region.id;
            const contact = contactByRegionId.get(region.id);
            const matchesQuery =
              !normalizedQuery ||
              normalizeSearch(region.name).includes(normalizedQuery) ||
              (contact ? normalizeSearch(contact.address).includes(normalizedQuery) : false);

            return (
              <path
                key={region.id}
                d={region.path}
                role="button"
                tabIndex={0}
                aria-label={contact ? `${region.name}: ${contact.name}, ${contact.phone}` : `${region.name}: партнер пока не опубликован`}
                className={classNames(
                  "cursor-pointer stroke-black outline-none transition-[fill,opacity,stroke] duration-200 hover:fill-[#ff8fc5] focus:fill-[#ff8fc5]",
                  active ? "fill-[#ff6da8]" : "fill-white/10",
                  selected ? "stroke-[#ffd0e2]" : "stroke-black",
                  matchesQuery ? "opacity-100" : "opacity-30",
                )}
                strokeWidth={selected ? 1.9 : 1.05}
                vectorEffect="non-scaling-stroke"
                fillRule="evenodd"
                onPointerEnter={(event) => {
                  setTooltip((current) => {
                    if (current?.pinned) {
                      return current;
                    }
                    const position = resolvePointerPosition(event);
                    return { regionId: region.id, x: position.x, y: position.y, pinned: false };
                  });
                }}
                onPointerMove={(event) => {
                  setTooltip((current) => {
                    if (current?.pinned || current?.regionId !== region.id) {
                      return current;
                    }
                    const position = resolvePointerPosition(event);
                    return { ...current, x: position.x, y: position.y };
                  });
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  showTooltip(region.id, event, true);
                }}
                onKeyDown={(event) => handleRegionKeyDown(region.id, event)}
              >
                <title>{region.name}</title>
              </path>
            );
          })}
          {partnerGeographyContacts.map((contact) => (
            <g
              key={contact.id}
              role="button"
              tabIndex={0}
              aria-label={`${contact.regionName}: ${contact.name}, ${contact.phone}`}
              className="cursor-pointer outline-none"
              filter="url(#partner-map-pin-shadow)"
              onPointerEnter={(event) => {
                setTooltip((current) => {
                  if (current?.pinned) {
                    return current;
                  }
                  const position = resolvePointerPosition(event);
                  return { regionId: contact.regionIds[0], x: position.x, y: position.y, pinned: false };
                });
              }}
              onPointerMove={(event) => {
                setTooltip((current) => {
                  if (current?.pinned || current?.regionId !== contact.regionIds[0]) {
                    return current;
                  }
                  const position = resolvePointerPosition(event);
                  return { ...current, x: position.x, y: position.y };
                });
              }}
              onClick={(event) => {
                event.stopPropagation();
                showTooltip(contact.regionIds[0], event, true);
              }}
              onKeyDown={(event) => handleRegionKeyDown(contact.regionIds[0], event)}
            >
              <circle cx={contact.pin.x} cy={contact.pin.y} r="18" fill="transparent" />
              <circle cx={contact.pin.x} cy={contact.pin.y} r="10" fill="#000000" stroke="#ffd0e2" strokeWidth="2.5" />
              <circle cx={contact.pin.x} cy={contact.pin.y} r="5" fill="#ff6da8" />
            </g>
          ))}
        </svg>

        {tooltip && tooltipRegion ? (
          <div
            className="pointer-events-auto absolute z-20 w-[min(18rem,calc(100%-2rem))] rounded-[0.85rem] border border-white/12 bg-white p-4 text-black shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
            style={{
              left: `min(max(${tooltip.x}px, 1rem), calc(100% - 1rem))`,
              top: `min(max(${tooltip.y}px, 1rem), calc(100% - 1rem))`,
              transform: "translate(-50%, calc(-100% - 14px))",
            }}
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-black/42">
              {tooltipContact ? "Партнер" : "Регион"}
            </p>
            <h3 className="mt-2 text-xl font-semibold leading-tight text-black">{tooltipRegion.name}</h3>
            {tooltipContact ? (
              <div className="mt-3 grid gap-2 text-sm leading-6 text-black/66">
                <p>{tooltipContact.name}</p>
                <a href={phoneHref(tooltipContact.phone)} className="font-semibold text-black transition hover:text-[#cf3f7d]">
                  {tooltipContact.phone}
                </a>
                <p>{tooltipContact.address}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {tooltipContact.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#ff6da8]/35 bg-white px-2.5 py-1 text-[0.65rem] font-semibold text-[#a71955]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-black/60">
                Партнер пока не опубликован. Регион оставлен в карте для будущего заполнения.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr] xl:items-start">
        <label className="block">
          <span className="sr-only">Поиск региона или партнера</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Введите название региона"
            className="h-[3.25rem] w-full rounded-[0.85rem] border border-white/12 bg-white/[0.07] px-4 text-sm text-white outline-none transition placeholder:text-white/36 focus:border-[#ff8fc5]/60"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredContacts.map((contact) => (
            <article
              key={contact.id}
              className="relative min-w-0 rounded-[0.75rem] border border-white/10 bg-white/[0.08] p-5 text-white transition hover:border-white/35 hover:bg-white hover:text-black"
            >
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-current/20 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] opacity-70">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.2em] opacity-50">{contact.city}</p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight">{contact.name}</h3>
              <p className="mt-3 text-sm leading-6 opacity-68">{contact.address}</p>
              <a href={phoneHref(contact.phone)} className="mt-5 inline-flex text-sm font-semibold transition hover:text-[#cf3f7d]">
                {contact.phone}
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

const landingFooterLinks: NavItem[] = [
  { label: "Политика обработки данных", href: "/legal/privacy" },
  { label: "Согласие на обработку данных", href: "/legal/consent" },
  { label: "Политика cookies", href: "/legal/cookies" },
  { label: "Пользовательское соглашение", href: "/legal/terms" },
  { label: "Не является публичной офертой", href: "/legal/not-public-offer" },
];

function isBrandSitePath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return (
    normalized === "/" ||
    normalized === "/partners" ||
    normalized === "/partners/geography" ||
    normalized === "/about" ||
    normalized === "/brand" ||
    normalized === "/quality" ||
    normalized === "/stores" ||
    normalized === "/request"
  );
}

function ChromeLink({
  href,
  children,
  className,
  dataAnalytics,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className: string;
  dataAnalytics?: string;
  onClick?: () => void;
}) {
  if (href.startsWith("#")) {
    return (
      <a href={href} data-analytics={dataAnalytics} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} data-analytics={dataAnalytics} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function SiteHeader({
  navItems,
  primaryCta,
}: {
  navItems: NavItem[];
  primaryCta: CtaLink;
}) {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  const storeMapHeader = normalizedPathname === "/stores/map";
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
    <header
      className={classNames(
        "top-0 z-40 border-b backdrop-blur-xl",
        storeMapHeader
          ? "fixed inset-x-0 border-white/10 bg-[#030303]/92"
          : "sticky border-white/10 bg-[#030303]",
      )}
    >
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-5 px-5 py-4 sm:px-6 lg:px-8">
        <ChromeLink
          href="/"
          dataAnalytics="nav_logo"
          className={classNames(
            "inline-flex items-center text-[0.78rem] font-semibold uppercase tracking-[0.28em]",
            "text-white",
          )}
        >
          STILNO
        </ChromeLink>

        <nav className="hidden items-center gap-6 xl:flex">
          {navItems.map((item) => (
            <ChromeLink
              key={item.href}
              href={item.href}
              dataAnalytics={`nav_${item.href.replace(/\W+/g, "_")}`}
              className={classNames(
                "text-[0.92rem] transition",
                "text-white/66 hover:text-white",
              )}
            >
              {item.label}
            </ChromeLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <ChromeLink
            href={primaryCta.href}
            dataAnalytics="primary_cta"
            className={classNames(
              "rounded-full px-5 py-2.5 text-sm font-medium transition shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
              "border border-white/22 bg-transparent text-white hover:border-white hover:bg-white hover:text-black",
            )}
          >
            {primaryCta.label}
          </ChromeLink>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className={classNames(
            "inline-flex h-12 w-12 items-center justify-center rounded-full border shadow-[0_10px_28px_rgba(0,0,0,0.06)] xl:hidden",
            "border-white/14 bg-white/10 text-white",
          )}
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
          className={classNames(
            "absolute inset-x-4 top-[calc(100%+0.75rem)] z-50 rounded-[1.25rem] border p-4 shadow-[0_30px_80px_rgba(0,0,0,0.16)] xl:hidden",
            "border-white/14 bg-[#030303] text-white",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Мобильное меню"
        >
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <ChromeLink
                key={item.href}
                href={item.href}
                dataAnalytics={`mobile_nav_${item.href.replace(/\W+/g, "_")}`}
                className={classNames(
                  "rounded-[0.9rem] border px-4 py-3 transition",
                  "border-white/12 bg-white/[0.04] text-white/72 hover:border-white/28 hover:text-white",
                )}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </ChromeLink>
            ))}
          </nav>
          <ChromeLink
            href={primaryCta.href}
            dataAnalytics="mobile_primary_cta"
            className={classNames(
              "mt-4 inline-flex w-full justify-center rounded-full px-4 py-3 text-center text-sm font-medium transition",
              "border border-white/22 bg-transparent text-white hover:border-white hover:bg-white hover:text-black",
            )}
            onClick={() => setMenuOpen(false)}
          >
            {primaryCta.label}
          </ChromeLink>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter({
  footerGroups,
  contactLines,
}: {
  footerGroups: FooterGroup[];
  contactLines: ContactLine[];
}) {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";

  if (normalizedPathname === "/stores/map") {
    return null;
  }

  if (isBrandSitePath(pathname)) {
    return (
      <footer className="border-t border-white/10 bg-[#000000] text-white">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.24em] text-white/38">STILNO</p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/62">
              Премиальный бренд электронных сигарет для взрослой аудитории 18+.
            </p>
            <div className="mt-6 grid gap-3 text-sm leading-6 text-white/58">
              <p>
                <span className="block text-white/36">Компания</span>
                <span className="mt-1 block">ООО «ВОСТОК ИМПОРТ ПРОМ»</span>
              </p>
              <p>
                <span className="block text-white/36">Юридический адрес</span>
                <span className="mt-1 block">{companyDetails.legalAddress}</span>
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.24em] text-white/38">Legal</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              {landingFooterLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-white/64 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-7 grid gap-3 text-sm leading-6 text-white/56">
              <p>
                <span className="font-medium text-white/78">18+.</span> Никотин вызывает зависимость. Продажа
                несовершеннолетним запрещена.
              </p>
              <p>
                Сайт не осуществляет дистанционную розничную продажу никотинсодержащей продукции. Информация на
                сайте носит справочный характер. Условия обсуждаются индивидуально.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-2 px-5 py-4 text-xs leading-5 text-white/38 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>© 2026 STILNO. Все права защищены.</p>
            <p>ООО «ВОСТОК ИМПОРТ ПРОМ»</p>
          </div>
        </div>
      </footer>
    );
  }

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
            {contactLines.slice(0, 2).map((line) => (
              <p key={line.label}>
                <span className="block text-black/38">{line.label}</span>
                <span className="mt-1 block">{line.value}</span>
              </p>
            ))}
          </div>
        </div>

        {footerGroups.map((group) => (
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/86 px-4 backdrop-blur-xl">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="relative w-full max-w-5xl overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#000000] p-5 text-white shadow-[0_40px_110px_rgba(0,0,0,0.5)] sm:p-7 lg:p-8"
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
                className="rounded-full border border-[#ff6da8] bg-[#ff6da8] px-6 py-3 text-sm font-medium text-black transition hover:bg-[#ff8fc5]"
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
            title="STILNO"
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
      <div className="pointer-events-auto mx-auto max-w-4xl rounded-[1.2rem] border border-white/12 bg-[#000000] px-5 py-5 text-white shadow-[0_28px_85px_rgba(0,0,0,0.28)] sm:px-6">
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
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
            <button
              type="button"
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#ff6da8] bg-[#ff6da8] px-5 py-2.5 text-sm font-medium leading-none text-black transition hover:bg-[#ff8fc5] sm:w-52"
              onClick={() => saveConsent(true)}
            >
              Принять все
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white/18 bg-white/[0.07] px-5 py-2.5 text-sm leading-none text-white transition hover:border-white/34 hover:bg-white/[0.12] sm:w-52"
              onClick={() => saveConsent(false)}
            >
              Только необходимые
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white/18 bg-white/[0.07] px-5 py-2.5 text-sm leading-none text-white transition hover:border-white/34 hover:bg-white/[0.12] sm:w-52"
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
                className="inline-flex min-h-11 w-full max-w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#ff6da8] bg-[#ff6da8] px-5 py-2.5 text-sm font-medium leading-none text-black transition hover:bg-[#ff8fc5] sm:w-52"
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

function isEmailLike(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhoneLike(value: string) {
  return value.replace(/[^\d]/g, "").length >= 10;
}

function requiredFieldMessage(name: string, fallbackLabel: string) {
  const messages: Record<string, string> = {
    name: "Укажите имя.",
    phone: "Укажите телефон.",
    email: "Укажите email.",
    city: "Укажите город или регион.",
    requestType: "Выберите тип запроса.",
  };

  return messages[name] ?? `Заполните поле «${fallbackLabel}».`;
}

function requiredConsentMessage(name: string) {
  if (name === "ageConfirmed") {
    return "Подтвердите возраст 18+.";
  }

  if (name === "personalData") {
    return "Подтвердите согласие на обработку персональных данных.";
  }

  return "Подтвердите обязательное согласие.";
}

function focusFormControl(form: HTMLFormElement, name: string) {
  const control = form.elements.namedItem(name);
  if (control instanceof HTMLElement) {
    control.focus();
  }
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

    for (const field of schema.fields) {
      const value = fieldsPayload[field.name] ?? "";

      if (field.required && !value) {
        setError(requiredFieldMessage(field.name, field.label));
        focusFormControl(form, field.name);
        setIsSubmitting(false);
        return;
      }

      if (field.type === "email" && value && !isEmailLike(value)) {
        setError("Проверьте формат email.");
        focusFormControl(form, field.name);
        setIsSubmitting(false);
        return;
      }

      if (field.type === "tel" && value && !isPhoneLike(value)) {
        setError("Укажите корректный телефон.");
        focusFormControl(form, field.name);
        setIsSubmitting(false);
        return;
      }
    }

    for (const checkbox of schema.checkboxes) {
      if (checkbox.required && !consentsPayload[checkbox.name]) {
        setError(requiredConsentMessage(checkbox.name));
        focusFormControl(form, checkbox.name);
        setIsSubmitting(false);
        return;
      }
    }

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
          : (schema.errorMessage ?? "Не удалось отправить форму. Повторите попытку чуть позже."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`rounded-[1rem] border p-6 ${
        theme === "dark"
          ? "border-black/10 bg-white text-black"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-semibold">{schema.title}</h3>
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
            <span className="min-w-0 flex-1">
              {checkbox.label}
              {checkbox.links?.length ? (
                <>
                  {" "}
                  {checkbox.links.map((link, index) => (
                    <span key={link.href}>
                      {index > 0 ? " и " : ""}
                      <Link
                        href={link.href}
                        className="underline decoration-black/20 underline-offset-4 transition hover:text-black"
                      >
                        {link.label}
                      </Link>
                    </span>
                  ))}
                  .
                </>
              ) : null}
            </span>
          </label>
        ))}
      </div>

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
        {isSubmitting ? "Отправляем…" : schema.submitLabel}
      </button>
      {schema.disclaimer ? (
        <p className={`mt-4 text-sm leading-6 ${theme === "dark" ? "text-black/50" : "text-black/50"}`}>
          {schema.disclaimer}
        </p>
      ) : null}
    </form>
  );
}

type AssortmentCard = {
  id: "cartridges" | "device-kit";
  title: string;
  label: string;
  eyebrow: string;
};

const assortmentCards: AssortmentCard[] = [
  {
    id: "cartridges",
    title: "Картриджи STILNO CLICK ONE",
    label: "Картриджи",
    eyebrow: "сменные вкусы",
  },
  {
    id: "device-kit",
    title: "Устройство в сборе STILNO CLICK ONE",
    label: "Устройство в сборе",
    eyebrow: "готовый комплект",
  },
];

type CatalogVariant = ProductVariant & {
  description?: string;
  flavorDescription?: string;
};

function getVariantGroups(variants: ProductVariant[]) {
  const groupMap = new Map<string, ProductVariant[]>();

  variants.forEach((variant) => {
    const group = variant.group || "Линейка";
    const existing = groupMap.get(group) ?? [];
    existing.push(variant);
    groupMap.set(group, existing);
  });

  return Array.from(groupMap.entries()).map(([group, items]) => ({ group, items }));
}

function getVariantDescription(variant: ProductVariant) {
  const catalogVariant = variant as CatalogVariant;
  const description = catalogVariant.description?.trim() || catalogVariant.flavorDescription?.trim();

  return description || `Профиль вкуса: ${variant.flavor}.`;
}

type FlavorIconKind = "berry" | "citrus" | "tropical" | "mint" | "drink" | "cream" | "ice" | "sour";

function formatFlavorTitle(title: string) {
  return title
    .replace(/\s*\(Пинкман\)/i, "")
    .replace(/\s+Айс$/i, " Лёд")
    .trim();
}

function getFlavorIconKind(variant: ProductVariant): FlavorIconKind {
  const title = variant.title.toLowerCase();
  const group = (variant.group || "").toLowerCase();

  if (group.includes("айс")) return "ice";
  if (title.includes("мят") || title.includes("тархун")) return "mint";
  if (title.includes("чай") || title.includes("лимонад") || title.includes("энергетик")) return "drink";
  if (title.includes("слив") || title.includes("крем") || title.includes("молок")) return "cream";
  if (
    title.includes("ананас") ||
    title.includes("манго") ||
    title.includes("персик") ||
    title.includes("кокос") ||
    title.includes("драгон")
  ) {
    return "tropical";
  }
  if (
    title.includes("грейп") ||
    title.includes("лимон") ||
    title.includes("лайм") ||
    title.includes("яблок") ||
    title.includes("апельс")
  ) {
    return group.includes("кисл") ? "sour" : "citrus";
  }

  return "berry";
}

function FlavorGlyph({ kind, className = "h-7 w-7" }: { kind: FlavorIconKind; className?: string }) {
  if (kind === "mint") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className={className} fill="none">
        <path d="M16 27V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 13C9.5 11.5 6.5 7 6 4.5c5.5.2 10 3.1 10 8.5Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 16c6.7-1.5 9.5-6.1 10-8.5-5.4.2-10 3-10 8.5Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 22c-4.4-.9-7-3.7-8-6.5 4.2.2 7.7 2.3 8 6.5Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (kind === "citrus" || kind === "sour") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className={className} fill="none">
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 6v20M8.5 16h15M10.5 9.5l11 13M21.5 9.5l-11 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        {kind === "sour" ? (
          <>
            <circle cx="6.5" cy="8" r="1.6" fill="currentColor" />
            <circle cx="25.5" cy="24" r="1.6" fill="currentColor" />
          </>
        ) : null}
      </svg>
    );
  }

  if (kind === "tropical") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className={className} fill="none">
        <path d="M16 6c-3.4 4.1-6 8-6 12.5A6 6 0 0 0 16 25a6 6 0 0 0 6-6.5C22 14 19.4 10.1 16 6Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 4v5M11 9l10 10M21 9 11 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11 7c1.7-2 3.4-2.9 5-2.9 1.8 0 3.4 1 5 2.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "drink") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className={className} fill="none">
        <path d="M8 12h16l-1.7 14H9.7L8 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11 8h10M14 4h4M12 17h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M20 8 24 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "cream") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className={className} fill="none">
        <path d="M9 24h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 22c.5-4.8 4-5.5 6-6.9 2-1.3 2.2-3 1.2-5.1 3.7 1.4 6 4.6 6 8 0 3.1-2.2 5-6.2 5H10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10.5 17.5c2.6 1.4 5.5 1.7 9 .9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "ice") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className={className} fill="none">
        <path d="M16 4v24M6 10l20 12M26 10 6 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="m12 6 4 4 4-4M12 26l4-4 4 4M5 15l5-1.5L8.8 8.5M27 17l-5 1.5 1.2 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={className} fill="none">
      <circle cx="12" cy="18" r="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="19" cy="16" r="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="23" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M17 11c.4-3 2.3-5 5-6M18 11c-2.4-1.7-4.8-2-7-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CatalogProductGlyph({
  mode,
  className = "h-24 w-14",
}: {
  mode: AssortmentCard["id"];
  className?: string;
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 74 150" className={`${className} text-current`} fill="none">
      <path d="M29 23h16v10H29z" fill="#111" stroke="#6f6f6f" strokeWidth="1" />
      <path d="M24 4h26l2 20H22L24 4Z" fill="#090909" stroke="#6a6a6a" strokeWidth="1.1" />
      <rect x="19" y="28" width="36" height="114" rx="13" fill="#050505" stroke="#777" strokeWidth="1.2" />
      <path d="M23 35c9 4 19 4 28 0" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="2" />
      <path d="M37 58v46" stroke="#ffffff" strokeOpacity="0.42" strokeWidth="2" strokeLinecap="round" />
      <circle cx="37" cy="50" r="4.5" stroke="#ffffff" strokeOpacity="0.58" strokeWidth="1.7" />
      <circle cx="37" cy="122" r="2.7" fill="#ffffff" fillOpacity="0.75" />
      <text
        x="30"
        y="96"
        fill="#ffffff"
        fillOpacity="0.8"
        fontFamily="Arial, sans-serif"
        fontSize="9"
        fontWeight="700"
        letterSpacing="1.4"
        transform="rotate(-90 30 96)"
      >
        STILNO
      </text>
      {mode === "device-kit" ? <path d="M26 36h22" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" /> : null}
    </svg>
  );
}

function getFlavorScenePalette(variant: ProductVariant) {
  const kind = getFlavorIconKind(variant);

  if (kind === "mint") return ["#d6d6d6", "#202020", "#ffffff"];
  if (kind === "drink") return ["#c4c4c4", "#1d1d1d", "#f5f5f5"];
  if (kind === "cream") return ["#e4e4e4", "#292929", "#ffffff"];
  if (kind === "ice") return ["#f3f3f3", "#373737", "#ffffff"];
  if (kind === "tropical") return ["#d0d0d0", "#232323", "#ffffff"];
  if (kind === "citrus" || kind === "sour") return ["#dddddd", "#252525", "#ffffff"];

  return ["#c9c9c9", "#1f1f1f", "#ffffff"];
}

function FlavorScene({ variant }: { variant: ProductVariant }) {
  const [primary, deep, shine] = getFlavorScenePalette(variant);
  const isIce = (variant.group || "").toLowerCase().includes("айс");
  const title = variant.title.toLowerCase();
  const isSlice = /грейп|лимон|лайм|апельс|яблок|кокос|ананас|манго|персик/.test(title);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] overflow-hidden rounded-r-[0.42rem] opacity-95 sm:block"
      style={
        {
          "--scene-primary": primary,
          "--scene-deep": deep,
          "--scene-shine": shine,
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0)_0%,rgba(8,8,8,0.68)_42%,rgba(8,8,8,0.12)_100%)]" />
      <span className="absolute -right-8 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_32%,var(--scene-shine),var(--scene-primary)_36%,var(--scene-deep)_66%,rgba(0,0,0,0)_70%)] opacity-70 blur-[0.5px]" />
      <span className="absolute right-24 top-4 h-10 w-10 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,var(--scene-primary)_38%,var(--scene-deep)_72%)] opacity-48" />
      <span className="absolute bottom-4 right-14 h-14 w-14 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,var(--scene-primary)_34%,var(--scene-deep)_72%)] opacity-42" />
      <span className="absolute right-3 top-2 h-px w-48 rotate-[-18deg] bg-white/14" />
      <span className="absolute bottom-2 right-8 h-px w-40 rotate-[17deg] bg-white/10" />
      {isSlice ? (
        <span className="absolute right-10 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full border border-white/28 shadow-[inset_0_0_0_10px_rgba(255,255,255,0.08)]" />
      ) : null}
      {isIce ? (
        <>
          <span className="absolute right-5 top-6 h-px w-28 rotate-45 bg-white/26" />
          <span className="absolute right-12 bottom-7 h-px w-32 -rotate-45 bg-white/18" />
        </>
      ) : null}
    </div>
  );
}

function getCatalogGroupBanner(group: string) {
  const normalizedGroup = group.toLowerCase();

  if (normalizedGroup.includes("айс")) {
    return {
      title: "X-Ice Pod",
      label: "Регулируемый холодок",
      icon: "ice" as FlavorIconKind,
      accent:
        "bg-[radial-gradient(circle_at_80%_45%,rgba(255,255,255,0.28),transparent_24%),linear-gradient(90deg,transparent,rgba(255,255,255,0.08))]",
    };
  }

  if (normalizedGroup.includes("кисл")) {
    return {
      title: "Кислые",
      label: "Яркий кислый профиль",
      icon: "sour" as FlavorIconKind,
      accent:
        "bg-[radial-gradient(circle_at_80%_45%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(90deg,transparent,rgba(255,255,255,0.06))]",
    };
  }

  return {
    title: "Наборы",
    label: "Основная линейка",
    icon: "berry" as FlavorIconKind,
    accent:
      "bg-[radial-gradient(circle_at_80%_45%,rgba(255,255,255,0.16),transparent_24%),linear-gradient(90deg,transparent,rgba(255,255,255,0.05))]",
  };
}

function CatalogGroupBanner({ group }: { group: string }) {
  const banner = getCatalogGroupBanner(group);

  return (
    <div className="relative overflow-hidden rounded-[0.42rem] border border-white/18 bg-[#0e0e0f] px-6 py-4 text-white sm:col-span-2">
      <div className={classNames("absolute inset-y-0 right-0 w-1/2", banner.accent)} />
      <div className="relative grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <p className="text-3xl font-semibold leading-none tracking-normal sm:text-4xl">{banner.title}</p>
        <div className="flex items-center gap-3 text-sm leading-5 text-white/74">
          <span className="grid h-9 w-9 place-items-center rounded-[0.28rem] border border-white/54">
            <FlavorGlyph kind={banner.icon} className="h-5 w-5" />
          </span>
          <span>{banner.label}</span>
        </div>
      </div>
    </div>
  );
}

export function CatalogAssortmentCards({ product }: { product: Product }) {
  const variants = product.variants;
  const [activeCardId, setActiveCardId] = useState<AssortmentCard["id"]>("cartridges");
  const groupedVariants = useMemo(() => getVariantGroups(variants), [variants]);
  const activeCard = assortmentCards.find((card) => card.id === activeCardId) ?? assortmentCards[0];
  const visibleVariantCount = groupedVariants.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div id="catalog-products" className="mx-auto grid w-full max-w-[76rem] gap-6 pb-12 text-white sm:pb-16">
      <div className="grid gap-4 pt-2 sm:pt-4">
        <div className="grid gap-2">
          <h2 className="text-4xl font-semibold leading-[0.94] tracking-normal text-white sm:text-6xl">
            Витрина вкусов STILNO
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-white/58 sm:text-base">
            Премиальные вкусы. Чистые ингредиенты. Максимальное удовольствие.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
          <div className="flex flex-wrap gap-2">
            {assortmentCards.map((card) => {
              const isActive = activeCard.id === card.id;

              return (
                <button
                  key={card.id}
                  type="button"
                  data-testid={`catalog-card-${card.id}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveCardId(card.id)}
                  className={classNames(
                    "min-h-10 rounded-full border px-5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                    isActive
                      ? "border-white/70 bg-white/12 text-white"
                      : "border-white/10 bg-black text-white/54 hover:border-white/34 hover:text-white",
                  )}
                >
                  {card.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/38">
            {visibleVariantCount} из {variants.length} вкусов
          </p>
        </div>
      </div>

      <div className="grid gap-2 xl:grid-cols-2">
        {groupedVariants.map(({ group, items }) => (
          <section key={group} aria-labelledby={`catalog-group-${group}`} className="contents">
            <h3 id={`catalog-group-${group}`} className="sr-only">
              {group}
            </h3>
            <CatalogGroupBanner group={group} />
            {items.map((variant) => {
              const description = getVariantDescription(variant);

              return (
                <article
                  key={variant.id}
                  data-testid={`catalog-flavor-card-${variant.id}`}
                  className="group relative min-h-[6.6rem] overflow-hidden rounded-[0.42rem] border border-white/14 bg-[#0a0a0b] text-white transition duration-200 hover:border-white/34 hover:bg-[#111113] sm:min-h-[6.2rem]"
                >
                  <FlavorScene variant={variant} />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.96)_0%,rgba(10,10,10,0.88)_43%,rgba(10,10,10,0.28)_100%)]" />
                  <div className="relative grid min-h-[6.6rem] grid-cols-[5rem_minmax(0,1fr)] items-center gap-3 px-4 py-3 sm:min-h-[6.2rem] sm:grid-cols-[6.6rem_minmax(0,1fr)] sm:gap-4 sm:px-5 sm:py-2">
                    <div className="flex h-full items-center justify-center">
                      <CatalogProductGlyph mode={activeCard.id} className="h-24 w-12 sm:h-24 sm:w-14" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="max-w-[16rem] text-2xl font-medium leading-[0.98] tracking-normal text-white sm:text-[1.72rem]">
                        {formatFlavorTitle(variant.title)}
                      </h4>
                      <span className="sr-only">{description}</span>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex min-h-5 items-center rounded-[0.16rem] border border-white/60 px-2 text-[0.66rem] font-semibold uppercase leading-none tracking-[0.08em] text-white">
                          Новое
                        </span>
                        <span className="text-xs leading-5 text-white/42 sm:hidden">{description}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ))}
      </div>

      <details data-testid="catalog-model-specs" className="rounded-[0.45rem] border border-white/12 bg-white/[0.04] p-5 text-white">
        <summary className="cursor-pointer text-sm font-semibold uppercase tracking-[0.14em] text-white/72">
          Характеристики модели
        </summary>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {product.specs.map((spec) => (
            <div key={`${spec.label}-${spec.value}`} className="border-t border-white/10 pt-3">
              <dt className="text-xs font-semibold uppercase text-white/36">{spec.label}</dt>
              <dd className="mt-1 text-sm leading-6 text-white/80">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </details>
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
        body: "Проверьте защитную наклейку или QR-код на упаковке STILNO и повторите ввод.",
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
        : "border-black/10 bg-white text-black";

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
