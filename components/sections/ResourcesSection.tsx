"use client";

import { useEffect, useState } from "react";
import type { PageSection } from "@/lib/types";

interface VideoItem {
  id: number;
  title: string;
  description?: string;
  youtube_id?: string;
  youtube_url: string;
  thumbnail: string;
  category?: { id: number; name: string; slug: string } | null;
}

interface GuideItem {
  title?: string;
  description?: string;
  link_text?: string;
  link_url?: string;
  image_url?: string;
}

const imageSizeClass: Record<string, string> = {
  sm: "sm:w-36",
  md: "sm:w-52",
  lg: "sm:w-72",
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 68 48" className="w-14 h-10">
      <path
        d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
        fill="#ff0000"
        fillOpacity={0.9}
      />
      <path d="M 45,24 27,14 27,34" fill="#fff" />
    </svg>
  );
}

export default function ResourcesSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const bgColor      = (settings.bg_color      as string) || "#fce7f3";
  const headingColor = (settings.heading_color  as string) || "#1f2937";
  const subColor     = (settings.sub_color      as string) || "#6b7280";
  const accentColor  = (settings.accent_color   as string) || "#f97316";
  const cardBg       = (settings.card_bg        as string) || "#ffffff";
  const guideImgSize    = (settings.guide_image_size    as string) || "md";
  const guideRadius     = (settings.guide_border_radius as string) || "1rem";
  const guideTitleColor = (settings.guide_title_color   as string) || "#111827";
  const showVideos   = settings.show_videos !== false;
  const videoCount   = parseInt((settings.video_count as string) || "2");
  const videoLayout  = (settings.video_layout as string) || "grid";
  const catSlugs     = (settings.video_category_slugs as string[]) || [];
  const guides       = (content.guides as GuideItem[]) || [];

  const [videos, setVideos]   = useState<VideoItem[]>([]);
  const [playing, setPlaying] = useState<number | null>(null);
  const [loading, setLoading] = useState(showVideos);

  useEffect(() => {
    if (!showVideos) return;
    const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
    const params  = new URLSearchParams({ per_page: String(videoCount) });
    if (catSlugs.length > 0) params.set("categories", catSlugs.join(","));

    fetch(`${apiBase}/videos?${params}`, { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((json) => { if (json.success) setVideos(json.data ?? []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVideos, catSlugs.join(","), videoCount]);

  return (
    <section
      id={section.anchor_id || undefined}
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-5xl mx-auto">
        {content.heading && (
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-center leading-tight mb-3"
            style={{ color: headingColor }}
          >
            {content.heading as string}
          </h2>
        )}
        {content.subheading && (
          <p
            className="text-center text-base leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{ color: subColor }}
          >
            {content.subheading as string}
          </p>
        )}

        {/* ── Video cards dari CMS ── */}
        {showVideos && loading ? (
          <div className={`flex flex-wrap justify-center gap-5 mb-5`}>
            {Array.from({ length: videoCount }).map((_, i) => (
              <div key={i} className={`${videoLayout === "large" ? "w-full" : "w-full sm:w-[calc(50%-10px)]"} rounded-2xl bg-gray-200 animate-pulse aspect-video`} />
            ))}
          </div>
        ) : showVideos && videos.length > 0 && (
          <div className={`flex flex-wrap justify-center gap-5 mb-5`}>
            {videos.map((video) => (
              <div
                key={video.id}
                className={`${videoLayout === "large" ? "w-full" : "w-full sm:w-[calc(50%-10px)]"} rounded-2xl overflow-hidden shadow-sm flex flex-col`}
                style={{ backgroundColor: cardBg }}
              >
                <div
                  className="relative aspect-video bg-gray-900 cursor-pointer overflow-hidden group"
                  onClick={() => setPlaying(playing === video.id ? null : video.id)}
                >
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
                          ? `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`
                          : video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <PlayIcon />
                      </div>
                    </>
                  )}
                </div>

                <div className="p-5 flex flex-col gap-1 flex-1">
                  {video.category && (
                    <p className="text-xs font-semibold" style={{ color: accentColor }}>
                      {video.category.name}
                    </p>
                  )}
                  <h3 className="font-bold text-base leading-snug text-gray-900">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Guide cards manual ── */}
        {guides.length > 0 && (
          <div className="flex flex-col gap-4">
            {guides.map((item, i) => (
              <div
                key={i}
                className="overflow-hidden shadow-sm flex flex-col sm:flex-row items-stretch"
                style={{ backgroundColor: cardBg, borderRadius: guideRadius }}
              >
                {item.image_url && (
                  <div className={`${imageSizeClass[guideImgSize] || "sm:w-52"} flex-shrink-0 bg-gray-100`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.title || ""}
                      className="w-full h-52 sm:h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col gap-2 justify-center flex-1">
                  {item.title && (
                    <h3 className="font-bold text-base leading-snug" style={{ color: guideTitleColor }}>
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <div
                      className="text-sm text-gray-500 leading-relaxed [&_p]:mb-2 [&_strong]:font-bold [&_a]:text-orange-500 [&_a]:underline"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}
                  {item.link_text && item.link_url && (
                    <a
                      href={item.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold mt-1 hover:underline"
                      style={{ color: accentColor }}
                    >
                      {item.link_text}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer / sumber ── */}
        {content.footer_text && (
          <p
            className="mt-8 text-xs text-gray-400 leading-relaxed [&_em]:italic [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: content.footer_text as string }}
          />
        )}
      </div>
    </section>
  );
}
