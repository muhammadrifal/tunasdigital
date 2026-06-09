import type {
  Article,
  ArticleListItem,
  Ebook,
  EbookListItem,
  KeluargaTunasStats,
  Page,
  PaginatedResponse,
  Province,
  Regency,
  SingleResponse,
  SiteSettings,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://tunasdigitalbackend.test/api/v1";

async function apiFetch<T>(
  path: string,
  options: RequestInit & { revalidate?: number | false } = {}
): Promise<T> {
  const { revalidate, ...fetchOptions } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    next: revalidate !== undefined ? { revalidate } : undefined,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(`API ${res.status}: ${path}`) as Error & { status: number; errors?: Record<string, string[]> };
    err.status = res.status;
    if (body.errors) err.errors = body.errors;
    throw err;
  }

  return res.json();
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<SingleResponse<SiteSettings>> {
  return apiFetch("/settings", { revalidate: 60 });
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export async function getPage(slug: string): Promise<SingleResponse<Page>> {
  return apiFetch(`/pages/${slug}`, { revalidate: 60 });
}

// ─── Articles ────────────────────────────────────────────────────────────────

export interface ArticleParams {
  page?: number;
  category?: string;
  tag?: string;
  search?: string;
  per_page?: number;
}

export async function getArticles(
  params?: ArticleParams
): Promise<PaginatedResponse<ArticleListItem>> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.category) qs.set("category", params.category);
  if (params?.tag) qs.set("tag", params.tag);
  if (params?.search) qs.set("search", params.search);
  if (params?.per_page) qs.set("per_page", String(params.per_page));

  const query = qs.toString() ? `?${qs}` : "";
  return apiFetch(`/articles${query}`, { revalidate: 60 });
}

export async function getArticle(
  slug: string
): Promise<SingleResponse<Article>> {
  return apiFetch(`/articles/${slug}`, { revalidate: 300 });
}

// ─── Ebooks ──────────────────────────────────────────────────────────────────

export interface EbookParams {
  page?: number;
  category?: string;
  search?: string;
  per_page?: number;
}

export async function getEbooks(
  params?: EbookParams
): Promise<PaginatedResponse<EbookListItem>> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.category) qs.set("category", params.category);
  if (params?.search) qs.set("search", params.search);
  if (params?.per_page) qs.set("per_page", String(params.per_page));

  const query = qs.toString() ? `?${qs}` : "";
  return apiFetch(`/ebooks${query}`, { revalidate: 60 });
}

export async function getEbook(slug: string): Promise<SingleResponse<Ebook>> {
  return apiFetch(`/ebooks/${slug}`, { revalidate: 300 });
}

export interface DownloadEbookParams {
  email: string;
  source_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export async function downloadEbook(
  slug: string,
  params: DownloadEbookParams
): Promise<{ success: boolean; data: { download_url: string; title: string } }> {
  return apiFetch(`/ebooks/${slug}/download`, {
    method: "POST",
    body: JSON.stringify(params),
    revalidate: false,
  });
}

// ─── Keluarga Tunas ──────────────────────────────────────────────────────────

export async function getKeluargaTunasStats(): Promise<SingleResponse<KeluargaTunasStats>> {
  return apiFetch("/keluarga-tunas/stats", { revalidate: 60 });
}

export async function getProvinces(): Promise<{ success: boolean; data: Province[] }> {
  return apiFetch("/keluarga-tunas/provinces", { revalidate: 3600 });
}

export async function getRegencies(provinceId: number): Promise<{ success: boolean; data: Regency[] }> {
  return apiFetch(`/keluarga-tunas/provinces/${provinceId}/regencies`, { revalidate: 3600 });
}

export interface RegisterKeluargaTunasData {
  nama: string;
  jenis_kelamin: "L" | "P";
  usia: number;
  nomor_telepon?: string;
  email?: string;
  province_id: number;
  regency_id: number;
}

export async function registerKeluargaTunas(
  data: RegisterKeluargaTunasData
): Promise<{ success: boolean; message: string; data: { id: number } }> {
  return apiFetch("/keluarga-tunas/register", {
    method: "POST",
    body: JSON.stringify(data),
    revalidate: false,
  });
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function subscribeNewsletter(
  email: string,
  source?: string
): Promise<{ success: boolean; message: string }> {
  return apiFetch("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({ email, source }),
    revalidate: false,
  });
}
