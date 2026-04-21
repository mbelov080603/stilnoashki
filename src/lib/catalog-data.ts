import { companyDetails } from "@/lib/site-config";
import type { GalleryItem, Product, ProductCategory, ProductVariant } from "@/lib/site-types";

export const productCategories: ProductCategory[] = [
  {
    id: "nicotine",
    slug: "nicotine",
    title: "Никотиновая линия",
    type: "nicotine",
    shortDescription:
      "STILNO CLICK ONE — подтверждённая никотинсодержащая линия бренда STILNO для совершеннолетних пользователей.",
    longDescription:
      "На сайте публикуются только подтверждённые данные текущей никотинсодержащей линии. Никотиновые и безникотиновые продукты не смешиваются в одной смысловой категории.",
    status: "Подтверждённая линия",
    disclaimer:
      "18+. Никотин вызывает зависимость. Информация на сайте не заменяет инструкцию и не является медицинской рекомендацией.",
    heroTitle: "STILNO CLICK ONE",
    heroBody:
      "Никотинсодержащая линия STILNO для совершеннолетних пользователей. Характеристики и вкусовые варианты опубликованы по подтверждённым упаковочным материалам.",
    heroImage: "/stilno/products/ananas-mango.jpg",
  },
];

const clickOneVariants: ProductVariant[] = [
  {
    id: "ananas-mango",
    title: "Ананас Манго",
    flavor: "Ананас Манго",
    nicotineStrength: "20 мг/см³",
    image: "/stilno/products/ananas-mango.jpg",
    packaging: "/stilno/products/ananas-mango.jpg",
    status: "Текущий вкус",
  },
  {
    id: "barbaris",
    title: "Барбарис",
    flavor: "Барбарис",
    nicotineStrength: "20 мг/см³",
    image: "/stilno/products/barbaris.jpg",
    packaging: "/stilno/products/barbaris.jpg",
    status: "Текущий вкус",
  },
  {
    id: "vishnya-limon-persik",
    title: "Вишня Лимон Персик",
    flavor: "Вишня Лимон Персик",
    nicotineStrength: "20 мг/см³",
    image: "/stilno/products/vishnya-limon-persik.jpg",
    packaging: "/stilno/products/vishnya-limon-persik.jpg",
    status: "Текущий вкус",
  },
  {
    id: "zemlyanika-dragonfruit",
    title: "Земляника Драгонфрут",
    flavor: "Земляника Драгонфрут",
    nicotineStrength: "20 мг/см³",
    image: "/stilno/products/zemlyanika-dragonfruit.jpg",
    packaging: "/stilno/products/zemlyanika-dragonfruit.jpg",
    status: "Текущий вкус",
  },
  {
    id: "myata",
    title: "Мята",
    flavor: "Мята",
    nicotineStrength: "20 мг/см³",
    image: "/stilno/products/myata.jpg",
    packaging: "/stilno/products/myata.jpg",
    status: "Текущий вкус",
  },
  {
    id: "slivochnaya-klubnika-mango",
    title: "Сливочная Клубника Манго",
    flavor: "Сливочная Клубника Манго",
    nicotineStrength: "20 мг/см³",
    image: "/stilno/products/slivochnaya-klubnika-mango.jpg",
    packaging: "/stilno/products/slivochnaya-klubnika-mango.jpg",
    status: "Текущий вкус",
  },
  {
    id: "smorodina-malina-ezhevika",
    title: "Смородина Малина Ежевика",
    flavor: "Смородина Малина Ежевика",
    nicotineStrength: "20 мг/см³",
    image: "/stilno/products/smorodina-malina-ezhevika.jpg",
    packaging: "/stilno/products/smorodina-malina-ezhevika.jpg",
    status: "Текущий вкус",
  },
  {
    id: "fruktoviy-chay",
    title: "Фруктовый Чай",
    flavor: "Фруктовый Чай",
    nicotineStrength: "20 мг/см³",
    image: "/stilno/products/fruktoviy-chay.jpg",
    packaging: "/stilno/products/fruktoviy-chay.jpg",
    status: "Текущий вкус",
  },
  {
    id: "chernika-klyukva-vishnya",
    title: "Черника Клюква Вишня",
    flavor: "Черника Клюква Вишня",
    nicotineStrength: "20 мг/см³",
    image: "/stilno/products/chernika-klyukva-vishnya.jpg",
    packaging: "/stilno/products/chernika-klyukva-vishnya.jpg",
    status: "Текущий вкус",
  },
  {
    id: "yagodniy-energetik",
    title: "Ягодный Энергетик",
    flavor: "Ягодный Энергетик",
    nicotineStrength: "20 мг/см³",
    image: "/stilno/products/yagodniy-energetik.jpg",
    packaging: "/stilno/products/yagodniy-energetik.jpg",
    status: "Текущий вкус",
  },
];

