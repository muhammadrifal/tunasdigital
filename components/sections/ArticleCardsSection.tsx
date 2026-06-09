"use client";

import { useState } from "react";
import type { PageSection } from "@/lib/types";

interface FaqItem {
  question?: string;
  answer?: string;
}

interface ArticleCard {
  title?: string;
  body?: string;
  source?: string;
  images?: string[];
  faq_heading?: string;
  faq_items?: FaqItem[];
}

export default function ArticleCardsSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const bgColor        = (settings.bg_color        as string) || "#fef08a";
  const cardBg         = (settings.card_bg         as string) || "#ffffff";
  const cardRadius     = (settings.card_radius     as string) || "1.5rem";
  const imgWidth       = (settings.image_width     as string) || "md";
  const headingColor   = (settings.heading_color   as string) || "#111827";
  const subColor       = (settings.sub_color       as string) || "#6b7280";
  const titleColor     = (settings.title_color     as string) || "#111827";
  const bodyColor      = (settings.body_color      as string) || "#374151";
  const paddingY       = (settings.padding_y       as string) || "4rem";
  const imgPadding     = (settings.image_padding   as string) || "0";
  const imgGap         = (settings.image_gap       as string) || "0";
  const imgRadius      = (settings.image_radius    as string) || "0";
  const faqHeadingColor = (settings.faq_heading_color as string) || "#f97316";
  const faqAccentColor  = (settings.faq_accent_color  as string) || "#f97316";
  const faqQuestionColor = (settings.faq_question_color as string) || "#111827";
  const cards = (content.cards as ArticleCard[]) || [];

  const [openFaq, setOpenFaq] = useState<Record<string, boolean>>({});
  const toggleFaq = (key: string) => setOpenFaq((prev) => ({ ...prev, [key]: !prev[key] }));

  const imgWidthClass: Record<string, string> = {
    sm: "sm:w-48",
    md: "sm:w-64",
    lg: "sm:w-80",
  };

  return (
    <section
      id={section.anchor_id || undefined}
      className="px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: bgColor, paddingTop: paddingY, paddingBottom: paddingY }}
    >
      <div className="max-w-5xl mx-auto">
        {(content.heading || content.subheading) && (
          <div className="text-center mb-12">
            {content.heading && (
              <h2
                className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3"
                style={{ color: headingColor }}
              >
                {content.heading as string}
              </h2>
            )}
            {content.subheading && (
              <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: subColor }}>
                {content.subheading as string}
              </p>
            )}
          </div>
        )}

        <div className="space-y-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className="overflow-hidden shadow-sm"
              style={{ backgroundColor: cardBg, borderRadius: cardRadius }}
            >
              {/* ── Article row ── */}
              <div className="flex flex-col sm:flex-row">
                {card.images && card.images.length > 0 && (
                  <div
                    className={`w-full ${imgWidthClass[imgWidth] || imgWidthClass.md} flex-shrink-0 flex flex-col`}
                    style={{ gap: imgGap, padding: imgPadding }}
                  >
                    {card.images.map((url, j) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={j}
                        src={url}
                        alt=""
                        className="w-full object-cover flex-1"
                        style={{ minHeight: "10rem", borderRadius: imgRadius }}
                      />
                    ))}
                  </div>
                )}
                <div className="flex-1 p-6 sm:p-8 flex flex-col gap-4 min-w-0">
                  {card.title && (
                    <h3 className="text-xl font-bold leading-snug" style={{ color: titleColor }}>
                      {card.title}
                    </h3>
                  )}
                  {card.body && (
                    <div
                      className="text-sm leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_em]:italic [&_a]:text-orange-500 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5"
                      style={{ color: bodyColor }}
                      dangerouslySetInnerHTML={{ __html: card.body }}
                    />
                  )}
                  {card.source && (
                    <div
                      className="text-sm leading-relaxed mt-auto pt-2 [&_strong]:font-bold [&_a]:underline [&_em]:italic"
                      dangerouslySetInnerHTML={{ __html: card.source }}
                    />
                  )}
                </div>
              </div>

              {/* ── FAQ accordion ── */}
              {card.faq_items && card.faq_items.length > 0 && (
                <div className="px-6 sm:px-8 pb-2">
                  {card.faq_heading && (
                    <p className="text-base font-bold mb-4" style={{ color: faqHeadingColor }}>
                      {card.faq_heading}
                    </p>
                  )}
                  <div className="divide-y divide-gray-200 border-t border-gray-200">
                    {card.faq_items.map((faq, j) => {
                      const key = `${i}-${j}`;
                      const isOpen = !!openFaq[key];
                      return (
                        <div key={j}>
                          <button
                            type="button"
                            className="w-full flex items-center justify-between py-4 text-left gap-4"
                            onClick={() => toggleFaq(key)}
                          >
                            <span className="text-sm font-bold" style={{ color: faqQuestionColor }}>
                              {faq.question}
                            </span>
                            <span
                              className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-white text-lg font-bold transition-transform"
                              style={{ backgroundColor: faqAccentColor, transform: isOpen ? "rotate(45deg)" : "none" }}
                            >
                              +
                            </span>
                          </button>
                          {isOpen && faq.answer && (
                            <div
                              className="pb-4 text-sm leading-relaxed [&_p]:mb-2 [&_strong]:font-bold [&_a]:text-orange-500 [&_a]:underline"
                              style={{ color: bodyColor }}
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
