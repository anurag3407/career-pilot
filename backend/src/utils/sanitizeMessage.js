/**
 * Strip HTML/script tags from chat message content before persistence.
 */
export function sanitizeMessageContent(content) {
  if (typeof content !== "string") {
    return "";
  }

  return content
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}
