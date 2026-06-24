/**
 * Parent Dashboard — wired to GET /api/parent/children and
 * GET /api/parent/dashboard/stats?student_id=… (the same payloads the web
 * parent dashboard consumes). Includes a child switcher for multi-child
 * parents, KPI cards, upcoming exams, recent results, a fee-due card and a
 * navigable module grid covering every parent module.
 */

import { useEffect } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { fetchParentChildren, fetchParentStats } from '@/modules/dashboard/api';
import type { ParentChild, ParentChildOverview, ParentDashboardStats } from '@/modules/dashboard/types';
import { useSelectedChild } from '@/store/selected-child-store';
import { compactNumber, formatCurrency, formatDate } from '@/utils/format';
import { colors, radius, spacing, typography } from '@/theme/tokens';

const MODULES: ModuleGridItem[] = [
  { key: 'attendance', label: 'Attendance', description: 'Daily record', icon: 'check-circle', accent: 'success', href: '/(parent)/module/attendance' },
  { key: 'results', label: 'Results', description: 'Marks & grades', icon: 'star', accent: 'success', href: '/(parent)/module/results' },
  { key: 'homework', label: 'Homework', description: 'Assignments', icon: 'book', accent: 'primary', href: '/(parent)/module/homework' },
  { key: 'exams', label: 'Exams', description: 'Upcoming exams', icon: 'clipboard', accent: 'warning', href: '/(parent)/module/exams' },
  { key: 'timetable', label: 'Timetable', description: 'Class schedule', icon: 'calendar', accent: 'success', href: '/(parent)/module/timetable' },
  { key: 'fees', label: 'Fees', description: 'Dues & payments', icon: 'wallet', accent: 'success', href: '/(parent)/module/fees' },
  { key: 'live-classes', label: 'Live Classes', description: 'Online sessions', icon: 'video', accent: 'primary', href: '/(parent)/module/live-classes' },
  { key: 'behavior', label: 'Behavior', description: 'Notes', icon: 'shield', accent: 'warning', href: '/(parent)/module/behavior' },
  { key: 'announcements', label: 'Announcements', description: 'Notices', icon: 'megaphone', accent: 'primary', href: '/(parent)/module/announcements' },
  { key: 'events', label: 'Events', description: 'School calendar', icon: 'megaphone', accent: 'primary', href: '/(parent)/module/events' },
  { key: 'leave', label: 'Leave', description: 'Apply / track', icon: 'clock', accent: 'warning', href: '/(parent)/module/leave' },
  { key: 'messages', label: 'Messages', description: 'Contact staff', icon: 'mail', accent: 'primary', href: '/(parent)/module/messages' },
];

const QUICK_ACTIONS: { key: string; label: string; icon: IconName; href: string }[] = [
  { key: 'fees', label: 'Pay Fees', icon: 'wallet', href: '/(parent)/module/fees' },
  { key: 'homework', label: 'Homework', icon: 'book', href: '/(parent)/module/homework' },
  { key: 'leave', label: 'Apply Leave', icon: 'clock', href: '/(parent)/module/leave' },
  { key: 'message', label: 'Message', icon: 'mail', href: '/(parent)/module/messages' },
];

