"use client";

import { useState, useEffect, useCallback } from "react";
import type { PageSection } from "@/lib/types";

interface QuoteSlide {
  quote: string;
  author_name: string;
  author_title: string;
  bg_color: string;
}

export default function QuotesSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const slides: QuoteSlide[] = content.slides ?? [];
  const interval = settings.autoplay_interval ?? 5000;
  const quoteColor = settings.quote_color ?? "#7c3aed";

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval, slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <section
      id={section.anchor_id || undefined}
      className="relative overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: slide.bg_color || "#a78bfa" }}
    >
      <div className="relative max-w-5xl mx-auto px-8 py-20 sm:py-24">
        {/* Decorative quote marks */}
        <QuoteMarkLeft color={quoteColor} className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 opacity-30 w-16 h-16 sm:w-24 sm:h-24" />
        <QuoteMarkRight color={quoteColor} className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 opacity-30 w-16 h-16 sm:w-24 sm:h-24" />

        {/* Slide content */}
        <div className="relative z-10 text-center px-8 sm:px-24">
          {slides.map((s, i) => (
            <div
              key={i}
              className="transition-opacity duration-700 absolute inset-0 flex flex-col items-center justify-center px-8 sm:px-24"
              style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
            >
              <p className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 leading-relaxed mb-8 italic">
                &ldquo;{s.quote}&rdquo;
              </p>
              {(s.author_name || s.author_title) && (
                <div>
                  {s.author_name && (
                    <p className="text-sm sm:text-base font-bold text-gray-900">{s.author_name},</p>
                  )}
                  {s.author_title && (
                    <p className="text-sm sm:text-base font-bold text-gray-900">{s.author_title}</p>
                  )}
                </div>
              )}
            </div>
          ))}
          {/* spacer so the section has height */}
          <div className="invisible" aria-hidden>
            <p className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed mb-8 italic">
              &ldquo;{slide.quote}&rdquo;
            </p>
            {(slide.author_name || slide.author_title) && (
              <div>
                <p className="text-sm sm:text-base font-bold">{slide.author_name},</p>
                <p className="text-sm sm:text-base font-bold">{slide.author_title}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dots */}
        {slides.length > 1 && (
          <div className="relative z-10 flex justify-center gap-2 mt-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "24px" : "8px",
                  height: "8px",
                  backgroundColor: i === current ? quoteColor : `${quoteColor}66`,
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function QuoteMarkLeft({ color, className }: { color: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 50 Q10 20 40 20 Q25 20 25 40 Q25 55 40 55 L40 70 Q10 70 10 50Z" fill={color} />
      <path d="M42 50 Q42 20 72 20 Q57 20 57 40 Q57 55 72 55 L72 70 Q42 70 42 50Z" fill={color} />
    </svg>
  );
}

function QuoteMarkRight({ color, className }: { color: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 30 Q70 60 40 60 Q55 60 55 40 Q55 25 40 25 L40 10 Q70 10 70 30Z" fill={color} />
      <path d="M38 30 Q38 60 8 60 Q23 60 23 40 Q23 25 8 25 L8 10 Q38 10 38 30Z" fill={color} />
    </svg>
  );
}
