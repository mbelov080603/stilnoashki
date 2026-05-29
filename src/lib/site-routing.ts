import { articles, cities, legalPages, vacancies, stores } from "@/lib/site-content";
import { siteOrigin } from "@/lib/site-config";
import type { LegalPage, ResolvedPage, Store, Vacancy } from "@/lib/site-types";

export const cityMap = new Map(cities.map((city) => [city.id, city]));

export const storesByCityId = new Map<string, Store[]>();
for (const store of stores) {
  const bucket = storesByCityId.get(store.cityId) ?? [];
  bucket.push(store);
  storesByCityId.set(store.cityId, bucket);
}

export function getCityStoreCount(cityId: string) {
  return storesByCityId.get(cityId)?.length ?? 0;
}

export function getStorePath(store: Store) {
  const city = cityMap.get(store.cityId);
  return city ? `/stores/${city.slug}/${store.slug}` : "/stores";
}

export function getVacancyPath(vacancy: Vacancy) {
  return `/careers/${vacancy.slug}`;
}

export function getArticlePath(article: { slug: string }) {
  return `/articles/${article.slug}`;
}

export function getLegalPath(legalPage: LegalPage) {
  return `/legal/${legalPage.slug}`;
}

export function getBreadcrumbs(pathname: string[], title: string) {
  const parts = pathname.filter(Boolean);
  if (parts.length === 0) {
    return [];
  }

  const labelMap = new Map<string, string>([
    ["stores", "Каталог"],
    ["map", "Карта магазинов"],
    ["about", "О бренде"],
    ["gallery", "Галерея"],
    ["quality", "Качество"],
    ["partners", "Партнёрам"],
    ["geography", "География партнёров"],
    ["request", "Заявка"],
    ["media-kit", "B2B-пакет"],
    ["verify", "Инструкция"],
    ["support", "Поддержка"],
    ["responsible", "Ответственное потребление"],
    ["franchise", "Франчайзинг"],
    ["careers", "Вакансии"],
    ["contacts", "Контакты"],
    ["articles", "Материалы"],
    ["faq", "Вопросы и ответы"],
    ["thank-you", "Спасибо"],
    ["legal", "Правовая информация"],
  ]);

  return parts.map((segment, index) => ({
    label: index === parts.length - 1 ? title : labelMap.get(segment) ?? title,
    href: `/${parts.slice(0, index + 1).join("/")}`,
  }));
}

