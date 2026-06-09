import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getArticles } from "@/lib/api";
import type { ArticleListItem } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Artikel",
  description: "Kumpulan artikel seputar literasi digital dan parenting.",
};

interface Props {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}

export default async function ArtikelPage({ searchParams }: Props) {
  const { page = "1", category, search } = await searchParams;

  const { data: articles, meta } = await getArticles({
    page: parseInt(page),
    category,
    search,
    per_page: 12,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Artikel</h1>
        <p className="text-gray-500 mt-2">
          Tips, panduan, dan cerita seputar dunia digital anak
        </p>
      </div>

      {/* Search */}
      <form method="GET" className="mb-8">
        <div className="flex gap-2 max-w-md">
          <input
            name="search"
            defaultValue={search}
            placeholder="Cari artikel..."
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

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Belum ada artikel ditemukan.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: ArticleListItem) => (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gray-100">
                  {article.featured_image ? (
                    <Image
                      src={article.featured_image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                      <svg className="w-10 h-10 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                  {article.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-xs font-medium text-orange-600">
                      {article.category.name}
                    </span>
                  )}
                </div>
                <div className="flex-1 p-5">
                  <h2 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-500 transition-colors mb-2">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{article.excerpt}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {article.read_time} menit baca ·{" "}
                    {new Date(article.published_at).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/artikel?page=${p}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
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
