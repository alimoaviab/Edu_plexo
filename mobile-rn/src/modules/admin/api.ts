import { api } from '@/api/client';
import type {
  AdminListResult,
  AdminModuleDefinition,
  AdminRecord,
} from '@/modules/admin/types';

interface ListArgs {
  page: number;
  search?: string;
  filters?: Record<string, string>;
  /**
   * Caller-injected scope params (e.g. a parent's selected `student_id`).
   * Merged into the effective filters so they satisfy `:param` path slots,
   * `requiredFilters`, and query params — exactly like a user-set filter.
   */
  scope?: Record<string, string | undefined>;
}

interface MutationArgs {
  definition: AdminModuleDefinition;
  payload: AdminRecord;
  mode: 'create' | 'edit';
  record?: AdminRecord;
}

export async function listAdminRecords(
  definition: AdminModuleDefinition,
  args: ListArgs,
): Promise<AdminListResult> {
  const effectiveFilters: Record<string, string> = { ...(args.filters ?? {}) };
  for (const [key, value] of Object.entries(args.scope ?? {})) {
    if (value && value.trim()) effectiveFilters[key] = value.trim();
  }

  const path = buildPathFromFilters(definition.listPath, effectiveFilters, definition.requiredFilters);
  if (!path.ok) {
    return {
      items: [],
      total: 0,
      page: args.page,
      pages: 0,
      limit: definition.pageSize ?? 20,
      raw: { missingRequiredFilters: path.missing },
    };
  }

  const query: Record<string, string | number | boolean | undefined> = {
    ...(definition.listParams ?? {}),
  };

  if (!definition.singleton) {
    query.page = args.page;
    query.limit = definition.pageSize ?? 20;
  }

  if (definition.searchable && args.search?.trim()) {
    query[definition.searchParam ?? 'search'] = args.search.trim();
  }

  for (const [key, value] of Object.entries(effectiveFilters)) {
    if (path.usedFilters.has(key)) continue;
    if (value.trim()) query[key] = value.trim();
  }

  const result = await api.get<unknown>(path.path, { query });
  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to load module data.');
  }

  return normalizeList(result.data, definition);
}

export async function getAdminRecord(
  definition: AdminModuleDefinition,
  record: AdminRecord,
): Promise<AdminRecord> {
  const id = getRecordId(record);
  if (!definition.getPath || !id) return record;

  const result = await api.get<unknown>(pathWithRecord(definition.getPath, record));
  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to load record.');
  }
  return normalizeRecord(result.data);
}

export async function saveAdminRecord({
  definition,
  payload,
  mode,
  record,
}: MutationArgs): Promise<AdminRecord> {
  const body = definition.transformPayload?.(payload, mode, record) ?? payload;

  if (mode === 'create') {
    if (!definition.createPath) throw new Error('Create is not available for this module.');
    const path = pathWithRecord(definition.createPath, body);
    const method = definition.createMethod ?? 'POST';
    const result =
      method === 'PUT'
        ? await api.put<unknown, AdminRecord>(path, body)
        : method === 'PATCH'
          ? await api.patch<unknown, AdminRecord>(path, body)
          : await api.post<unknown, AdminRecord>(path, body);

    if (!result.ok) throw new Error(result.message ?? 'Create failed.');
    return normalizeRecord(result.data);
  }

  const id = record ? getRecordId(record) : '';
  if (!definition.updatePath || !id) throw new Error('Edit is not available for this module.');

  const path = pathWithRecord(definition.updatePath, { ...record, ...body, id });
  const method = definition.updateMethod ?? 'PATCH';
  const result =
    method === 'PUT'
      ? await api.put<unknown, AdminRecord>(path, body)
      : method === 'POST'
        ? await api.post<unknown, AdminRecord>(path, body)
        : await api.patch<unknown, AdminRecord>(path, body);

  if (!result.ok) throw new Error(result.message ?? 'Update failed.');
  return normalizeRecord(result.data);
}

export async function deleteAdminRecord(
  definition: AdminModuleDefinition,
  record: AdminRecord,
): Promise<void> {
  const id = getRecordId(record);
  if (!definition.deletePath || !id) throw new Error('Delete is not available for this module.');
  const result = await api.delete<unknown>(pathWithRecord(definition.deletePath, record));
  if (!result.ok) throw new Error(result.message ?? 'Delete failed.');
}

export async function runAdminAction(
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: AdminRecord,
): Promise<AdminRecord | undefined> {
  const result =
    method === 'DELETE'
      ? await api.delete<unknown>(path)
      : method === 'PUT'
        ? await api.put<unknown, AdminRecord>(path, body ?? {})
        : method === 'PATCH'
          ? await api.patch<unknown, AdminRecord>(path, body ?? {})
          : await api.post<unknown, AdminRecord>(path, body ?? {});

  if (!result.ok) throw new Error(result.message ?? 'Action failed.');
  return result.data === undefined ? undefined : normalizeRecord(result.data);
}

export function getRecordId(record: AdminRecord): string {
  return String(record._id ?? record.id ?? '');
}

export function pathWithId(template: string, id: string): string {
  return template.replace(':id', encodeURIComponent(id));
}

