import type { PageSection } from "@/lib/types";

interface StatItem {
  value: string;
  label: string;
  icon?: string;
  bg_color?: string;
  value_color?: string;
  text_color?: string;
}

export default function StatsSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const columns   = parseInt((settings.columns as string) ?? "4");
  const cardStyle = !!(settings.card_style);
  const items: StatItem[] = (content.items as StatItem[]) ?? [];

  // Plain style (existing behavior)
  if (!cardStyle) {
    const gridClass =
      columns === 2 ? "grid-cols-2"
      : columns === 3 ? "grid-cols-2 sm:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-4";

    return (
      <section
        id={section.anchor_id || undefined}
        className="py-16"
        style={{ backgroundColor: (settings.bg_color as string) || "#f9fafb" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {content.heading && (
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {content.heading as string}
            </h2>
          )}
          <div className={`grid ${gridClass} gap-6`}>
            {items.map((item, i) => (
              <div key={i} className="text-center">
                {item.icon && (
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                    <i className={`${item.icon} text-orange-500 text-2xl`} />
                  </div>
                )}
                <p className="text-4xl font-bold text-gray-900 mb-1">{item.value}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Card style — colored background cards, flex-wrap centered
  const itemClass =
    columns === 2 ? "w-full sm:w-[calc(50%-10px)]"
    : "w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]";

  return (
    <section
      id={section.anchor_id || undefined}
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: (settings.bg_color as string) || undefined }}
    >
      <div className="max-w-5xl mx-auto">
        {content.heading && (
          <p className="text-center text-base sm:text-lg text-gray-900 mb-10 max-w-2xl mx-auto leading-relaxed">
            {content.heading as string}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className={`${itemClass} rounded-2xl p-6 flex items-center gap-4`}
              style={{ backgroundColor: item.bg_color || "#f3f4f6" }}
            >
              <span
                className="text-4xl sm:text-5xl font-extrabold leading-none flex-shrink-0"
                style={{ color: item.value_color || "#111827" }}
              >
                {item.value}
              </span>
              <p
                className="text-sm leading-snug [&_strong]:font-bold [&_small]:text-xs [&_small]:opacity-70 [&_br]:block"
                style={{ color: item.text_color || "#374151" }}
                dangerouslySetInnerHTML={{ __html: item.label }}
              />
            </div>
          ))}
        </div>

        {(content.cta_text as string) && (
          <div className="mt-10 text-center">
            <a
              href={(content.cta_url as string) || "#"}
              className="inline-block rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
            >
              {content.cta_text as string}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
