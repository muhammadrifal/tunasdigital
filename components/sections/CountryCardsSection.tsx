import Image from "next/image";
import type { PageSection } from "@/lib/types";

interface CountryCard {
  flag_url?: string;
  country_name?: string;
  title?: string;
  description?: string;
}

export default function CountryCardsSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const bgColor     = (settings.bg_color     as string) || "#FFC107";
  const accentColor = (settings.accent_color as string) || "#dc2626";
  const columns     = (settings.columns      as number) || 3;
  const items       = (content.items         as CountryCard[]) || [];

  const itemClass = columns === 2
    ? "w-full sm:w-[calc(50%-10px)]"
    : "w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]";

  return (
    <section
      id={section.anchor_id || undefined}
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-5xl mx-auto">
        {content.heading && (
          <div
            className="text-center text-base sm:text-lg text-gray-900 mb-10 max-w-2xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.heading as string }}
          />
        )}

        <div className="flex flex-wrap justify-center gap-5">
          {items.map((item, i) => (
            <div key={i} className={`${itemClass} bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3`}>
              <div className="flex items-center gap-2">
                {item.flag_url && (
                  <Image
                    src={item.flag_url}
                    alt={item.country_name || ""}
                    width={28}
                    height={20}
                    className="object-contain rounded-sm flex-shrink-0"
                  />
                )}
                {item.country_name && (
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: accentColor }}
                  >
                    {item.country_name}
                  </span>
                )}
              </div>
              {item.title && (
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {item.title}
                </h3>
              )}
              {item.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {content.footer && (
          <div
            className="text-center text-sm sm:text-base text-gray-900 mt-10 max-w-2xl mx-auto leading-relaxed [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: content.footer as string }}
          />
        )}
      </div>
    </section>
  );
}
