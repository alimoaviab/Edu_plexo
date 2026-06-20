/**
 * Admin Dashboard — wired to GET /api/dashboard/composite (the same payload the
 * web admin dashboard consumes). Surfaces the full widget set: KPI counters,
 * today's attendance, fee collection, operational counts, quick actions, a
 * navigable module grid covering every admin module, upcoming events and the
 * recent activity feed.
 */

import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { StatTile } from '@/components/ui/StatTile';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import {
  ListCard,
  ModuleGrid,
  ProgressBar,
  QuickActions,
  SectionHeader,
  type ListRow,
  type ModuleGridItem,
} from '@/components/dashboard/widgets';
import { fetchAdminComposite } from '@/modules/dashboard/api';
import type { AdminComposite } from '@/modules/dashboard/types';
import { useAuthStore } from '@/store/auth-store';
import { compactNumber, formatCurrency, formatDate, titleCase } from '@/utils/format';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

const MODULES: ModuleGridItem[] = [
  { key: 'academic-years', label: 'Academic Years', description: 'Sessions', icon: 'calendar', accent: 'success', href: '/(admin)/module/academic-years' },
  { key: 'classes', label: 'Classes', description: 'Sections & batches', icon: 'graduation', accent: 'primary', href: '/(admin)/module/classes' },
  { key: 'subjects', label: 'Subjects', description: 'Curriculum', icon: 'book', accent: 'primary', href: '/(admin)/module/subjects' },
  { key: 'teachers', label: 'Teachers', description: 'Faculty roster', icon: 'users', accent: 'primary', href: '/(admin)/module/teachers' },
  { key: 'students', label: 'Students', description: 'Enrollment', icon: 'graduation', accent: 'success', href: '/(admin)/module/students' },
  { key: 'attendance', label: 'Attendance', description: 'Daily marking', icon: 'check-circle', accent: 'success', href: '/(admin)/module/attendance' },
  { key: 'timetable', label: 'Timetable', description: 'Schedules', icon: 'calendar', accent: 'success', href: '/(admin)/module/timetable' },
  { key: 'exams', label: 'Exams', description: 'Term exams', icon: 'clipboard', accent: 'warning', href: '/(admin)/module/exams' },
  { key: 'tests', label: 'Tests', description: 'Class tests', icon: 'clipboard', accent: 'warning', href: '/(admin)/module/tests' },
  { key: 'results', label: 'Results', description: 'Marks & grades', icon: 'star', accent: 'success', href: '/(admin)/module/results' },
  { key: 'homework', label: 'Homework', description: 'Assignments', icon: 'book', accent: 'primary', href: '/(admin)/module/homework' },
  { key: 'behavior', label: 'Behavior', description: 'Discipline notes', icon: 'shield', accent: 'warning', href: '/(admin)/module/behavior' },
  { key: 'leave', label: 'Leave', description: 'Approvals', icon: 'clock', accent: 'warning', href: '/(admin)/module/leave' },
  { key: 'events', label: 'Events', description: 'School calendar', icon: 'megaphone', accent: 'primary', href: '/(admin)/module/events' },
  { key: 'announcements', label: 'Announcements', description: 'Notices', icon: 'megaphone', accent: 'primary', href: '/(admin)/module/announcements' },
  { key: 'live-classes', label: 'Live Classes', description: 'Online sessions', icon: 'video', accent: 'primary', href: '/(admin)/module/live-classes' },
  { key: 'question-bank', label: 'Question Bank', description: 'Moderation', icon: 'book', accent: 'primary', href: '/(admin)/module/question-bank' },
  { key: 'question-papers', label: 'Question Papers', description: 'Generated papers', icon: 'clipboard', accent: 'warning', href: '/(admin)/module/question-papers' },
  { key: 'certificates', label: 'Certificates', description: 'Issued & verify', icon: 'star', accent: 'success', href: '/(admin)/module/certificates' },
  { key: 'certificate-templates', label: 'Templates', description: 'Certificate designer', icon: 'star', accent: 'success', href: '/(admin)/module/certificate-templates' },
  { key: 'fees', label: 'Fees', description: 'Vouchers & ledger', icon: 'wallet', accent: 'success', href: '/(admin)/module/fees' },
  { key: 'fee-ledger', label: 'Fee Ledger', description: 'Collection state', icon: 'wallet', accent: 'success', href: '/(admin)/module/fee-ledger' },
  { key: 'subscription', label: 'Subscription', description: 'Plan & limits', icon: 'wallet', accent: 'primary', href: '/(admin)/module/subscription' },
  { key: 'schedules', label: 'Schedule', description: 'Reminders', icon: 'calendar', accent: 'success', href: '/(admin)/module/schedules' },
  { key: 'messages', label: 'Messages', description: 'Conversations', icon: 'mail', accent: 'primary', href: '/(admin)/module/messages' },
  { key: 'settings', label: 'Settings', description: 'Configuration', icon: 'settings', accent: 'neutral', href: '/(admin)/module/settings' },
];

