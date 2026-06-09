import Image from "next/image";
import Link from "next/link";
import type { ArticleListItem, PageSection } from "@/lib/types";

function ArticleCard({ article, imgHeight }: { article: ArticleListItem; imgHeight: string }) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative bg-gray-100 overflow-hidden" style={{ height: imgHeight }}>
        {article.featured_image ? (
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50">
            <svg className="w-12 h-12 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-500 transition-colors mb-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{article.excerpt}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
          <span>{article.read_time} menit baca</span>
          <span>·</span>
          <span>
            {new Date(article.published_at).toLocaleDateString("id-ID", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArticleListItem({ article, imgHeight, ctaText, ctaColor }: { article: ArticleListItem; imgHeight: string; ctaText: string; ctaColor: string }) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group flex flex-col sm:flex-row gap-4 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4"
    >
      {article.featured_image && (
        <div className="relative w-full sm:w-auto flex-shrink-0 rounded-xl overflow-hidden bg-gray-100" style={{ height: imgHeight, aspectRatio: "4/3" }}>
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, 160px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-start">
        {article.category && (
          <span className="text-xs font-medium text-orange-500 mb-1">{article.category.name}</span>
        )}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-500 transition-colors mb-1">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{article.excerpt}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span>{article.read_time} menit baca</span>
          <span>·</span>
          <span>
            {new Date(article.published_at).toLocaleDateString("id-ID", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        </div>
        <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold" style={{ color: ctaColor }}>
          {ctaText}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function ArticlesSection({ section }: { section: PageSection }) {
  const { content, settings } = section;
  const articles: ArticleListItem[] = section.resolved?.articles ?? [];

  const style          = (settings.style          as string) || "card";
  const columns        = parseInt((settings.columns as string) || "3");
  const paddingY       = (settings.padding_y       as string) || "4rem";
  const cardImgHeight  = (settings.card_img_height  as string) || "12rem";
  const listItemHeight = (settings.list_item_height as string) || "8rem";
  const listCtaText    = (settings.list_cta_text    as string) || "Telusuri Artikel";
  const listCtaColor   = (settings.list_cta_color   as string) || "#f97316";
  const viewAllText      = (settings.view_all_text       as string) || "Lihat Semua";
  const viewAllStyle     = (settings.view_all_style      as string) || "link";
  const viewAllColor     = (settings.view_all_color      as string) || "#f97316";
  const viewAllTextColor = (settings.view_all_text_color as string) || "#ffffff";
  const viewAllUrl       = (settings.view_all_url        as string) || "/artikel";

  if (articles.length === 0) return null;

  const gridCols =
    columns === 2 ? "grid-cols-1 sm:grid-cols-2"
    : columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const ViewAllButton = () => {
    if (viewAllStyle === "pill") {
      return (
        <Link
          href={viewAllUrl}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: viewAllColor, color: viewAllTextColor }}
        >
          {viewAllText}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      );
    }
    if (viewAllStyle === "outline") {
      return (
        <Link
          href={viewAllUrl}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-opacity hover:opacity-80"
          style={{ color: viewAllColor, borderColor: viewAllColor }}
        >
          {viewAllText}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      );
    }
    // default: link
    return (
      <Link
        href={viewAllUrl}
        className="inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: viewAllColor }}
      >
        {viewAllText}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    );
  };

  return (
    <section id={section.anchor_id || undefined} style={{ paddingTop: paddingY, paddingBottom: paddingY }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          {content.heading && (
            <h2 className="text-3xl font-bold text-gray-900">{content.heading as string}</h2>
          )}
          <ViewAllButton />
        </div>

        {style === "list" ? (
          <div className="flex flex-col gap-4">
            {articles.map((article) => (
              <ArticleListItem key={article.id} article={article} imgHeight={listItemHeight} ctaText={listCtaText} ctaColor={listCtaColor} />
            ))}
          </div>
        ) : (
          <div className={`grid ${gridCols} gap-6`}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} imgHeight={cardImgHeight} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
