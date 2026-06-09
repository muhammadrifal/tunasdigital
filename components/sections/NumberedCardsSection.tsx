import type { PageSection } from "@/lib/types";

interface NumberedCard {
  title?: string;
  description?: string;
  bg_color?: string;
}

export default function NumberedCardsSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const bgColor      = (settings.bg_color      as string) || "#7c3aed";
  const headingColor = (settings.heading_color as string) || "#ffffff";
  const subColor     = (settings.sub_color     as string) || "#e5e7eb";
  const badgeColor   = (settings.badge_color   as string) || "#f97316";
  const cardBg       = (settings.card_bg       as string) || "#ffffff";
  const titleColor   = (settings.title_color   as string) || "#1e1b4b";
  const descColor    = (settings.desc_color    as string) || "#6b7280";
  const columns     = (settings.columns      as number) || 3;
  const doodleLeft  = (settings.doodle_left  as string) || "";
  const doodleRight = (settings.doodle_right as string) || "";
  const showBadge   = settings.show_badge !== false;
  const badgeLayout = (settings.badge_layout as string) || "top";   // "top" | "left"
  const titleWeight = (settings.title_weight as string) || "bold";  // "normal" | "semibold" | "bold" | "extrabold"
  const titleSize   = (settings.title_size   as string) || "base";  // "sm" | "base" | "lg" | "xl"
  const descWeight      = (settings.desc_weight      as string) || "normal";
  const descSize        = (settings.desc_size        as string) || "sm";
  const cardAlignment   = (settings.card_alignment   as string) || "left";
  const items           = (content.items             as NumberedCard[]) || [];

  const itemClass =
    columns === 2
      ? "w-full sm:w-[calc(50%-10px)]"
      : "w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]";

  const titleWeightClass: Record<string, string> = {
    normal: "font-normal", semibold: "font-semibold",
    bold: "font-bold", extrabold: "font-extrabold",
  };
  const titleSizeClass: Record<string, string> = {
    sm: "text-sm", base: "text-base", lg: "text-lg", xl: "text-xl",
  };
  const descWeightClass: Record<string, string> = {
    normal: "font-normal", semibold: "font-semibold",
    bold: "font-bold", extrabold: "font-extrabold",
  };
  const descSizeClass: Record<string, string> = {
    sm: "text-sm", base: "text-base", lg: "text-lg", xl: "text-xl",
  };

  const alignClass = cardAlignment === "center" ? "items-center text-center" : cardAlignment === "right" ? "items-end text-right" : "items-start text-left";
  const badgeAlignClass = cardAlignment === "center" ? "mx-auto" : cardAlignment === "right" ? "ml-auto" : "";

  const Badge = ({ i }: { i: number }) => showBadge ? (
    <span
      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-lg"
      style={{ backgroundColor: badgeColor }}
    >
      {i + 1}
    </span>
  ) : null;

  return (
    <section
      id={section.anchor_id || undefined}
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-5xl mx-auto">
        {(content.heading || content.subheading) && (
          <div className="text-center mb-12">
            {content.heading && (
              <div className="relative">
                {doodleLeft && (
                  <img
                    src={doodleLeft}
                    alt=""
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-20 sm:w-28 h-auto pointer-events-none select-none"
                  />
                )}
                <h2
                  className="text-3xl sm:text-4xl font-extrabold leading-tight inline-block px-8 sm:px-32 [&_strong]:font-extrabold [&_em]:italic [&_a]:underline"
                  style={{ color: headingColor }}
                  dangerouslySetInnerHTML={{ __html: content.heading as string }}
                />
                {doodleRight && (
                  <img
                    src={doodleRight}
                    alt=""
                    aria-hidden="true"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-20 sm:w-28 h-auto pointer-events-none select-none"
                  />
                )}
              </div>
            )}
            {content.subheading && (
              <div
                className="mt-4 text-base leading-relaxed max-w-2xl mx-auto [&_strong]:font-bold [&_em]:italic [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5"
                style={{ color: subColor }}
                dangerouslySetInnerHTML={{ __html: content.subheading as string }}
              />
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className={`${itemClass} rounded-2xl p-5 flex flex-col justify-center`}
              style={{ backgroundColor: item.bg_color || cardBg }}
            >
              {badgeLayout === "left" && showBadge ? (
                /* ── Horizontal layout: badge on left ── */
                <div className="flex items-center gap-4">
                  <Badge i={i} />
                  <div className="flex-1 min-w-0">
                    {item.title && (
                      <h3
                        className={`leading-snug ${titleWeightClass[titleWeight] || "font-bold"} ${titleSizeClass[titleSize] || "text-base"}`}
                        style={{ color: titleColor }}
                      >
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p
                        className={`mt-1 leading-relaxed [&_a]:text-orange-500 [&_a]:underline [&_strong]:font-bold ${descWeightClass[descWeight] || "font-normal"} ${descSizeClass[descSize] || "text-sm"}`}
                        style={{ color: descColor }}
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}
                  </div>
                </div>
              ) : (
                /* ── Vertical layout: badge on top ── */
                <div className={`flex flex-col gap-3 justify-center ${alignClass}`}>
                  <span className={badgeAlignClass}><Badge i={i} /></span>
                  {item.title && (
                    <h3
                      className={`leading-snug ${titleWeightClass[titleWeight] || "font-bold"} ${titleSizeClass[titleSize] || "text-base"}`}
                      style={{ color: titleColor }}
                    >
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p
                      className={`leading-relaxed [&_a]:text-orange-500 [&_a]:underline [&_strong]:font-bold ${descWeightClass[descWeight] || "font-normal"} ${descSizeClass[descSize] || "text-sm"}`}
                      style={{ color: descColor }}
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
