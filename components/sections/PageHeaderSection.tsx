import type { PageSection } from "@/lib/types";

export default function PageHeaderSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const bgHeight   = (settings.bg_height    as string | undefined) || "280px";
  const bgColor    = (settings.bg_color     as string | undefined) || "#f97316";
  const bgPosition = (settings.bg_position  as string | undefined) || "center";
  const labelColor = (settings.label_color  as string | undefined) || "#f97316";

  return (
    <section id={section.anchor_id || undefined}>
      {/* Background image area */}
      <div
        className="w-full"
        style={{
          height: bgHeight,
          backgroundColor: bgColor,
          backgroundImage: content.image_url ? `url(${content.image_url})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: bgPosition,
        }}
      />

      {/* White card overlapping upward */}
      <div className="relative -mt-16 z-10 mx-4 sm:mx-8 lg:mx-auto lg:max-w-5xl bg-white rounded-[2.5rem] px-6 sm:px-12 pt-10 pb-12 text-center shadow-sm">
        {content.label && (
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: labelColor }}>
            {content.label as string}
          </p>
        )}
        {content.heading && (
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            {content.heading}
          </h1>
        )}
        {content.body && (
          <div
            className="text-gray-500 text-base leading-relaxed max-w-2xl mx-auto [&_a]:text-orange-500 [&_strong]:text-orange-500"
            dangerouslySetInnerHTML={{ __html: content.body }}
          />
        )}
      </div>
    </section>
  );
}
