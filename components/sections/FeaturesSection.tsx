import Image from "next/image";
import type { PageSection } from "@/lib/types";

interface FeatureItem {
  icon?: string;
  image_url?: string;
  title?: string;
  description?: string;
  bg_color?: string;
  title_color?: string;
  desc_color?: string;
}

export default function FeaturesSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const columns     = parseInt((settings.columns     as string) ?? "3");
  const iconSize    = (settings.icon_size    as string) || "md";
  const alignment   = (settings.alignment   as string) || "left";
  const cardLayout  = (settings.card_layout as string) || "vertical";

  const isHorizontal = cardLayout === "horizontal";

  const alignClass     = alignment === "center" ? "items-center text-center" : alignment === "right" ? "items-end text-right" : "items-start text-left";
  const iconAlignClass = alignment === "center" ? "mx-auto" : alignment === "right" ? "ml-auto" : "";
  const items: FeatureItem[] = (content.items as FeatureItem[]) ?? [];

  const iconSizeMap: Record<string, { wrap: string; img: number; fa: string }> = {
    sm: { wrap: "w-12 h-12", img: 32,  fa: "text-lg"  },
    md: { wrap: "w-16 h-16", img: 48,  fa: "text-xl"  },
    lg: { wrap: "w-24 h-24", img: 72,  fa: "text-3xl" },
    xl: { wrap: "w-32 h-32", img: 96,  fa: "text-4xl" },
  };
  const sz = iconSizeMap[iconSize] ?? iconSizeMap.md;

  // Vertical layout — CSS grid
  const gridClass =
    columns === 2 ? "grid-cols-1 sm:grid-cols-2"
    : columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  // Horizontal layout — flex-wrap for orphan centering
  const hItemClass =
    columns === 2
      ? "w-full sm:w-[calc(50%-12px)]"
      : columns === 4
      ? "w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
      : "w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]";

  const cardBase = "rounded-2xl p-5 transition-shadow";

  return (
    <section id={section.anchor_id || undefined} className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.heading && (
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {content.heading as string}
          </h2>
        )}

        {isHorizontal ? (
          /* ── Horizontal layout ─────────────────────────────────── */
          <div className={`grid ${gridClass} gap-6`}>
            {items.map((item, i) => {
              const isLastOdd = i === items.length - 1 && items.length % columns !== 0;
              return (
                <div
                  key={i}
                  className={`${cardBase} flex flex-row items-start gap-4${isLastOdd && columns === 2 ? " sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full" : ""}`}
                  style={{
                    backgroundColor: item.bg_color || "#ffffff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                  }}
                >
                  {/* Image / icon circle — flex-shrink-0 keeps size fixed */}
                  {(item.image_url || item.icon) && (
                    <div className={`${sz.wrap} flex-shrink-0 rounded-full bg-white flex items-center justify-center overflow-hidden`}>
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.title || ""}
                          width={sz.img}
                          height={sz.img}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <i className={`${item.icon} text-orange-500 ${sz.fa}`} />
                      )}
                    </div>
                  )}
                  {/* Text — titles & descs align naturally since image size is fixed */}
                  <div className="flex-1 min-w-0">
                    {item.title && (
                      <h3
                        className="font-semibold mb-2 leading-snug"
                        style={{ color: item.title_color || "#111827" }}
                      >
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: item.desc_color || "#6b7280" }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Vertical layout (default) ─────────────────────────── */
          <div className={`grid ${gridClass} gap-6`}>
            {items.map((item, i) => (
              <div
                key={i}
                className={`${cardBase} flex flex-col ${alignClass}`}
                style={{
                  backgroundColor: item.bg_color || "#ffffff",
                  boxShadow: item.bg_color ? "none" : "0 1px 3px rgba(0,0,0,0.07)",
                }}
              >
                {(item.image_url || item.icon) && (
                  <div className={`${sz.wrap} ${iconAlignClass} rounded-full bg-white flex items-center justify-center mb-5 overflow-hidden flex-shrink-0`}>
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title || ""}
                        width={sz.img}
                        height={sz.img}
                        className="object-contain"
                      />
                    ) : (
                      <i className={`${item.icon} text-orange-500 ${sz.fa}`} />
                    )}
                  </div>
                )}
                {item.title && (
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: item.title_color || "#111827" }}
                  >
                    {item.title}
                  </h3>
                )}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: item.desc_color || "#6b7280" }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
