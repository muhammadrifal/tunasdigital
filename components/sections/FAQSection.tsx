"use client";

import { useState } from "react";
import type { PageSection } from "@/lib/types";

interface FAQRow   { label: string; value: string }
interface FAQItem  { question: string; answer?: string; answer_type?: string; rows?: FAQRow[] }

export default function FAQSection({ section }: { section: PageSection }) {
  const { content } = section;
  const items: FAQItem[] = content.items ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id={section.anchor_id || undefined} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {content.heading && (
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {content.heading}
          </h2>
        )}

        <div>
          {items.map((item, i) => {
            const isOpen    = openIndex === i;
            const num       = String(i + 1).padStart(2, "0");
            const isTable   = item.answer_type === "rows" && (item.rows?.length ?? 0) > 0;
            const hasContent = isTable || !!item.answer;

            return (
              <div key={i} className="border-b border-gray-200 last:border-b-0">
                <button
                  className="w-full flex items-center gap-5 py-6 text-left group"
                  onClick={() => hasContent && setOpenIndex(isOpen ? null : i)}
                  disabled={!hasContent}
                >
                  {/* Number */}
                  <span className="flex-shrink-0 text-sm font-bold text-gray-400 w-6">
                    {num}
                  </span>

                  {/* Question */}
                  <span className="flex-1 text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {item.question}
                  </span>

                  {/* +/− toggle */}
                  {hasContent && (
                    <span
                      className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white transition-transform duration-300 shadow-sm"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  )}
                </button>

                {/* Answer */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? "800px" : "0px" }}
                >
                  <div className="pl-11 pb-6">
                    {isTable ? (
                      <div className="space-y-3">
                        {item.rows!.map((row, ri) => (
                          <div key={ri} className="grid grid-cols-[10rem_1fr] gap-4 text-sm">
                            <span className="font-semibold text-gray-700 pt-0.5">{row.label}</span>
                            <span className="text-gray-500 leading-relaxed">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm leading-relaxed">{item.answer}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
