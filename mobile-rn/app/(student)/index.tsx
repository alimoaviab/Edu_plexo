/**
 * Student / Parent Dashboard — live wired.
 *
 * - Parent: pulls /api/parent/dashboard/stats + /api/parent/children. The
 *   linked-children switcher surfaces the names; tapping a child sets it
 *   as the active student for subsequent module screens.
 * - Student: same API, scoped server-side via the JWT.
 *
 * Module navigation uses the same /modules/* route group as admin/teacher
 * so we share screens across roles. Each screen renders role-aware UI.
 */

import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { StatTile } from '@/components/ui/StatTile';
import { ErrorState } from '@/components/ui/EmptyState';
import { useParentChildren, useParentDashboard } from '@/hooks';
import { useActiveChildStore } from '@/store/active-child-store';
import { useAuthStore } from '@/store/auth-store';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { formatCount, formatCurrency, formatPercent } from '@/utils/format';
import type { ParentChildRow, ParentDashboardStats } from '@/services/types';

interface ModuleEntry {
  key: string;
  label: string;
  icon: IconName;
  accent: 'primary' | 'success' | 'warning' | 'error';
  description: string;
  href: string;
}

const MODULES: ModuleEntry[] = [
  { key: 'timetable',    label: 'Timetable',    icon: 'calendar',     accent: 'success', description: 'Class schedule',     href: '/modules/timetable' },
  { key: 'attendance',   label: 'Attendance',   icon: 'check-circle', accent: 'success', description: 'My attendance',      href: '/modules/attendance' },
  { key: 'homework',     label: 'Homework',     icon: 'book',         accent: 'primary', description: 'Assignments',        href: '/modules/homework' },
  { key: 'exams',        label: 'Exams',        icon: 'clipboard',    accent: 'warning', description: 'Upcoming exams',     href: '/modules/exams' },
  { key: 'results',      label: 'Results',      icon: 'star',         accent: 'success', description: 'My grades',          href: '/modules/results' },
  { key: 'live-classes', label: 'Live Classes', icon: 'video',        accent: 'primary', description: 'Online sessions',    href: '/modules/live-classes' },
  { key: 'fees',         label: 'Fee Charges',  icon: 'wallet',       accent: 'success', description: 'Pay or view dues',   href: '/modules/fees' },
  { key: 'announcements',label: 'Announcements',icon: 'megaphone',    accent: 'primary', description: 'School notices',     href: '/modules/announcements' },
  { key: 'events',       label: 'Events',       icon: 'megaphone',    accent: 'primary', description: 'School calendar',    href: '/modules/events' },
];

export default function StudentDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isParent = user?.role === 'parent';

  const dashboard = useParentDashboard();
  const childrenQ = useParentChildren();

  const stats = (dashboard.data ?? {}) as ParentDashboardStats;
  const refreshing =
    (dashboard.isFetching || childrenQ.isFetching) && !!dashboard.data;

  function refresh() {
    dashboard.refetch();
    childrenQ.refetch();
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
            greeting={isParent ? 'Welcome' : 'Hi there'}
            title={isParent ? 'Parent Portal' : 'Student Portal'}
            subtitle={user?.email ?? ''}
          />

          {dashboard.isError ? (
            <ErrorState
              title="Couldn't load dashboard"
              message={dashboard.error?.message ?? 'Please try again.'}
              onRetry={() => dashboard.refetch()}
            />
          ) : null}

          {isParent ? (
            <ChildrenStrip
              children={childrenQ.children}
              loading={childrenQ.isLoading}
            />
          ) : null}

          <View style={styles.statsRow}>
            <StatTile
              label="Attendance"
              value={
                dashboard.isLoading
                  ? '…'
                  : formatPercent(stats.attendance?.percent ?? 0)
              }
              accent="success"
              icon={<Icon name="check-circle" size={20} color={colors.success} />}
            />
            <StatTile
              label="Homework Due"
              value={
                dashboard.isLoading
                  ? '…'
                  : formatCount(stats.homework_due ?? 0)
              }
              accent="warning"
              icon={<Icon name="book" size={20} color={colors.warning} />}
            />
          </View>

          {stats.fees ? (
            <View style={styles.statsRow}>
              <StatTile
                label="Fees Pending"
                value={formatCurrency(stats.fees.pending ?? 0)}
                accent="warning"
                icon={<Icon name="wallet" size={20} color={colors.warning} />}
              />
              <StatTile
                label="Upcoming Exams"
                value={formatCount(stats.upcoming_exams ?? 0)}
                accent="primary"
                icon={<Icon name="clipboard" size={20} color={colors.primary} />}
              />
            </View>
          ) : null}

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

function ChildrenStrip({
  children,
  loading,
}: {
  children: ParentChildRow[];
  loading: boolean;
}) {
  const activeId = useActiveChildStore((s) => s.studentId);
  const setActive = useActiveChildStore((s) => s.set);

  if (loading) {
    return (
      <Card style={styles.childCard} padding="md">
        <Text style={styles.childTitle}>Linked Children</Text>
        <Text style={styles.childSubtitle}>Loading…</Text>
      </Card>
    );
  }
  if (!children.length) {
    return (
      <Card style={styles.childCard} padding="md">
        <View style={styles.childRow}>
          <View style={styles.childAvatar}>
            <Icon name="family" size={22} color={colors.primary} />
          </View>
          <View style={styles.childText}>
            <Text style={styles.childTitle}>Linked Children</Text>
            <Text style={styles.childSubtitle}>
              No children are linked to this email yet. Contact the school
              admin to link a student profile.
            </Text>
          </View>
        </View>
      </Card>
    );
  }

  return (
    <View style={styles.childCard}>
      <Text style={[styles.childTitle, { marginBottom: spacing.sm }]}>
        Linked Children
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm }}
      >
        {children.map((child) => {
          const id = child.student_id ?? child.id ?? '';
          const isActive = id === activeId;
          return (
            <Pressable
              key={id || child.full_name}
              onPress={() => setActive(id)}
              style={({ pressed }) => [
                styles.childChip,
                shadows.card,
                isActive && styles.childChipActive,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.childAvatar}>
                <Icon name="graduation" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.chipName} numberOfLines={1}>
                  {child.full_name ?? 'Student'}
                </Text>
                <Text style={styles.chipMeta} numberOfLines={1}>
                  {[child.class_name, child.section].filter(Boolean).join(' · ')}
                </Text>
              </View>
              {isActive ? (
                <Icon name="check-circle" size={18} color={colors.primary} />
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
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

  childCard: { marginBottom: spacing.md },
  childRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childText: { flex: 1 },
  childTitle: { ...typography.h4, color: colors.gray900 },
  childSubtitle: { ...typography.bodySm, color: colors.gray500, marginTop: 2 },

  childChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    minWidth: 220,
  },
  childChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  chipName: { ...typography.bodyMd, fontWeight: '700', color: colors.gray900 },
  chipMeta: { ...typography.bodySm, color: colors.gray500 },

  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },

  sectionTitle: { marginTop: spacing.sm, marginBottom: spacing.md },
  sectionTitleText: { ...typography.h4, color: colors.gray900 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
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
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleLabel: { ...typography.bodyMd, fontWeight: '700', color: colors.gray900 },
  moduleDescription: { ...typography.bodySm, color: colors.gray500 },

  pressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
});
