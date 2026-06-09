import Link from "next/link";
import type { PageSection } from "@/lib/types";
import DoodleDecor from "./DoodleDecor";

interface TimelineItem {
  label: string;
  title: string;
  description: string;
}

export default function TimelineSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const items: TimelineItem[] = content.items ?? [];
  const bgColor    = settings.bg_color    ?? "#2323e8";
  const badgeColor = settings.badge_color ?? "#f5c400";

  return (
    <section
      id={section.anchor_id || undefined}
      className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: bgColor }}
    >
      {settings.doodle && (
        <DoodleDecor corners={settings.doodle_corners} color={settings.doodle_color} />
      )}

      {/* Header */}
      <div className="relative z-10 max-w-3xl mx-auto text-center mb-14">
        {content.heading && (
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
            {content.heading}
          </h2>
        )}
        {content.subheading && (
          <p
            className="text-sm sm:text-base text-white/80 leading-relaxed mb-7"
            dangerouslySetInnerHTML={{ __html: content.subheading }}
          />
        )}
        {content.cta?.text && content.cta?.url && (
          <Link
            href={content.cta.url}
            className="inline-flex items-center px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors shadow-lg"
          >
            {content.cta.text}
          </Link>
        )}
      </div>

      {/* Timeline */}
      {items.length > 0 && (
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Desktop layout — one column per item so badge/dot/arrow are always aligned */}
          <div
            className="hidden md:grid"
            style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
          >
            {items.map((item, i) => (
              <div key={i} className="flex flex-col items-center">

                {/* Badge */}
                <span
                  className="px-5 py-2 rounded-xl text-base font-extrabold text-gray-900 shadow-md whitespace-nowrap"
                  style={{ backgroundColor: badgeColor }}
                >
                  {item.label}
                </span>

                {/* Connector: line segment + dot */}
                <div className="relative flex items-center justify-center w-full h-12">
                  {/* Left half line */}
                  {i > 0 && (
                    <div className="absolute left-0 right-1/2 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/40" />
                  )}
                  {/* Right half line */}
                  {i < items.length - 1 && (
                    <div className="absolute left-1/2 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/40" />
                  )}
                  {/* Dot */}
                  <div className="relative z-10 w-5 h-5 rounded-full border-4 border-white bg-orange-500 shadow-lg" />
                </div>

                {/* Card */}
                <div className="relative w-full px-3 flex-1 flex flex-col">
                  {/* Arrow pointing up — centered on dot */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: "12px solid transparent",
                      borderRight: "12px solid transparent",
                      borderBottom: "12px solid white",
                    }}
                  />
                  <div className="bg-white rounded-2xl p-5 shadow-lg flex-1">
                    <h3 className="text-base font-extrabold text-gray-900 leading-snug mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Mobile layout — vertical stacked */}
          <div className="md:hidden space-y-4">
            {items.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                {/* Left: badge + line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <span
                    className="px-3 py-1.5 rounded-lg text-sm font-extrabold text-gray-900 whitespace-nowrap"
                    style={{ backgroundColor: badgeColor }}
                  >
                    {item.label}
                  </span>
                  {i < items.length - 1 && (
                    <div className="w-0.5 flex-1 mt-2 border-l-2 border-dashed border-white/40 min-h-[24px]" />
                  )}
                </div>
                {/* Right: card */}
                <div className="flex-1 bg-white rounded-2xl p-4 shadow-md">
                  <h3 className="text-sm font-extrabold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
