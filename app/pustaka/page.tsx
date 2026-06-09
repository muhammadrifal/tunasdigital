import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getEbooks } from "@/lib/api";
import type { EbookListItem } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Pustaka",
  description: "Kumpulan ebook dan panduan digital untuk keluarga.",
};

interface Props {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}

export default async function EbookPage({ searchParams }: Props) {
  const { page = "1", category, search } = await searchParams;

  const { data: ebooks, meta } = await getEbooks({
    page: parseInt(page),
    category,
    search,
    per_page: 12,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Pustaka Tunas</h1>
        <p className="text-gray-500 mt-2">
          Kumpulan panduan, modul, dan buku digital untuk keluarga
        </p>
      </div>

      {/* Search */}
      <form method="GET" className="mb-8">
        <div className="flex gap-2 max-w-md">
          <input
            name="search"
            defaultValue={search}
            placeholder="Cari ebook..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Cari
          </button>
        </div>
      </form>

      {ebooks.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Belum ada ebook ditemukan.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {ebooks.map((ebook: EbookListItem) => (
              <Link
                key={ebook.id}
                href={`/pustaka/${ebook.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  {ebook.cover_image ? (
                    <Image
                      src={ebook.cover_image}
                      alt={ebook.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                      <svg className="w-12 h-12 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-500 transition-colors text-sm">
                    {ebook.title}
                  </h2>
                  {ebook.category && (
                    <p className="text-xs text-gray-400 mt-1">{ebook.category.name}</p>
                  )}
                  {ebook.file_size && (
                    <p className="text-xs text-gray-400 mt-1">{ebook.file_size}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {meta.last_page > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/pustaka?page=${p}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    p === meta.current_page
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
