import Image from "next/image";

import { assetPath, mediaAssets } from "@/lib/site-config";

type MediaSlotAspect = "wide" | "square" | "portrait";
type MediaSlotRole = "product" | "store" | "partner" | "brand";

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

const aspectClass: Record<MediaSlotAspect, string> = {
  wide: "min-h-[16rem] sm:min-h-[18rem] lg:aspect-[16/10]",
  square: "min-h-[14rem] sm:min-h-[15rem] lg:aspect-square",
  portrait: "min-h-[18rem] sm:min-h-[20rem] lg:aspect-[4/5]",
};

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

function getAsset(slotId: string, role: MediaSlotRole) {
  if (/franchise|process/i.test(slotId)) {
    return mediaAssets.franchise;
  }

  if (/responsible|legal/i.test(slotId)) {
    return mediaAssets.responsible;
  }

  if (role === "store") {
    return mediaAssets.stores;
  }

  if (role === "partner") {
    return mediaAssets.partner;
  }

  if (role === "brand") {
    return mediaAssets.responsible;
  }

  return mediaAssets.product;
}

export function MediaSlot({
  slotId,
  title = "STILNO CLICK ONE",
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
  const asset = getAsset(slotId, role);

  return (
    <figure
      className={classNames(
        "relative w-full min-w-0 max-w-full overflow-hidden rounded-[1rem] border border-black/10 bg-[#f6f6f3]",
        aspectClass[aspect],
        className,
      )}
      data-visual-slot={role}
      aria-label={title}
    >
      <Image
        src={assetPath(asset)}
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 1280px) 44rem, 100vw"
        className="object-cover"
        loading="eager"
        unoptimized
      />
      {note ? <figcaption className="sr-only">{note}</figcaption> : null}
    </figure>
  );
}