const QUICK_ACTIONS: { key: string; label: string; icon: IconName; href: string }[] = [
  { key: 'attendance', label: 'Mark Attendance', icon: 'check-circle', href: '/(admin)/module/attendance' },
  { key: 'announce', label: 'Announcement', icon: 'megaphone', href: '/(admin)/module/announcements' },
  { key: 'student', label: 'Add Student', icon: 'plus', href: '/(admin)/module/students' },
  { key: 'fees', label: 'Generate Fees', icon: 'wallet', href: '/(admin)/module/fees' },
];

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const query = useQuery({ queryKey: ['admin-composite'], queryFn: fetchAdminComposite });
  const data = query.data;

  return (
    <ScreenContainer flush>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={query.isRefetching}
            onRefresh={() => query.refetch()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.padded}>
          <Header
            greeting="Welcome back"
            title="Admin Console"
            subtitle={user?.email ?? 'Eduplexo Workspace'}
            right={<NotificationBell />}
          />

          {query.isError ? (
            <ErrorBanner message={(query.error as Error).message} onRetry={() => query.refetch()} />
          ) : null}

          <Kpis data={data} loading={query.isLoading} />

          <AttendanceCard data={data} />
          <FeeCard data={data} />
          <OperationsRow data={data} />

          <SectionHeader title="Quick Actions" />
          <QuickActions actions={QUICK_ACTIONS} />

          <SectionHeader title="Modules" subtitle="Tap to open" />
          <ModuleGrid items={MODULES} />

          <SectionHeader title="Upcoming Events" />
          <ListCard rows={toEventRows(data)} emptyText="No upcoming events." />

          <SectionHeader title="Recent Activity" />
          <ListCard rows={toActivityRows(data)} emptyText="No recent activity." />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Kpis({ data, loading }: { data?: AdminComposite; loading: boolean }) {
  const o = data?.overview;
  const dash = (v?: number) => (loading || o === undefined ? '—' : compactNumber(v ?? 0));
  return (
    <>
      <View style={styles.statsRow}>
        <StatTile label="Students" value={dash(o?.totalStudents)} accent="primary" icon={<Icon name="users" size={20} color={colors.primary} />} />
        <StatTile label="Teachers" value={dash(o?.totalTeachers)} accent="success" icon={<Icon name="graduation" size={20} color={colors.success} />} />
      </View>
      <View style={styles.statsRow}>
        <StatTile label="Classes" value={dash(o?.totalClasses)} accent="warning" icon={<Icon name="book" size={20} color={colors.warning} />} />
        <StatTile label="Subjects" value={dash(o?.totalSubjects)} accent="primary" icon={<Icon name="clipboard" size={20} color={colors.primary} />} />
      </View>
    </>
  );
}

function AttendanceCard({ data }: { data?: AdminComposite }) {
  const a = data?.attendance;
  const percent = a?.percent ?? 0;
  return (
    <Card style={styles.wideCard}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>Today's Attendance</Text>
        <Text style={styles.cardPercent}>{a ? `${percent}%` : '—'}</Text>
      </View>
      <ProgressBar value={percent} accent={percent >= 75 ? 'success' : percent >= 50 ? 'warning' : 'error'} />
      <View style={styles.breakdownRow}>
        <Breakdown label="Present" value={a?.present ?? 0} color={colors.success} />
        <Breakdown label="Absent" value={a?.absent ?? 0} color={colors.error} />
        <Breakdown label="Late" value={a?.late ?? 0} color={colors.warning} />
        <Breakdown label="Unmarked" value={a?.unmarked ?? 0} color={colors.gray500} />
      </View>
    </Card>
  );
}

function FeeCard({ data }: { data?: AdminComposite }) {
  const f = data?.fees;
  const percent = f?.percentage ?? 0;
  return (
    <Card style={styles.wideCard}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>Fee Collection</Text>
        <Text style={styles.cardPercent}>{f ? `${percent}%` : '—'}</Text>
      </View>
      <ProgressBar value={percent} accent="success" />
      <View style={styles.feeRow}>
        <View style={styles.feeCol}>
          <Text style={styles.feeLabel}>Collected</Text>
          <Text style={[styles.feeValue, { color: colors.success }]}>{f ? formatCurrency(f.totalPaid) : '—'}</Text>
        </View>
        <View style={styles.feeCol}>
          <Text style={styles.feeLabel}>Expected</Text>
          <Text style={styles.feeValue}>{f ? formatCurrency(f.totalExpected) : '—'}</Text>
        </View>
        <View style={styles.feeCol}>
          <Text style={styles.feeLabel}>Pending</Text>
          <Text style={[styles.feeValue, { color: colors.error }]}>{f ? compactNumber(f.pendingCount) : '—'}</Text>
        </View>
      </View>
    </Card>
  );
}

function OperationsRow({ data }: { data?: AdminComposite }) {
  const o = data?.overview;
  const items: { key: string; label: string; value: number; icon: IconName; accent: string }[] = [
    { key: 'leave', label: 'Pending Leaves', value: data?.pendingLeaves ?? o?.pendingLeave ?? 0, icon: 'clock', accent: colors.warning },
    { key: 'exams', label: 'Active Exams', value: o?.activeExams ?? 0, icon: 'clipboard', accent: colors.primary },
    { key: 'homework', label: 'Homework', value: o?.totalHomework ?? 0, icon: 'book', accent: colors.success },
    { key: 'live', label: 'Live Classes', value: o?.totalLiveClasses ?? 0, icon: 'video', accent: colors.primary },
  ];
  return (
    <View style={styles.opsRow}>
      {items.map((item) => (
        <View key={item.key} style={[styles.opsCard, shadows.card]}>
          <Icon name={item.icon} size={18} color={item.accent} />
          <Text style={styles.opsValue}>{o === undefined ? '—' : compactNumber(item.value)}</Text>
          <Text style={styles.opsLabel} numberOfLines={1}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function Breakdown({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.breakdownItem}>
      <Text style={[styles.breakdownValue, { color }]}>{compactNumber(value)}</Text>
      <Text style={styles.breakdownLabel}>{label}</Text>
    </View>
  );
}

function NotificationBell() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push('/(admin)/module/notifications' as never)}
      style={({ pressed }) => [styles.bell, pressed && styles.pressed]}
    >
      <Icon name="bell" size={20} color={colors.gray700} />
      <View style={styles.bellDot} />
    </Pressable>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Pressable onPress={onRetry} style={styles.errorBanner}>
      <Icon name="bell" size={16} color={colors.error} />
      <Text style={styles.errorText} numberOfLines={2}>{message} · Tap to retry</Text>
    </Pressable>
  );
}

function toEventRows(data?: AdminComposite): ListRow[] {
  return (data?.upcomingEvents ?? []).slice(0, 5).map((raw, index) => {
    const e = raw as Record<string, unknown>;
    const date = (e.starts_at ?? e.date ?? e.start_date ?? e.event_date) as string | undefined;
    return {
      key: String(e._id ?? e.id ?? index),
      title: String(e.title ?? e.name ?? 'Event'),
      subtitle: e.location ? String(e.location) : e.type ? titleCase(String(e.type)) : undefined,
      meta: date ? formatDate(date) : undefined,
      icon: 'calendar',
      accent: 'primary',
    };
  });
}

function toActivityRows(data?: AdminComposite): ListRow[] {
  return (data?.activities ?? []).slice(0, 6).map((raw, index) => {
    const a = raw as Record<string, unknown>;
    const when = (a.created_at ?? a.date ?? a.timestamp) as string | undefined;
    return {
      key: String(a._id ?? a.id ?? index),
      title: String(a.title ?? a.message ?? a.description ?? titleCase(String(a.type ?? 'Activity'))),
      subtitle: a.type ? titleCase(String(a.type)) : undefined,
      meta: when ? formatDate(when) : undefined,
      icon: 'check-circle',
      accent: 'success',
    };
  });
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl3 },
  padded: { paddingHorizontal: spacing.base },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },

  wideCard: { marginTop: spacing.md, gap: spacing.md },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { ...typography.h4, color: colors.gray900 },
  cardPercent: { ...typography.h4, color: colors.primary },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownItem: { alignItems: 'center', flex: 1, gap: 2 },
  breakdownValue: { ...typography.h4, fontWeight: '800' },
  breakdownLabel: { ...typography.bodySm, color: colors.gray500 },

  feeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  feeCol: { flex: 1, gap: 2 },
  feeLabel: { ...typography.bodySm, color: colors.gray500 },
  feeValue: { ...typography.bodyLg, fontWeight: '800', color: colors.gray900 },

  opsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  opsCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  opsValue: { ...typography.h4, color: colors.gray900, fontWeight: '800' },
  opsLabel: { ...typography.caption, color: colors.gray500, textAlign: 'center' },

  bell: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 12,
    right: 13,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.errorLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  errorText: { ...typography.bodySm, color: colors.error, flex: 1, fontWeight: '600' },
});
