export const siteOrigin = "https://stilno.example";

export const documentLinks = {
  franchisePresentation:
    "https://raw.githubusercontent.com/mbelov080603/stilnoashki/90449c9c256513fbf7e85f536914cd618f566285/public/stilno/docs/franchise-presentation.pdf",
  deviceAndPackage:
    "https://raw.githubusercontent.com/mbelov080603/stilnoashki/90449c9c256513fbf7e85f536914cd618f566285/public/stilno/docs/device-and-package.pdf",
};

export type NavItem = {
  label: string;
  href: string;
};

export type CtaLink = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

export type City = {
  id: string;
  name: string;
  slug: string;
  region: string;
  coordinates: [number, number];
  networkX: string;
  networkY: string;
  spotlight: string;
  featured: boolean;
};

export type Store = {
  id: string;
  cityId: string;
  slug: string;
  title: string;
  address: string;
  coordinates: [number, number];
  phone: string;
  hours: string;
  services: string[];
  categories: string[];
  featured: boolean;
};

export type ProductCategory = {
  id: string;
  slug: string;
  title: string;
  type: "nicotine" | "nicotine-free" | "future";
  shortDescription: string;
  longDescription: string;
  status: string;
  disclaimer: string;
  heroTitle: string;
  heroBody: string;
  heroImage?: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  flavor: string;
  nicotineStrength: string;
  image?: string;
  packaging?: string;
  status: string;
};

export type Product = {
  id: string;
  slug: string;
  categoryId: string;
  title: string;
  nicotineType: "nicotine" | "nicotine-free" | "future";
  shortDescription: string;
  longDescription: string;
  availability: string;
  highlight: string;
  specs: Array<{ label: string; value: string }>;
  facts: string[];
  warnings: string[];
  images: string[];
  packagingImages: string[];
  variants: ProductVariant[];
  featured: boolean;
};

export type Partner = {
  id: string;
  name: string;
  type: "retail" | "distribution" | "launch" | "real-estate";
  note: string;
  region: string;
};

export type Vacancy = {
  id: string;
  slug: string;
  title: string;
  cityId: string;
  department: string;
  employmentType: string;
  salaryText: string;
  description: string[];
  requirements: string[];
  conditions: string[];
};

export type GalleryItem = {
  id: string;
  title: string;
  type: "device" | "packaging" | "detail" | "editorial";
  media?: string;
  alt: string;
  caption: string;
};

export type FAQItem = {
  id: string;
  scope:
    | "general"
    | "stores"
    | "products"
    | "franchise"
    | "careers"
    | "responsible";
  question: string;
  answer: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  author: string;
  body: string[];
};

export type LegalPage = {
  slug: string;
  title: string;
  effectiveDate: string;
  version: string;
  summary: string;
  body: string[];
};

export type ResolvedPage = {
  kind:
    | "stores-index"
    | "city"
    | "store"
    | "about"
    | "gallery"
    | "products-index"
    | "product-category"
    | "product"
    | "partners"
    | "responsible"
    | "franchise"
    | "careers-index"
    | "vacancy"
    | "contacts"
    | "articles-index"
    | "article"
    | "faq"
    | "thank-you"
    | "legal";
  title: string;
  description: string;
  pathname: string[];
  city?: City;
  stores?: Store[];
  store?: Store;
  category?: ProductCategory;
  products?: Product[];
  product?: Product;
  vacancy?: Vacancy;
  article?: Article;
  legalPage?: LegalPage;
  thankYouType?: string;
};

export const siteSettings = {
  brandName: "STILNO",
  title: "STILNO v2",
  description:
    "Премиальная digital-система бренда электронных устройств с заделом под сеть магазинов, продуктовые страницы, франчайзинг и B2B.",
  primaryNav: [
    { label: "Магазины", href: "/stores" },
    { label: "О бренде", href: "/about" },
    { label: "Галерея", href: "/gallery" },
    { label: "Продукция", href: "/products" },
    { label: "Партнёры", href: "/partners" },
    { label: "Ответственное потребление", href: "/responsible" },
    { label: "Франчайзинг", href: "/franchise" },
    { label: "Вакансии", href: "/careers" },
    { label: "Контакты", href: "/contacts" },
  ] satisfies NavItem[],
  utilityCta: {
    label: "Получить презентацию",
    href: documentLinks.franchisePresentation,
    variant: "secondary",
  } satisfies CtaLink,
  primaryCta: {
    label: "Стать партнёром",
    href: "/franchise",
    variant: "primary",
  } satisfies CtaLink,
  footerLinks: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Cookies", href: "/legal/cookies" },
    { label: "Consent", href: "/legal/consent" },
    { label: "FAQ", href: "/faq" },
    { label: "News", href: "/articles" },
  ] satisfies NavItem[],
  contactLines: [
    { label: "Email", value: "hello@stilno.example", href: "mailto:hello@stilno.example" },
    { label: "Телефон", value: "+7 (800) 555-18-18", href: "tel:+78005551818" },
    { label: "B2B", value: "b2b@stilno.example", href: "mailto:b2b@stilno.example" },
  ],
  socialLinks: [
    { label: "Telegram", href: "/contacts" },
    { label: "VK", href: "/contacts" },
    { label: "Email", href: "mailto:hello@stilno.example" },
  ],
  ageGateVersion: "v2.0",
  consentVersion: "v2.0",
  mapProvider: "Yandex Maps / 2GIS ready",
  demoNote:
    "Сеть, карта и часть внутренних страниц работают на demo-ready структуре данных и рассчитаны на прямую замену контента на CMS.",
};

