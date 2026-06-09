import type { PageSection } from "@/lib/types";

export default function CalloutSection({ section }: { section: PageSection }) {
  const { content, settings } = section;

  const bgColor          = (settings.bg_color          as string) || "#3347e8";
  const textColor        = (settings.text_color        as string) || "#ffffff";
  const borderTopColor   = (settings.border_top_color   as string) || "";
  const borderBottomColor= (settings.border_bottom_color as string) || "";
  const borderWidth      = (settings.border_width       as string) || "6px";
  const paddingY         = (settings.padding_y          as string) || "4rem";
  const textSize         = (settings.text_size          as string) || "xl";
  const textAlign        = (settings.text_align         as string) || "center";
  const fontWeight       = (settings.font_weight        as string) || "bold";
  const maxWidth         = (settings.max_width          as string) || "4xl";

  const sizeClass: Record<string, string> = {
    sm:   "text-sm",
    base: "text-base",
    lg:   "text-lg sm:text-xl",
    xl:   "text-xl sm:text-2xl",
    "2xl":"text-2xl sm:text-3xl",
    "3xl":"text-3xl sm:text-4xl",
  };

  const weightClass: Record<string, string> = {
    normal:    "font-normal",
    medium:    "font-medium",
    semibold:  "font-semibold",
    bold:      "font-bold",
    extrabold: "font-extrabold",
  };

  const maxWidthClass: Record<string, string> = {
    sm:   "max-w-sm",
    md:   "max-w-md",
    lg:   "max-w-lg",
    xl:   "max-w-xl",
    "2xl":"max-w-2xl",
    "3xl":"max-w-3xl",
    "4xl":"max-w-4xl",
    "5xl":"max-w-5xl",
    full: "max-w-full",
  };

  return (
    <section
      id={section.anchor_id || undefined}
      className="px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: bgColor,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        borderTop: borderTopColor ? `${borderWidth} solid ${borderTopColor}` : undefined,
        borderBottom: borderBottomColor ? `${borderWidth} solid ${borderBottomColor}` : undefined,
      }}
    >
      <div
        className={`mx-auto ${maxWidthClass[maxWidth] ?? "max-w-4xl"}`}
        style={{ textAlign: textAlign as "left" | "center" | "right" }}
      >
        {content.text && (
          <div
            className={`leading-relaxed ${sizeClass[textSize] ?? "text-xl sm:text-2xl"} ${weightClass[fontWeight] ?? "font-bold"} [&_a]:underline [&_strong]:font-extrabold [&_em]:italic`}
            style={{ color: textColor }}
            dangerouslySetInnerHTML={{ __html: content.text as string }}
          />
        )}
      </div>
    </section>
  );
}
