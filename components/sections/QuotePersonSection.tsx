import Image from "next/image";
import type { PageSection } from "@/lib/types";

export default function QuotePersonSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const accentColor = (settings.accent_color as string | undefined) || "#f97316";
  const photoBg     = (settings.photo_bg    as string | undefined) || "#f1f0f5";

  return (
    <section id={section.anchor_id || undefined} className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">

        {/* Left: Quote card */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-8 md:py-10">
          {content.quote && (
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              &ldquo;{content.quote}&rdquo;
            </p>
          )}
          <div>
            {content.name && (
              <p className="font-bold text-gray-900 text-base">{content.name},</p>
            )}
            {content.title && (
              <p className="font-semibold text-base" style={{ color: accentColor }}>
                {content.title}
              </p>
            )}
          </div>
        </div>

        {/* Right: Photo */}
        {content.photo_url && (
          <div
            className="flex-shrink-0 rounded-3xl overflow-hidden"
            style={{ backgroundColor: photoBg }}
          >
            <Image
              src={content.photo_url as string}
              alt={(content.name as string) || ""}
              width={280}
              height={320}
              className="w-64 md:w-72 h-auto object-cover"
            />
          </div>
        )}

      </div>
    </section>
  );
}