export const cities: City[] = [
  {
    id: "moscow",
    name: "Москва",
    slug: "moscow",
    region: "Центральный федеральный округ",
    coordinates: [55.7558, 37.6173],
    networkX: "24%",
    networkY: "46%",
    spotlight: "Федеральный флагман и центр партнёрских запусков.",
    featured: true,
  },
  {
    id: "saint-petersburg",
    name: "Санкт-Петербург",
    slug: "saint-petersburg",
    region: "Северо-Западный федеральный округ",
    coordinates: [59.9343, 30.3351],
    networkX: "18%",
    networkY: "28%",
    spotlight: "Северо-западный узел с фокусом на premium retail.",
    featured: true,
  },
  {
    id: "kazan",
    name: "Казань",
    slug: "kazan",
    region: "Приволжский федеральный округ",
    coordinates: [55.7961, 49.1064],
    networkX: "37%",
    networkY: "43%",
    spotlight: "Пилотный город для мультиформатной розницы.",
    featured: true,
  },
  {
    id: "yekaterinburg",
    name: "Екатеринбург",
    slug: "yekaterinburg",
    region: "Уральский федеральный округ",
    coordinates: [56.8389, 60.6057],
    networkX: "48%",
    networkY: "40%",
    spotlight: "Опорная точка для дальнейшей региональной экспансии.",
    featured: false,
  },
  {
    id: "krasnodar",
    name: "Краснодар",
    slug: "krasnodar",
    region: "Южный федеральный округ",
    coordinates: [45.0355, 38.9753],
    networkX: "29%",
    networkY: "62%",
    spotlight: "Тёплый регион с сильным franchise demand.",
    featured: false,
  },
  {
    id: "novosibirsk",
    name: "Новосибирск",
    slug: "novosibirsk",
    region: "Сибирский федеральный округ",
    coordinates: [55.0084, 82.9357],
    networkX: "67%",
    networkY: "45%",
    spotlight: "Сибирский кластер для B2B и city rollout.",
    featured: false,
  },
];

export const stores: Store[] = [
  {
    id: "moscow-patriarch",
    cityId: "moscow",
    slug: "patriarch",
    title: "STILNO Patriarch",
    address: "Москва, Патриарший пер., 8",
    coordinates: [55.7648, 37.5921],
    phone: "+7 (800) 555-18-18",
    hours: "10:00 - 22:00",
    services: ["Retail", "Product advisory", "B2B pickup"],
    categories: ["Никотиновые устройства", "POD / аксессуары"],
    featured: true,
  },
  {
    id: "moscow-river",
    cityId: "moscow",
    slug: "river-terminal",
    title: "STILNO River Terminal",
    address: "Москва, Ленинградское ш., 51",
    coordinates: [55.8514, 37.4678],
    phone: "+7 (800) 555-18-18",
    hours: "11:00 - 21:00",
    services: ["Retail", "Partner meetings"],
    categories: ["Никотиновые устройства", "Безникотиновые решения"],
    featured: false,
  },
  {
    id: "spb-nevsky",
    cityId: "saint-petersburg",
    slug: "nevsky",
    title: "STILNO Nevsky",
    address: "Санкт-Петербург, Невский пр., 82",
    coordinates: [59.9322, 30.3556],
    phone: "+7 (812) 555-18-18",
    hours: "10:00 - 22:00",
    services: ["Retail", "Flagship service"],
    categories: ["Никотиновые устройства", "POD / аксессуары"],
    featured: true,
  },
  {
    id: "kazan-center",
    cityId: "kazan",
    slug: "baumana",
    title: "STILNO Bauman",
    address: "Казань, ул. Баумана, 54",
    coordinates: [55.7926, 49.1221],
    phone: "+7 (843) 555-18-18",
    hours: "10:00 - 21:00",
    services: ["Retail", "Franchise scouting"],
    categories: ["Никотиновые устройства", "Безникотиновые решения"],
    featured: true,
  },
  {
    id: "ekb-center",
    cityId: "yekaterinburg",
    slug: "city-center",
    title: "STILNO City Center",
    address: "Екатеринбург, ул. Малышева, 36",
    coordinates: [56.8352, 60.6122],
    phone: "+7 (343) 555-18-18",
    hours: "10:00 - 21:00",
    services: ["Retail", "B2B pickup"],
    categories: ["Никотиновые устройства"],
    featured: false,
  },
  {
    id: "krasnodar-park",
    cityId: "krasnodar",
    slug: "galereya",
    title: "STILNO Galereya",
    address: "Краснодар, ул. Володи Головатого, 313",
    coordinates: [45.0401, 38.9745],
    phone: "+7 (861) 555-18-18",
    hours: "10:00 - 22:00",
    services: ["Retail", "Launch support"],
    categories: ["Никотиновые устройства", "Future line"],
    featured: false,
  },
  {
    id: "nsk-riverside",
    cityId: "novosibirsk",
    slug: "riverside",
    title: "STILNO Riverside",
    address: "Новосибирск, Красный пр., 17",
    coordinates: [55.0289, 82.9204],
    phone: "+7 (383) 555-18-18",
    hours: "10:00 - 21:00",
    services: ["Retail", "Regional partnership desk"],
    categories: ["Никотиновые устройства", "Безникотиновые решения"],
    featured: false,
  },
];

