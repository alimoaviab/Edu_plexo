import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { fetchAdminComposite } from '@/modules/dashboard/api';
import { getRecordId, listAdminRecords } from '@/modules/admin/api';
import { ADMIN_MODULE_BY_KEY } from '@/modules/admin/config';
import type { AdminModuleDefinition, AdminRecord } from '@/modules/admin/types';
import { classTitle } from '@/modules/admin/record-utils';
import {
  ATTENDANCE_STATUS_LABELS,
  type AttendanceSheet,
  type AttendanceSheetStudent,
  type AttendanceStatus,
  MarkAttendanceError,
  fetchAttendanceSheet,
  isAmbiguousNetworkKind,
  markAttendance,
} from '@/modules/attendance/api';
import { compactNumber, formatDate } from '@/utils/format';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

/** Statuses shown on the marking buttons, in display order. */
const MARKING_STATUSES: AttendanceStatus[] = ['present', 'absent', 'late', 'excused'];

const STATUS_ACCENTS: Record<AttendanceStatus, { color: string; light: string }> = {
  present: { color: colors.success, light: colors.successLight },
  absent: { color: colors.error, light: colors.errorLight },
  late: { color: colors.warning, light: colors.warningLight },
  excused: { color: colors.primary, light: colors.primaryLight },
};

const CLASS_PICKER_DEFINITION: AdminModuleDefinition = {
  ...ADMIN_MODULE_BY_KEY.classes,
  pageSize: 100,
};

export default function AttendanceScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState<AdminRecord | null>(null);
  const date = todayIso();

  const classesQuery = useQuery({
    queryKey: ['admin-attendance-classes'],
    queryFn: () => listAdminRecords(CLASS_PICKER_DEFINITION, { page: 1 }),
  });

  // Class cards show today's aggregate from the composite dashboard. It is
  // presentation-only — the marking sheet always derives its numbers from
  // GET /attendance/sheet, never from this payload.
  const dashboardQuery = useQuery({ queryKey: ['admin-composite'], queryFn: fetchAdminComposite });

  const classStatsById = useMemo(
    () => buildClassStatsMap(classesQuery.data?.items ?? [], dashboardQuery.data?.classAttendance ?? []),
    [classesQuery.data?.items, dashboardQuery.data?.classAttendance],
  );

  if (selectedClass) {
    return (
      <AttendanceMarkingView
        classRecord={selectedClass}
        date={date}
        onBack={() => setSelectedClass(null)}
        onManage={() => router.push('/(admin)/module/attendance' as never)}
        onCompositeChanged={() => {
          // Keep the class-card aggregates in sync after marks change.
          queryClient.invalidateQueries({ queryKey: ['admin-composite'] });
        }}
      />
    );
  }

  return (
    <ScreenContainer scroll>
      <Header
        greeting="Daily Attendance"
        title="Attendance"
        subtitle={`Select a class · ${formatDate(date, true)}`}
      />
      {classesQuery.isLoading || dashboardQuery.isLoading ? (
        <StateCard loading title="Loading classes" />
      ) : classesQuery.isError ? (
        <StateCard title="Unable to load classes" message={classesQuery.error.message} />
      ) : classesQuery.data?.items.length ? (
        <View style={styles.classList}>
          {classesQuery.data.items.map((item) => (
            <ClassAttendanceCard
              key={getRecordId(item)}
              record={item}
              stats={classStatsById.get(getRecordId(item))}
              onPress={() => setSelectedClass(item)}
            />
          ))}
        </View>
      ) : (
        <StateCard title="No classes" message="Create classes from the existing Classes module." />
      )}
    </ScreenContainer>
  );
}

/**
 * Marking view for one class. Every visible state — student status, summary
 * counters, Not marked chips — is derived from the authoritative
 * GET /attendance/sheet response; the mutation only triggers a refetch.
 */
