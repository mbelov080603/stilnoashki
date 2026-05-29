import flavorData from "../../data/stilno-flavors.json";

export type StilnoFlavorCategory = "regular" | "sour" | "ice";

export type StilnoFlavor = {
  code: string;
  name: string;
  category: StilnoFlavorCategory;
  categoryLabel: string;
  description: string;
  tags: string[];
  ingredients: string[];
  colors: string[];
  accent: string;
  profile: {
    sweetness: number;
    sourness: number;
    coolness: number;
  };
  asset: string;
  pngPreview: string;
};

const variantIdsByCode: Record<string, string> = {
  R01: "greypfrut-malina-klubnika-pinkman",
  R02: "myata",
  R03: "ananas-mango",
  R04: "fruktoviy-chay",
  R05: "vishnya-limon-persik",
  R06: "yagodniy-energetik",
  R07: "chernika-klyukva-vishnya",
  R08: "smorodina-malina-ezhevika",
  R09: "slivochnaya-klubnika-mango",
  R10: "zemlyanika-dragonfruit",
  R11: "barbaris",
  R12: "tarhun",
  R13: "krem-slivki",
  S01: "kislaya-ezhevika-malina",
  S02: "kislaya-malina-yabloko",
  S03: "kislaya-chernaya-smorodina",
  S04: "kisliy-greypfrut-kivi",
  S05: "kisloe-zelenoe-yabloko",
  S06: "kisliy-ananas-malina",
  S07: "kisliy-yagodniy-limonad",
  S08: "kaktus-laym",
  I01: "ananas-ice",
  I02: "klubnika-ice",
  I03: "persik-ice",
  I04: "malina-ice",
  I05: "ezhevika-ice",
  I06: "vishnya-ice",
  I07: "chernichniy-sorbet",
  I08: "klubnichno-bananoviy-milksheyk",
  I09: "vinograd-chernika-ice",
};

export const stilnoFlavors = flavorData as StilnoFlavor[];

export const stilnoFlavorByCode = new Map(
  stilnoFlavors.map((flavor) => [flavor.code, flavor]),
);

export function getStilnoFlavorVariantId(flavor: StilnoFlavor) {
  return variantIdsByCode[flavor.code] ?? flavor.code.toLocaleLowerCase("ru-RU");
}

export function getStilnoFlavorGroup(flavor: StilnoFlavor) {
  if (flavor.category === "sour") {
    return "Кислые";
  }

  if (flavor.category === "ice") {
    return "Айс";
  }

  return "Основная линейка";
}
