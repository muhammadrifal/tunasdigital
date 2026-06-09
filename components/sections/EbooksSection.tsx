import Image from "next/image";
import Link from "next/link";
import type { EbookListItem, PageSection } from "@/lib/types";

function EbookCard({ ebook, sizes }: { ebook: EbookListItem; sizes: string }) {
  return (
    <Link
      href={`/pustaka/${ebook.slug}`}
      className="group flex flex-col"
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-[40px]">
        {ebook.cover_image ? (
          <Image
            src={ebook.cover_image}
            alt={ebook.title}
            fill
            sizes={sizes}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50">
            <svg className="w-14 h-14 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        {ebook.category && (
          <p className="text-xs font-semibold text-primary mb-2">
            {ebook.category.name}
          </p>
        )}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-3 group-hover:text-primary transition-colors">
          {ebook.title}
        </h3>
      </div>
    </Link>
  );
}

export default function EbooksSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const ebooks: EbookListItem[] = section.resolved?.ebooks ?? [];

  const columns = parseInt(settings.columns ?? "3");
  const gridCols =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const imgSizes =
    columns === 2
      ? "(max-width: 640px) 100vw, 50vw"
      : columns === 4
      ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw";

  const ctaText = content.cta_text as string | undefined;
  const ctaUrl  = content.cta_url  as string | undefined;

  if (ebooks.length === 0) return null;

  return (
    <section id={section.anchor_id || undefined} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        {(content.heading || content.subheading || ctaText) && (
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

        {/* Grid */}
        <div className={`grid ${gridCols} gap-6`}>
          {ebooks.map((ebook) => (
            <EbookCard key={ebook.id} ebook={ebook} sizes={imgSizes} />
          ))}
        </div>

      </div>
    </section>
  );
}