function AttendanceMarkingView({
  classRecord,
  date,
  onBack,
  onManage,
  onCompositeChanged,
}: {
  classRecord: AdminRecord;
  date: string;
  onBack: () => void;
  onManage: () => void;
  onCompositeChanged: () => void;
}) {
  const classId = getRecordId(classRecord);
  const queryClient = useQueryClient();

  const applySheet = useCallback(
    (fresh: AttendanceSheet) => {
      queryClient.setQueryData(['admin-attendance-sheet', classId, date], fresh);
    },
    [classId, date, queryClient],
  );

  const sheetQuery = useQuery({
    queryKey: ['admin-attendance-sheet', classId, date],
    queryFn: () => fetchAttendanceSheet({ classId, date }),
    enabled: !!classId,
    // Fresh window around a mutation; long-lived between visits.
    staleTime: 15_000,
    refetchInterval: 60_000,
  });

  const [markingStudentId, setMarkingStudentId] = useState<string | null>(null);
  // Student ids in a failed request, pending reconciliation outcome.
  const [failedStudentIds, setFailedStudentIds] = useState<string[]>([]);

  const markMutation = useMutation({
    mutationFn: async ({ student, status }: { student: AttendanceSheetStudent; status: AttendanceStatus }) => {
      setMarkingStudentId(student.student_id);
      try {
        return await markAttendance({
          classId,
          date,
          records: { [student.student_id]: status },
        });
      } catch (error) {
        // Timeout / no-response: the backend may still have processed the
        // mark. Re-read the sheet and reconcile before reporting failure.
        if (error instanceof MarkAttendanceError && isAmbiguousNetworkKind(error.backend?.kind)) {
          try {
            const sheet = await fetchAttendanceSheet({ classId, date });
            const fresh = sheet.students.find((row) => row.student_id === student.student_id);
            if (fresh && fresh.status === status) {
              await applySheet(sheet);
              return { saved: 1, failed: 0, total: 1 } as const;
            }
          } catch {
            // Sheet also unreachable — fall through to the error state below.
          }
        }
        throw error;
      }
    },
    onSuccess: async (_result, { student }) => {
      setFailedStudentIds((ids) => ids.filter((id) => id !== student.student_id));
      // Single source of truth: re-read the sheet after a successful mark.
      await queryClient.invalidateQueries({ queryKey: ['admin-attendance-sheet', classId, date] });
      onCompositeChanged();
    },
    onError: (error, { student }) => {
      const ambiguous = error instanceof MarkAttendanceError && error.ambiguous;
      if (ambiguous) {
        // Reconciliation already failed — leave the row in the visible
        // retry state instead of silently swallowing the outcome.
        setFailedStudentIds((ids) => (ids.includes(student.student_id) ? ids : [...ids, student.student_id]));
      } else {
        // Definitive backend rejection (validation / permission / …) —
        // explain it; the sheet refetch below re-syncs the row state.
        Alert.alert('Attendance not saved', error.message);
        setFailedStudentIds((ids) => ids.filter((id) => id !== student.student_id));
        queryClient.invalidateQueries({ queryKey: ['admin-attendance-sheet', classId, date] }).catch(() => {});
      }
    },
    onSettled: () => {
      // Clear the busy flag on every path, including reconciliation.
      setMarkingStudentId(null);
    },
  });

  const sheet = sheetQuery.data;

  const students = sheet?.students ?? [];
  const summary = sheet?.summary;
  const summaryPercent = summary && summary.marked > 0 ? Math.round((summary.present / summary.marked) * 100) : 0;
  const unmarked = summary ? summary.total - summary.marked : 0;

  const handleMark = useCallback(
    (student: AttendanceSheetStudent, status: AttendanceStatus) => {
      if (markingStudentId) return; // one in-flight mark at a time
      markMutation.mutate({ student, status });
    },
    [markMutation, markingStudentId],
  );

  return (
    <ScreenContainer scroll>
      <Header
        showBack
        onBack={onBack}
        greeting="Attendance"
        title={classTitle(classRecord)}
        subtitle={`Today · ${formatDate(date, true)}`}
        right={<Button label="Manage" size="sm" onPress={onManage} />}
      />

      {sheetQuery.isLoading ? (
        <StateCard loading title="Loading attendance sheet" />
      ) : sheetQuery.isError ? (
        <StateCard
          title="Unable to load attendance"
          message={sheetQuery.error.message}
          onRetry={() => sheetQuery.refetch()}
        />
      ) : (
        <>
          {summary ? (
            <AttendanceSummaryCard
              stats={summary}
              unmarked={unmarked}
              percent={summaryPercent}
            />
          ) : null}

          {students.length === 0 ? (
            <StateCard title="No students" message="No active students were found for this class." />
          ) : (
            <View style={styles.list}>
              {students.map((student) => (
                <AttendanceStudentRow
                  key={student.student_id}
                  student={student}
                  busy={markingStudentId === student.student_id}
                  failed={failedStudentIds.includes(student.student_id)}
                  onMark={(status) => handleMark(student, status)}
                  onRetry={() => sheetQuery.refetch()}
                />
              ))}
            </View>
          )}
        </>
      )}
    </ScreenContainer>
  );
}