export const products: Product[] = [
  {
    id: "stilno-click-one",
    slug: "stilno-click-one",
    categoryId: "nicotine",
    title: "STILNO CLICK ONE",
    nicotineType: "nicotine",
    shortDescription:
      "STILNO CLICK ONE — никотинсодержащая продуктовая линия для совершеннолетних пользователей. Характеристики указаны по подтверждённым упаковочным материалам.",
    longDescription:
      "STILNO CLICK ONE — никотинсодержащая продуктовая линия для совершеннолетних пользователей. Характеристики указаны по подтверждённым упаковочным материалам. Показатель количества затяжек зависит от режима использования.",
    availability: "Наличие и партнёрские условия уточняются через формы сайта и подтверждённые каналы STILNO.",
    highlight: "Основная линия бренда",
    specs: [
      { label: "Модель", value: "STILNO CLICK ONE" },
      {
        label: "Формат",
        value:
          "Перезаряжаемое устройство STILNO CLICK ONE. Точная формулировка формата должна быть сверена с упаковкой и документацией перед релизом.",
      },
      { label: "Объём жидкости", value: "10 мл / 10 см³" },
      { label: "Концентрация никотина", value: "20 мг/см³" },
      { label: "Аккумулятор", value: "850 мА·ч" },
      { label: "Порт", value: "Type-C" },
      { label: "Мощность", value: "10–22 Вт" },
      { label: "Ресурс", value: "До 15 000 затяжек*" },
    ],
    facts: [
      "Состав: глицерин, пропиленгликоль, ароматизаторы, никотин, бензойная кислота.",
      `Изготовлено в соответствии с ${companyDetails.gost}.`,
      `Срок годности: ${companyDetails.shelfLife}.`,
      `Изготовитель: ${companyDetails.companyName}.`,
      companyDetails.storageConditions,
    ],
    warnings: [
      "18+. Никотин вызывает зависимость.",
      "Запрещено использовать лицам младше 18 лет.",
      "Не рекомендуется беременным и кормящим женщинам, а также людям с индивидуальной непереносимостью компонентов.",
      "Показатель количества затяжек зависит от режима использования.",
      "Материалы сайта не заменяют инструкцию и не содержат медицинских обещаний.",
    ],
    images: clickOneVariants.slice(0, 4).map((variant) => variant.image ?? "").filter(Boolean),
    packagingImages: clickOneVariants.slice(4).map((variant) => variant.packaging ?? "").filter(Boolean),
    variants: clickOneVariants,
    featured: true,
  },
];

export const featuredProduct = products[0];

