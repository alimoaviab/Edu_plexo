import type { AdminModuleDefinition, AdminRecord } from '@/modules/admin/types';

export interface RecordField {
  key: string;
  label: string;
  value: unknown;
  formatted: string;
  group: string;
}

export function readRecordPath(record: AdminRecord | undefined, path: string): unknown {
  if (!record) return undefined;
  return path.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object' && part in current) {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, record);
}

export function firstRecordValue(record: AdminRecord | undefined, fields: string[]): string {
  for (const field of fields) {
    const formatted = formatRecordValue(readRecordPath(record, field), field);
    if (formatted && formatted !== '-') return formatted;
  }
  return '';
}

export function recordTitle(
  record: AdminRecord | undefined,
  definition?: Pick<AdminModuleDefinition, 'displayFields' | 'title'>,
  fallback = 'Record',
): string {
  if (!record) return fallback;
  if (definition?.displayFields?.length) {
    const configured = firstRecordValue(record, definition.displayFields);
    if (configured) return configured;
  }

  const composed = [record.first_name, record.last_name].filter(Boolean).join(' ').trim();
  return (
    String(record.name ?? record.title ?? record.full_name ?? record.email ?? composed ?? '').trim() ||
    String(record.admission_no ?? record.employee_no ?? record._id ?? record.id ?? definition?.title ?? fallback)
  );
}

export function recordSubtitle(record: AdminRecord | undefined, fields: string[]): string {
  if (!record) return '';
  const values = fields
    .map((field) => firstRecordValue(record, [field]))
    .filter((value) => value && value !== '-');
  return values.slice(0, 2).join(' · ');
}

export function classTitle(record: AdminRecord | undefined): string {
  if (!record) return 'Class';
  const name = String(record.name ?? record.class_name ?? record.title ?? 'Class').trim();
  const section = String(record.section ?? '').trim();
  return section && !name.includes(section) ? `${name} ${section}` : name;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function numberFrom(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

export function formatRecordValue(value: unknown, key?: string): string {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(2);

  if (typeof value === 'string') {
    if (looksLikeDate(value, key)) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    }
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '-';
    if (value.every((item) => item === null || typeof item !== 'object')) {
      return value.map((item) => formatRecordValue(item, key)).join(', ');
    }
    return JSON.stringify(value);
  }

  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function labelizeKey(path: string): string {
  return path
    .split('.')
    .pop()!
    .replace(/\[[0-9]+\]/g, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function shouldHideRecordField(key: string, value: unknown): boolean {
  const keyLower = key.toLowerCase();
  if (
    keyLower.includes('password') ||
    keyLower.includes('token') ||
    keyLower.includes('secret') ||
    keyLower.includes('otp')
  ) {
    return true;
  }
  if ((keyLower === '_id' || keyLower === 'id') && typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value)) {
    return true;
  }
  return false;
}

export function collectRecordFields(record: AdminRecord | undefined): RecordField[] {
  if (!record) return [];
  const fields: RecordField[] = [];

  function visit(value: unknown, path: string) {
    if (shouldHideRecordField(path, value)) return;
    if (value === null || value === undefined || value === '') return;

    if (Array.isArray(value)) {
      if (value.length === 0) return;
      fields.push(buildField(path, value));
      return;
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (!entries.length) return;
      for (const [childKey, childValue] of entries) {
        visit(childValue, path ? `${path}.${childKey}` : childKey);
      }
      return;
    }

    fields.push(buildField(path, value));
  }

  for (const [key, value] of Object.entries(record)) {
    visit(value, key);
  }

  return fields;
}

export function groupRecordFields(fields: RecordField[]): { title: string; fields: RecordField[] }[] {
  const byGroup = new Map<string, RecordField[]>();
  for (const field of fields) {
    const current = byGroup.get(field.group) ?? [];
    current.push(field);
    byGroup.set(field.group, current);
  }

  return Array.from(byGroup.entries()).map(([title, groupFields]) => ({ title, fields: groupFields }));
}

export function getRecordImageUri(record: AdminRecord | undefined): string | undefined {
  if (!record) return undefined;
  for (const key of ['photo', 'photo_url', 'avatar', 'avatar_url', 'image', 'image_url', 'profile_photo', 'profile.photo']) {
    const value = readRecordPath(record, key);
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return undefined;
}

function buildField(key: string, value: unknown): RecordField {
  return {
    key,
    label: labelizeKey(key),
    value,
    formatted: formatRecordValue(value, key),
    group: groupForKey(key),
  };
}

function groupForKey(key: string): string {
  const lower = key.toLowerCase();
  const first = key.split('.')[0];

  if (/(photo|admission|roll|class|section|status|employee|joining|qualification)/.test(lower)) return 'Profile';
  if (/(email|phone|mobile|address|city|state|country)/.test(lower)) return 'Contact';
  if (/(guardian|parent|father|mother|emergency)/.test(lower)) return 'Family & Guardian';
  if (/(attendance|present|absent|late)/.test(lower)) return 'Attendance';
  if (/(fee|ledger|payment|paid|pending|balance|salary|subscription|amount)/.test(lower)) return 'Finance';
  if (/(subject|exam|test|result|mark|grade|performance|homework|timetable|academic|certificate)/.test(lower)) return 'Academics';
  if (/(document|attachment|file|certificate)/.test(lower)) return 'Documents';
  if (/(behavior|note|remark|comment|leave)/.test(lower)) return 'Notes';

  return labelizeKey(first);
}

function looksLikeDate(value: string, key?: string): boolean {
  const lower = key?.toLowerCase() ?? '';
  return (
    lower.endsWith('_at') ||
    lower.endsWith('_date') ||
    lower.includes('date') ||
    /^\d{4}-\d{2}-\d{2}(T|\s|$)/.test(value)
  );
}
