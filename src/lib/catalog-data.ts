import { companyDetails } from "@/lib/site-config";
import type { GalleryItem, Product, ProductCategory, ProductVariant } from "@/lib/site-types";

export const productCategories: ProductCategory[] = [
  {
    id: "nicotine",
    slug: "nicotine",
    title: "Никотиновая линия",
    type: "nicotine",
    shortDescription:
      "STILNO CLICK ONE — никотинсодержащая линия STILNO с чёрным силуэтом, чистой упаковкой и вкусовой системой для аудитории 18+.",
    longDescription:
      "На сайте публикуются только подтверждённые данные текущей никотинсодержащей линии. Продуктовая подача строится вокруг корпуса, упаковки, вкусовой метки и обязательной legal-рамки 18+.",
    status: "Подтверждённая линия",
    disclaimer:
      "18+. Никотин вызывает зависимость. Информация на сайте не заменяет инструкцию и не является медицинской рекомендацией.",
    heroTitle: "STILNO CLICK ONE",
    heroBody:
      "Чёрный корпус, единая упаковочная система и десять вкусов текущей линии. Характеристики опубликованы по подтверждённым упаковочным материалам.",
  },
];

const clickOneVariants: ProductVariant[] = [
  {
    id: "ananas-mango",
    title: "Ананас Манго",
    flavor: "Ананас Манго",
    nicotineStrength: "20 мг/см³",
    status: "Текущий вкус",
  },
  {
    id: "barbaris",
    title: "Барбарис",
    flavor: "Барбарис",
    nicotineStrength: "20 мг/см³",
    status: "Текущий вкус",
  },
  {
    id: "vishnya-limon-persik",
    title: "Вишня Лимон Персик",
    flavor: "Вишня Лимон Персик",
    nicotineStrength: "20 мг/см³",
    status: "Текущий вкус",
  },
  {
    id: "zemlyanika-dragonfruit",
    title: "Земляника Драгонфрут",
    flavor: "Земляника Драгонфрут",
    nicotineStrength: "20 мг/см³",
    status: "Текущий вкус",
  },
  {
    id: "myata",
    title: "Мята",
    flavor: "Мята",
    nicotineStrength: "20 мг/см³",
    status: "Текущий вкус",
  },
  {
    id: "slivochnaya-klubnika-mango",
    title: "Сливочная Клубника Манго",
    flavor: "Сливочная Клубника Манго",
    nicotineStrength: "20 мг/см³",
    status: "Текущий вкус",
  },
  {
    id: "smorodina-malina-ezhevika",
    title: "Смородина Малина Ежевика",
    flavor: "Смородина Малина Ежевика",
    nicotineStrength: "20 мг/см³",
    status: "Текущий вкус",
  },
  {
    id: "fruktoviy-chay",
    title: "Фруктовый Чай",
    flavor: "Фруктовый Чай",
    nicotineStrength: "20 мг/см³",
    status: "Текущий вкус",
  },
  {
    id: "chernika-klyukva-vishnya",
    title: "Черника Клюква Вишня",
    flavor: "Черника Клюква Вишня",
    nicotineStrength: "20 мг/см³",
    status: "Текущий вкус",
  },
  {
    id: "yagodniy-energetik",
    title: "Ягодный Энергетик",
    flavor: "Ягодный Энергетик",
    nicotineStrength: "20 мг/см³",
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
      "STILNO CLICK ONE — чёрный силуэт, Type-C, десять вкусов и упаковка, которая держит продукт как единую серию для аудитории 18+.",
    longDescription:
      "STILNO CLICK ONE — никотинсодержащая продуктовая линия для совершеннолетних пользователей. Характеристики указаны по подтверждённым упаковочным материалам, а визуальная система держится на корпусе, упаковке и вкусовой метке. Показатель количества затяжек зависит от режима использования.",
    availability: "Наличие уточняется через розничный запрос, B2B-обращения — через раздел «Партнёрам».",
    highlight: "Основная линия бренда",
    specs: [
      { label: "Модель", value: "STILNO CLICK ONE" },
      {
        label: "Формат",
        value: "Многоразовое устройство + картридж",
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
    images: [],
    packagingImages: [],
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
    alt: "Силуэт устройства STILNO CLICK ONE",
    caption: "Матовый чёрный корпус и вертикальный логотип формируют узнаваемый силуэт без лишних декоративных сигналов.",
  },
  {
    id: "gallery-packaging-front",
    title: "Фронт упаковки",
    type: "packaging",
    alt: "Упаковка STILNO CLICK ONE",
    caption: "Фронт упаковки работает как витринный сигнал: продукт, вкус и предупреждение считываются в одной строгой иерархии.",
  },
  {
    id: "gallery-technical-flat",
    title: "Техническая плоскость",
    type: "technical-flat",
    alt: "Техническая плоскость STILNO CLICK ONE",
    caption: "Технические данные остаются фактическим доказательством после первого визуального впечатления: 10 мл, 850 мА·ч, Type-C, 10–22 Вт и 20 мг/см³.",
  },
  {
    id: "gallery-logotype-closeup",
    title: "Крупный план логотипа",
    type: "close-up",
    alt: "Крупный план логотипа STILNO",
    caption: "Крупный вертикальный логотип работает как часть силуэта устройства, а не как декоративная наклейка.",
  },
  {
    id: "gallery-flavour-series-1",
    title: "Вкусовая метка / Ананас Манго",
    type: "packaging",
    alt: "STILNO CLICK ONE Ананас Манго",
    caption: "У вкусовой линии общий графический каркас: меняется метка вкуса, а премиальная серийность остаётся цельной.",
  },
  {
    id: "gallery-flavour-series-2",
    title: "Вкусовая метка / Сливочная клубника манго",
    type: "device",
    alt: "STILNO CLICK ONE Сливочная Клубника Манго",
    caption: "Композиция подчёркивает связку устройства и картриджа, не превращая продуктовую страницу в шумный каталог.",
  },
  {
    id: "gallery-warning-layer",
    title: "Предупреждение на упаковке",
    type: "technical-flat",
    alt: "Предупреждение на упаковке STILNO CLICK ONE",
    caption: "Предупреждение не скрыто в мелком тексте: оно встроено в упаковку как обязательная и читаемая часть маркировки.",
  },
  {
    id: "gallery-packaging-series",
    title: "Серия упаковки",
    type: "packaging",
    alt: "Серийная упаковка STILNO CLICK ONE",
    caption: "Одинаковая геометрия серии помогает быстро различать вкусы и одновременно удерживает единое лицо бренда.",
  },
  {
    id: "gallery-device-front",
    title: "Фронт устройства / Вишня Лимон Персик",
    type: "device",
    alt: "STILNO CLICK ONE Вишня Лимон Персик",
    caption: "Устройство остаётся главным объектом кадра: сильный продуктовый силуэт важнее декоративных спецэффектов.",
  },
  {
    id: "gallery-current-line",
    title: "Текущая линия / витрина",
    type: "close-up",
    alt: "Витрина STILNO CLICK ONE",
    caption: "Текущая опубликованная вкусовая линия собрана на актуальных упаковочных материалах и выглядит как цельная витринная серия.",
  },
];

export const qualityStandards = [
  {
    title: "Фактические данные о продукте",
    body: "Премиальная подача не заменяет факты: 10 мл, 850 мА·ч, Type-C, 10–22 Вт, 20 мг/см³ и до 15 000 затяжек* указаны по упаковочным материалам.",
  },
  {
    title: "Упаковочная дисциплина",
    body: "Чёрный корпус, белая упаковка, вкусовая метка и предупреждение читаются стабильно от вкуса к вкусу и держат единую серию.",
  },
  {
    title: "Отдельная правовая информация",
    body: "Предупреждения, состав, ГОСТ, срок годности и хранение вынесены в отдельные блоки и не маскируются под рекламный текст.",
  },
  {
    title: "Чистая структура линейки",
    body: "Сайт показывает только подтверждённую линию STILNO CLICK ONE и не смешивает её с непубликованными направлениями.",
  },
];
