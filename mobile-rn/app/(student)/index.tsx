/**
 * Student Dashboard — wired to GET /api/parent/dashboard/stats (the backend
 * resolves the active student from the JWT, so the same payload powers the
 * student portal). Surfaces attendance, pending work, current grade, fee dues,
 * upcoming exams, recent results and a navigable module grid.
 */

import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { StatTile } from '@/components/ui/StatTile';
import {
  ListCard,
  ModuleGrid,
  ProgressBar,
  QuickActions,
  SectionHeader,
  type ListRow,
  type ModuleGridItem,
} from '@/components/dashboard/widgets';
import { fetchParentStats } from '@/modules/dashboard/api';
import type { ParentChildOverview, ParentDashboardStats } from '@/modules/dashboard/types';
import { useAuthStore } from '@/store/auth-store';
import { compactNumber, formatCurrency, formatDate } from '@/utils/format';
import { colors, spacing, typography } from '@/theme/tokens';

const MODULES: ModuleGridItem[] = [
  { key: 'timetable', label: 'Timetable', description: 'Class schedule', icon: 'calendar', accent: 'success', href: '/(student)/module/timetable' },
  { key: 'attendance', label: 'Attendance', description: 'My record', icon: 'check-circle', accent: 'success', href: '/(student)/module/attendance' },
  { key: 'homework', label: 'Homework', description: 'Assignments', icon: 'book', accent: 'primary', href: '/(student)/module/homework' },
  { key: 'exams', label: 'Exams', description: 'Upcoming exams', icon: 'clipboard', accent: 'warning', href: '/(student)/module/exams' },
  { key: 'results', label: 'Results', description: 'My grades', icon: 'star', accent: 'success', href: '/(student)/module/results' },
  { key: 'live-classes', label: 'Live Classes', description: 'Online sessions', icon: 'video', accent: 'primary', href: '/(student)/module/live-classes' },
  { key: 'fees', label: 'Fees', description: 'Dues & payments', icon: 'wallet', accent: 'success', href: '/(student)/module/fees' },
  { key: 'behavior', label: 'Behavior', description: 'Conduct notes', icon: 'shield', accent: 'warning', href: '/(student)/module/behavior' },
  { key: 'announcements', label: 'Announcements', description: 'Notices', icon: 'megaphone', accent: 'primary', href: '/(student)/module/announcements' },
  { key: 'events', label: 'Events', description: 'School calendar', icon: 'megaphone', accent: 'primary', href: '/(student)/module/events' },
  { key: 'leave', label: 'Leave', description: 'Apply / track', icon: 'clock', accent: 'warning', href: '/(student)/module/leave' },
  { key: 'messages', label: 'Messages', description: 'Contact teachers', icon: 'mail', accent: 'primary', href: '/(student)/module/messages' },
];