function AttendanceSummaryCard({
  stats,
  unmarked,
  percent,
}: {
  stats: { total: number; marked: number; present: number; absent: number; late: number };
  unmarked: number;
  percent: number;
}) {
  return (
    <Card style={styles.summary} padding="md">
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Today</Text>
        <Text style={styles.summaryPercent}>{percent}% present</Text>
      </View>
      <View style={styles.miniStats}>
        <MiniStat label="Students" value={stats.total} color={colors.gray700} />
        <MiniStat label="Present" value={stats.present} color={colors.success} />
        <MiniStat label="Absent" value={stats.absent} color={colors.error} />
        <MiniStat label="Late" value={stats.late} color={colors.warning} />
      </View>
      {unmarked > 0 ? (
        <Text style={styles.unmarkedNote}>{unmarked} not marked yet</Text>
      ) : null}
    </Card>
  );
}

function AttendanceStudentRow({
  student,
  busy,
  failed,
  onMark,
  onRetry,
}: {
  student: AttendanceSheetStudent;
  busy: boolean;
  failed: boolean;
  onMark: (status: AttendanceStatus) => void;
  onRetry: () => void;
}) {
  return (
    <Card style={[styles.studentCard, failed && styles.studentCardFailed]} padding="md">
      <View style={styles.studentHeader}>
        <View style={styles.studentIcon}>
          <Icon name="graduation" size={18} color={colors.primary} />
        </View>
        <View style={styles.studentText}>
          <Text style={styles.studentTitle} numberOfLines={1}>
            {student.student_name || 'Student'}
          </Text>
          <Text style={styles.studentMeta} numberOfLines={1}>
            {[student.admission_no, student.roll_no ? `Roll ${student.roll_no}` : ''].filter(Boolean).join(' · ') ||
              'Student'}
          </Text>
        </View>
        {student.status == null ? (
          <View style={styles.unmarkedChip}>
            <Text style={styles.unmarkedChipText}>Not marked</Text>
          </View>
        ) : busy ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : failed ? (
          <Pressable onPress={onRetry} style={styles.retryChip} hitSlop={6}>
            <Icon name="alert-triangle" size={14} color={colors.error} />
            <Text style={styles.retryChipText}>Retry</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.statusRow}>
        {MARKING_STATUSES.map((status) => (
          <StatusButton
            key={status}
            status={status}
            active={student.status === status}
            busy={busy}
            onPress={onMark}
          />
        ))}
      </View>
    </Card>
  );
}

function StatusButton({
  status,
  active,
  busy,
  onPress,
}: {
  status: AttendanceStatus;
  active: boolean;
  busy: boolean;
  onPress: (status: AttendanceStatus) => void;
}) {
  const accent = STATUS_ACCENTS[status];
  return (
    <Pressable
      onPress={() => onPress(status)}
      disabled={busy}
      accessibilityRole="button"
      accessibilityState={{ selected: active, busy }}
      style={({ pressed }) => [
        styles.statusButton,
        active && { backgroundColor: accent.color, borderColor: accent.color },
        !active && busy && styles.statusButtonBusy,
        pressed && !busy && styles.pressed,
      ]}
    >
      <Text style={[styles.statusText, active && styles.statusTextActive]}>{ATTENDANCE_STATUS_LABELS[status]}</Text>
      {active ? <Icon name="check" size={12} color={colors.white} /> : null}
    </Pressable>
  );
}

function ClassAttendanceCard({
  record,
  stats,
  onPress,
}: {
  record: AdminRecord;
  stats?: ClassStats;
  onPress: () => void;
}) {
  const total = stats?.total ?? readCount(record, ['student_count', 'students_count', 'total_students']);
  const percent = stats?.percent ?? (total ? Math.round(((stats?.present ?? 0) / total) * 100) : 0);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.classAttendanceCard, shadows.card, pressed && styles.pressed]}
    >
      <View style={styles.classHeader}>
        <View style={styles.classIcon}>
          <Icon name="graduation" size={20} color={colors.primary} />
        </View>
        <View style={styles.classHeaderText}>
          <Text style={styles.classTitle} numberOfLines={1}>
            {classTitle(record)}
          </Text>
          <Text style={styles.classMeta} numberOfLines={1}>
            {compactNumber(total)} students
          </Text>
        </View>
        <Text style={styles.percent}>{percent}%</Text>
      </View>
      <View style={styles.miniStats}>
        <MiniStat label="Present" value={stats?.present ?? 0} color={colors.success} />
        <MiniStat label="Absent" value={stats?.absent ?? 0} color={colors.error} />
        <MiniStat label="Late" value={stats?.late ?? 0} color={colors.warning} />
      </View>
    </Pressable>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={[styles.miniStatValue, { color }]}>{compactNumber(value)}</Text>
      <Text style={styles.miniStatLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function StateCard({
  title,
  message,
  loading = false,
  onRetry,
}: {
  title: string;
  message?: string;
  loading?: boolean;
  onRetry?: () => void;
}) {
  return (
    <Card style={styles.state}>
      {loading ? <ActivityIndicator color={colors.primary} /> : null}
      <Text style={styles.stateTitle}>{title}</Text>
      {message ? <Text style={styles.stateText}>{message}</Text> : null}
      {onRetry && !loading ? (
        <Button label="Try Again" size="sm" variant="secondary" onPress={onRetry} />
      ) : null}
    </Card>
  );
}

interface ClassStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  percent: number;
}