export const productCategories: ProductCategory[] = [
  {
    id: "nicotine",
    slug: "nicotine",
    title: "Никотиновые устройства",
    type: "nicotine",
    shortDescription:
      "Основная product-линия STILNO с акцентом на модульность, строгую упаковку и предсказуемый пользовательский сценарий.",
    longDescription:
      "Раздел спроектирован как CMS-ready каталог для текущей nicotine-линейки: hero, list, product detail, variant selector и legal-safe warning layer.",
    status: "Active line",
    disclaimer:
      "18+. Никотин вызывает зависимость. Материал не является медицинской рекомендацией.",
    heroTitle: "Линейка, собранная как премиальная система.",
    heroBody:
      "Сайт не маскирует категорию: устройство, упаковка, предупреждения и фактические product facts собраны в одну строгую визуальную систему.",
    heroImage: "/stilno/products/ananas-mango.jpg",
  },
  {
    id: "nicotine-free",
    slug: "nicotine-free",
    title: "Безникотиновые решения",
    type: "nicotine-free",
    shortDescription:
      "Категория подготовлена как отдельный архитектурный слой с независимыми предупреждениями, контентом и SEO.",
    longDescription:
      "В текущей версии раздел служит шаблоном для будущей nicotine-free линейки и демонстрирует, как STILNO разделяет продуктовые ветки без визуального шума.",
    status: "Template ready",
    disclaimer:
      "Контент раздела работает как demo-ready шаблон до публикации финальной продуктовой линейки.",
    heroTitle: "Отдельная ветка, а не сноска в каталоге.",
    heroBody:
      "Безникотиновая линейка получает собственную архитектуру, собственный тон и отдельную legal-safe коммуникацию.",
  },
  {
    id: "future-line",
    slug: "future-line",
    title: "POD / аксессуары / future line",
    type: "future",
    shortDescription:
      "Резерв под аксессуары, дополняющие устройства, и будущие релизы без ощущения маркетплейса.",
    longDescription:
      "Категория держит место под расходные материалы, retail support kit и будущие product drops в рамках единой брендовой системы.",
    status: "Scalable placeholder",
    disclaimer:
      "Раздел заложен под рост и может быть наполнен через CMS без пересборки route architecture.",
    heroTitle: "Не шумный каталог, а расширяемая product-матрица.",
    heroBody:
      "Future line хранит логику акссесуаров, сервисных SKU и лимитированных запусков без потери премиального тона.",
  },
];

