/**
 * Attendance — the most-used teacher action.
 *
 * Flow:
 *   1. Pick a class.
 *   2. Pick a date (defaults to today).
 *   3. The screen loads existing attendance for that class+date and the
 *      class's roster of students.
 *   4. Tap a student to cycle Present → Absent → Late → Excused.
 *   5. Save sends a bulk POST to /api/attendance/mark.
 *
 * Parents and students see a read-only summary of their own attendance.
 */

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { Picker } from '@/components/ui/Picker';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  useAttendance,
  useClasses,
  useMarkAttendance,
  useStudents,
  useTenant,
} from '@/hooks';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { fullName, todayIso } from '@/utils/format';

const STATUSES = ['present', 'absent', 'late', 'excused'] as const;
type Status = (typeof STATUSES)[number];

const STATUS_TONE: Record<Status, { bg: string; fg: string; label: string }> = {
  present: { bg: colors.successLight, fg: colors.success, label: 'P' },
  absent: { bg: colors.errorLight, fg: colors.error, label: 'A' },
  late: { bg: colors.warningLight, fg: colors.warning, label: 'L' },
  excused: { bg: colors.infoLight, fg: colors.info, label: 'E' },
};

export default function AttendanceScreen() {
  const { role, classId } = useTenant();
  const isStaff = role === 'admin' || role === 'super_admin' || role === 'teacher';

  if (!isStaff) {
    return <StudentAttendanceView />;
  }

  return <StaffAttendanceView defaultClassId={classId} />;
}

function StaffAttendanceView({ defaultClassId }: { defaultClassId?: string }) {
  const [date, setDate] = useState<string>(todayIso());
  const [selectedClass, setSelectedClass] = useState<string>(defaultClassId ?? '');
  const [drafts, setDrafts] = useState<Record<string, Status>>({});

  const classesQ = useClasses();
  const classOptions = useMemo(
    () =>
      (classesQ.items?.data ?? []).map((c) => ({
        label: [c.name, c.section].filter(Boolean).join(' — '),
        value: c._id ?? c.id ?? '',
      })),
    [classesQ.items],
  );

  const students = useStudents({
    class_id: selectedClass || undefined,
    status: 'active',
  });
  const attendance = useAttendance({
    class_id: selectedClass || undefined,
    date,
  });
  const mark = useMarkAttendance();

  // Seed drafts whenever the existing attendance loads / changes.
  useEffect(() => {
    if (!attendance.items) return;
    const seed: Record<string, Status> = {};
    for (const r of attendance.items) {
      seed[r.student_id] = (r.status as Status) ?? 'present';
    }
    setDrafts(seed);
  }, [attendance.items, date, selectedClass]);

  function cycleStatus(studentId: string) {
    setDrafts((prev) => {
      const current = prev[studentId] ?? 'present';
      const idx = STATUSES.indexOf(current);
      const next = STATUSES[(idx + 1) % STATUSES.length];
      return { ...prev, [studentId]: next };
    });
  }

  async function handleSave() {
    if (!selectedClass) {
      Alert.alert('Pick a class', 'Choose a class before saving attendance.');
      return;
    }
    const records = (students.items ?? []).map((s) => ({
      student_id: s._id ?? s.id ?? '',
      status: (drafts[s._id ?? s.id ?? ''] ?? 'present') as Status,
    }));
    if (records.length === 0) {
      Alert.alert('No students', 'This class has no active students.');
      return;
    }
    try {
      await mark.mutateAsync({
        class_id: selectedClass,
        date,
        records,
      });
      Alert.alert('Saved', 'Attendance marked.');
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  }

  function setAll(status: Status) {
    const next: Record<string, Status> = {};
    for (const s of students.items ?? []) {
      const id = s._id ?? s.id ?? '';
      if (id) next[id] = status;
    }
    setDrafts(next);
  }

  const counts = useMemo(() => {
    const tally: Record<Status, number> = { present: 0, absent: 0, late: 0, excused: 0 };
    for (const s of students.items ?? []) {
      const id = s._id ?? s.id ?? '';
      const status = drafts[id] ?? 'present';
      tally[status]++;
    }
    return tally;
  }, [drafts, students.items]);

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Attendance"
          subtitle={
            students.isLoading ? 'Loading…' : `${(students.items ?? []).length} students`
          }
        />

        <Picker
          label="Class"
          value={selectedClass}
          onChange={setSelectedClass}
          placeholder="Select a class"
          options={classOptions}
        />

        <View style={{ height: spacing.sm }} />

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Picker
              label="Date"
              value={date}
              onChange={setDate}
              options={generateDateOptions()}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() => setAll('present')}
              style={({ pressed }) => [styles.allBtn, pressed && styles.pressed]}
              android_ripple={{ color: colors.primaryLight }}
            >
              <Icon name="check-circle" size={16} color={colors.success} />
              <Text style={styles.allBtnLabel}>Mark all present</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.summary}>
          {STATUSES.map((s) => (
            <View key={s} style={[styles.summaryChip, { backgroundColor: STATUS_TONE[s].bg }]}>
              <Text style={[styles.summaryLabel, { color: STATUS_TONE[s].fg }]}>{s}</Text>
              <Text style={[styles.summaryCount, { color: STATUS_TONE[s].fg }]}>{counts[s]}</Text>
            </View>
          ))}
        </View>
      </View>

      {!selectedClass ? (
        <EmptyState icon="check-circle" title="Pick a class" description="Choose a class to see its students." />
      ) : students.isError ? (
        <ErrorState message={students.error?.message ?? 'Failed.'} onRetry={() => students.refetch()} />
      ) : students.isLoading && !students.items ? (
        <LoadingBlock />
      ) : (
        <>
          <FlatList
            data={students.items ?? []}
            keyExtractor={(s, i) => s._id ?? s.id ?? String(i)}
            contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: 120 }}
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            refreshControl={
              <RefreshControl
                refreshing={attendance.isFetching && !attendance.isLoading}
                onRefresh={() => {
                  students.refetch();
                  attendance.refetch();
                }}
                tintColor={colors.primary}
              />
            }
            renderItem={({ item }) => {
              const id = item._id ?? item.id ?? '';
              const status = drafts[id] ?? 'present';
              const tone = STATUS_TONE[status];
              const name =
                fullName(item.profile) ||
                fullName({
                  first_name: item.first_name,
                  last_name: item.last_name,
                  full_name: item.full_name,
                }) ||
                'Student';
              return (
                <Pressable
                  onPress={() => cycleStatus(id)}
                  style={({ pressed }) => [styles.row, shadows.card, pressed && styles.pressed]}
                  android_ripple={{ color: colors.gray100 }}
                >
                  <View style={[styles.statusBubble, { backgroundColor: tone.bg }]}>
                    <Text style={[styles.statusText, { color: tone.fg }]}>{tone.label}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.studentName} numberOfLines={1}>
                      {name}
                    </Text>
                    <Text style={styles.studentMeta} numberOfLines={1}>
                      {item.roll_no ? `Roll #${item.roll_no}` : ''}
                    </Text>
                  </View>
                  <Text style={[styles.statusLabel, { color: tone.fg }]}>{status}</Text>
                </Pressable>
              );
            }}
          />

          <View style={styles.saveBar}>
            <Button
              label={mark.isPending ? 'Saving…' : 'Save attendance'}
              onPress={handleSave}
              loading={mark.isPending}
              size="lg"
              fullWidth
            />
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

