import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage } from "@/lib/api";
import SectionRenderer from "@/components/sections/SectionRenderer";
import TrackView from "@/components/ui/TrackView";

export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { data } = await getPage(slug);
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

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;

  let page;
  try {
    const res = await getPage(slug);
    page = res.data;
  } catch (err) {
    const status = (err as { status?: number }).status;
    if (!status || status === 404) notFound();
    return null;
  }

  return (
    <>
      <TrackView type="page" slug={page.slug} />
      <SectionRenderer sections={page.sections} />
    </>
  );
}