export function resolvePage(slug: string[]): ResolvedPage | null {
  if (slug.length === 0) {
    return null;
  }

  const [section, second, third] = slug;

  if (section === "stores") {
    if (!second) {
      return {
        kind: "stores-index",
        title: "Каталог STILNO",
        description:
          "Каталог STILNO с модельной информацией, характеристиками, вкусами, предупреждениями и розничным маршрутом без дистанционной продажи.",
        pathname: slug,
        stores,
      };
    }

    if (second === "map") {
      if (third) {
        return null;
      }

      return {
        kind: "stores-map",
        title: "Карта магазинов STILNO",
        description:
          "Интерактивная карта магазинов и партнёрских точек STILNO с центральным офисом в Москве.",
        pathname: slug,
        stores,
      };
    }

    const city = cities.find((item) => item.slug === second);
    if (!city) {
      return null;
    }

    const cityStores = storesByCityId.get(city.id) ?? [];
    if (!third) {
      return {
        kind: "city",
        title: `${city.name} — STILNO`,
        description: city.spotlight,
        pathname: slug,
        city,
        stores: cityStores,
      };
    }

    const store = cityStores.find((item) => item.slug === third);
    if (!store) {
      return null;
    }

    return {
      kind: "store",
      title: `${store.title} — ${city.name}`,
      description: `${store.address}. ${store.inventoryStatus ?? store.hours}.`,
      pathname: slug,
      city,
      store,
    };
  }

  if (section === "about") {
    if (second) {
      return null;
    }

    return {
      kind: "about",
      title: "О STILNO",
      description:
        "STILNO — премиальный бренд электронных сигарет для взрослой аудитории 18+: сдержанный дизайн, фабричное производство и контроль качества.",
      pathname: slug,
    };
  }

  if (section === "gallery") {
    return {
      kind: "gallery",
      title: "Визуальный код STILNO",
      description: "Визуальная система STILNO, предупреждения 18+ и retail-среда без дублирования каталога.",
      pathname: slug,
    };
  }

  if (section === "quality") {
    if (second) {
      return null;
    }

    return {
      kind: "quality",
      title: "Качество STILNO",
      description:
        "Фабричное производство STILNO, контроль комплектующих, сборки, упаковки, маркировки и готовой партии для взрослой аудитории 18+.",
      pathname: slug,
    };
  }

  if (section === "partners") {
    if (second === "media-kit") {
      return {
        kind: "media-kit",
        title: "B2B-пакет STILNO",
        description:
          "B2B-материалы STILNO для опта и действующих розничных точек: презентация, продуктовая база и правила 18+.",
        pathname: slug,
      };
    }

    if (second === "geography") {
      return {
        kind: "partners-geography",
        title: "География партнёров",
        description:
          "Интерактивная карта географии партнёров STILNO: регионы России, розовая подсветка и опубликованный контакт в Москве.",
        pathname: slug,
      };
    }

    if (second) {
      return null;
    }

    return null;
  }

  if (section === "request") {
    if (second) {
      return null;
    }

    return {
      kind: "request",
      title: "Оставить заявку STILNO",
      description:
        "Отдельная форма заявки STILNO для партнёрства, дистрибуции, розничной точки или другого обращения без дистанционной продажи продукции.",
      pathname: slug,
    };
  }

  if (section === "verify") {
    return {
      kind: "verify",
      title: "Инструкция по замене картриджа",
      description:
        "Видеоинструкция STILNO по подготовке картриджа и сбросу показаний остатка жидкости.",
      pathname: slug,
    };
  }

  if (section === "support") {
    return {
      kind: "support",
      title: "Поддержка STILNO",
      description:
        "Отдельный маршрут поддержки STILNO по оригинальности, качеству, гарантийным обращениям, утилизации и правилам категории 18+.",
      pathname: slug,
    };
  }

  if (section === "responsible") {
    return {
      kind: "responsible",
      title: "Ответственное потребление",
      description:
        "Правовая информация STILNO: 18+, предупреждения, условия хранения и ответственная коммуникация для никотиновой категории.",
      pathname: slug,
    };
  }

  if (section === "franchise") {
    return {
      kind: "franchise",
      title: "Запуск STILNO в регионе",
      description:
        "Запуск под брендом STILNO в регионе: город, команда, бренд-материалы, legal 18+ и отдельная заявка.",
      pathname: slug,
    };
  }

  if (section === "careers") {
    if (!second) {
      return {
        kind: "careers-index",
        title: "Вакансии STILNO",
        description:
          "Открытые роли STILNO для B2B, trade-маркетинга, розничных запусков и брендовых функций.",
        pathname: slug,
      };
    }

    const vacancy = vacancies.find((item) => item.slug === second);
    if (!vacancy) {
      return null;
    }

    return {
      kind: "vacancy",
      title: vacancy.title,
      description: vacancy.description[0],
      pathname: slug,
      vacancy,
      city: cityMap.get(vacancy.cityId),
    };
  }

  if (section === "contacts") {
    return {
      kind: "contacts",
      title: "Контакты STILNO",
      description:
        "Маршрутизация обращений STILNO: розничный запрос, B2B-запрос, запуск под брендом, карьера, поддержка и юридические данные.",
      pathname: slug,
    };
  }

  if (section === "articles") {
    if (!second) {
      return {
        kind: "articles-index",
        title: "Материалы STILNO",
        description: "Материалы STILNO по продукту, B2B-запросам, запуску под брендом, рознице, поддержке и legal.",
        pathname: slug,
      };
    }

    const article = articles.find((item) => item.slug === second);
    if (!article) {
      return null;
    }

    return {
      kind: "article",
      title: article.title,
      description: article.excerpt,
      pathname: slug,
      article,
    };
  }

  if (section === "faq") {
    return {
      kind: "faq",
      title: "Вопросы и ответы STILNO",
      description: "Частые вопросы о продукте, B2B-запросах, запуске под брендом, рознице, поддержке и правовой информации.",
      pathname: slug,
    };
  }

  if (section === "thank-you" && second) {
    return {
      kind: "thank-you",
      title: "Спасибо",
      description: "Подтверждение отправки формы STILNO.",
      pathname: slug,
      thankYouType: second,
    };
  }

  if (section === "legal" && second) {
    const legalPage = legalPages.find((item) => item.slug === second);
    if (!legalPage) {
      return null;
    }

    return {
      kind: "legal",
      title: legalPage.title,
      description: legalPage.summary,
      pathname: slug,
      legalPage,
    };
  }

  return null;
}

export function getAllStaticPaths() {
  return [
    ["stores"],
    ["stores", "map"],
    ...cities.flatMap((city) => {
      const cityStores = storesByCityId.get(city.id) ?? [];
      return [["stores", city.slug], ...cityStores.map((store) => ["stores", city.slug, store.slug])];
    }),
    ["about"],
    ["gallery"],
    ["quality"],
    ["partners", "media-kit"],
    ["partners", "geography"],
    ["request"],
    ["verify"],
    ["support"],
    ["responsible"],
    ["franchise"],
    ["careers"],
    ...vacancies.map((vacancy) => ["careers", vacancy.slug]),
    ["contacts"],
    ["articles"],
    ...articles.map((article) => ["articles", article.slug]),
    ["faq"],
    ["thank-you", "retail"],
    ["thank-you", "franchise"],
    ["thank-you", "partner"],
    ["thank-you", "career"],
    ...legalPages.map((page) => ["legal", page.slug]),
  ];
}

export function getCanonicalUrl(pathname: string[]) {
  return pathname.length === 0 ? siteOrigin : `${siteOrigin}/${pathname.join("/")}`;
}
