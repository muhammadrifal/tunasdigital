import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticle } from "@/lib/api";
import type { ArticleListItem } from "@/lib/types";
import TrackView from "@/components/ui/TrackView";

export const revalidate = 300;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { data } = await getArticle(slug);
    return {
      title: data.meta.title,
      description: data.meta.description ?? undefined,
      openGraph: {
        title: data.meta.title,
        description: data.meta.description ?? undefined,
        images: data.meta.og_image ? [{ url: data.meta.og_image }] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params;

  let article;
  try {
    const res = await getArticle(slug);
    article = res.data;
  } catch {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <TrackView type="article" slug={article.slug} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-orange-500 transition-colors">Beranda</Link>
        <span>/</span>
        <Link href="/artikel" className="hover:text-orange-500 transition-colors">Artikel</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Category */}
      {article.category && (
        <Link
          href={`/artikel?category=${article.category.slug}`}
          className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-medium mb-4 hover:bg-orange-100 transition-colors"
        >
          {article.category.name}
        </Link>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
        {article.author && (
          <span className="font-medium text-gray-600">{article.author.name}</span>
        )}
        <span>
          {new Date(article.published_at).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </span>
        <span>{article.read_time} menit baca</span>
      </div>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-orange-500 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
          {article.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/artikel?tag=${tag.slug}`}
              className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Related Articles */}
      {article.related_articles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Artikel Terkait</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {article.related_articles.map((rel: ArticleListItem) => (
              <Link
                key={rel.id}
                href={`/artikel/${rel.slug}`}
                className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-36 bg-gray-100">
                  {rel.featured_image && (
                    <Image
                      src={rel.featured_image}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {rel.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
