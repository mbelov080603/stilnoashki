import { companyDetails } from "@/lib/site-config";
import type { Product, ProductVariant } from "@/lib/site-types";

function variant(id: string, title: string, group: string): ProductVariant {
  return {
    id,
    title,
    flavor: title,
    group,
    nicotineStrength: "20 мг/см³",
    status: "Текущий вкус",
  };
}

const clickOneVariants: ProductVariant[] = [
  variant("greypfrut-malina-klubnika-pinkman", "Грейпфрут малина клубника (Пинкман)", "Обычные"),
  variant("myata", "Мята", "Обычные"),
  variant("ananas-mango", "Ананас манго", "Обычные"),
  variant("fruktoviy-chay", "Фруктовый чай", "Обычные"),
  variant("vishnya-limon-persik", "Вишня Лимон Персик", "Обычные"),
  variant("yagodniy-energetik", "Ягодный энергетик", "Обычные"),
  variant("chernika-klyukva-vishnya", "Черника клюква вишня", "Обычные"),
  variant("smorodina-malina-ezhevika", "Смородина, малина, ежевика", "Обычные"),
  variant("slivochnaya-klubnika-mango", "Сливочная клубника манго", "Обычные"),
  variant("zemlyanika-dragonfruit", "Земляника драгонфрут", "Обычные"),
  variant("barbaris", "Барбарис", "Обычные"),
  variant("tarhun", "Тархун", "Обычные"),
  variant("krem-slivki", "Крем-сливки", "Обычные"),
  variant("kislaya-ezhevika-malina", "Кислая ежевика малина", "Кислые"),
  variant("kislaya-malina-yabloko", "Кислая малина яблоко", "Кислые"),
  variant("kislaya-chernaya-smorodina", "Кислая черная смородина", "Кислые"),
  variant("kisliy-greypfrut-kivi", "Кислый грейпфрут киви", "Кислые"),
  variant("kisloe-zelenoe-yabloko", "Кислое зеленое яблоко", "Кислые"),
  variant("kisliy-ananas-malina", "Кислый ананас малина", "Кислые"),
  variant("kisliy-yagodniy-limonad", "Кислый ягодный лимонад", "Кислые"),
  variant("kaktus-laym", "Кактус Лайм", "Кислые"),
  variant("ananas-ice", "Ананас айс", "Айс"),
  variant("klubnika-ice", "Клубника Айс", "Айс"),
  variant("persik-ice", "Персик Айс", "Айс"),
  variant("malina-ice", "Малина Айс", "Айс"),
  variant("ezhevika-ice", "Ежевика Айс", "Айс"),
  variant("vishnya-ice", "Вишня Айс", "Айс"),
  variant("chernichniy-sorbet", "Черничный сорбет", "Айс"),
  variant("klubnichno-bananoviy-milksheyk", "Клубнично-банановый милкшейк", "Айс"),
  variant("vinograd-chernika-ice", "Виноград Черника Айс", "Айс"),
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
