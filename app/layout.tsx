import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/api";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await getSettings();
    return {
      title: {
        default: data.seo.default_meta_title,
        template: `%s | ${data.site_name}`,
      },
      description: data.seo.default_meta_description,
    };
  } catch {
    return {
      title: "Tunas Digital",
      description: "Membentuk anak cerdas di dunia maya, bijak di dunia nyata",
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingsRes = await getSettings().catch(() => null);
  const settings = settingsRes?.data ?? {
    site_name: "Tunas Digital",
    site_description: "",
    logo_url: null,
    favicon_url: null,
    social_media: {
      facebook: null,
      twitter: null,
      instagram: null,
      tiktok: null,
      linkedin: null,
      youtube: null,
    },
    seo: {
      default_meta_title: "Tunas Digital",
      default_meta_description: "",
      google_analytics_id: null,
      google_tag_manager_id: null,
      facebook_pixel_id: null,
    },
    articles_per_page: 12,
  };

  return (
    <html lang="id" className={figtree.variable}>
      <body className="antialiased min-h-screen flex flex-col font-[family-name:var(--font-figtree)]">
        <Navbar settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
