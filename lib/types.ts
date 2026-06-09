// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  site_name: string;
  site_description: string;
  logo_url: string | null;
  favicon_url: string | null;
  social_media: {
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    tiktok: string | null;
    linkedin: string | null;
    youtube: string | null;
  };
  seo: {
    default_meta_title: string;
    default_meta_description: string;
    google_analytics_id: string | null;
    google_tag_manager_id: string | null;
    facebook_pixel_id: string | null;
  };
  articles_per_page: number;
}

// ─── Common ───────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Author {
  name: string;
  avatar: string | null;
}

// ─── Article ──────────────────────────────────────────────────────────────────

export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  category: Category | null;
  tags: Tag[];
  author: Author | null;
  published_at: string;
  read_time: number;
}

export interface Article extends ArticleListItem {
  content: string;
  meta: {
    title: string;
    description: string | null;
    focus_keyword: string | null;
    canonical_url: string | null;
    og_image: string | null;
  };
  related_articles: ArticleListItem[];
}

// ─── Ebook ────────────────────────────────────────────────────────────────────

export interface EbookListItem {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  category: Category | null;
  tags: Tag[];
  file_size: string | null;
  version: string | null;
  download_count: number;
}

export interface Ebook extends EbookListItem {
  meta: {
    title: string;
    description: string | null;
    og_image: string | null;
  };
}

// ─── Page Builder ─────────────────────────────────────────────────────────────

export type SectionType =
  | "hero"
  | "text"
  | "features"
  | "cta"
  | "gallery"
  | "faq"
  | "stats"
  | "divider"
  | "embed"
  | "articles"
  | "tabs"
  | "ebooks"
  | "partners"
  | "newsletter"
  | "timeline"
  | "quotes"
  | "split"
  | "cards"
  | "videos"
  | "page-header"
  | "quote-person"
  | "country-cards"
  | "numbered-cards"
  | "resources"
  | "article-cards"
  | "callout";

export interface PageSection {
  id: number;
  type: SectionType;
  label: string;
  anchor_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: Record<string, any>;
  resolved: {
    articles?: ArticleListItem[];
    ebooks?: EbookListItem[];
  } | null;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  template: string;
  meta: {
    title: string;
    description: string | null;
    focus_keyword: string | null;
    canonical_url: string | null;
    og_image: string | null;
  };
  sections: PageSection[];
}

// ─── Keluarga Tunas ───────────────────────────────────────────────────────────

export interface IslandStat {
  id: number;
  name: string;
  count: number;
}

export interface KeluargaTunasStats {
  islands: IslandStat[];
  total_agents: number;
  total_provinces: number;
  total_regencies: number;
}

export interface Province {
  id: number;
  island_id: number;
  name: string;
}

export interface Regency {
  id: number;
  name: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
}
