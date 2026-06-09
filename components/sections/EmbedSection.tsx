import type { PageSection } from "@/lib/types";

export default function EmbedSection({ section }: { section: PageSection }) {
  const { content } = section;

  if (!content.html) return null;

  return (
    <section id={section.anchor_id || undefined} className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="w-full"
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      </div>
    </section>
  );
}
