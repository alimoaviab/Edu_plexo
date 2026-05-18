/**
 * Teacher Dashboard — live wired.
 *
 * Periods Today: count of timetable rows for today's weekday for this teacher.
 * Pending Marks: count of homework items where this teacher hasn't graded
 * any submission yet (best-effort heuristic).
 */

import { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { StatTile } from '@/components/ui/StatTile';
import { useHomework, useTenant, useTimetable } from '@/hooks';
import { useAuthStore } from '@/store/auth-store';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { formatCount } from '@/utils/format';

interface ModuleEntry {
  key: string;
  label: string;
  icon: IconName;
  accent: 'primary' | 'success' | 'warning' | 'error';
  description: string;
  href: string;
}

const MODULES: ModuleEntry[] = [
  { key: 'classes',      label: 'My Classes',     icon: 'graduation',   accent: 'primary', description: 'Sections you teach',  href: '/modules/classes' },
  { key: 'timetable',    label: 'Timetable',      icon: 'calendar',     accent: 'success', description: 'Today\u2019s schedule', href: '/modules/timetable' },
  { key: 'attendance',   label: 'Attendance',     icon: 'check-circle', accent: 'success', description: 'Mark students',       href: '/modules/attendance' },
  { key: 'homework',     label: 'Homework',       icon: 'book',         accent: 'primary', description: 'Assignments',         href: '/modules/homework' },
  { key: 'tests',        label: 'Tests',          icon: 'clipboard',    accent: 'warning', description: 'Class tests',         href: '/modules/tests' },
  { key: 'exams',        label: 'Exams',          icon: 'clipboard',    accent: 'warning', description: 'Term exams',          href: '/modules/exams' },
  { key: 'results',      label: 'Results',        icon: 'star',         accent: 'success', description: 'Marks entry',         href: '/modules/results' },
  { key: 'live-classes', label: 'Live Classes',   icon: 'video',        accent: 'primary', description: 'Online sessions',     href: '/modules/live-classes' },
  { key: 'behavior',     label: 'Behavior',       icon: 'shield',       accent: 'warning', description: 'Discipline notes',    href: '/modules/behavior' },
  { key: 'leave',        label: 'My Leave',       icon: 'clock',        accent: 'warning', description: 'Apply / track',       href: '/modules/leave' },
  { key: 'events',       label: 'Events',         icon: 'megaphone',    accent: 'primary', description: 'School calendar',     href: '/modules/events' },
];

const ISO_WEEKDAY_TODAY = (() => {
  const d = new Date().getDay(); // 0..6, Sun..Sat
  return d === 0 ? 7 : d; // ISO 1..7, Mon..Sun
})();

export default function TeacherDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { profileId, userId } = useTenant();
  const teacherId = profileId || userId;

  const timetable = useTimetable({
    teacher_id: teacherId || undefined,
    day_of_week: ISO_WEEKDAY_TODAY,
  });
  const homework = useHomework({ teacher_id: teacherId || undefined });

  const refreshing =
    (timetable.isFetching || homework.isFetching) &&
    !!timetable.items &&
    !!homework.items;

  const periodsToday = (timetable.items ?? []).length;
  const pendingMarks = useMemo(() => {
    const items = homework.items ?? [];
    return items.filter((hw) => {
      const subs = hw.submissions ?? [];
      // Pending = at least one submission without a marks_obtained value.
      return subs.some(
        (s) =>
          s.marks_obtained === undefined ||
          s.marks_obtained === null ||
          (s.status && s.status !== 'graded'),
      );
    }).length;
  }, [homework.items]);

  function refresh() {
    timetable.refetch();
    homework.refetch();
  }

  return (
    <ScreenContainer flush>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.padded}>
          <Header
            greeting="Teacher"
            title="Today's Plan"
            subtitle={user?.email ?? ''}
          />

          <View style={styles.statsRow}>
            <StatTile
              label="Periods Today"
              value={timetable.isLoading ? '…' : formatCount(periodsToday)}
              accent="primary"
              icon={<Icon name="calendar" size={20} color={colors.primary} />}
            />
            <StatTile
              label="Pending Marks"
              value={homework.isLoading ? '…' : formatCount(pendingMarks)}
              accent="warning"
              icon={<Icon name="clipboard" size={20} color={colors.warning} />}
            />
          </View>

          <Card style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>Next Period</Text>
            <Text style={styles.scheduleDescription}>
              {periodsToday > 0
                ? `${periodsToday} period${periodsToday === 1 ? '' : 's'} on your schedule today. Tap Timetable to see the full plan.`
                : 'No periods scheduled for today.'}
            </Text>
          </Card>

          <SectionTitle title="Modules" />
          <View style={styles.grid}>
            {MODULES.map((m) => (
              <ModuleCard
                key={m.key}
                entry={m}
                onPress={() => router.push(m.href as never)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
  );
}

function ModuleCard({ entry, onPress }: { entry: ModuleEntry; onPress: () => void }) {
  const tint =
    entry.accent === 'primary'
      ? colors.primaryLight
      : entry.accent === 'success'
        ? colors.successLight
        : entry.accent === 'warning'
          ? colors.warningLight
          : colors.errorLight;
  const stroke =
    entry.accent === 'primary'
      ? colors.primary
      : entry.accent === 'success'
        ? colors.success
        : entry.accent === 'warning'
          ? colors.warning
          : colors.error;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.moduleCard, shadows.card, pressed && styles.pressed]}
      android_ripple={{ color: colors.gray100 }}
    >
      <View style={[styles.moduleIcon, { backgroundColor: tint }]}>
        <Icon name={entry.icon} size={22} color={stroke} />
      </View>
      <Text style={styles.moduleLabel} numberOfLines={1}>
        {entry.label}
      </Text>
      <Text style={styles.moduleDescription} numberOfLines={1}>
        {entry.description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl3 },
  padded: { paddingHorizontal: spacing.base },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  scheduleCard: { marginBottom: spacing.lg, gap: 6 },
  scheduleTitle: { ...typography.h4, color: colors.gray900 },
  scheduleDescription: { ...typography.bodySm, color: colors.gray500 },

  sectionTitle: { marginTop: spacing.sm, marginBottom: spacing.md },
  sectionTitleText: { ...typography.h4, color: colors.gray900 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  moduleCard: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: 14,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 10,
  },
  moduleIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleLabel: { ...typography.bodyMd, fontWeight: '700', color: colors.gray900 },
  moduleDescription: { ...typography.bodySm, color: colors.gray500 },

  pressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
});
