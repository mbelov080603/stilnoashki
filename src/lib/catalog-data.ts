import { companyDetails } from "@/lib/site-config";
import type { Product, ProductVariant } from "@/lib/site-types";

function variant(id: string, title: string, group: string, flavorDescription: string): ProductVariant {
  return {
    id,
    title,
    flavor: title,
    flavorDescription,
    group,
    nicotineStrength: "20 мг/см³",
    status: "Текущий вкус",
  };
}

const clickOneVariants: ProductVariant[] = [
  variant("greypfrut-malina-klubnika-pinkman", "Грейпфрут малина клубника (Пинкман)", "Обычные", "Цитрус, малина и клубника"),
  variant("myata", "Мята", "Обычные", "Чистый мятный профиль"),
  variant("ananas-mango", "Ананас манго", "Обычные", "Ананас и спелое манго"),
  variant("fruktoviy-chay", "Фруктовый чай", "Обычные", "Чай с фруктовыми нотами"),
  variant("vishnya-limon-persik", "Вишня Лимон Персик", "Обычные", "Вишня, лимон и персик"),
  variant("yagodniy-energetik", "Ягодный энергетик", "Обычные", "Ягоды и энергетический оттенок"),
  variant("chernika-klyukva-vishnya", "Черника клюква вишня", "Обычные", "Черника, клюква и вишня"),
  variant("smorodina-malina-ezhevika", "Смородина, малина, ежевика", "Обычные", "Смородина, малина и ежевика"),
  variant("slivochnaya-klubnika-mango", "Сливочная клубника манго", "Обычные", "Сливки, клубника и манго"),
  variant("zemlyanika-dragonfruit", "Земляника драгонфрут", "Обычные", "Земляника и драгонфрут"),
  variant("barbaris", "Барбарис", "Обычные", "Классический барбарисовый вкус"),
  variant("tarhun", "Тархун", "Обычные", "Травяной вкус тархуна"),
  variant("krem-slivki", "Крем-сливки", "Обычные", "Мягкий сливочный профиль"),
  variant("kislaya-ezhevika-malina", "Кислая ежевика малина", "Кислые", "Кислая ежевика и малина"),
  variant("kislaya-malina-yabloko", "Кислая малина яблоко", "Кислые", "Кислая малина и яблоко"),
  variant("kislaya-chernaya-smorodina", "Кислая черная смородина", "Кислые", "Кислая черная смородина"),
  variant("kisliy-greypfrut-kivi", "Кислый грейпфрут киви", "Кислые", "Кислый грейпфрут и киви"),
  variant("kisloe-zelenoe-yabloko", "Кислое зеленое яблоко", "Кислые", "Кислое зеленое яблоко"),
  variant("kisliy-ananas-malina", "Кислый ананас малина", "Кислые", "Кислый ананас и малина"),
  variant("kisliy-yagodniy-limonad", "Кислый ягодный лимонад", "Кислые", "Кислый ягодный лимонад"),
  variant("kaktus-laym", "Кактус Лайм", "Кислые", "Кактус и лайм"),
  variant("ananas-ice", "Ананас айс", "Айс", "Ананас с холодным оттенком"),
  variant("klubnika-ice", "Клубника Айс", "Айс", "Клубника с холодным оттенком"),
  variant("persik-ice", "Персик Айс", "Айс", "Персик с холодным оттенком"),
  variant("malina-ice", "Малина Айс", "Айс", "Малина с холодным оттенком"),
  variant("ezhevika-ice", "Ежевика Айс", "Айс", "Ежевика с холодным оттенком"),
  variant("vishnya-ice", "Вишня Айс", "Айс", "Вишня с холодным оттенком"),
  variant("chernichniy-sorbet", "Черничный сорбет", "Айс", "Черника и сорбетная нота"),
  variant("klubnichno-bananoviy-milksheyk", "Клубнично-банановый милкшейк", "Айс", "Клубника, банан и молоко"),
  variant("vinograd-chernika-ice", "Виноград Черника Айс", "Айс", "Виноград, черника и холод"),
];

const products: Product[] = [
  {
    id: "stilno-click-one",
    slug: "stilno-click-one",
    categoryId: "nicotine",
    title: "STILNO CLICK ONE",
    nicotineType: "nicotine",
    shortDescription:
      "STILNO CLICK ONE — чёрный силуэт, Type-C, 30 вкусов и упаковка, которая держит продукт как единую серию для аудитории 18+.",
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
