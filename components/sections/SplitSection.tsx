import Image from "next/image";
import Link from "next/link";
import type { PageSection } from "@/lib/types";

export default function SplitSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const imageOnLeft    = (settings.image_side         ?? "left")    === "left";
  const imageBg        = settings.image_bg_color      ?? "#fde047";
  const cardBg         = settings.card_bg_color       ?? "#ffffff";
  const imageBorderRadius = (settings.image_border_radius as string) || "0px";
  const cardShadow        = settings.card_shadow !== false;
  const ctaStyle    = {
    ...(settings.cta_bg   ? { backgroundColor: settings.cta_bg   } : {}),
    ...(settings.cta_text ? { color:           settings.cta_text } : {}),
  };

  const imageCol = (
    <div className="relative flex items-center justify-center min-h-[320px] lg:min-h-[420px]">
      {/* Blob background */}
      <div
        className="absolute inset-6 rounded-[2.5rem]"
        style={{ backgroundColor: imageBg }}
      />
      {content.image_url && (
        <Image
          src={content.image_url}
          alt={content.image_alt || content.heading || ""}
          width={0}
          height={0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="relative z-10 w-full h-auto max-h-[420px] object-contain"
          style={{ borderRadius: imageBorderRadius }}
        />
      )}
    </div>
  );

  const cardCol = (
    <div className="flex items-center justify-center">
      <div
        className={`rounded-3xl p-8 lg:p-10 w-full ${cardShadow ? "shadow-lg" : ""}`}
        style={{ backgroundColor: cardBg }}
      >
        {content.heading && (
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {content.heading}
          </h2>
        )}
        {content.body && (
          <div
            className="text-gray-500 text-base leading-relaxed mb-8 prose prose-sm max-w-none [&_strong]:font-bold [&_a]:text-orange-500 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: content.body as string }}
          />
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
    </div>
  );

  return (
    <section
      id={section.anchor_id || undefined}
      className="py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {imageOnLeft ? (
          <>
            {imageCol}
            {cardCol}
          </>
        ) : (
          <>
            {cardCol}
            {imageCol}
          </>
        )}
      </div>
    </section>
  );
}
