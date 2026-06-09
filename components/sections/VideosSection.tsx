"use client";

import { useEffect, useState } from "react";
import type { PageSection } from "@/lib/types";

interface VideoItem {
  id: number;
  title: string;
  slug: string;
  description?: string;
  youtube_id?: string;
  youtube_url: string;
  thumbnail: string;
  category?: { id: number; name: string; slug: string } | null;
  published_at?: string;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 68 48" className="w-16 h-12">
      <path
        d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
        fill="#ff0000"
        fillOpacity={0.9}
      />
      <path d="M 45,24 27,14 27,34" fill="#fff" />
    </svg>
  );
}

export default function VideosSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [playing, setPlaying] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const columns      = parseInt(settings.columns ?? "3");
  const count        = parseInt(settings.count ?? "6");
  const catSlugs     = (settings.category_slugs ?? []) as string[];
  const showDesc     = settings.show_description !== false;

  const itemClass =
    columns === 2
      ? "w-full sm:w-[calc(50%-12px)]"
      : columns === 4
      ? "w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
      : "w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]";

  const imgSizes =
    columns === 2
      ? "(max-width: 640px) 100vw, 50vw"
      : columns === 4
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  useEffect(() => {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
    const params  = new URLSearchParams({ per_page: String(count) });
    if (catSlugs.length > 0) params.set("categories", catSlugs.join(","));

    fetch(`${apiBase}/videos?${params}`, { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setVideos(json.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catSlugs.join(","), count]);

  return (
    <section
      id={section.anchor_id || undefined}
      className="py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(content.heading || content.subheading) && (
          <div className="text-center mb-12">
            {content.heading && (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                {content.heading}
              </h2>
            )}
            {content.subheading && (
              <p className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed">
                {content.subheading}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex flex-wrap justify-center gap-6">
            {Array.from({ length: count > 6 ? 6 : count }).map((_, i) => (
              <div key={i} className={`${itemClass} rounded-2xl bg-gray-100 animate-pulse aspect-video`} />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className={`${itemClass} group rounded-2xl overflow-hidden shadow-sm bg-white`}
              >
                {/* Thumbnail / Player */}
                <div className="relative aspect-video bg-gray-900 cursor-pointer overflow-hidden"
                     onClick={() => setPlaying(playing === video.id ? null : video.id)}>
                  {playing === video.id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1`}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      loading="lazy"
                      title={video.title}
                    />
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.youtube_id
                          ? `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`
                          : video.thumbnail}
                        alt={video.title}
                        sizes={imgSizes}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <PlayIcon />
                      </div>
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  {video.category && (
                    <p className="text-xs font-semibold text-primary mb-1">
                      {video.category.name}
                    </p>
                  )}
                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                    {video.title}
                  </h3>
                  {showDesc && video.description && (
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm">Belum ada video tersedia.</p>
        )}
      </div>
    </section>
  );
}
