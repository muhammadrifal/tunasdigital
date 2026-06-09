import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage } from "@/lib/api";
import SectionRenderer from "@/components/sections/SectionRenderer";

const HOME_SLUG = process.env.NEXT_PUBLIC_HOME_PAGE_SLUG || "beranda";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await getPage(HOME_SLUG);
    return {
      title: data.meta.title,
      description: data.meta.description ?? undefined,
      openGraph: data.meta.og_image
        ? { images: [{ url: data.meta.og_image }] }
        : undefined,
    };
  } catch {
    return {};
  }
}

export const revalidate = 60;

export default async function HomePage() {
  let page;
  try {
    const res = await getPage(HOME_SLUG);
    page = res.data;
  } catch {
    notFound();
  }

  return <SectionRenderer sections={page.sections} />;
}
