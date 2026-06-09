"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getEbook, downloadEbook } from "@/lib/api";
import type { Ebook } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function EbookDetailPage({ params }: Props) {
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    params.then(({ slug: s }) => {
      setSlug(s);
      getEbook(s)
        .then((res) => setEbook(res.data))
        .catch(() => notFound())
        .finally(() => setLoading(false));
    });
  }, [params]);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !slug) return;
    setDownloadStatus("loading");

    try {
      const sp = new URLSearchParams(window.location.search);
      const res = await downloadEbook(slug, {
        email,
        source_url: window.location.href,
        utm_source: sp.get("utm_source") ?? undefined,
        utm_medium: sp.get("utm_medium") ?? undefined,
        utm_campaign: sp.get("utm_campaign") ?? undefined,
        utm_term: sp.get("utm_term") ?? undefined,
        utm_content: sp.get("utm_content") ?? undefined,
      });
      if (res.data.download_url) {
        setDownloadUrl(res.data.download_url);
        setDownloadStatus("success");
      } else {
        setDownloadStatus("error");
      }
    } catch {
      setDownloadStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!ebook) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-orange-500">Beranda</Link>
        <span>/</span>
        <Link href="/pustaka" className="hover:text-orange-500">Pustaka</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-xs">{ebook.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Cover */}
        <div className="md:col-span-1">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
            {ebook.cover_image ? (
              <Image
                src={ebook.cover_image}
                alt={ebook.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-orange-50">
                <svg className="w-16 h-16 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="mt-5 space-y-2 text-sm text-gray-500">
            {ebook.category && (
              <div className="flex justify-between">
                <span>Kategori</span>
                <span className="font-medium text-gray-700">{ebook.category.name}</span>
              </div>
            )}
            {ebook.version && (
              <div className="flex justify-between">
                <span>Versi</span>
                <span className="font-medium text-gray-700">{ebook.version}</span>
              </div>
            )}
            {ebook.file_size && (
              <div className="flex justify-between">
                <span>Ukuran</span>
                <span className="font-medium text-gray-700">{ebook.file_size}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Diunduh</span>
              <span className="font-medium text-gray-700">{ebook.download_count}×</span>
            </div>
          </div>
        </div>

        {/* Detail */}
        <div className="md:col-span-2">
          {ebook.category && (
            <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-medium mb-3">
              {ebook.category.name}
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{ebook.title}</h1>

          {ebook.description && (
            <p className="text-gray-600 leading-relaxed mb-8">{ebook.description}</p>
          )}

          {ebook.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {ebook.tags.map((tag) => (
                <span key={tag.id} className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Download Form */}
          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-1">Unduh Gratis</h3>
            <p className="text-sm text-gray-500 mb-4">
              Masukkan email kamu untuk mendapatkan akses unduhan.
            </p>

            {downloadStatus === "success" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium text-sm">Siap diunduh!</span>
                </div>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Unduh Sekarang
                </a>
              </div>
            ) : (
              <form onSubmit={handleDownload} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@kamu.com"
                  required
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 bg-white"
                />
                <button
                  type="submit"
                  disabled={downloadStatus === "loading"}
                  className="px-6 py-2.5 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 disabled:opacity-60 transition-colors whitespace-nowrap"
                >
                  {downloadStatus === "loading" ? "Memproses..." : "Unduh"}
                </button>
              </form>
            )}

            {downloadStatus === "error" && (
              <p className="mt-2 text-sm text-red-500">
                Terjadi kesalahan. Silakan coba lagi.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
