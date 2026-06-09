/** Strip all HTML/script tags and trim whitespace from a string */
export function sanitize(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")   // strip HTML tags
    .replace(/&[a-z]+;/gi, "") // strip HTML entities like &amp; &lt;
    .trimStart();               // no leading whitespace
}

/** Sanitize all string values in a record */
export function sanitizeFields<T extends Record<string, unknown>>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, typeof v === "string" ? sanitize(v) : v])
  ) as T;
}
