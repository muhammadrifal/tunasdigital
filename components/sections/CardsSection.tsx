import Image from "next/image";
import Link from "next/link";
import type { PageSection } from "@/lib/types";

interface CardItem {
  image_url?: string;
  image_alt?: string;
  title?: string;
  description?: string;
  link_text?: string;
  link_url?: string;
  link_target?: string;
}

export default function CardsSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const items: CardItem[] = content.items ?? [];
  const columns        = String(settings.columns ?? "3");
  const sectionBg      = settings.section_bg_color as string | undefined;
  const cardBg         = settings.card_bg_color    as string | undefined ?? "#ffffff";
  const cardTitleColor = settings.card_title_color as string | undefined;
  const cardBodyColor  = settings.card_body_color  as string | undefined;
  const cardLinkColor  = settings.card_link_color  as string | undefined;
  const ctaStyle  = {
    ...(settings.cta_bg   ? { backgroundColor: settings.cta_bg   } : {}),
    ...(settings.cta_text ? { color:           settings.cta_text } : {}),
  };
  const titleStyle = cardTitleColor ? { color: cardTitleColor } : undefined;
  const bodyStyle  = cardBodyColor  ? { color: cardBodyColor  } : undefined;
  const linkStyle  = cardLinkColor  ? { color: cardLinkColor  } : undefined;

  const containerClass =
    columns === "1-narrow" ? "max-w-3xl mx-auto" : "max-w-7xl mx-auto";

  const gridCols =
    columns === "1" || columns === "1-narrow"
      ? "grid-cols-1"
      : columns === "2"
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === "4"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const cardSizes =
    columns === "1" || columns === "1-narrow"
      ? "100vw"
      : columns === "2"
      ? "(max-width: 640px) 100vw, 50vw"
      : columns === "4"
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <section
      id={section.anchor_id || undefined}
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={sectionBg ? { backgroundColor: sectionBg } : undefined}
    >
      <div className={containerClass}>

        {/* Header */}
        {(content.heading || content.subheading || content.cta?.text) && (
          <div className="text-center mb-12">
            {content.heading && (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                {content.heading}
              </h2>
            )}
            {content.subheading && (
              <p className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed mb-6">
                {content.subheading}
              </p>
            )}
            {content.cta?.text && content.cta?.url && (
              <Link
                href={content.cta.url}
                target={content.cta.target ?? "_self"}
                className="inline-block bg-gray-900 text-white px-7 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            style={ctaStyle}
              >
                {content.cta.text}
              </Link>
            )}
          </div>
        )}

        {/* Cards grid */}
        {items.length > 0 && (
          <div className={`grid ${gridCols} gap-6`}>
            {items.map((card, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl overflow-hidden shadow-sm"
                style={{ backgroundColor: cardBg }}
              >
                {/* Image */}
                {card.image_url && (
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                      src={card.image_url}
                      alt={card.image_alt || card.title || ""}
                      fill
                      sizes={cardSizes}
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  {card.title && (
                    <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug" style={titleStyle}>
                      {card.title}
                    </h3>
                  )}
                  {card.description && (
                    <div
                      className="text-gray-500 text-sm leading-relaxed flex-1 [&_a]:text-orange-500 [&_a]:underline [&_a]:hover:opacity-80"
                      style={bodyStyle}
                      dangerouslySetInnerHTML={{ __html: card.description }}
                    />
                  )}
                  {card.link_text && card.link_url && (
                    <Link
                      href={card.link_url}
                      target={card.link_target ?? "_self"}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                      style={linkStyle}
                    >
                      {card.link_text}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
