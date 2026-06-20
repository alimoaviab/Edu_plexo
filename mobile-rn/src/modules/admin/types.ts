import type { IconName } from '@/components/ui/Icon';

export type AdminModuleKey =
  | 'students'
  | 'teachers'
  | 'classes'
  | 'subjects'
  | 'academic-years'
  | 'attendance'
  | 'attendance-sheet'
  | 'exams'
  | 'tests'
  | 'results'
  | 'homework'
  | 'behavior'
  | 'leave'
  | 'events'
  | 'announcements'
  | 'timetable'
  | 'live-classes'
  | 'certificate-templates'
  | 'certificates'
  | 'question-bank'
  | 'question-papers'
  | 'chapters'
  | 'class-fees'
  | 'fee-types'
  | 'fees'
  | 'fee-ledger'
  | 'fee-dashboard'
  | 'fee-classes-summary'
  | 'fee-payments'
  | 'fee-daily-collection'
  | 'fee-adjustments'
  | 'fee-discounts'
  | 'scholarships'
  | 'wallet'
  | 'wallet-transactions'
  | 'payment-methods'
  | 'subscription'
  | 'subscription-plans'
  | 'subscription-history'
  | 'domain-status'
  | 'notifications'
  | 'messages'
  | 'broadcasts'
  | 'schedules'
  | 'settings';

export type AdminRecord = Record<string, unknown>;

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'time'
  | 'textarea'
  | 'select'
  | 'boolean'
  | 'csv'
  | 'json';

export interface SelectOption {
  label: string;
  value: string;
}

export interface AdminFormField {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  options?: SelectOption[];
  defaultValue?: unknown;
  createOnly?: boolean;
  editOnly?: boolean;
}

export interface AdminFilterField {
  key: string;
  label: string;
  type?: 'select' | 'text';
  placeholder?: string;
  options?: SelectOption[];
}

export interface AdminRowAction {
  key: string;
  label: string;
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: (record: AdminRecord) => string;
  body?: (record: AdminRecord) => AdminRecord | undefined;
  confirm?: string;
  destructive?: boolean;
}

export interface AdminModuleDefinition {
  /**
   * Stable module key. Admin keys come from {@link AdminModuleKey}; teacher,
   * parent and student registries reuse the same engine with their own keys,
   * so the type is widened to `string` here while the admin config keeps the
   * documented union via the {@link AdminModuleKey} alias.
   */
  key: AdminModuleKey | (string & {});
  title: string;
  subtitle: string;
  icon: IconName;
  listPath: string;
  getPath?: string;
  createPath?: string;
  updatePath?: string;
  deletePath?: string;
  createMethod?: 'POST' | 'PUT' | 'PATCH';
  updateMethod?: 'PATCH' | 'PUT' | 'POST';
  singleton?: boolean;
  pageSize?: number;
  searchable?: boolean;
  searchParam?: string;
  clientSearchKeys?: string[];
  listParams?: Record<string, string | number | boolean>;
  requiredFilters?: string[];
  filters?: AdminFilterField[];
  /**
   * Map injected scope keys (e.g. a parent's selected `student_id`) onto
   * create/update payload fields. Example for parent leave:
   *   { student_id: 'requester_id' }
   * The engine fills the target field from scope when the user leaves it blank.
   */
  scopeToPayload?: Record<string, string>;
  displayFields: string[];
  detailFields: string[];
  fields?: AdminFormField[];
  rowActions?: AdminRowAction[];
  transformPayload?: (
    payload: AdminRecord,
    mode: 'create' | 'edit',
    record?: AdminRecord,
  ) => AdminRecord;
}

export interface AdminListResult {
  items: AdminRecord[];
  total?: number;
  page?: number;
  pages?: number;
  limit?: number;
  raw?: unknown;
}
