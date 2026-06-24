/**
 * Tiny presentation formatters shared across dashboards and module screens.
 * Kept dependency-free (no Intl polyfills required on older RN engines).
 */

/** Format a number as a compact currency-ish string (e.g. 12,500 → "12,500"). */
export function formatNumber(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? Number(value) : value ?? 0;
  if (!Number.isFinite(n as number)) return '0';
  return (n as number).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/** Format a money amount with a currency prefix (defaults to Rs). */
export function formatCurrency(
  value: number | string | null | undefined,
  prefix = 'Rs ',
): string {
  return `${prefix}${formatNumber(value)}`;
}

/** Compact large numbers: 1500 → "1.5k", 2_300_000 → "2.3M". */
export function compactNumber(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? Number(value) : value ?? 0;
  if (!Number.isFinite(n as number)) return '0';
  const abs = Math.abs(n as number);
  if (abs >= 1_000_000) return `${((n as number) / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${((n as number) / 1_000).toFixed(1)}k`;
  return String(n);
}

/** A human date like "Jun 21" / "Jun 21, 2026" from any ISO-ish input. */
export function formatDate(
  input: string | number | Date | null | undefined,
  withYear = false,
): string {
  if (!input) return '';
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return typeof input === 'string' ? input : '';
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  return withYear ? `${month} ${day}, ${date.getFullYear()}` : `${month} ${day}`;
}

/** A short time like "9:00 AM" from an ISO string or "HH:mm". */
export function formatTime(input: string | null | undefined): string {
  if (!input) return '';
  // Accept plain "HH:mm" too.
  if (/^\d{1,2}:\d{2}$/.test(input)) {
    const [h, m] = input.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
  }
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** Title-case a snake_case or kebab-case token. */
export function titleCase(value: string | null | undefined): string {
  if (!value) return '';
  return String(value)
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
