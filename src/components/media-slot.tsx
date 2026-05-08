import Image from "next/image";

import { assetPath, mediaAssets } from "@/lib/site-config";

type MediaSlotAspect = "wide" | "square" | "portrait";
type MediaSlotRole = "product" | "store" | "partner" | "brand";
type MediaVisual = {
  src: string;
  fit?: "cover" | "contain";
  position?: string;
};

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

const aspectClass: Record<MediaSlotAspect, string> = {
  wide: "min-h-[17rem] sm:min-h-[20rem] lg:aspect-[16/10]",
  square: "min-h-[15rem] sm:min-h-[16rem] lg:aspect-square",
  portrait: "min-h-[20rem] sm:min-h-[24rem] lg:aspect-[4/5]",
};

const slotVisuals: Array<[RegExp, MediaVisual]> = [
  [/home-hero/i, { src: mediaAssets.partner, position: "50% 50%" }],
  [/gallery-hero/i, { src: mediaAssets.partner, position: "50% 50%" }],
  [/age-gate-product/i, { src: mediaAssets.responsible, fit: "contain", position: "50% 50%" }],
  [/verify-product/i, { src: mediaAssets.responsible, fit: "contain", position: "50% 50%" }],
  [/product-variant-ananas-mango|variant-ananas-mango|partner-variant-ananas-mango/i, {
    src: mediaAssets.partner,
    position: "50% 50%",
  }],
  [/vishnya-limon-persik|gallery-device-front/i, {
    src: mediaAssets.partner,
    position: "50% 50%",
  }],
  [/slivochnaya-klubnika-mango|gallery-flavour-series-2/i, {
    src: mediaAssets.partner,
    position: "50% 50%",
  }],
  [/gallery-packaging-series|gallery-packaging-front|gallery-warning-layer/i, {
    src: mediaAssets.partner,
    position: "50% 50%",
  }],
  [/gallery-current-line/i, { src: mediaAssets.partner, position: "50% 50%" }],
  [/gallery-device-silhouette|gallery-logotype-closeup/i, {
    src: mediaAssets.lifestyleHand,
    position: "50% 50%",
  }],
  [/gallery-device-front/i, { src: mediaAssets.partner, position: "50% 50%" }],
  [/gallery-technical-flat/i, { src: mediaAssets.production, position: "50% 50%" }],
  [/stores-hero|stores-request|home-stores|store|city|retail/i, {
    src: mediaAssets.stores,
    position: "50% 50%",
  }],
  [/home-partners|partners-hero|partner-media-kit/i, {
    src: mediaAssets.partner,
    position: "50% 50%",
  }],
  [/partner-variant-|product-variant-|variant-|product-variant-fallback/i, {
    src: mediaAssets.partner,
    position: "50% 50%",
  }],
  [/franchise-lineup|franchise/i, { src: mediaAssets.franchise, position: "50% 50%" }],
  [/support-system|support/i, { src: mediaAssets.production, position: "50% 50%" }],
  [/about-secondary/i, { src: mediaAssets.production, position: "50% 50%" }],
  [/about-primary|brand/i, { src: mediaAssets.partner, position: "50% 50%" }],
  [/home-faq-side/i, { src: mediaAssets.responsible, position: "50% 50%" }],
  [/article-card-how-to-check-original|article-how-to-check-original/i, {
    src: mediaAssets.responsible,
    fit: "contain",
    position: "50% 50%",
  }],
  [/article-card-retail-18-rules|article-retail-18-rules/i, {
    src: mediaAssets.responsible,
    fit: "contain",
    position: "50% 50%",
  }],
  [/article-card-partner-kit-overview|article-partner-kit-overview/i, {
    src: mediaAssets.partner,
    position: "50% 50%",
  }],
];

function getRole(slotId: string): MediaSlotRole {
  if (/store|city|retail/i.test(slotId)) {
    return "store";
  }

  if (/partner|b2b|support/i.test(slotId)) {
    return "partner";
  }

  if (/franchise|process/i.test(slotId)) {
    return "partner";
  }

  if (/article|career|about|brand|responsible|legal/i.test(slotId)) {
    return "brand";
  }

  return "product";
}

function getVisual(slotId: string, role: MediaSlotRole): MediaVisual {
  const matchedVisual = slotVisuals.find(([pattern]) => pattern.test(slotId));

  if (matchedVisual) {
    return matchedVisual[1];
  }

  if (/franchise|process/i.test(slotId)) {
    return { src: mediaAssets.franchise };
  }

  if (/responsible|legal/i.test(slotId)) {
    return { src: mediaAssets.responsible };
  }

  if (role === "store") {
    return { src: mediaAssets.stores };
  }

  if (role === "partner") {
    return { src: mediaAssets.partner };
  }

  if (role === "brand") {
    return { src: mediaAssets.partner };
  }

  return { src: mediaAssets.partner };
}

export function MediaSlot({
  slotId,
  title = "STILNO",
  note,
  aspect = "wide",
  className,
}: {
  slotId: string;
  title?: string;
  note?: string;
  aspect?: MediaSlotAspect;
  className?: string;
}) {
  const role = getRole(slotId);
  const visual = getVisual(slotId, role);
  const fitClassName = visual.fit === "contain" ? "object-contain" : "object-cover";

  return (
    <figure
      className={classNames(
        "relative w-full min-w-0 max-w-full overflow-hidden rounded-[1.35rem] border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.08)]",
        aspectClass[aspect],
        className,
      )}
      data-visual-slot={role}
      aria-label={title}
    >
      <Image
        src={assetPath(visual.src)}
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 1280px) 44rem, 100vw"
        className={fitClassName}
        style={{ objectPosition: visual.position ?? "50% 50%" }}
        loading="eager"
        unoptimized
      />
      {note ? <figcaption className="sr-only">{note}</figcaption> : null}
    </figure>
  );
}
