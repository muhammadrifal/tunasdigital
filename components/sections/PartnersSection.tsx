import Image from "next/image";
import Link from "next/link";
import type { PageSection } from "@/lib/types";

interface Partner {
  name: string;
  logo_url: string;
  url: string;
}

export default function PartnersSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const items: Partner[] = content.items ?? [];
  const bgColor = (settings.bg_color as string | undefined) || "#166534";
  const ctaText = content.cta_text as string | undefined;
  const ctaUrl = content.cta_url as string | undefined;

  if (items.length === 0) return null;

  return (
    <section
      id={section.anchor_id || undefined}
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        {(content.heading || content.subheading) && (
          <div className="text-center mb-10">
            {content.heading && (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                {content.heading}
              </h2>
            )}
            {content.subheading && (
              <p className="text-white/80 max-w-2xl mx-auto text-base leading-relaxed mb-6">
                {content.subheading}
              </p>
            )}
            {ctaText && ctaUrl && (
              <Link
                href={ctaUrl}
                className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {ctaText}
              </Link>
            )}
          </div>
        )}

        {/* Logos container */}
        <div className="bg-white rounded-2xl px-8 py-6 flex flex-wrap items-center justify-center gap-8">
          {items.map((partner, i) => {
            const inner = partner.logo_url ? (
              <Image
                src={partner.logo_url}
                alt={partner.name || `Mitra ${i + 1}`}
                width={140}
                height={60}
                loading="lazy"
                className="max-h-14 w-auto object-contain"
              />
            ) : (
              <span className="text-sm font-semibold text-gray-500">
                {partner.name}
              </span>
            );

            return partner.url ? (
              <a
                key={i}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center hover:opacity-75 transition-opacity"
              >
                {inner}
              </a>
            ) : (
              <div key={i} className="flex items-center justify-center">
                {inner}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
