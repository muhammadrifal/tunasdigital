import type { PageSection } from "@/lib/types";

export default function DividerSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const style = settings.style ?? "line";

  return (
    <section id={section.anchor_id || undefined} className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {style === "dots" ? (
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="w-2 h-2 rounded-full bg-gray-300" />
            ))}
          </div>
        ) : style === "wave" ? (
          <svg viewBox="0 0 1200 60" className="w-full h-8 text-gray-200">
            <path
              d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <div className="flex items-center gap-4">
            <hr className="flex-1 border-gray-200" />
            {content.text && (
              <span className="text-sm text-gray-400 whitespace-nowrap">
                {content.text}
              </span>
            )}
            {content.text && <hr className="flex-1 border-gray-200" />}
          </div>
        )}
      </div>
    </section>
  );
}
