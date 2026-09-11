/**
 * Attendance domain API for the daily marking sheet.
 *
 * Uses the same endpoints the web app uses:
 *   • POST /attendance/mark    — idempotent batch upsert
 *     (backend: ON CONFLICT (school_id, student_id, date, period) DO UPDATE),
 *     so repeated taps and automatic retries can never create duplicates.
 *   • GET  /attendance/sheet   — server-side LEFT JOIN of students ×
 *     attendance for one class/date, including the authoritative summary.
 *
 * Backend rules honored here (backend-go/internal/domain/attendance):
 *   • Statuses are exactly 'present' | 'absent' | 'late' | 'excused'
 *     (attendance_status_chk) — nothing else is ever sent or displayed.
 *   • The mark endpoint keys records on (school, student, date, period);
 *     the sheet reads period=1 by default and the summary is computed by
 *     the backend, so the UI derives every number from this response.
 */

import { api } from '@/api/client';

/** The only attendance states the backend accepts (DB CHECK constraint). */
export const ATTENDANCE_STATUSES = ['present', 'absent', 'late', 'excused'] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export interface AttendanceSheetStudent {
  student_id: string;
  student_name: string;
  admission_no: string;
  roll_no: string;
  /** null when the student has not been marked yet. */
  status: AttendanceStatus | null;
  note: string | null;
  /** Attendance record id — null when not marked. */
  attendance_id: string | null;
}

export interface AttendanceSheetSummary {
  total: number;
  marked: number;
  present: number;
  absent: number;
  late: number;
}

export interface AttendanceSheet {
  class_id: string;
  class_name: string;
  date: string;
  period: number;
  students: AttendanceSheetStudent[];
  summary: AttendanceSheetSummary;
}

export interface MarkAttendanceResult {
  saved: number;
  failed: number;
  total: number;
}

/** Human label per backend status. */
export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  excused: 'Excused',
};

function isAttendanceStatus(value: unknown): value is AttendanceStatus {
  return (
    typeof value === 'string' && (ATTENDANCE_STATUSES as readonly string[]).includes(value)
  );
}

export interface MarkArgs {
  classId: string;
  date: string;
  /** student_id → status */
  records: Record<string, AttendanceStatus>;
  period?: number;
  academicYearId?: string;
}

/**
 * Mark attendance for one or more students. Idempotent upsert — safe to
 * retry after a timeout because the backend resolves the same
 * (school, student, date, period) key instead of creating a duplicate.
 */
export async function markAttendance(args: MarkArgs): Promise<MarkAttendanceResult> {
  const body: Record<string, unknown> = {
    class_id: args.classId,
    date: args.date,
    records: args.records,
  };
  if (args.period && args.period > 0) body.period = args.period;
  if (args.academicYearId) body.academic_year_id = args.academicYearId;

  const result = await api.post<MarkAttendanceResult, typeof body>('/attendance/mark', body);
  if (!result.ok) {
    throw new MarkAttendanceError(result.message ?? 'Attendance could not be saved.', result.error);
  }
  const data = result.data;
  if (!data || typeof data.saved !== 'number') {
    // Unknown response shape — treat as unverifiable rather than success.
    throw new MarkAttendanceError('The server response could not be confirmed.', undefined, true);
  }
  return data;
}

export class MarkAttendanceError extends Error {
  /** Backend error payload (code/status/kind) when the request got a response. */
  readonly backend?: { code?: string; status?: number; kind?: string };
  /** True when the request never reached a definite backend verdict
   *  (timeout / unreachable / interrupted). The authoritative state must be
   *  reconciled via the sheet before reporting failure to the user. */
  readonly ambiguous: boolean;

  constructor(message: string, backend?: { code?: string; status?: number; kind?: string }, ambiguous = false) {
    super(message);
    this.name = 'MarkAttendanceError';
    this.backend = backend;
    this.ambiguous = ambiguous;
  }
}

export interface FetchSheetArgs {
  classId: string;
  date: string;
  period?: number;
  academicYearId?: string;
}

/**
 * Fetch the authoritative attendance sheet for a class/date from the
 * backend JOIN endpoint (students + statuses + computed summary).
 */
export async function fetchAttendanceSheet(args: FetchSheetArgs): Promise<AttendanceSheet> {
  const query: Record<string, string | number> = {
    class_id: args.classId,
    date: args.date,
  };
  if (args.period && args.period > 0) query.period = args.period;
  if (args.academicYearId) query.academic_year_id = args.academicYearId;

  const result = await api.get<Record<string, unknown>>('/attendance/sheet', { query });
  if (!result.ok || !result.data) {
    throw new Error(result.message ?? 'Unable to load the attendance sheet.');
  }
  return normalizeSheet(result.data);
}

function normalizeSheet(payload: Record<string, unknown>): AttendanceSheet {
  const rawStudents = Array.isArray(payload.students) ? payload.students : [];
  const students: AttendanceSheetStudent[] = [];
  for (const raw of rawStudents) {
    if (!raw || typeof raw !== 'object') continue;
    const row = raw as Record<string, unknown>;
    students.push({
      student_id: String(row.student_id ?? ''),
      student_name: String(row.student_name ?? ''),
      admission_no: String(row.admission_no ?? ''),
      roll_no: String(row.roll_no ?? ''),
      status: isAttendanceStatus(row.status) ? row.status : null,
      note: row.note == null ? null : String(row.note),
      attendance_id: row.attendance_id == null ? null : String(row.attendance_id),
    });
  }

  const rawSummary =
    payload.summary && typeof payload.summary === 'object'
      ? (payload.summary as Record<string, unknown>)
      : {};
  const toInt = (value: unknown): number => {
    const parsed = typeof value === 'number' ? value : Number(String(value ?? ''));
    return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
  };

  return {
    class_id: String(payload.class_id ?? ''),
    class_name: String(payload.class_name ?? ''),
    date: String(payload.date ?? ''),
    period: toInt(payload.period) || 1,
    students,
    summary: {
      total: toInt(rawSummary.total) || students.length,
      marked: toInt(rawSummary.marked),
      present: toInt(rawSummary.present),
      absent: toInt(rawSummary.absent),
      late: toInt(rawSummary.late),
    },
  };
}

/** True when the failure kind means "no definite backend verdict". */
export function isAmbiguousNetworkKind(kind: string | undefined): boolean {
  return kind === 'timeout' || kind === 'unreachable';
}