const nicotineVariants: ProductVariant[] = [
  {
    id: "ananas-mango",
    title: "Ананас Манго",
    flavor: "Ананас Манго",
    nicotineStrength: "2%",
    image: "/stilno/products/ananas-mango.jpg",
    packaging: "/stilno/products/ananas-mango.jpg",
    status: "Current visual asset",
  },
  {
    id: "barbaris",
    title: "Барбарис",
    flavor: "Барбарис",
    nicotineStrength: "2%",
    image: "/stilno/products/barbaris.jpg",
    packaging: "/stilno/products/barbaris.jpg",
    status: "Current visual asset",
  },
  {
    id: "vishnya-limon-persik",
    title: "Вишня Лимон Персик",
    flavor: "Вишня Лимон Персик",
    nicotineStrength: "2%",
    image: "/stilno/products/vishnya-limon-persik.jpg",
    packaging: "/stilno/products/vishnya-limon-persik.jpg",
    status: "Current visual asset",
  },
  {
    id: "zemlyanika-dragonfruit",
    title: "Земляника Драгонфрут",
    flavor: "Земляника Драгонфрут",
    nicotineStrength: "2%",
    image: "/stilno/products/zemlyanika-dragonfruit.jpg",
    packaging: "/stilno/products/zemlyanika-dragonfruit.jpg",
    status: "Current visual asset",
  },
  {
    id: "myata",
    title: "Мята",
    flavor: "Мята",
    nicotineStrength: "2%",
    image: "/stilno/products/myata.jpg",
    packaging: "/stilno/products/myata.jpg",
    status: "Current visual asset",
  },
  {
    id: "slivochnaya-klubnika-mango",
    title: "Сливочная Клубника Манго",
    flavor: "Сливочная Клубника Манго",
    nicotineStrength: "2%",
    image: "/stilno/products/slivochnaya-klubnika-mango.jpg",
    packaging: "/stilno/products/slivochnaya-klubnika-mango.jpg",
    status: "Current visual asset",
  },
  {
    id: "smorodina-malina-ezhevika",
    title: "Смородина Малина Ежевика",
    flavor: "Смородина Малина Ежевика",
    nicotineStrength: "2%",
    image: "/stilno/products/smorodina-malina-ezhevika.jpg",
    packaging: "/stilno/products/smorodina-malina-ezhevika.jpg",
    status: "Current visual asset",
  },
  {
    id: "fruktoviy-chay",
    title: "Фруктовый Чай",
    flavor: "Фруктовый Чай",
    nicotineStrength: "2%",
    image: "/stilno/products/fruktoviy-chay.jpg",
    packaging: "/stilno/products/fruktoviy-chay.jpg",
    status: "Current visual asset",
  },
  {
    id: "chernika-klyukva-vishnya",
    title: "Черника Клюква Вишня",
    flavor: "Черника Клюква Вишня",
    nicotineStrength: "2%",
    image: "/stilno/products/chernika-klyukva-vishnya.jpg",
    packaging: "/stilno/products/chernika-klyukva-vishnya.jpg",
    status: "Current visual asset",
  },
  {
    id: "yagodniy-energetik",
    title: "Ягодный Энергетик",
    flavor: "Ягодный Энергетик",
    nicotineStrength: "2%",
    image: "/stilno/products/yagodniy-energetik.jpg",
    packaging: "/stilno/products/yagodniy-energetik.jpg",
    status: "Current visual asset",
  },
];

export const products: Product[] = [
  {
    id: "pod-plus",
    slug: "stilno-pod-plus",
    categoryId: "nicotine",
    title: "STILNO POD+",
    nicotineType: "nicotine",
    shortDescription:
      "Многоразовое устройство + картридж с модульной flavor-системой и дисциплинированной упаковкой.",
    longDescription:
      "Главный текущий product template для сайта STILNO: устройство, вкус, legal-safe предупреждения, specs, gallery и future-ready variant selector в одной строгой подаче.",
    availability: "В сети и у партнёров",
    highlight: "Product-first flagship",
    specs: [
      { label: "Формат", value: "Устройство + картридж" },
      { label: "Объём", value: "10 мл" },
      { label: "Аккумулятор", value: "850 mAh" },
      { label: "Порт", value: "Type-C" },
      { label: "Ресурс", value: "До 15 000 затяжек" },
      { label: "Категория", value: "18+" },
    ],
    facts: [
      "Модульная подача вкусов через variant selector.",
      "Повторяемая упаковочная дисциплина без перегруза.",
      "Наглядное разделение product facts и предупреждений.",
    ],
    warnings: [
      "18+. Никотин вызывает зависимость.",
      "Хранить в недоступном для детей месте.",
      "Материал не содержит медицинских обещаний и не заменяет инструкцию.",
    ],
    images: nicotineVariants
      .slice(0, 4)
      .map((variant) => variant.image)
      .filter(Boolean) as string[],
    packagingImages: nicotineVariants
      .slice(4, 8)
      .map((variant) => variant.packaging)
      .filter(Boolean) as string[],
    variants: nicotineVariants,
    featured: true,
  },
  {
    id: "zero-architecture",
    slug: "stilno-zero-architecture",
    categoryId: "nicotine-free",
    title: "STILNO Zero Architecture",
    nicotineType: "nicotine-free",
    shortDescription:
      "Demo-ready product detail template для будущей nicotine-free линейки с отдельной legal-safe логикой.",
    longDescription:
      "Страница закладывает структуру под zero-line: отдельная терминология, независимые FAQ и своя матрица свойств без кальки с nicotine-раздела.",
    availability: "Готово к наполнению",
    highlight: "Template-ready category",
    specs: [
      { label: "Статус", value: "CMS-ready template" },
      { label: "Коммуникация", value: "Отдельная от nicotine-линейки" },
      { label: "SEO", value: "Собственный route и metadata layer" },
    ],
    facts: [
      "Категория не смешивается с nicotine-коммуникацией.",
      "Template готов к подключению нового контента без редизайна.",
    ],
    warnings: [
      "Текущий контент раздела демонстрационный.",
      "Финальные product facts и предупреждения подключаются из CMS.",
    ],
    images: [],
    packagingImages: [],
    variants: [
      {
        id: "zero-line-template",
        title: "Launch-ready template",
        flavor: "Category blueprint",
        nicotineStrength: "0%",
        status: "Awaiting final product assets",
      },
    ],
    featured: false,
  },
  {
    id: "core-accessories",
    slug: "stilno-core-accessories",
    categoryId: "future-line",
    title: "STILNO Core Accessories",
    nicotineType: "future",
    shortDescription:
      "Платформа для future line: расходные элементы, accessory program и service SKUs.",
    longDescription:
      "Раздел нужен для роста: ограниченные дропы, retail-support позиции и все SKU, которые не должны превращать STILNO в маркетплейс.",
    availability: "Scalable placeholder",
    highlight: "Future line",
    specs: [
      { label: "Роль", value: "Service + accessory layer" },
      { label: "Вывод", value: "Через CMS и feature flags" },
      { label: "UX", value: "Без checkout-шума на первом этапе" },
    ],
    facts: [
      "Категория обслуживает future growth without visual noise.",
      "Поддерживает лимитированные релизы и расширение retail-сценария.",
    ],
    warnings: ["Часть позиций будет раскрыта после продуктового запуска."],
    images: [],
    packagingImages: [],
    variants: [
      {
        id: "service-sku-template",
        title: "Service SKU blueprint",
        flavor: "Future line",
        nicotineStrength: "N/A",
        status: "Awaiting commercial scope",
      },
    ],
    featured: false,
  },
];

