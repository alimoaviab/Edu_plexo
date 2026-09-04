/**
 * escapeHtml escapes a value for safe interpolation into an HTML string.
 *
 * Print/report flows build HTML documents by string concatenation and write
 * them with document.write(). Any attacker-influenced value (student names,
 * class names, school names, certificate data) must be escaped before it is
 * embedded, otherwise a value such as
 *   <img src=x onerror=alert(document.domain)>
 * becomes executable markup in a same-origin print window (stored XSS that
 * runs in the admin's session).
 */
export function escapeHtml(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