export default function ParentDashboard() {
  const studentId = useSelectedChild((s) => s.studentId);
  const children = useSelectedChild((s) => s.children);
  const hydrated = useSelectedChild((s) => s.hydrated);
  const hydrate = useSelectedChild((s) => s.hydrate);
  const setChildren = useSelectedChild((s) => s.setChildren);
  const select = useSelectedChild((s) => s.select);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrated, hydrate]);

  const childrenQuery = useQuery({ queryKey: ['parent-children'], queryFn: fetchParentChildren });
  useEffect(() => {
    if (childrenQuery.data) setChildren(childrenQuery.data);
  }, [childrenQuery.data, setChildren]);

  const statsQuery = useQuery({
    queryKey: ['parent-stats', studentId ?? ''],
    queryFn: () => fetchParentStats(studentId),
    enabled: hydrated,
  });

  const overview = pickOverview(statsQuery.data);
  const activeChild = children.find((c) => c.student_id === studentId);

  const refreshing = childrenQuery.isRefetching || statsQuery.isRefetching;
  const onRefresh = () => {
    childrenQuery.refetch();
    statsQuery.refetch();
  };

  return (
    <ScreenContainer flush>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
      >
        <View style={styles.padded}>
          <Header
            greeting="Parent Portal"
            title={activeChild?.name ?? overview?.name ?? 'My Child'}
            subtitle={childSubtitle(activeChild, overview)}
          />

          {children.length > 1 ? (
            <ChildSwitcher children={children} activeId={studentId} onSelect={(id) => select(id)} />
          ) : null}

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
              label="Pending Fees"
              value={overview ? formatCurrency(overview.pending_fees ?? 0) : '—'}
              accent="warning"
              icon={<Icon name="wallet" size={20} color={colors.warning} />}
            />
          </View>
          <View style={styles.statsRow}>
            <StatTile
              label="Homework Due"
              value={overview ? compactNumber(overview.pending_assignments ?? 0) : '—'}
              accent="primary"
              icon={<Icon name="book" size={20} color={colors.primary} />}
            />
            <StatTile
              label="Current Grade"
              value={overview?.current_grade ?? '—'}
              accent="success"
              icon={<Icon name="star" size={20} color={colors.success} />}
            />
          </View>

          <AttendanceCard stats={statsQuery.data} />
          <FeeDueCard stats={statsQuery.data} />

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

function ChildSwitcher({
  children,
  activeId,
  onSelect,
}: {
  children: ParentChild[];
  activeId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.switcher}>
      {children.map((child) => {
        const active = child.student_id === activeId;
        return (
          <Pressable
            key={child.student_id}
            onPress={() => onSelect(child.student_id)}
            style={[styles.childChip, active && styles.childChipActive]}
          >
            <Icon name="family" size={16} color={active ? colors.white : colors.primary} />
            <Text style={[styles.childChipText, active && styles.childChipTextActive]} numberOfLines={1}>
              {child.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
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

function FeeDueCard({ stats }: { stats?: ParentDashboardStats }) {
  const fee = stats?.feeDue;
  const amount = fee?.amount ?? 0;
  if (!fee || amount <= 0) return null;
  return (
    <Card style={[styles.wideCard, styles.feeDueCard]}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.feeDueText}>
          <Text style={styles.feeDueTitle}>Fee Due</Text>
          <Text style={styles.feeDueAmount}>{formatCurrency(amount)}</Text>
          {fee.due_date ? <Text style={styles.feeDueDate}>Due {formatDate(fee.due_date, true)}</Text> : null}
        </View>
        <Icon name="wallet" size={28} color={colors.error} />
      </View>
    </Card>
  );
}

function pickOverview(stats?: ParentDashboardStats): ParentChildOverview | undefined {
  const overview = stats?.dashboard?.children_overview?.[0];
  if (overview && overview.name) return overview;
  // Synthesize from legacy fields when children_overview isn't populated.
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

function childSubtitle(child?: ParentChild, overview?: ParentChildOverview): string {
  const cls = child?.class_name ?? child?.class ?? overview?.class ?? '';
  const section = child?.section ? ` · ${child.section}` : '';
  return cls ? `${cls}${section}` : 'Linked child overview';
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

  switcher: { gap: spacing.sm, paddingBottom: spacing.md },
  childChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  childChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  childChipText: { ...typography.bodySm, fontWeight: '700', color: colors.gray800, maxWidth: 140 },
  childChipTextActive: { color: colors.white },

  wideCard: { marginTop: spacing.md, gap: spacing.sm },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { ...typography.h4, color: colors.gray900 },
  cardPercent: { ...typography.h4, color: colors.primary },
  cardFootnote: { ...typography.bodySm, color: colors.gray500 },

  feeDueCard: { backgroundColor: colors.errorLight, borderColor: colors.errorLight },
  feeDueText: { gap: 2 },
  feeDueTitle: { ...typography.label, color: colors.error, textTransform: 'uppercase' },
  feeDueAmount: { ...typography.h2, color: colors.error },
  feeDueDate: { ...typography.bodySm, color: colors.error },

  errorCard: { marginBottom: spacing.md, gap: 4, backgroundColor: colors.errorLight, borderColor: colors.errorLight },
  errorText: { ...typography.bodySm, color: colors.error, fontWeight: '600' },
  retryText: { ...typography.bodySm, color: colors.error, fontWeight: '800' },
});
