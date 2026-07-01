import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { fetchAdminComposite } from '@/modules/dashboard/api';
import { getRecordId, listAdminRecords, saveAdminRecord } from '@/modules/admin/api';
import { ADMIN_MODULE_BY_KEY } from '@/modules/admin/config';
import type { AdminModuleDefinition, AdminRecord } from '@/modules/admin/types';
import { classTitle, numberFrom, recordSubtitle, recordTitle, todayIso } from '@/modules/admin/record-utils';
import { compactNumber, formatDate } from '@/utils/format';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

type AttendanceStatus = 'present' | 'absent' | 'late';

const CLASS_PICKER_DEFINITION: AdminModuleDefinition = {
  ...ADMIN_MODULE_BY_KEY.classes,
  pageSize: 100,
};

const STUDENT_PICKER_DEFINITION: AdminModuleDefinition = {
  ...ADMIN_MODULE_BY_KEY.students,
  pageSize: 200,
};

const ATTENDANCE_SHEET_DEFINITION: AdminModuleDefinition = {
  ...ADMIN_MODULE_BY_KEY['attendance-sheet'],
  pageSize: 200,
};

interface ClassStats {
  percent?: number;
  present: number;
  absent: number;
  late: number;
  total: number;
}

export default function AttendanceScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState<AdminRecord | null>(null);
  const [markingStudentId, setMarkingStudentId] = useState<string | null>(null);
  const selectedClassId = selectedClass ? getRecordId(selectedClass) : '';
  const date = todayIso();

  const classesQuery = useQuery({
    queryKey: ['admin-attendance-classes'],
    queryFn: () => listAdminRecords(CLASS_PICKER_DEFINITION, { page: 1 }),
  });

  const dashboardQuery = useQuery({ queryKey: ['admin-composite'], queryFn: fetchAdminComposite });

  const studentsQuery = useQuery({
    queryKey: ['admin-attendance-students', selectedClassId],
    queryFn: () =>
      listAdminRecords(STUDENT_PICKER_DEFINITION, {
        page: 1,
        filters: { class_id: selectedClassId },
      }),
    enabled: !!selectedClassId,
  });

  const sheetQuery = useQuery({
    queryKey: ['admin-attendance-sheet', selectedClassId, date],
    queryFn: () =>
      listAdminRecords(ATTENDANCE_SHEET_DEFINITION, {
        page: 1,
        filters: { class_id: selectedClassId, date },
      }),
    enabled: !!selectedClassId,
  });

  const sheetRows = sheetQuery.data?.items ?? [];
  const classStatsById = useMemo(
    () => buildClassStatsMap(classesQuery.data?.items ?? [], dashboardQuery.data?.classAttendance ?? []),
    [classesQuery.data?.items, dashboardQuery.data?.classAttendance],
  );

  const markMutation = useMutation({
    mutationFn: async ({ student, status }: { student: AdminRecord; status: AttendanceStatus }) => {
      const existing = findSheetRow(sheetRows, student);
      const attendanceId = attendanceRecordId(existing);
      const payload: AdminRecord = {
        student_id: getRecordId(student),
        class_id: selectedClassId,
        date,
        status,
      };

      if (attendanceId) {
        return saveAdminRecord({
          definition: ADMIN_MODULE_BY_KEY.attendance,
          mode: 'edit',
          record: { ...(existing ?? {}), _id: attendanceId },
          payload,
        });
      }

      return saveAdminRecord({
        definition: ADMIN_MODULE_BY_KEY.attendance,
        mode: 'create',
        payload,
      });
    },
    onMutate: ({ student }) => {
      setMarkingStudentId(getRecordId(student));
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-attendance-sheet', selectedClassId, date] }),
        queryClient.invalidateQueries({ queryKey: ['admin-composite'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-module', 'attendance'] }),
      ]);
    },
    onError: (error) => Alert.alert('Attendance failed', error.message),
    onSettled: () => setMarkingStudentId(null),
  });

  if (selectedClass) {
    const stats = summarizeSelectedClass(selectedClass, sheetRows, classStatsById.get(selectedClassId));
    return (
      <ScreenContainer scroll>
        <Header
          showBack
          onBack={() => setSelectedClass(null)}
          greeting="Attendance"
          title={classTitle(selectedClass)}
          subtitle={`Today · ${formatDate(date, true)}`}
          right={<Button label="Manage" size="sm" onPress={() => router.push('/(admin)/module/attendance' as never)} />}
        />
        <AttendanceSummaryCard stats={stats} />
        {studentsQuery.isLoading || sheetQuery.isLoading ? (
          <StateCard loading title="Loading attendance sheet" />
        ) : studentsQuery.isError ? (
          <StateCard title="Unable to load students" message={studentsQuery.error.message} />
        ) : sheetQuery.isError ? (
          <StateCard title="Unable to load attendance" message={sheetQuery.error.message} />
        ) : studentsQuery.data?.items.length ? (
          <View style={styles.list}>
            {studentsQuery.data.items.map((student) => {
              const row = findSheetRow(sheetRows, student);
              return (
                <AttendanceStudentRow
                  key={getRecordId(student)}
                  student={student}
                  status={statusFromRow(row)}
                  busy={markingStudentId === getRecordId(student)}
                  onMark={(status) => markMutation.mutate({ student, status })}
                />
              );
            })}
          </View>
        ) : (
          <StateCard title="No students" message="No students were returned for this class." />
        )}
      </ScreenContainer>
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

function ClassAttendanceCard({
  record,
  stats,
  onPress,
}: {
  record: AdminRecord;
  stats?: ClassStats;
  onPress: () => void;
}) {
  const total =
    stats?.total ??
    numberFrom(record.student_count) ??
    numberFrom(record.students_count) ??
    numberFrom(record.total_students) ??
    0;
  const percent = stats?.percent ?? (total ? Math.round(((stats?.present ?? 0) / total) * 100) : 0);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.classAttendanceCard, shadows.card, pressed && styles.pressed]}>
      <View style={styles.classHeader}>
        <View style={styles.classIcon}>
          <Icon name="graduation" size={20} color={colors.primary} />
        </View>
        <View style={styles.classHeaderText}>
          <Text style={styles.classTitle} numberOfLines={1}>{classTitle(record)}</Text>
          <Text style={styles.classMeta} numberOfLines={1}>{compactNumber(total)} students</Text>
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

function AttendanceSummaryCard({ stats }: { stats: ClassStats }) {
  const percent = stats.percent ?? (stats.total ? Math.round((stats.present / stats.total) * 100) : 0);
  return (
    <Card style={styles.summary} padding="md">
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Today</Text>
        <Text style={styles.summaryPercent}>{percent}%</Text>
      </View>
      <View style={styles.miniStats}>
        <MiniStat label="Total" value={stats.total} color={colors.gray700} />
        <MiniStat label="Present" value={stats.present} color={colors.success} />
        <MiniStat label="Absent" value={stats.absent} color={colors.error} />
        <MiniStat label="Late" value={stats.late} color={colors.warning} />
      </View>
    </Card>
  );
}

function AttendanceStudentRow({
  student,
  status,
  busy,
  onMark,
}: {
  student: AdminRecord;
  status?: AttendanceStatus;
  busy: boolean;
  onMark: (status: AttendanceStatus) => void;
}) {
  return (
    <Card style={styles.studentCard} padding="md">
      <View style={styles.studentHeader}>
        <View style={styles.studentIcon}>
          <Icon name="graduation" size={18} color={colors.primary} />
        </View>
        <View style={styles.studentText}>
          <Text style={styles.studentTitle} numberOfLines={1}>{recordTitle(student, ADMIN_MODULE_BY_KEY.students, 'Student')}</Text>
          <Text style={styles.studentMeta} numberOfLines={1}>
            {recordSubtitle(student, ['admission_no', 'roll_no', 'section']) || 'Student'}
          </Text>
        </View>
        {busy ? <ActivityIndicator size="small" color={colors.primary} /> : null}
      </View>
      <View style={styles.statusRow}>
        <StatusButton label="Present" value="present" active={status === 'present'} busy={busy} color={colors.success} onPress={onMark} />
        <StatusButton label="Absent" value="absent" active={status === 'absent'} busy={busy} color={colors.error} onPress={onMark} />
        <StatusButton label="Late" value="late" active={status === 'late'} busy={busy} color={colors.warning} onPress={onMark} />
      </View>
    </Card>
  );
}

function StatusButton({
  label,
  value,
  active,
  busy,
  color,
  onPress,
}: {
  label: string;
  value: AttendanceStatus;
  active: boolean;
  busy: boolean;
  color: string;
  onPress: (status: AttendanceStatus) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(value)}
      disabled={busy}
      style={[styles.statusButton, active && { backgroundColor: color, borderColor: color }, busy && styles.disabled]}
    >
      <Text style={[styles.statusText, active && styles.statusTextActive]}>{label}</Text>
    </Pressable>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={[styles.miniStatValue, { color }]}>{compactNumber(value)}</Text>
      <Text style={styles.miniStatLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function StateCard({ title, message, loading = false }: { title: string; message?: string; loading?: boolean }) {
  return (
    <Card style={styles.state}>
      {loading ? <ActivityIndicator color={colors.primary} /> : null}
      <Text style={styles.stateTitle}>{title}</Text>
      {message ? <Text style={styles.stateText}>{message}</Text> : null}
    </Card>
  );
}

function buildClassStatsMap(classes: AdminRecord[], rows: Record<string, unknown>[]): Map<string, ClassStats> {
  const map = new Map<string, ClassStats>();
  for (const cls of classes) {
    const id = getRecordId(cls);
    const title = classTitle(cls).toLowerCase();
    const row = rows.find((candidate) => {
      const candidateId = String(candidate.class_id ?? candidate.id ?? candidate._id ?? '');
      const candidateName = String(candidate.class_name ?? candidate.name ?? '').toLowerCase();
      return candidateId === id || (!!candidateName && candidateName === title);
    });
    if (row) map.set(id, statsFromRow(row, cls));
  }
  return map;
}

function summarizeSelectedClass(selectedClass: AdminRecord, rows: AdminRecord[], fallback?: ClassStats): ClassStats {
  if (rows.length) {
    const present = rows.filter((row) => statusFromRow(row) === 'present').length;
    const absent = rows.filter((row) => statusFromRow(row) === 'absent').length;
    const late = rows.filter((row) => statusFromRow(row) === 'late').length;
    const total = rows.length;
    return { present, absent, late, total, percent: total ? Math.round((present / total) * 100) : 0 };
  }
  return fallback ?? statsFromRow({}, selectedClass);
}

function statsFromRow(row: Record<string, unknown>, cls?: AdminRecord): ClassStats {
  const total =
    numberFrom(row.total) ??
    numberFrom(row.total_students) ??
    numberFrom(row.student_count) ??
    numberFrom(cls?.student_count) ??
    numberFrom(cls?.students_count) ??
    0;
  const present = numberFrom(row.present) ?? numberFrom(row.present_count) ?? 0;
  const absent = numberFrom(row.absent) ?? numberFrom(row.absent_count) ?? 0;
  const late = numberFrom(row.late) ?? numberFrom(row.late_count) ?? 0;
  const percent =
    numberFrom(row.percent) ??
    numberFrom(row.percentage) ??
    numberFrom(row.attendance_percentage) ??
    (total ? Math.round((present / total) * 100) : 0);
  return { total, present, absent, late, percent };
}

function findSheetRow(rows: AdminRecord[], student: AdminRecord): AdminRecord | undefined {
  const studentId = getRecordId(student);
  const admissionNo = String(student.admission_no ?? '').trim();
  return rows.find((row) => {
    const nestedStudent = row.student && typeof row.student === 'object' ? (row.student as AdminRecord) : undefined;
    const rowStudentId = String(row.student_id ?? row.studentId ?? nestedStudent?.id ?? nestedStudent?._id ?? '').trim();
    const rowAdmission = String(row.admission_no ?? row.admissionNo ?? '').trim();
    return (!!studentId && rowStudentId === studentId) || (!!admissionNo && rowAdmission === admissionNo);
  });
}

function attendanceRecordId(row: AdminRecord | undefined): string {
  if (!row) return '';
  const studentId = String(row.student_id ?? row.studentId ?? '').trim();
  const candidates = [
    row.attendance_id,
    row.attendanceId,
    row.attendance_record_id,
    row.record_id,
    row.attendance && typeof row.attendance === 'object' ? (row.attendance as AdminRecord)._id : undefined,
    row.attendance && typeof row.attendance === 'object' ? (row.attendance as AdminRecord).id : undefined,
    row.id,
    row._id,
  ];
  for (const candidate of candidates) {
    const id = String(candidate ?? '').trim();
    if (id && id !== studentId) return id;
  }
  return '';
}

function statusFromRow(row: AdminRecord | undefined): AttendanceStatus | undefined {
  const raw = String(row?.status ?? row?.attendance_status ?? '').toLowerCase();
  if (raw === 'present' || raw === 'absent' || raw === 'late') return raw;
  return undefined;
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
  summaryPercent: { ...typography.h2, color: colors.primary },
  miniStats: { flexDirection: 'row', gap: spacing.sm },
  miniStat: {
    flex: 1,
    minWidth: 64,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.gray50,
    alignItems: 'center',
  },
  miniStatValue: { ...typography.bodyLg, fontWeight: '800' },
  miniStatLabel: { ...typography.caption, color: colors.gray500, fontWeight: '700' },
  list: { gap: spacing.sm, paddingBottom: spacing.xl3 },
  studentCard: { gap: spacing.md },
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
  statusRow: { flexDirection: 'row', gap: spacing.sm },
  statusButton: {
    flex: 1,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { ...typography.bodySm, color: colors.gray700, fontWeight: '800' },
  statusTextActive: { color: colors.white },
  disabled: { opacity: 0.6 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  state: { alignItems: 'center', gap: spacing.sm },
  stateTitle: { ...typography.bodyLg, color: colors.gray900, fontWeight: '800', textAlign: 'center' },
  stateText: { ...typography.bodySm, color: colors.gray500, textAlign: 'center' },
});
