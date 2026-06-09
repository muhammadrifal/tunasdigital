import Image from "next/image";
import type { PageSection } from "@/lib/types";

export default function GallerySection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const columns = parseInt(settings.columns ?? "3");
  const images: { url: string; alt: string }[] = content.images ?? [];

  const gridClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-3";

  return (
    <section id={section.anchor_id || undefined} className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.heading && (
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            {content.heading}
          </h2>
        )}
        <div className={`grid ${gridClass} gap-4`}>
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={img.url}
                alt={img.alt || ""}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