export const partners: Partner[] = [
  {
    id: "retail-north",
    name: "Retail North",
    type: "retail",
    note: "Demo-ready mark for federal retail onboarding.",
    region: "Северо-Запад",
  },
  {
    id: "capital-distribution",
    name: "Capital Distribution",
    type: "distribution",
    note: "Placeholder for regional distribution integration.",
    region: "Москва",
  },
  {
    id: "launch-ops",
    name: "Launch Ops",
    type: "launch",
    note: "Placeholder for opening support partners.",
    region: "Поволжье",
  },
  {
    id: "urban-real-estate",
    name: "Urban Real Estate",
    type: "real-estate",
    note: "Placeholder for location sourcing pipeline.",
    region: "Юг",
  },
];

export const vacancies: Vacancy[] = [
  {
    id: "regional-development",
    slug: "regional-development-manager",
    title: "Regional Development Manager",
    cityId: "moscow",
    department: "Expansion",
    employmentType: "Full time",
    salaryText: "По итогам интервью",
    description: [
      "Роль отвечает за поиск локаций, переговоры с партнёрами и подготовку запусков в новых городах.",
      "Позиция встроена в федеральный сценарий роста и соединяет product, retail и franchise-процессы.",
    ],
    requirements: [
      "Опыт в retail development или франчайзинге.",
      "Сильная переговорная дисциплина и системность.",
      "Готовность работать с demo-ready и production-ready данными одновременно.",
    ],
    conditions: [
      "Гибридный формат.",
      "Команда, ориентированная на продукт и качество исполнения.",
      "Возможность собирать федеральную сеть с нуля.",
    ],
  },
  {
    id: "brand-ops",
    slug: "brand-operations-lead",
    title: "Brand Operations Lead",
    cityId: "saint-petersburg",
    department: "Brand",
    employmentType: "Full time",
    salaryText: "По итогам интервью",
    description: [
      "Позиция ведёт брендовые стандарты, retail-гайдлайны и согласование materials для сети и партнёров.",
    ],
    requirements: [
      "Опыт в бренд- или retail-операциях.",
      "Чувство визуальной дисциплины и аккуратность в системах.",
    ],
    conditions: [
      "Работа с дизайном, продактом и партнёрским блоком.",
      "Прямое влияние на brand system STILNO.",
    ],
  },
  {
    id: "retail-curator",
    slug: "retail-curator-kazan",
    title: "Retail Curator",
    cityId: "kazan",
    department: "Retail",
    employmentType: "Full time",
    salaryText: "Фикс + KPI",
    description: [
      "Локальная роль для операционного сопровождения точки, обучения команды и поддержки сервиса.",
    ],
    requirements: [
      "Опыт в premium retail.",
      "Спокойный тон коммуникации и ответственность за детали.",
    ],
    conditions: [
      "Работа в городе запуска.",
      "Плотное взаимодействие с brand и product командами.",
    ],
  },
];

export const galleryItems: GalleryItem[] = nicotineVariants.map((variant, index) => ({
  id: variant.id,
  title: variant.title,
  type: index % 3 === 0 ? "device" : index % 3 === 1 ? "packaging" : "detail",
  media: variant.image,
  alt: `STILNO ${variant.title}`,
  caption:
    "Один и тот же объект читается как серия благодаря дисциплине формы, логотипа и упаковки.",
}));

