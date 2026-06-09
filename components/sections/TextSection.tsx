import type { PageSection } from "@/lib/types";

export default function TextSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const width = settings.width ?? "narrow";

  return (
    <section id={section.anchor_id || undefined} className="py-16">
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${
          width === "narrow" ? "max-w-3xl" : width === "wide" ? "max-w-6xl" : "max-w-7xl"
        }`}
      >
        <div
          className="prose prose-lg max-w-none [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5"
          dangerouslySetInnerHTML={{ __html: content.html || "" }}
        />
      </div>
    </section>
  );
}
