import { useState, useRef } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { TrialBanner } from '@/components/subscription/TrialBanner';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.78;

const QUICK_ACTIONS: { key: string; label: string; icon: IconName; href: string }[] = [
  { key: 'student', label: 'Add Student', icon: 'plus', href: '/(owner)/module/students' },
  { key: 'attendance', label: 'Take Attendance', icon: 'check-circle', href: '/(owner)/attendance' },
  { key: 'fees', label: 'Generate Fees', icon: 'wallet', href: '/(owner)/module/fees' },
  { key: 'announce', label: 'Announcements', icon: 'megaphone', href: '/(owner)/module/announcements' },
];

type Accent = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

interface ProfileItem {
  key: string;
  label: string;
  description?: string;
  icon: IconName;
  accent: Accent;
  href?: string;
  onPress?: () => void;
}

interface ProfileSection {
  title: string;
  items: ProfileItem[];
}

export default function AdminHome() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const dashboardQuery = useQuery({ queryKey: ['admin-composite'], queryFn: fetchAdminComposite });
  const settingsQuery = useQuery({
    queryKey: ['admin-settings-summary'],
    queryFn: async () => {
      const result = await listAdminRecords(ADMIN_MODULE_BY_KEY.settings, { page: 1 });
      return result.items[0] as AdminRecord | undefined;
    },
  });

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSidebarVisible(false);
    });
  };

  function confirmLogout() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => {
        closeSidebar();
        logout();
      }},
    ]);
  }

  const sections: ProfileSection[] = [
    {
      title: 'Owner Portal',
      items: [
        { key: 'schools', label: 'My Schools', description: 'Portfolio and branch switcher', icon: 'building', accent: 'primary', href: '/(owner)/schools' },
      ],
    },
    {
      title: 'Academic Setup',
      items: [
        { key: 'academic-years', label: 'Academic years', description: 'School sessions', icon: 'calendar', accent: 'success', href: '/(owner)/module/academic-years' },
        { key: 'classes', label: 'Classes', description: 'Sections and classroom setup', icon: 'graduation', accent: 'primary', href: '/(owner)/module/classes' },
      ],
    },
    {
      title: 'Staff',
      items: [
        { key: 'leave', label: 'Leave', description: 'Teacher leave applications', icon: 'clock', accent: 'warning', href: '/(owner)/module/leave' },
      ],
    },
    {
      title: 'Students',
      items: [
        { key: 'behavior', label: 'Behavior', description: 'Discipline and merit notes', icon: 'shield', accent: 'warning', href: '/(owner)/module/behavior' },
      ],
    },
    {
      title: 'Academics',
      items: [
        { key: 'timetable', label: 'Timetable', description: 'Class and teacher schedules', icon: 'calendar', accent: 'success', href: '/(owner)/module/timetable' },
        { key: 'homework', label: 'Homework', description: 'Assignments and submissions', icon: 'book', accent: 'primary', href: '/(owner)/module/homework' },
        { key: 'exams', label: 'Exams', description: 'Term exams and schedules', icon: 'clipboard', accent: 'warning', href: '/(owner)/module/exams' },
        { key: 'tests', label: 'Tests', description: 'Class tests and quizzes', icon: 'clipboard', accent: 'warning', href: '/(owner)/module/tests' },
        { key: 'results', label: 'Results', description: 'Marks and transcripts', icon: 'star', accent: 'success', href: '/(owner)/module/results' },
        { key: 'question-papers', label: 'Question Papers', description: 'Generated question papers', icon: 'clipboard', accent: 'warning', href: '/(owner)/module/question-papers' },
        { key: 'live-classes', label: 'Live classes', description: 'Online sessions', icon: 'video', accent: 'primary', href: '/(owner)/module/live-classes' },
      ],
    },
    {
      title: 'Operations',
      items: [
        { key: 'announcements', label: 'Announcements', description: 'School notices', icon: 'megaphone', accent: 'primary', href: '/(owner)/module/announcements' },
        { key: 'certificates', label: 'Certificates', description: 'Issued certificates', icon: 'star', accent: 'success', href: '/(owner)/module/certificates' },
        { key: 'certificate-templates', label: 'Template Designer', description: 'Certificate layout designer', icon: 'sparkles', accent: 'success', href: '/(owner)/module/certificate-templates' },
      ],
    },
    {
      title: 'Finance',
      items: [
        { key: 'fees', label: 'Fee', description: 'Vouchers and student fees', icon: 'wallet', accent: 'success', href: '/(owner)/module/fees' },
      ],
    },
    {
      title: 'Subscription',
      items: [
        { key: 'subscription', label: 'Subscription', description: 'Plan limits and billing', icon: 'wallet', accent: 'primary', href: '/(owner)/subscription' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { key: 'schedules', label: 'Schedule', description: 'Reminders and meetings', icon: 'calendar', accent: 'success', href: '/(owner)/module/schedules' },
        { key: 'messages', label: 'Conversations', description: 'Conversations', icon: 'mail', accent: 'primary', href: '/(owner)/module/messages' },
        { key: 'settings', label: 'Settings', description: 'System configuration', icon: 'settings', accent: 'neutral', href: '/(owner)/settings' },
      ],
    },
    {
      title: 'Session',
      items: [
        { key: 'logout', label: 'Sign Out', description: 'End this session', icon: 'logout', accent: 'error', onPress: confirmLogout },
      ],
    },
  ];

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
            greeting="Owner Portal"
            title={schoolName}
            subtitle="Executive Campus Dashboard"
            showMenu={true}
            onMenuPress={openSidebar}
            right={<NotificationBell />}
          />

          <TrialBanner />

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

      {/* Dynamic Animated Sidebar Drawer */}
      <Modal
        transparent
        visible={sidebarVisible}
        onRequestClose={closeSidebar}
        animationType="none"
      >
        <View style={styles.sidebarContainer}>
          {/* Backdrop Touch Mask */}
          <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar}>
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
          </Pressable>

          {/* Sidebar Drawer Panel */}
          <Animated.View
            style={[
              styles.sidebarPanel,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <SafeAreaView style={styles.sidebarInner} edges={['top', 'left', 'bottom']}>
              {/* Sidebar Profile Card Header */}
              <View style={styles.sidebarHeader}>
                <View style={styles.sidebarUserSection}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>
                      {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
                    </Text>
                  </View>
                  <View style={styles.userTextContainer}>
                    <Text style={styles.userNameText} numberOfLines={1}>
                      Admin Account
                    </Text>
                    <Text style={styles.userEmailText} numberOfLines={1}>
                      {user?.email ?? 'admin@eduplexo.com'}
                    </Text>
                  </View>
                </View>
                <Pressable onPress={closeSidebar} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
                  <Icon name="chevron-right" size={22} color={colors.primary} />
                </Pressable>
              </View>

              {/* Scrollable List of Admin Modules */}
              <ScrollView
                style={styles.sidebarScroll}
                contentContainerStyle={styles.sidebarScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {sections.map((section) => (
                  <View key={section.title} style={styles.sidebarSection}>
                    <Text style={styles.sidebarSectionTitle}>{section.title}</Text>
                    <View style={styles.sidebarList}>
                      {section.items.map((item) => (
                        <SidebarRow
                          key={item.key}
                          item={item}
                          onPress={
                            item.onPress
                              ? () => {
                                  closeSidebar();
                                  item.onPress?.();
                                }
                              : item.href
                              ? () => {
                                  closeSidebar();
                                  router.push(item.href as never);
                                }
                              : undefined
                          }
                        />
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function SidebarRow({ item, onPress }: { item: ProfileItem; onPress?: () => void }) {
  const palette = tintMap[item.accent];
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.sidebarRow, shadows.card, pressed && styles.pressed]}
      android_ripple={{ color: colors.gray100 }}
    >
      <View style={[styles.sidebarIconWrap, { backgroundColor: palette.bg }]}>
        <Icon name={item.icon} size={18} color={palette.fg} />
      </View>
      <View style={styles.sidebarRowText}>
        <Text style={styles.sidebarRowTitle} numberOfLines={1}>
          {item.label}
        </Text>
        {item.description ? (
          <Text style={styles.sidebarRowDescription} numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
      </View>
      <Icon name="chevron-right" size={16} color={colors.gray400} />
    </Pressable>
  );
}

const tintMap = {
  primary: { bg: colors.primaryLight, fg: colors.primary },
  success: { bg: colors.successLight, fg: colors.success },
  warning: { bg: colors.warningLight, fg: colors.warning },
  error: { bg: colors.errorLight, fg: colors.error },
  neutral: { bg: colors.gray100, fg: colors.gray700 },
} as const;

function CompactStats({ data, loading }: { data?: AdminComposite; loading: boolean }) {
  const overview = data?.overview;
  const attendance = data?.attendance;
  const fees = data?.fees;
  const dash = (value?: number) => (loading || !overview ? '-' : compactNumber(value ?? 0));
  const money = (value?: number) => (loading || !overview ? '-' : `Rs ${compactNumber(value ?? 0)}`);
  const percent = attendance ? `${attendance.percent ?? 0}%` : loading ? '-' : '0%';
  const teacherAtt = overview
    ? overview.totalTeachers > 0
      ? `${Math.round((overview.presentToday / overview.totalTeachers) * 100)}%`
      : '0%'
    : loading
    ? '-'
    : '0%';

  const metrics: StatMetric[] = [
    { key: 'students', label: 'Student', value: dash(overview?.totalStudents), icon: 'users', accent: colors.primary, href: '/(owner)/module/students' },
    { key: 'teachers', label: 'Teacher', value: dash(overview?.totalTeachers), icon: 'graduation', accent: colors.success, href: '/(owner)/module/teachers' },
    { key: 'feesToday', label: 'Fee', value: money(fees?.totalPaid ?? overview?.collectedFees), icon: 'wallet', accent: colors.success, href: '/(owner)/module/fees' },
    { key: 'pendingFees', label: 'Pending Fee', value: compactNumber(fees?.pendingCount ?? overview?.pendingFees ?? 0), icon: 'wallet', accent: colors.error, href: '/(owner)/module/fees' },
    { key: 'teacherAttendance', label: 'Teacher Attendance', value: teacherAtt, icon: 'check-circle', accent: colors.success, href: '/(owner)/teacher-attendance' },
    { key: 'studentAttendance', label: 'Student Attendance', value: percent, icon: 'check-circle', accent: colors.primary, href: '/(owner)/attendance' },
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
  href?: string;
}

function MetricTile({ metric }: { metric: StatMetric }) {
  const router = useRouter();
  const content = (
    <>
      <View style={[styles.metricIcon, { backgroundColor: tint(metric.accent) }]}>
        <Icon name={metric.icon} size={15} color={metric.accent} />
      </View>
      <Text style={styles.metricValue} numberOfLines={1}>
        {metric.value}
      </Text>
      <Text style={styles.metricLabel} numberOfLines={1}>
        {metric.label}
      </Text>
    </>
  );

  if (metric.href) {
    return (
      <Pressable
        onPress={() => router.push(metric.href as never)}
        style={({ pressed }) => [styles.metric, shadows.card, pressed && styles.pressed]}
        android_ripple={{ color: colors.gray100 }}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.metric, shadows.card]}>
      {content}
    </View>
  );
}

function NotificationBell() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push('/(owner)/module/notifications' as never)}
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
  sidebarContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sidebarPanel: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 16,
  },
  sidebarInner: {
    flex: 1,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.primary,
  },
  sidebarUserSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.bodyLg,
    color: colors.primary,
    fontWeight: '800',
  },
  userTextContainer: {
    flex: 1,
    gap: 1,
  },
  userNameText: {
    ...typography.bodyMd,
    color: colors.white,
    fontWeight: '700',
  },
  userEmailText: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '180deg' }],
  },
  sidebarScroll: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  sidebarScrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl3,
  },
  sidebarSection: {
    marginBottom: spacing.lg,
  },
  sidebarSectionTitle: {
    ...typography.caption,
    color: colors.gray500,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  sidebarList: {
    gap: spacing.xs,
  },
  sidebarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sidebarIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarRowText: {
    flex: 1,
    gap: 1,
  },
  sidebarRowTitle: {
    ...typography.bodySm,
    color: colors.gray900,
    fontWeight: '700',
  },
  sidebarRowDescription: {
    fontSize: 10,
    color: colors.gray500,
  },
});