export const faqItems: FAQItem[] = [
  {
    id: "faq-products-1",
    scope: "products",
    question: "Почему каталог разделён на nicotine и nicotine-free?",
    answer:
      "Так STILNO избегает смешанной коммуникации и готовит отдельные сценарии для product facts, предупреждений и SEO-структуры.",
  },
  {
    id: "faq-franchise-1",
    scope: "franchise",
    question: "Есть ли на сайте финансовые обещания по франшизе?",
    answer:
      "Нет. Первый релиз не фальсифицирует цифры: сайт собирает лиды, показывает стандарты и готовит место под будущую финансовую модель.",
  },
  {
    id: "faq-stores-1",
    scope: "stores",
    question: "Карта уже показывает реальные данные?",
    answer:
      "Текущая карта и сетевые показатели собраны на demo-ready структуре и рассчитаны на прямую замену данных из CMS или store backend.",
  },
  {
    id: "faq-careers-1",
    scope: "careers",
    question: "Как устроен карьерный сценарий?",
    answer:
      "На главной работает recruitment teaser, а у каждой вакансии есть собственный template, form flow и thank-you сценарий.",
  },
  {
    id: "faq-responsible-1",
    scope: "responsible",
    question: "Как STILNO подаёт ответственное потребление?",
    answer:
      "Спокойно и юридически чисто: без псевдонаучных claims, с явным разделением категорий и отдельным слоем предупреждений.",
  },
  {
    id: "faq-general-1",
    scope: "general",
    question: "Подключается ли сюда CMS?",
    answer:
      "Да. Data model и routing уже построены так, чтобы заменить demo-данные на CMS без переписывания компонентной архитектуры.",
  },
];

export const articles: Article[] = [
  {
    id: "brand-system",
    slug: "premium-brand-system",
    title: "Как строится brand system для будущей федеральной сети",
    category: "Brand",
    excerpt:
      "Не лендинг ради картинки, а архитектура под магазины, продуктовые страницы и франшизу.",
    coverImage: "/stilno/products/barbaris.jpg",
    publishedAt: "2026-04-15",
    author: "STILNO Team",
    body: [
      "STILNO v2 проектируется как цифровой каркас бренда: navigation, legal-safe routes, product system и franchise layer запускаются одновременно.",
      "Ключевая идея сайта — не повторять эстетику шумного vapeshop UI, а удерживать спокойный premium-tech режим с product-first визуалами.",
      "Поэтому even demo data на карте, в вакансиях и в партнёрском блоке подаётся как архитектура роста, а не как искусственно раздутая федеральность.",
    ],
  },
  {
    id: "responsible-layer",
    slug: "responsible-layer",
    title: "Почему legal-safe коммуникация встроена в интерфейс с первого дня",
    category: "Compliance",
    excerpt:
      "18+ gate, consent и раздельная маркировка категорий входят в сам продукт сайта, а не прячутся в футере.",
    coverImage: "/stilno/products/fruktoviy-chay.jpg",
    publishedAt: "2026-04-15",
    author: "STILNO Team",
    body: [
      "В премиальной категории зрелый тон начинается не с декоративных решений, а с корректных ограничений и прозрачной коммуникации.",
      "STILNO отделяет nicotine и nicotine-free не только смыслом, но и архитектурой страниц, предупреждений и FAQ.",
    ],
  },
];

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Политика конфиденциальности",
    effectiveDate: "15.04.2026",
    version: "2.0",
    summary: "Правила обработки контактных и lead-данных в рамках сайта STILNO.",
    body: [
      "STILNO обрабатывает только те данные, которые пользователь осознанно отправляет через формы сайта: имя, телефон, email, город и комментарий.",
      "Lead-данные используются для обратной связи, franchise intake, карьерного отклика и сервисной коммуникации.",
      "Версионирование документа и consent-хранение заложены в data model и могут быть подключены к production backend без переработки интерфейса.",
    ],
  },
  {
    slug: "terms",
    title: "Пользовательское соглашение",
    effectiveDate: "15.04.2026",
    version: "2.0",
    summary: "Условия доступа к контенту сайта и использования сервисных сценариев STILNO.",
    body: [
      "Сайт STILNO создаётся как информационная и lead-generation платформа бренда. Он не является полноценным checkout-магазином на первом этапе.",
      "Пользователь подтверждает, что ознакомился с age gate, legal notices и правилами использования контента.",
    ],
  },
  {
    slug: "cookies",
    title: "Cookie policy",
    effectiveDate: "15.04.2026",
    version: "2.0",
    summary: "Описание cookie и consent-поведения для аналитики и сервисных сценариев сайта.",
    body: [
      "Cookie-слой используется для age gate state, cookie consent и аналитических событий. Production implementation может быть расширен через CMP без редизайна.",
      "Пользователь в любой момент может пересмотреть условия обработки, вернувшись к legal-страницам.",
    ],
  },
  {
    slug: "consent",
    title: "Согласие на обработку персональных данных",
    effectiveDate: "15.04.2026",
    version: "2.0",
    summary: "Базовое согласие на отправку form data и обработку контактных данных.",
    body: [
      "Отправляя форму, пользователь подтверждает, что действует добровольно и разрешает обработку указанных данных для ответа на запрос.",
      "Сайт хранит версию consent-модели, что позволяет обновлять документ без потери истории.",
    ],
  },
  {
    slug: "age-18",
    title: "18+ и доступ к контенту",
    effectiveDate: "15.04.2026",
    version: "2.0",
    summary: "Пояснение к age gate и возрастным ограничениям на сайте STILNO.",
    body: [
      "Контент STILNO адресован совершеннолетней аудитории. Age gate является обязательным входным слоем и не служит декоративным попапом.",
      "Если пользователь не подтверждает возраст, доступ к основному контенту ограничивается.",
    ],
  },
  {
    slug: "disclaimer",
    title: "Ответственное потребление и disclaimer",
    effectiveDate: "15.04.2026",
    version: "2.0",
    summary: "Дополнительный legal-safe слой для product pages, FAQ и brand copy.",
    body: [
      "Сайт не делает медицинских заявлений и не использует манипулятивные claims. Все product facts публикуются в пределах допустимой коммуникации.",
      "Никотиновые и безникотиновые категории разделяются по смыслу, архитектуре и предупреждениям.",
    ],
  },
];

