"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";
import type { PageSection } from "@/lib/types";

export default function NewsletterSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await subscribeNewsletter(email, "newsletter_section");
      setMessage(
        res.message || content.success_message || "Terima kasih sudah mendaftar!"
      );
      setStatus("success");
      setEmail("");
    } catch {
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
      setStatus("error");
    }
  };

  const isInline = settings.layout === "inline";

  return (
    <section
      id={section.anchor_id || undefined}
      className="py-16"
      style={{ backgroundColor: settings.bg_color || "#fff7ed" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {content.heading && (
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {content.heading}
          </h2>
        )}
        {content.subheading && (
          <p className="text-gray-600 mb-8 leading-relaxed">{content.subheading}</p>
        )}

        {status === "success" ? (
          <div className="flex items-center justify-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-6 py-4">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700 font-medium">{message}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`${
              isInline
                ? "flex flex-col sm:flex-row gap-3"
                : "flex flex-col items-center gap-3"
            }`}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content.placeholder || "Masukkan email kamu"}
              required
              className={`rounded-full border border-gray-300 px-5 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition ${
                isInline ? "flex-1" : "w-full max-w-sm"
              }`}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 disabled:opacity-60 transition-colors whitespace-nowrap"
            >
              {status === "loading"
                ? "Memproses..."
                : content.button_text || "Daftar Sekarang"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-red-500">{message}</p>
        )}
      </div>
    </section>
  );
}