function buildClassStatsMap(
  classes: AdminRecord[],
  rows: Record<string, unknown>[],
): Map<string, ClassStats> {
  const map = new Map<string, ClassStats>();
  for (const cls of classes) {
    const id = getRecordId(cls);
    const title = classTitle(cls).toLowerCase();
    const row = rows.find((candidate) => {
      const candidateId = String(candidate.class_id ?? candidate.id ?? candidate._id ?? '');
      const candidateName = String(candidate.class_name ?? candidate.name ?? '').toLowerCase();
      return candidateId === id || (!!candidateName && candidateName === title);
    });
    if (!row) continue;
    const present = readCount(row, ['present', 'present_count']);
    const absent = readCount(row, ['absent', 'absent_count']);
    const late = readCount(row, ['late', 'late_count']);
    const total = readCount(row, ['total', 'total_students', 'student_count']) || readCount(cls, ['student_count', 'students_count', 'total_students']);
    map.set(id, {
      total,
      present,
      absent,
      late,
      percent: total ? Math.round((present / total) * 100) : 0,
    });
  }
  return map;
}

function readCount(record: Record<string, unknown> | undefined, keys: string[]): number {
  if (!record) return 0;
  for (const key of keys) {
    const value = record[key];
    const parsed = typeof value === 'number' ? value : Number(String(value ?? ''));
    if (Number.isFinite(parsed)) return Math.trunc(parsed);
  }
  return 0;
}

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  classList: { gap: spacing.md, paddingBottom: spacing.xl3 },
  classAttendanceCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
    gap: spacing.md,
  },
  classHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  classIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classHeaderText: { flex: 1, gap: 2 },
  classTitle: { ...typography.bodyLg, color: colors.gray900, fontWeight: '800' },
  classMeta: { ...typography.bodySm, color: colors.gray500 },
  percent: { ...typography.h3, color: colors.primary, fontWeight: '800' },
  summary: { gap: spacing.md, marginBottom: spacing.md },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryTitle: { ...typography.bodyLg, color: colors.gray900, fontWeight: '800' },
  summaryPercent: { ...typography.bodySm, color: colors.primary, fontWeight: '800' },
  miniStats: { flexDirection: 'row', gap: spacing.sm },
  miniStat: {
    flex: 1,
    minWidth: 56,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.gray50,
    alignItems: 'center',
  },
  miniStatValue: { ...typography.bodyLg, fontWeight: '800' },
  miniStatLabel: { ...typography.caption, color: colors.gray500, fontWeight: '700' },
  unmarkedNote: { ...typography.bodySm, color: colors.gray500 },
  list: { gap: spacing.sm, paddingBottom: spacing.xl3 },
  studentCard: { gap: spacing.md },
  studentCardFailed: { borderColor: colors.errorLight, borderWidth: 1 },
  studentHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  studentIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentText: { flex: 1, gap: 2 },
  studentTitle: { ...typography.bodyMd, color: colors.gray900, fontWeight: '800' },
  studentMeta: { ...typography.bodySm, color: colors.gray500 },
  unmarkedChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
  },
  unmarkedChipText: { ...typography.caption, color: colors.gray500, fontWeight: '700' },
  retryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.errorLight,
  },
  retryChipText: { ...typography.caption, color: colors.error, fontWeight: '800' },
  statusRow: { flexDirection: 'row', gap: spacing.xs },
  statusButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  statusButtonBusy: { opacity: 0.6 },
  statusText: { ...typography.bodySm, color: colors.gray700, fontWeight: '800' },
  statusTextActive: { color: colors.white },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  state: { alignItems: 'center', gap: spacing.sm },
  stateTitle: { ...typography.bodyLg, color: colors.gray900, fontWeight: '800', textAlign: 'center' },
  stateText: { ...typography.bodySm, color: colors.gray500, textAlign: 'center' },
});