const QUICK_ACTIONS: { key: string; label: string; icon: IconName; href: string }[] = [
  { key: 'homework', label: 'Homework', icon: 'book', href: '/(student)/module/homework' },
  { key: 'results', label: 'Results', icon: 'star', href: '/(student)/module/results' },
  { key: 'timetable', label: 'Timetable', icon: 'calendar', href: '/(student)/module/timetable' },
  { key: 'fees', label: 'Fees', icon: 'wallet', href: '/(student)/module/fees' },
];

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const studentId = user?.studentId;

  const statsQuery = useQuery({
    queryKey: ['student-stats', studentId ?? 'self'],
    queryFn: () => fetchParentStats(studentId),
  });

  const overview = pickOverview(statsQuery.data);
  const studentName = overview?.name || (user?.email ?? 'Student Portal');

  return (
    <ScreenContainer flush>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={statsQuery.isRefetching}
            onRefresh={() => statsQuery.refetch()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.padded}>
          <Header
            greeting="Hi there"
            title={studentName}
            subtitle={overview?.class ? `Class ${overview.class}` : 'Student Portal'}
          />

          {statsQuery.isError ? (
            <Card style={styles.errorCard}>
              <Text style={styles.errorText}>{(statsQuery.error as Error).message}</Text>
              <Text style={styles.retryText} onPress={() => statsQuery.refetch()}>Tap to retry</Text>
            </Card>
          ) : null}

          <View style={styles.statsRow}>
            <StatTile
              label="Attendance"
              value={overview ? `${Math.round(overview.attendance_percentage ?? 0)}%` : '—'}
              accent="success"
              icon={<Icon name="check-circle" size={20} color={colors.success} />}
            />
            <StatTile
              label="Homework Due"
              value={overview ? compactNumber(overview.pending_assignments ?? 0) : '—'}
              accent="warning"
              icon={<Icon name="book" size={20} color={colors.warning} />}
            />
          </View>
          <View style={styles.statsRow}>
            <StatTile
              label="Current Grade"
              value={overview?.current_grade ?? '—'}
              accent="success"
              icon={<Icon name="star" size={20} color={colors.success} />}
            />
            <StatTile
              label="Pending Fees"
              value={overview ? formatCurrency(overview.pending_fees ?? 0) : '—'}
              accent="primary"
              icon={<Icon name="wallet" size={20} color={colors.primary} />}
            />
          </View>

          <AttendanceCard stats={statsQuery.data} />

          <SectionHeader title="Quick Actions" />
          <QuickActions actions={QUICK_ACTIONS} />

          <SectionHeader title="Upcoming Exams" />
          <ListCard rows={toExamRows(statsQuery.data)} emptyText="No upcoming exams." />

          <SectionHeader title="Recent Results" />
          <ListCard rows={toResultRows(statsQuery.data)} emptyText="No results yet." />

          <SectionHeader title="Modules" subtitle="Tap to open" />
          <ModuleGrid items={MODULES} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function AttendanceCard({ stats }: { stats?: ParentDashboardStats }) {
  const a = stats?.attendance;
  const percent = a?.percentage ?? 0;
  return (
    <Card style={styles.wideCard}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>Attendance</Text>
        <Text style={styles.cardPercent}>{a ? `${Math.round(percent)}%` : '—'}</Text>
      </View>
      <ProgressBar value={percent} accent={percent >= 75 ? 'success' : percent >= 50 ? 'warning' : 'error'} />
      <Text style={styles.cardFootnote}>
        {a ? `${a.present ?? 0} of ${a.total ?? 0} days present` : 'No attendance recorded yet.'}
      </Text>
    </Card>
  );
}

function pickOverview(stats?: ParentDashboardStats): ParentChildOverview | undefined {
  const overview = stats?.dashboard?.children_overview?.[0];
  if (overview && overview.name) return overview;
  if (stats) {
    return {
      student_id: '',
      name: '',
      class: '',
      current_grade: '—',
      attendance_percentage: stats.attendance?.percentage ?? 0,
      pending_fees: stats.feeDue?.amount ?? 0,
      pending_assignments: 0,
    };
  }
  return undefined;
}

function toExamRows(stats?: ParentDashboardStats): ListRow[] {
  return (stats?.upcomingExams ?? []).slice(0, 5).map((exam, index) => ({
    key: exam._id ?? String(index),
    title: exam.title ?? 'Exam',
    subtitle: exam.subject,
    meta: exam.starts_at ? formatDate(exam.starts_at) : undefined,
    icon: 'clipboard',
    accent: 'warning',
  }));
}

function toResultRows(stats?: ParentDashboardStats): ListRow[] {
  return (stats?.recentResults ?? []).slice(0, 5).map((result, index) => ({
    key: result._id ?? String(index),
    title: `Marks: ${compactNumber(result.obtained_marks ?? 0)}`,
    subtitle: result.exam_id ? `Exam ${result.exam_id}` : undefined,
    icon: 'star',
    accent: 'success',
  }));
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl3 },
  padded: { paddingHorizontal: spacing.base },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  wideCard: { marginTop: spacing.md, gap: spacing.sm },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { ...typography.h4, color: colors.gray900 },
  cardPercent: { ...typography.h4, color: colors.primary },
  cardFootnote: { ...typography.bodySm, color: colors.gray500 },
  errorCard: { marginBottom: spacing.md, gap: 4, backgroundColor: colors.errorLight, borderColor: colors.errorLight },
  errorText: { ...typography.bodySm, color: colors.error, fontWeight: '600' },
  retryText: { ...typography.bodySm, color: colors.error, fontWeight: '800' },
});