export const galleryItems: GalleryItem[] = [
  {
    id: "gallery-device-silhouette",
    title: "Силуэт устройства",
    type: "device",
    media: "/stilno/products/barbaris.jpg",
    alt: "Силуэт устройства STILNO CLICK ONE",
    caption: "Матовый чёрный корпус и вертикальный логотип формируют узнаваемый силуэт без лишних декоративных сигналов.",
  },
  {
    id: "gallery-packaging-front",
    title: "Фронт упаковки",
    type: "packaging",
    media: "/stilno/products/ananas-mango.jpg",
    alt: "Упаковка STILNO CLICK ONE",
    caption: "Фронтальная плоскость упаковки держит вкусовую метку, предупреждение и продуктовый рендер в одной строгой иерархии.",
  },
  {
    id: "gallery-technical-flat",
    title: "Техническая плоскость",
    type: "technical-flat",
    media: "/stilno/products/vishnya-limon-persik.jpg",
    alt: "Техническая плоскость STILNO CLICK ONE",
    caption: "Технические данные выведены без маркетингового шума: 10 мл, 850 мА·ч, Type-C, 10–22 Вт и 20 мг/см³.",
  },
  {
    id: "gallery-logotype-closeup",
    title: "Крупный план логотипа",
    type: "close-up",
    media: "/stilno/products/zemlyanika-dragonfruit.jpg",
    alt: "Крупный план логотипа STILNO",
    caption: "Крупный вертикальный логотип работает как часть корпуса устройства, а не как декоративная наклейка.",
  },
  {
    id: "gallery-flavour-series-1",
    title: "Вкусовая метка / Мята",
    type: "packaging",
    media: "/stilno/products/myata.jpg",
    alt: "STILNO CLICK ONE Мята",
    caption: "У вкусовой линии общий графический каркас: меняется только вкусовая метка, не ломая премиальную серийность.",
  },
  {
    id: "gallery-flavour-series-2",
    title: "Вкусовая метка / Сливочная клубника манго",
    type: "device",
    media: "/stilno/products/slivochnaya-klubnika-mango.jpg",
    alt: "STILNO CLICK ONE Сливочная Клубника Манго",
    caption: "Композиция подчёркивает связку устройства и картриджа, а не превращает продуктовую страницу в каталог с визуальным шумом.",
  },
  {
    id: "gallery-warning-layer",
    title: "Слой предупреждения",
    type: "technical-flat",
    media: "/stilno/products/smorodina-malina-ezhevika.jpg",
    alt: "Предупреждение на упаковке STILNO CLICK ONE",
    caption: "Предупреждение не скрыто в мелком тексте: оно встроено в упаковку как обязательный и читаемый юридический слой.",
  },
  {
    id: "gallery-packaging-series",
    title: "Серия упаковки",
    type: "packaging",
    media: "/stilno/products/fruktoviy-chay.jpg",
    alt: "Серийная упаковка STILNO CLICK ONE",
    caption: "Одинаковая геометрия серии помогает быстро различать вкусы и одновременно удерживает целостный брендовый вид линии.",
  },
  {
    id: "gallery-device-front",
    title: "Фронт устройства / Черника Клюква Вишня",
    type: "device",
    media: "/stilno/products/chernika-klyukva-vishnya.jpg",
    alt: "STILNO CLICK ONE Черника Клюква Вишня",
    caption: "Устройство остаётся главным объектом кадра: спокойная подача продукта важнее декоративных спецэффектов.",
  },
  {
    id: "gallery-current-line",
    title: "Текущая линия / Ягодный энергетик",
    type: "close-up",
    media: "/stilno/products/yagodniy-energetik.jpg",
    alt: "STILNO CLICK ONE Ягодный Энергетик",
    caption: "Текущая опубликованная вкусовая линия собрана на актуальных упаковочных материалах и не содержит вымышленных SKU.",
  },
];

export const qualityStandards = [
  {
    title: "Фактические данные о продукте",
    body: "В интерфейсе используются параметры из подтверждённых упаковочных материалов: 10 мл, 850 мА·ч, Type-C, 10–22 Вт, 20 мг/см³ и до 15 000 затяжек*.",
  },
  {
    title: "Упаковочная дисциплина",
    body: "Чёрная плоскость, белые плашки, вкусовая метка и предупреждение читаются стабильно от вкуса к вкусу и не распадаются на разные стили.",
  },
  {
    title: "Отдельный правовой слой",
    body: "Предупреждения, состав, ГОСТ, срок годности и хранение вынесены в отдельные блоки и не маскируются под рекламный текст.",
  },
  {
    title: "Чистая архитектура линейки",
    body: "Сайт показывает только подтверждённую линию STILNO CLICK ONE и не смешивает её с непубликованными направлениями.",
  },
];

export const responsibilityNotes = [
  "18+ доступ обязателен для всего сайта и применяется до просмотра продуктового контента.",
  "STILNO CLICK ONE относится к никотинсодержащей категории и маркируется отдельно.",
  "Безникотиновые продукты, если они будут опубликованы, должны иметь собственные предупреждения, маршруты и самостоятельную подачу.",
  "Сайт не использует медицинские обещания и не подменяет инструкцию по использованию продукта.",
];

export const homeSignals = [
  "STILNO CLICK ONE",
  "10 мл · 20 мг/см³ · до 15 000 затяжек*",
  "850 мА·ч · Type-C · 10–22 Вт",
  "Партнёрство · франчайзинг · розничные запросы",
];
