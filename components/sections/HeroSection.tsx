"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PageSection } from "@/lib/types";

interface Slide {
  image_url?: string;
  image_alt?: string;
  heading?: string;
  body?: string;
  cta_primary?: { text?: string; url?: string };
  cta_secondary?: { text?: string; url?: string };
}

export default function HeroSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const slides: Slide[] = content.slides?.length ? content.slides : [];
  const minHeight = settings.min_height ?? "75vh";
  const interval = settings.autoplay_interval ?? 5000;
  const cardPosition = settings.card_position ?? "left";

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 600);
    },
    [animating, current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setTimeout(next, interval);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, next, interval, slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];

  const cardAlignClass =
    cardPosition === "right"
      ? "justify-end"
      : cardPosition === "center"
      ? "justify-center"
      : "justify-start";

  return (
    <section
      id={section.anchor_id || undefined}
      className="group relative overflow-hidden"
      style={{ minHeight }}
    >
      {/* Background images — crossfade */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {s.image_url && (
            <Image
              src={s.image_url}
              alt={s.image_alt || ""}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          )}
        </div>
      ))}

      {/* Content */}
      <div
        className={`relative z-10 flex items-center ${cardAlignClass} min-h-[inherit] w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16`}
        style={{ minHeight }}
      >
        {/* White card */}
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-2xl px-8 py-10">
          {slide.heading && (
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {slide.heading}
            </h1>
          )}
          {slide.body && (
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8">
              {slide.body}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {slide.cta_primary?.text && slide.cta_primary?.url && (
              <Link
                href={slide.cta_primary.url}
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors shadow"
              >
                {slide.cta_primary.text}
              </Link>
            )}
            {slide.cta_secondary?.text && slide.cta_secondary?.url && (
              <Link
                href={slide.cta_secondary.url}
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors shadow"
              >
                {slide.cta_secondary.text}
              </Link>
            )}
          </div>

          {/* Dots */}
          {slides.length > 1 && (
            <div className="flex items-center gap-2 mt-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (timerRef.current) clearTimeout(timerRef.current);
                    goTo(i);
                  }}
                  aria-label={`Slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-7 h-2.5 bg-orange-500"
                      : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Arrow prev/next — optional, shown on hover */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
              goTo((current - 1 + slides.length) % slides.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white shadow transition-all opacity-0 group-hover:opacity-100"
            aria-label="Sebelumnya"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white shadow transition-all opacity-0 group-hover:opacity-100"
            aria-label="Selanjutnya"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
