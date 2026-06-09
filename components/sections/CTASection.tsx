import Link from "next/link";
import type { PageSection } from "@/lib/types";

export default function CTASection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const bgColor = settings.bg_color ?? "#fff7ed";

  return (
    <section
      id={section.anchor_id || undefined}
      className="py-16"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {content.heading && (
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {content.heading}
          </h2>
        )}
        {content.body && (
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {content.body}
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          {content.cta_primary?.text && content.cta_primary?.url && (
            <Link
              href={content.cta_primary.url}
              className="inline-flex items-center px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors shadow"
            >
              {content.cta_primary.text}
            </Link>
          )}
          {content.cta_secondary?.text && content.cta_secondary?.url && (
            <Link
              href={content.cta_secondary.url}
              className="inline-flex items-center px-6 py-3 rounded-full border-2 border-gray-800 text-gray-800 font-semibold hover:bg-gray-800 hover:text-white transition-colors"
            >
              {content.cta_secondary.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
