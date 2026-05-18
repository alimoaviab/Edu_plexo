/**
 * Admin Dashboard — live wired to GET /api/dashboard/composite.
 *
 * Layout untouched (matches the previous skeleton): header, KPI tiles,
 * quick-action pills, module grid, AI banner. Only the data behind the
 * tiles changed: hooks/useCompositeDashboard provides the real numbers
 * with loading / error / refresh handling.
 */

import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ErrorState } from '@/components/ui/EmptyState';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { StatTile } from '@/components/ui/StatTile';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useCompositeDashboard, useNotifications } from '@/hooks';
import { useAuthStore } from '@/store/auth-store';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { formatCount, formatCurrency, formatPercent } from '@/utils/format';

interface ModuleEntry {
  key: string;
  label: string;
  icon: IconName;
  accent: 'primary' | 'success' | 'warning' | 'error';
  description: string;
  href: string;
}

const MODULES: ModuleEntry[] = [
  { key: 'classes',        label: 'Classes',          icon: 'graduation',   accent: 'primary', description: 'Sections & batches', href: '/modules/classes' },
  { key: 'subjects',       label: 'Subjects',         icon: 'book',         accent: 'primary', description: 'Curriculum',         href: '/modules/subjects' },
  { key: 'timetable',      label: 'Timetable',        icon: 'calendar',     accent: 'success', description: 'Weekly schedules',   href: '/modules/timetable' },
  { key: 'attendance',     label: 'Attendance',       icon: 'check-circle', accent: 'success', description: 'Daily marking',      href: '/modules/attendance' },
  { key: 'exams',          label: 'Exams',            icon: 'clipboard',    accent: 'warning', description: 'Term exams',         href: '/modules/exams' },
  { key: 'tests',          label: 'Tests',            icon: 'clipboard',    accent: 'warning', description: 'Class tests',        href: '/modules/tests' },
  { key: 'results',        label: 'Results',          icon: 'star',         accent: 'success', description: 'Grades & marks',     href: '/modules/results' },
  { key: 'live-classes',   label: 'Live Classes',     icon: 'video',        accent: 'primary', description: 'Online sessions',    href: '/modules/live-classes' },
  { key: 'homework',       label: 'Homework',         icon: 'book',         accent: 'primary', description: 'Assignments',        href: '/modules/homework' },
  { key: 'students',       label: 'Students',         icon: 'users',        accent: 'primary', description: 'Profiles',           href: '/modules/students' },
  { key: 'teachers',       label: 'Teachers',         icon: 'users',        accent: 'primary', description: 'Faculty roster',     href: '/modules/teachers' },
  { key: 'behavior',       label: 'Student Behavior', icon: 'shield',       accent: 'warning', description: 'Discipline notes',   href: '/modules/behavior' },
  { key: 'leave',          label: 'Teacher Leave',    icon: 'clock',        accent: 'warning', description: 'Approvals',          href: '/modules/leave' },
  { key: 'announcements',  label: 'Announcements',    icon: 'megaphone',    accent: 'primary', description: 'Broadcasts',         href: '/modules/announcements' },
  { key: 'events',         label: 'Events',           icon: 'megaphone',    accent: 'primary', description: 'School calendar',    href: '/modules/events' },
  { key: 'fees',           label: 'Fees',             icon: 'wallet',       accent: 'success', description: 'Billing',            href: '/modules/fees' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const dashboard = useCompositeDashboard();
  const notifications = useNotifications();

  const showInitialLoader = dashboard.isLoading && !dashboard.data;
  const refreshing = dashboard.isFetching && !showInitialLoader;

  return (
    <ScreenContainer flush>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => dashboard.refetch()}
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
            right={
              <NotificationBell
                count={notifications.unreadCount}
                onPress={() => router.push('/modules/notifications' as never)}
              />
            }
          />

          {dashboard.isError ? (
            <ErrorState
              title="Couldn't load dashboard"
              message={dashboard.error?.message ?? 'Please try again.'}
              onRetry={() => dashboard.refetch()}
            />
          ) : null}

          <View style={styles.statsRow}>
            <StatTile
              label="Students"
              value={
                showInitialLoader
                  ? '…'
                  : formatCount(dashboard.overview?.totalStudents ?? 0)
              }
              accent="primary"
              icon={<Icon name="users" size={20} color={colors.primary} />}
            />
            <StatTile
              label="Teachers"
              value={
                showInitialLoader
                  ? '…'
                  : formatCount(dashboard.overview?.totalTeachers ?? 0)
              }
              accent="success"
              icon={<Icon name="graduation" size={20} color={colors.success} />}
            />
          </View>
          <View style={styles.statsRow}>
            <StatTile
              label="Today's Attendance"
              value={
                showInitialLoader
                  ? '…'
                  : formatPercent(dashboard.attendance?.percent ?? 0)
              }
              accent="warning"
              icon={<Icon name="check-circle" size={20} color={colors.warning} />}
            />
            <StatTile
              label="Fees Collected"
              value={
                showInitialLoader
                  ? '…'
                  : formatCurrency(dashboard.fees?.totalPaid ?? 0)
              }
              accent="success"
              icon={<Icon name="wallet" size={20} color={colors.success} />}
            />
          </View>

          <SectionTitle title="Quick Actions" />
          <View style={styles.quickRow}>
            <QuickPill
              label="Mark Attendance"
              icon="check-circle"
              onPress={() => router.push('/modules/attendance' as never)}
            />
            <QuickPill
              label="New Announcement"
              icon="megaphone"
              onPress={() =>
                router.push('/modules/announcements/new' as never)
              }
            />
            <QuickPill
              label="Add Student"
              icon="plus"
              onPress={() => router.push('/modules/students/new' as never)}
            />
          </View>

          <SectionTitle title="Modules" subtitle="Tap to open" />
          <View style={styles.moduleGrid}>
            {MODULES.map((m) => (
              <ModuleCard
                key={m.key}
                entry={m}
                onPress={() => router.push(m.href as never)}
              />
            ))}
          </View>

          <Card style={styles.aiBanner} padding="lg">
            <View style={styles.aiHeader}>
              <View style={styles.aiIcon}>
                <Icon name="sparkles" size={22} color={colors.white} />
              </View>
              <View style={styles.aiText}>
                <Text style={styles.aiTitle}>Ask AI Copilot</Text>
                <Text style={styles.aiSubtitle}>
                  Get instant answers about attendance, fees, results, and more.
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitleText}>{subtitle}</Text> : null}
    </View>
  );
}

function QuickPill({ label, icon, onPress }: { label: string; icon: IconName; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pill, shadows.card, pressed && styles.pressed]}
      android_ripple={{ color: colors.gray100 }}
    >
      <Icon name={icon} size={16} color={colors.primary} />
      <Text style={styles.pillLabel} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
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

function NotificationBell({ count, onPress }: { count: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.bell, pressed && styles.pressed]}
    >
      <Icon name="bell" size={20} color={colors.gray700} />
      {count > 0 ? (
        <View style={styles.bellDot}>
          <Text style={styles.bellDotText}>{count > 9 ? '9+' : String(count)}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl3 },
  padded: { paddingHorizontal: spacing.base },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.md, gap: 2 },
  sectionTitleText: { ...typography.h4, color: colors.gray900 },
  sectionSubtitleText: { ...typography.bodySm, color: colors.gray500 },

  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pillLabel: {
    ...typography.bodySm,
    fontWeight: '700',
    color: colors.gray800,
  },

  moduleGrid: {
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

  aiBanner: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiText: { flex: 1 },
  aiTitle: { ...typography.h4, color: colors.white },
  aiSubtitle: { ...typography.bodySm, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  bell: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDotText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },

  pressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
});
