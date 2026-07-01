import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import {
  ListCard,
  QuickActions,
  SectionHeader,
  type ListRow,
} from '@/components/dashboard/widgets';
import { fetchAdminComposite } from '@/modules/dashboard/api';
import type { AdminComposite } from '@/modules/dashboard/types';
import { listAdminRecords } from '@/modules/admin/api';
import { ADMIN_MODULE_BY_KEY } from '@/modules/admin/config';
import type { AdminRecord } from '@/modules/admin/types';
import { readRecordPath } from '@/modules/admin/record-utils';
import { useAuthStore } from '@/store/auth-store';
import { compactNumber, formatDate, titleCase } from '@/utils/format';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

const QUICK_ACTIONS: { key: string; label: string; icon: IconName; href: string }[] = [
  { key: 'student', label: 'Add Student', icon: 'plus', href: '/(admin)/module/students' },
  { key: 'attendance', label: 'Take Attendance', icon: 'check-circle', href: '/(admin)/attendance' },
  { key: 'fees', label: 'Generate Fees', icon: 'wallet', href: '/(admin)/module/fees' },
  { key: 'announce', label: 'Announcements', icon: 'megaphone', href: '/(admin)/module/announcements' },
];

export default function AdminHome() {
  const user = useAuthStore((s) => s.user);
  const dashboardQuery = useQuery({ queryKey: ['admin-composite'], queryFn: fetchAdminComposite });
  const settingsQuery = useQuery({
    queryKey: ['admin-settings-summary'],
    queryFn: async () => {
      const result = await listAdminRecords(ADMIN_MODULE_BY_KEY.settings, { page: 1 });
      return result.items[0] as AdminRecord | undefined;
    },
  });

  const schoolName =
    String(
      readRecordPath(settingsQuery.data, 'profile.schoolName') ??
        readRecordPath(settingsQuery.data, 'schoolName') ??
        '',
    ).trim() || 'School Dashboard';

  return (
    <ScreenContainer flush>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={dashboardQuery.isRefetching}
            onRefresh={() => dashboardQuery.refetch()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.padded}>
          <Header
            greeting="Welcome back"
            title={schoolName}
            subtitle={user?.email ?? 'Admin'}
            right={<NotificationBell />}
          />

          {dashboardQuery.isError ? (
            <ErrorBanner message={(dashboardQuery.error as Error).message} onRetry={() => dashboardQuery.refetch()} />
          ) : null}

          <CompactStats data={dashboardQuery.data} loading={dashboardQuery.isLoading} />

          <SectionHeader title="Quick Actions" />
          <QuickActions actions={QUICK_ACTIONS} />

          <SectionHeader title="Recent Activity" />
          <ListCard rows={toActivityRows(dashboardQuery.data)} emptyText="No recent activity." />

          <SectionHeader title="Upcoming" />
          <ListCard rows={toEventRows(dashboardQuery.data)} emptyText="No upcoming events." />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function CompactStats({ data, loading }: { data?: AdminComposite; loading: boolean }) {
  const overview = data?.overview;
  const attendance = data?.attendance;
  const fees = data?.fees;
  const dash = (value?: number) => (loading || !overview ? '-' : compactNumber(value ?? 0));
  const money = (value?: number) => (loading || !overview ? '-' : `Rs ${compactNumber(value ?? 0)}`);
  const percent = attendance ? `${attendance.percent ?? 0}%` : loading ? '-' : '0%';

  const metrics: StatMetric[] = [
    { key: 'students', label: 'Students', value: dash(overview?.totalStudents), icon: 'users', accent: colors.primary },
    { key: 'teachers', label: 'Teachers', value: dash(overview?.totalTeachers), icon: 'graduation', accent: colors.success },
    { key: 'classes', label: 'Classes', value: dash(overview?.totalClasses), icon: 'book', accent: colors.warning },
    { key: 'subjects', label: 'Subjects', value: dash(overview?.totalSubjects), icon: 'clipboard', accent: colors.primary },
    { key: 'att', label: "Today's %", value: percent, icon: 'chart', accent: colors.success },
    { key: 'present', label: 'Present', value: compactNumber(attendance?.present ?? overview?.presentToday ?? 0), icon: 'check-circle', accent: colors.success },
    { key: 'absent', label: 'Absent', value: compactNumber(attendance?.absent ?? 0), icon: 'clock', accent: colors.error },
    { key: 'late', label: 'Late', value: compactNumber(attendance?.late ?? 0), icon: 'clock', accent: colors.warning },
    { key: 'feesToday', label: 'Fee Collection', value: money(fees?.totalPaid ?? overview?.collectedFees), icon: 'wallet', accent: colors.success },
    { key: 'pendingFees', label: 'Pending Fees', value: compactNumber(fees?.pendingCount ?? overview?.pendingFees ?? 0), icon: 'wallet', accent: colors.error },
    { key: 'expectedFees', label: 'Expected Fees', value: money(fees?.totalExpected), icon: 'wallet', accent: colors.primary },
    { key: 'unmarked', label: 'Unmarked', value: compactNumber(attendance?.unmarked ?? overview?.unmarkedStudents ?? 0), icon: 'clipboard', accent: colors.gray600 },
  ];

  return (
    <View style={styles.statsGrid}>
      {metrics.map((metric) => (
        <MetricTile key={metric.key} metric={metric} />
      ))}
    </View>
  );
}

interface StatMetric {
  key: string;
  label: string;
  value: string;
  icon: IconName;
  accent: string;
}

function MetricTile({ metric }: { metric: StatMetric }) {
  return (
    <View style={[styles.metric, shadows.card]}>
      <View style={[styles.metricIcon, { backgroundColor: tint(metric.accent) }]}>
        <Icon name={metric.icon} size={15} color={metric.accent} />
      </View>
      <Text style={styles.metricValue} numberOfLines={1}>
        {metric.value}
      </Text>
      <Text style={styles.metricLabel} numberOfLines={1}>
        {metric.label}
      </Text>
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
  return (data?.upcomingEvents ?? []).slice(0, 4).map((raw, index) => {
    const event = raw as Record<string, unknown>;
    const date = (event.starts_at ?? event.date ?? event.start_date ?? event.event_date) as string | undefined;
    return {
      key: String(event._id ?? event.id ?? index),
      title: String(event.title ?? event.name ?? 'Event'),
      subtitle: event.location ? String(event.location) : event.type ? titleCase(String(event.type)) : undefined,
      meta: date ? formatDate(date) : undefined,
      icon: event.type === 'exam' ? 'clipboard' : event.type === 'meeting' ? 'users' : 'calendar',
      accent: event.type === 'holiday' ? 'warning' : 'primary',
    };
  });
}

function toActivityRows(data?: AdminComposite): ListRow[] {
  return (data?.activities ?? []).slice(0, 4).map((raw, index) => {
    const activity = raw as Record<string, unknown>;
    const when = (activity.created_at ?? activity.date ?? activity.timestamp) as string | undefined;
    const type = String(activity.type ?? activity.action ?? 'update');
    return {
      key: String(activity._id ?? activity.id ?? index),
      title: String(activity.title ?? activity.message ?? activity.description ?? titleCase(type)),
      subtitle: titleCase(type),
      meta: when ? formatDate(when) : undefined,
      icon: activityIcon(type),
      accent: type.includes('fee') ? 'success' : type.includes('attendance') ? 'warning' : 'primary',
    };
  });
}

function activityIcon(type: string): IconName {
  const lower = type.toLowerCase();
  if (lower.includes('student')) return 'graduation';
  if (lower.includes('fee') || lower.includes('payment')) return 'wallet';
  if (lower.includes('attendance')) return 'check-circle';
  if (lower.includes('announce')) return 'megaphone';
  return 'sparkles';
}

function tint(color: string): string {
  if (color === colors.success) return colors.successLight;
  if (color === colors.warning) return colors.warningLight;
  if (color === colors.error) return colors.errorLight;
  if (color === colors.primary) return colors.primaryLight;
  return colors.gray100;
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl3 },
  padded: { paddingHorizontal: spacing.base, paddingBottom: spacing.xl },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metric: {
    width: '31.5%',
    minHeight: 78,
    flexGrow: 1,
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
    gap: 3,
  },
  metricIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: { ...typography.bodyLg, color: colors.gray900, fontWeight: '800' },
  metricLabel: { ...typography.caption, color: colors.gray500, fontWeight: '700' },
  bell: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.errorLight,
    marginBottom: spacing.md,
  },
  errorText: { ...typography.bodySm, color: colors.error, flex: 1, fontWeight: '700' },
});
