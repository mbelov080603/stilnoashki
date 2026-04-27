type MediaSlotAspect = "wide" | "square" | "portrait";

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

const aspectClass: Record<MediaSlotAspect, string> = {
  wide: "min-h-[18rem] aspect-[16/10]",
  square: "min-h-[15rem] aspect-square",
  portrait: "min-h-[20rem] aspect-[4/5]",
};

export function MediaSlot({
  slotId,
  title = "Место для фото",
  note = "Изображение будет добавлено позже.",
  aspect = "wide",
  className,
}: {
  slotId: string;
  title?: string;
  note?: string;
  aspect?: MediaSlotAspect;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "relative overflow-hidden rounded-[1rem] border border-black/10 bg-[#f6f6f3] p-5",
        aspectClass[aspect],
        className,
      )}
      data-media-slot={slotId}
      aria-label={title}
    >
      <div className="absolute inset-5 rounded-[0.75rem] border border-dashed border-black/16" aria-hidden="true" />
      <div className="relative flex h-full min-h-[inherit] items-center justify-center text-center">
        <div className="max-w-[18rem]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/34">{slotId}</p>
          <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-black/72">{title}</p>
          <p className="mt-2 text-sm leading-6 text-black/46">{note}</p>
        </div>
      </div>
    </div>
  );
}
