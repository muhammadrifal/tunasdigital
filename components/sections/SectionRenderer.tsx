import type { CSSProperties } from "react";
import type { PageSection } from "@/lib/types";
import HeroSection from "./HeroSection";
import TextSection from "./TextSection";
import FeaturesSection from "./FeaturesSection";
import CTASection from "./CTASection";
import GallerySection from "./GallerySection";
import FAQSection from "./FAQSection";
import StatsSection from "./StatsSection";
import DividerSection from "./DividerSection";
import EmbedSection from "./EmbedSection";
import ArticlesSection from "./ArticlesSection";
import TabsSection from "./TabsSection";
import EbooksSection from "./EbooksSection";
import PartnersSection from "./PartnersSection";
import NewsletterSection from "./NewsletterSection";
import TimelineSection from "./TimelineSection";
import QuotesSection from "./QuotesSection";
import SplitSection from "./SplitSection";
import CardsSection from "./CardsSection";
import VideosSection from "./VideosSection";
import PageHeaderSection from "./PageHeaderSection";
import QuotePersonSection from "./QuotePersonSection";
import CountryCardsSection from "./CountryCardsSection";
import NumberedCardsSection from "./NumberedCardsSection";
import ResourcesSection from "./ResourcesSection";
import ArticleCardsSection from "./ArticleCardsSection";
import CalloutSection from "./CalloutSection";
import DoodleDecor from "./DoodleDecor";

function renderSection(section: PageSection) {
  switch (section.type) {
    case "hero":        return <HeroSection        section={section} />;
    case "text":        return <TextSection        section={section} />;
    case "features":    return <FeaturesSection    section={section} />;
    case "cta":         return <CTASection         section={section} />;
    case "gallery":     return <GallerySection     section={section} />;
    case "faq":         return <FAQSection         section={section} />;
    case "stats":       return <StatsSection       section={section} />;
    case "divider":     return <DividerSection     section={section} />;
    case "embed":       return <EmbedSection       section={section} />;
    case "articles":    return <ArticlesSection    section={section} />;
    case "tabs":        return <TabsSection        section={section} />;
    case "ebooks":      return <EbooksSection      section={section} />;
    case "partners":    return <PartnersSection    section={section} />;
    case "newsletter":  return <NewsletterSection  section={section} />;
    case "timeline":    return <TimelineSection    section={section} />;
    case "quotes":      return <QuotesSection      section={section} />;
    case "split":       return <SplitSection       section={section} />;
    case "cards":       return <CardsSection       section={section} />;
    case "videos":      return <VideosSection      section={section} />;
    case "page-header":   return <PageHeaderSection   section={section} />;
    case "quote-person":    return <QuotePersonSection    section={section} />;
    case "country-cards":    return <CountryCardsSection    section={section} />;
    case "numbered-cards":   return <NumberedCardsSection   section={section} />;
    case "resources":        return <ResourcesSection        section={section} />;
    case "article-cards":   return <ArticleCardsSection     section={section} />;
    case "callout":         return <CalloutSection          section={section} />;
    default:                return null;
  }
}

const paddingMap: Record<string, string> = {
  none: "0rem",
  xs:   "1rem",
  sm:   "2rem",
  md:   "4rem",
  lg:   "6rem",
  xl:   "8rem",
};

function buildSectionStyle(settings: Record<string, unknown>): CSSProperties {
  const style: Record<string, string> = {};
  if (settings.bg_color)        style.backgroundColor         = settings.bg_color as string;
  if (settings.heading_color)   style["--st-hc" as string]   = settings.heading_color as string;
  if (settings.body_color)      style["--st-bc" as string]   = settings.body_color as string;
  if (settings.heading_weight)  style["--st-hw" as string]   = settings.heading_weight as string;
  if (settings.heading_italic)  style["--st-hi" as string]   = "italic";
  if (settings.cta_bg)          style["--st-cb" as string]   = settings.cta_bg as string;
  if (settings.cta_text)        style["--st-ct" as string]   = settings.cta_text as string;
  const pt = paddingMap[settings.padding_top as string];
  const pb = paddingMap[settings.padding_bottom as string];
  if (pt) style["--section-pt" as string] = pt;
  if (pb) style["--section-pb" as string] = pb;
  return style as CSSProperties;
}

function hasTextStyle(settings: Record<string, unknown>): boolean {
  return !!(
    settings.heading_color || settings.body_color ||
    settings.heading_weight || settings.heading_italic ||
    settings.cta_bg || settings.cta_text
  );
}

export default function SectionRenderer({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section) => {
        const key       = section.id ?? section.anchor_id ?? section.type;
        const settings  = section.settings ?? {};
        const hasDoodle = settings.doodle && section.type !== "timeline";
        const wrapStyle = buildSectionStyle(settings);
        const dataAttr  = hasTextStyle(settings) ? { "data-st": "" } : {};
        const rendered  = renderSection(section);
        if (!rendered) return null;

        if (hasDoodle) {
          return (
            <div key={key} className="relative overflow-hidden" style={wrapStyle} {...dataAttr}>
              <DoodleDecor
                corners={settings.doodle_corners as never}
                color={settings.doodle_color as string}
              />
              <div className="relative z-10">{rendered}</div>
            </div>
          );
        }

        return (
          <div key={key} style={wrapStyle} {...dataAttr}>
            {rendered}
          </div>
        );
      })}
    </>
  );
}