function StudentAttendanceView() {
  const { studentId } = useTenant();
  const [date, setDate] = useState(todayIso());
  const attendance = useAttendance({ student_id: studentId, date });

  const records = attendance.items ?? [];

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader title="My Attendance" />
        <Picker label="Date" value={date} onChange={setDate} options={generateDateOptions()} />
      </View>
      {attendance.isLoading ? (
        <LoadingBlock />
      ) : records.length === 0 ? (
        <EmptyState icon="check-circle" title="No record" description="No attendance marked for this date yet." />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(r, i) => r._id ?? r.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3, paddingTop: spacing.md }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => {
            const tone = STATUS_TONE[item.status as Status] ?? STATUS_TONE.present;
            return (
              <View style={[styles.row, shadows.card]}>
                <View style={[styles.statusBubble, { backgroundColor: tone.bg }]}>
                  <Text style={[styles.statusText, { color: tone.fg }]}>{tone.label}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName}>{item.status}</Text>
                  <Text style={styles.studentMeta}>{item.remarks ?? ''}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}

function generateDateOptions(): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const label = i === 0 ? 'Today' : i === 1 ? 'Yesterday' : d.toDateString();
    out.push({ label, value: iso });
  }
  return out;
}

const styles = StyleSheet.create({
  allBtn: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  allBtnLabel: { ...typography.bodySm, color: colors.gray700, fontWeight: '700' },
  summary: { flexDirection: 'row', gap: 6, paddingVertical: spacing.md },
  summaryChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.md,
    alignItems: 'center',
    gap: 2,
  },
  summaryLabel: { ...typography.labelXs, textTransform: 'uppercase' },
  summaryCount: { ...typography.h3, fontWeight: '700' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statusBubble: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { ...typography.h4, fontWeight: '800' },
  statusLabel: { ...typography.bodySm, fontWeight: '700', textTransform: 'uppercase' },
  studentName: { ...typography.bodyMd, fontWeight: '700', color: colors.gray900 },
  studentMeta: { ...typography.bodySm, color: colors.gray500 },

  saveBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.base,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.cardBorder,
  },
  pressed: { opacity: 0.85 },
});