export const qualityStandards = [
  {
    title: "Контроль упаковки",
    body: "Каждый SKU встроен в повторяемую упаковочную иерархию: чёрная плоскость, белые плашки, крупное предупреждение и читаемая flavour-метка.",
  },
  {
    title: "Product discipline",
    body: "Device остаётся главным объектом интерфейса: без шумных фонов, кислотных маркеров и визуального базара.",
  },
  {
    title: "Category split",
    body: "Nicotine и nicotine-free не смешиваются в одной смысловой плоскости. На это работает и copy, и routing, и legal layer.",
  },
  {
    title: "Ready for rollout",
    body: "Карточки, страницы продукта, city pages и franchise templates спроектированы так, чтобы масштабироваться без полного редизайна.",
  },
];

export const franchisePillars = [
  "Brand playbook и визуальные стандарты запуска.",
  "Готовая продуктовая матрица и CMS-ready каталог.",
  "Routing под города, stores, careers и B2B без перестройки сайта.",
  "Команда сопровождения для открытия точки и локального маркетинга.",
];

export const responsibilityNotes = [
  "18+ gate обязателен и хранит версию подтверждения.",
  "Никотиновые продукты маркируются отдельно и сопровождаются предупреждениями.",
  "Безникотиновые решения получают собственные routes, FAQ и формулировки.",
  "Сайт не использует медицинские обещания и не подменяет инструкцию.",
];

export const brandNarrative = [
  "STILNO строится как взрослая product-система: устройство, упаковка, retail и digital читаются как единая дисциплина.",
  "Бренд не копирует логику шумных vape-shop сайтов. Вместо этого он выбирает чистую федеральную структуру и спокойный premium-tech тон.",
  "Вся архитектура сайта рассчитана на рост: новые города, новые SKU, franchise leads, partner routes и редакционный слой добавляются без разрушения интерфейса.",
];

export const homeSignals = [
  "Премиальные электронные устройства.",
  "Строгий контроль качества и product design.",
  "Никотиновые и безникотиновые решения в отдельной логике.",
  "Digital-база под федеральную сеть и franchise rollout.",
];

export const homeStats = {
  cities: cities.length,
  stores: stores.length,
  featuredCities: cities.filter((city) => city.featured).length,
  partnerMarks: partners.length,
  note: "Показатели основаны на demo-ready dataset и открыто помечены как структура под будущую CMS.",
};

export const featuredProduct = products[0];

export const cityMap = new Map(cities.map((city) => [city.id, city]));
export const categoryMap = new Map(productCategories.map((category) => [category.id, category]));

export const storesByCityId = new Map<string, Store[]>();
for (const store of stores) {
  const bucket = storesByCityId.get(store.cityId) ?? [];
  bucket.push(store);
  storesByCityId.set(store.cityId, bucket);
}

export const productsByCategoryId = new Map<string, Product[]>();
for (const product of products) {
  const bucket = productsByCategoryId.get(product.categoryId) ?? [];
  bucket.push(product);
  productsByCategoryId.set(product.categoryId, bucket);
}

export function getCityStoreCount(cityId: string) {
  return storesByCityId.get(cityId)?.length ?? 0;
}

