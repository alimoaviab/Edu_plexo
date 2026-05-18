/**
 * Tiny shared formatters — keep number/date formatting consistent across
 * the app so the same value never appears as "1,200" in one place and "1.2K"
 * in another.
 */

export function formatCount(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en').format(value);
}

export function formatCurrency(
  value: number | undefined | null,
  currency = 'PKR',
): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '—';
  try {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${formatCount(Math.round(value))}`;
  }
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '—';
  return `${Math.round(value)}%`;
}

export function formatDate(value: string | Date | undefined | null): string {
  if (!value) return '—';
  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return '—';
  }
}

export function formatDateTime(
  value: string | Date | undefined | null,
): string {
  if (!value) return '—';
  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en', {
      day: '2-digit',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '—';
  }
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isoToDate(value?: string | null): string {
  if (!value) return '';
  return value.slice(0, 10);
}

export function fullName(profile?: {
  first_name?: string;
  last_name?: string;
  full_name?: string;
}): string {
  if (!profile) return '';
  if (profile.full_name && profile.full_name.trim()) return profile.full_name;
  return [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
}