export function pathWithRecord(template: string, record: AdminRecord): string {
  return template.replace(/:([A-Za-z0-9_]+)/g, (_match, key: string) => {
    const value = key === 'id' ? getRecordId(record) : readRecordPath(record, key);
    if (value === undefined || value === null || String(value).trim() === '') {
      throw new Error(`${key} is required to call ${template}.`);
    }
    return encodeURIComponent(String(value));
  });
}

function buildPathFromFilters(
  template: string,
  filters: Record<string, string>,
  requiredFilters?: string[],
): { ok: true; path: string; usedFilters: Set<string> } | { ok: false; missing: string[] } {
  const usedFilters = new Set<string>();
  const missing = new Set<string>();

  for (const key of requiredFilters ?? []) {
    if (!filters[key]?.trim()) missing.add(key);
  }

  const path = template.replace(/:([A-Za-z0-9_]+)/g, (_match, key: string) => {
    usedFilters.add(key);
    const value = filters[key];
    if (!value?.trim()) {
      missing.add(key);
      return '';
    }
    return encodeURIComponent(value.trim());
  });

  if (missing.size) return { ok: false, missing: Array.from(missing) };
  return { ok: true, path, usedFilters };
}

function normalizeList(payload: unknown, definition: AdminModuleDefinition): AdminListResult {
  if (definition.singleton) {
    return { items: [normalizeRecord(payload)], total: 1, page: 1, pages: 1, limit: 1, raw: payload };
  }

  if (Array.isArray(payload)) {
    return { items: payload.map(normalizeRecord), total: payload.length, raw: payload };
  }

  if (!payload || typeof payload !== 'object') {
    return { items: [], total: 0, raw: payload };
  }

  const obj = payload as Record<string, unknown>;
  const nested = obj.data && typeof obj.data === 'object' ? (obj.data as Record<string, unknown>) : undefined;
  const meta = obj.meta && typeof obj.meta === 'object' ? (obj.meta as Record<string, unknown>) : undefined;

  const items =
    arrayFrom(obj.items) ??
    arrayFrom(obj.records) ??
    arrayFrom(obj.results) ??
    arrayFrom(obj.rows) ??
    arrayFrom(obj.students) ??
    arrayFrom(obj.fees) ??
    arrayFrom(obj.payments) ??
    arrayFrom(obj.transactions) ??
    arrayFrom(obj.data) ??
    (nested
      ? arrayFrom(nested.items) ??
        arrayFrom(nested.records) ??
        arrayFrom(nested.results) ??
        arrayFrom(nested.rows) ??
        arrayFrom(nested.students) ??
        arrayFrom(nested.fees) ??
        arrayFrom(nested.payments) ??
        arrayFrom(nested.transactions)
      : undefined) ??
    // Generic fallback: any first array-valued property (covers parent
    // endpoints that wrap lists under domain keys like `homework`,
    // `announcements`, `attendance`, `exams`, `conversations`, etc.).
    firstArrayValue(obj) ??
    (nested ? firstArrayValue(nested) : undefined) ??
    [];

  const total =
    numberFrom(obj.total) ??
    numberFrom(obj.count) ??
    (obj.pagination && typeof obj.pagination === 'object'
      ? numberFrom((obj.pagination as Record<string, unknown>).total)
      : undefined) ??
    (meta ? numberFrom(meta.total) : undefined) ??
    items.length;

  const page =
    numberFrom(obj.page) ??
    (obj.pagination && typeof obj.pagination === 'object'
      ? numberFrom((obj.pagination as Record<string, unknown>).page)
      : undefined) ??
    (meta ? numberFrom(meta.page) : undefined);

  const pages =
    numberFrom(obj.pages) ??
    (obj.pagination && typeof obj.pagination === 'object'
      ? numberFrom((obj.pagination as Record<string, unknown>).pages)
      : undefined) ??
    (meta ? numberFrom(meta.pages) : undefined);

  const limit =
    numberFrom(obj.limit) ??
    numberFrom(obj.pageSize) ??
    (obj.pagination && typeof obj.pagination === 'object'
      ? numberFrom((obj.pagination as Record<string, unknown>).limit)
      : undefined) ??
    (meta ? numberFrom(meta.limit) ?? numberFrom(meta.pageSize) : undefined);

  return {
    items: items.map(normalizeRecord),
    total,
    page,
    pages,
    limit,
    raw: payload,
  };
}

function normalizeRecord(payload: unknown): AdminRecord {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { value: payload };
  }
  return payload as AdminRecord;
}

function arrayFrom(value: unknown): AdminRecord[] | undefined {
  return Array.isArray(value) ? value.map(normalizeRecord) : undefined;
}

/** Find the first array-valued property of an object (skips meta arrays). */
function firstArrayValue(obj: Record<string, unknown>): AdminRecord[] | undefined {
  const skip = new Set(['errors', 'warnings', 'messages_log']);
  for (const [key, value] of Object.entries(obj)) {
    if (skip.has(key)) continue;
    if (Array.isArray(value)) return value.map(normalizeRecord);
  }
  return undefined;
}

function numberFrom(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function readRecordPath(record: AdminRecord, path: string): unknown {
  return path.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object' && part in current) {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, record);
}