export function getCategoryProducts(categoryId: string) {
  return productsByCategoryId.get(categoryId) ?? [];
}

export function getStorePath(store: Store) {
  const city = cityMap.get(store.cityId);
  return city ? `/stores/${city.slug}/${store.slug}` : "/stores";
}

export function getVacancyPath(vacancy: Vacancy) {
  return `/careers/${vacancy.slug}`;
}

export function getProductCategoryPath(category: ProductCategory) {
  return `/products/${category.slug}`;
}

export function getProductPath(product: Product) {
  return `/products/${product.slug}`;
}

export function getArticlePath(article: Article) {
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
    ["stores", "Магазины"],
    ["about", "О бренде"],
    ["gallery", "Галерея"],
    ["products", "Продукция"],
    ["partners", "Партнёры"],
    ["responsible", "Ответственное потребление"],
    ["franchise", "Франчайзинг"],
    ["careers", "Вакансии"],
    ["contacts", "Контакты"],
    ["articles", "Articles"],
    ["faq", "FAQ"],
    ["thank-you", "Спасибо"],
    ["legal", "Legal"],
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
        title: "Магазины STILNO",
        description:
          "Store locator с картой присутствия, demo-ready city architecture и template под будущие точки сети.",
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
      description: `${store.address}. ${store.hours}.`,
      pathname: slug,
      city,
      store,
    };
  }

  if (section === "about") {
    return {
      kind: "about",
      title: "О бренде STILNO",
      description:
        "Позиционирование, visual discipline и digital-архитектура STILNO как будущей федеральной сети.",
      pathname: slug,
    };
  }

  if (section === "gallery") {
    return {
      kind: "gallery",
      title: "Галерея STILNO",
      description: "Product renders, упаковка и close-up детали как основа визуального языка STILNO.",
      pathname: slug,
    };
  }

  if (section === "products") {
    if (!second) {
      return {
        kind: "products-index",
        title: "Продукция STILNO",
        description:
          "Каталог STILNO с разделением nicotine, nicotine-free и future line без ощущения маркетплейса.",
        pathname: slug,
        products,
      };
    }

    const category = productCategories.find((item) => item.slug === second);
    if (category) {
      return {
        kind: "product-category",
        title: category.title,
        description: category.shortDescription,
        pathname: slug,
        category,
        products: getCategoryProducts(category.id),
      };
    }

    const product = products.find((item) => item.slug === second);
    if (!product) {
      return null;
    }

    const relatedCategory = categoryMap.get(product.categoryId);
    return {
      kind: "product",
      title: product.title,
      description: product.shortDescription,
      pathname: slug,
      product,
      category: relatedCategory,
    };
  }

  if (section === "partners") {
    return {
      kind: "partners",
      title: "Партнёры STILNO",
      description:
        "Тёмный B2B-слой бренда с партнёрскими сценариями, distribution logic и lead capture.",
      pathname: slug,
    };
  }

  if (section === "responsible") {
    return {
      kind: "responsible",
      title: "Ответственное потребление",
      description:
        "Legal-safe страница про разделение категорий, предупреждения и ответственную позицию STILNO.",
      pathname: slug,
    };
  }

  if (section === "franchise") {
    return {
      kind: "franchise",
      title: "Франчайзинг STILNO",
      description:
        "Франчайзинговый сценарий с value proposition, launch support и lead-формой без фальшивых финансовых claims.",
      pathname: slug,
    };
  }

  if (section === "careers") {
    if (!second) {
      return {
        kind: "careers-index",
        title: "Вакансии STILNO",
        description:
          "Recruitment template с list page, vacancy details, forms и федеральным карьерным сценарием.",
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
        "Контактный слой бренда: формы, service lines, B2B поток и map-ready инфраструктура.",
      pathname: slug,
    };
  }

  if (section === "articles") {
    if (!second) {
      return {
        kind: "articles-index",
        title: "Articles",
        description:
          "Редакционный слой STILNO: brand thinking, compliance and rollout notes.",
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
      title: "FAQ",
      description: "Частые вопросы о продукции, franchise flow, stores и legal-safe логике сайта.",
      pathname: slug,
    };
  }

  if (section === "thank-you" && second) {
    return {
      kind: "thank-you",
      title: "Спасибо",
      description: "Сценарий успешной отправки формы и переход к следующему шагу.",
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
    ...cities.flatMap((city) => {
      const cityStores = storesByCityId.get(city.id) ?? [];
      return [[ "stores", city.slug ], ...cityStores.map((store) => ["stores", city.slug, store.slug])];
    }),
    ["about"],
    ["gallery"],
    ["products"],
    ...productCategories.map((category) => ["products", category.slug]),
    ...products.map((product) => ["products", product.slug]),
    ["partners"],
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
    ["thank-you", "career"],
    ["thank-you", "partner"],
    ...legalPages.map((page) => ["legal", page.slug]),
  ];
}
