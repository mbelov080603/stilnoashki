import { companyDetails } from "@/lib/site-config";
import type { Product, ProductVariant } from "@/lib/site-types";

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

const products: Product[] = [
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
    availability: "Наличие уточняется через розничный запрос, партнёрские обращения — через страницу «Заявка».",
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
