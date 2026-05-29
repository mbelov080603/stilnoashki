import { companyDetails } from "@/lib/site-config";
import {
  getStilnoFlavorGroup,
  getStilnoFlavorVariantId,
  stilnoFlavors,
  type StilnoFlavor,
} from "@/lib/stilno-flavors";
import type { Product, ProductVariant } from "@/lib/site-types";

function variant(flavor: StilnoFlavor): ProductVariant {
  return {
    id: getStilnoFlavorVariantId(flavor),
    title: flavor.name,
    flavor: flavor.name,
    flavorDescription: flavor.description,
    flavorCode: flavor.code,
    group: getStilnoFlavorGroup(flavor),
    nicotineStrength: "20 мг/см³",
    status: "Текущий вкус",
  };
}

const clickOneVariants: ProductVariant[] = stilnoFlavors.map(variant);

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
