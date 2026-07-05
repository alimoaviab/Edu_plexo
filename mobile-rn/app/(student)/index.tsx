import { useState, useRef } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { StatTile } from '@/components/ui/StatTile';
import {
  ListCard,
  ProgressBar,
  QuickActions,
  SectionHeader,
  type ListRow,
} from '@/components/dashboard/widgets';
import { fetchParentStats } from '@/modules/dashboard/api';
import type { ParentChildOverview, ParentDashboardStats } from '@/modules/dashboard/types';
import { useAuthStore } from '@/store/auth-store';
import { compactNumber, formatCurrency, formatDate } from '@/utils/format';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.78;

const QUICK_ACTIONS: { key: string; label: string; icon: IconName; href: string }[] = [
  { key: 'homework', label: 'Homework', icon: 'book', href: '/(student)/module/homework' },
  { key: 'results', label: 'Results', icon: 'star', href: '/(student)/module/results' },
  { key: 'timetable', label: 'Timetable', icon: 'calendar', href: '/(student)/module/timetable' },
  { key: 'fees', label: 'Fees', icon: 'wallet', href: '/(student)/module/fees' },
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

export default function StudentDashboard() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const studentId = user?.studentId;

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const statsQuery = useQuery({
    queryKey: ['student-stats', studentId ?? 'self'],
    queryFn: () => fetchParentStats(studentId),
  });

  const overview = pickOverview(statsQuery.data);
  const studentName = overview?.name || (user?.email ?? 'Student Portal');

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
      title: 'Academic',
      items: [
        { key: 'timetable', label: 'Timetable', description: 'Class schedule', icon: 'calendar', accent: 'success', href: '/(student)/module/timetable' },
        { key: 'attendance', label: 'Attendance', description: 'My record', icon: 'check-circle', accent: 'success', href: '/(student)/module/attendance' },
        { key: 'homework', label: 'Homework', description: 'Assignments', icon: 'book', accent: 'primary', href: '/(student)/module/homework' },
      ],
    },
    {
      title: 'Evaluations',
      items: [
        { key: 'exams', label: 'Exams', description: 'Upcoming exams', icon: 'clipboard', accent: 'warning', href: '/(student)/module/exams' },
        { key: 'results', label: 'Results', description: 'My grades', icon: 'star', accent: 'success', href: '/(student)/module/results' },
      ],
    },
    {
      title: 'Operations',
      items: [
        { key: 'live-classes', label: 'Live Classes', description: 'Online sessions', icon: 'video', accent: 'primary', href: '/(student)/module/live-classes' },
        { key: 'fees', label: 'Fees', description: 'Dues & payments', icon: 'wallet', accent: 'success', href: '/(student)/module/fees' },
        { key: 'behavior', label: 'Behavior', description: 'Conduct notes', icon: 'shield', accent: 'warning', href: '/(student)/module/behavior' },
        { key: 'announcements', label: 'Announcements', description: 'Notices', icon: 'megaphone', accent: 'primary', href: '/(student)/module/announcements' },
        { key: 'events', label: 'Events', description: 'School calendar', icon: 'megaphone', accent: 'primary', href: '/(student)/module/events' },
        { key: 'leave', label: 'Leave', description: 'Apply / track', icon: 'clock', accent: 'warning', href: '/(student)/module/leave' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { key: 'messages', label: 'Messages', description: 'Contact teachers', icon: 'mail', accent: 'primary', href: '/(student)/module/messages' },
      ],
    },
  ];

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
            showMenu={true}
            onMenuPress={openSidebar}
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
                      {user?.email ? user.email.charAt(0).toUpperCase() : 'S'}
                    </Text>
                  </View>
                  <View style={styles.userTextContainer}>
                    <Text style={styles.userNameText} numberOfLines={1}>
                      {studentName}
                    </Text>
                    <Text style={styles.userEmailText} numberOfLines={1}>
                      {user?.email ?? 'student@eduplexo.com'}
                    </Text>
                  </View>
                </View>
                <Pressable onPress={closeSidebar} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
                  <Icon name="chevron-right" size={22} color={colors.primary} />
                </Pressable>
              </View>

              {/* Scrollable List of Modules */}
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
                          onPress={() => {
                            closeSidebar();
                            router.push(item.href as never);
                          }}
                        />
                      ))}
                    </View>
                  </View>
                ))}

                {/* Sign Out Button in Sidebar */}
                <View style={[styles.sidebarSection, { marginTop: spacing.md }]}>
                  <Pressable
                    onPress={confirmLogout}
                    style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}
                  >
                    <Icon name="logout" size={18} color={colors.error} />
                    <Text style={styles.logoutBtnText}>Sign Out</Text>
                  </Pressable>
                </View>
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

function AttendanceCard({ stats }: { stats?: ParentDashboardStats }) {
  const a = stats?.attendance;
  const percent = a?.percentage ?? 0;
  return (
    <Card style={styles.wideCard}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardLabel}>ATTENDANCE RATE</Text>
        <Text style={styles.cardValue}>{Math.round(percent)}%</Text>
        <Text style={styles.cardMeta}>
          {a ? `${a.present} present of ${a.total} school days` : '—'}
        </Text>
      </View>
      <View style={styles.progress}>
        <ProgressBar value={percent} accent={percent >= 75 ? 'success' : 'warning'} />
      </View>
    </Card>
  );
}

function pickOverview(data?: ParentDashboardStats): ParentChildOverview | undefined {
  if (!data) return undefined;
  // Dashboard endpoint wraps either in `.overview` or directly in keys depending on version
  const raw = data as any;
  return raw.overview || raw.child || raw;
}

function toExamRows(data?: ParentDashboardStats): ListRow[] {
  return (data?.upcomingExams ?? []).slice(0, 3).map((raw: any, index: number) => {
    const exam = raw as Record<string, unknown>;
    const date = (exam.starts_at ?? exam.date ?? exam.start_date) as string | undefined;
    return {
      key: String(exam.id ?? exam._id ?? index),
      title: String(exam.subject_name ?? exam.name ?? 'Exam'),
      subtitle: exam.class_name ? String(exam.class_name) : exam.type ? String(exam.type) : undefined,
      meta: date ? formatDate(date) : undefined,
      icon: 'clipboard',
      accent: 'warning',
    };
  });
}

function toResultRows(data?: ParentDashboardStats): ListRow[] {
  return (data?.recentResults ?? []).slice(0, 3).map((raw: any, index: number) => {
    const result = raw as Record<string, unknown>;
    return {
      key: String(result.id ?? result._id ?? index),
      title: String(result.subject_name ?? result.exam_name ?? 'Result'),
      subtitle: result.exam_name ? String(result.exam_name) : undefined,
      meta: result.marks_obtained !== undefined ? `${result.marks_obtained}/${result.total_marks ?? 100}` : undefined,
      icon: 'star',
      accent: 'success',
    };
  });
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl3 },
  padded: { paddingHorizontal: spacing.base, paddingBottom: spacing.xl },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  errorCard: { marginBottom: spacing.md, gap: 4, backgroundColor: colors.errorLight, borderColor: colors.errorLight },
  errorText: { ...typography.bodySm, color: colors.error, fontWeight: '600' },
  retryText: { ...typography.bodySm, color: colors.error, fontWeight: '800' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  
  wideCard: {
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderColor: colors.cardBorder,
  },
  cardInfo: { gap: 2 },
  cardLabel: { ...typography.labelXs, color: colors.gray400, letterSpacing: 0.6 },
  cardValue: { ...typography.h1, color: colors.gray900 },
  cardMeta: { ...typography.caption, color: colors.gray500, fontWeight: '600' },
  progress: { height: 8 },

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
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.errorLight,
  },
  logoutBtnText: {
    ...typography.bodySm,
    color: colors.error,
    fontWeight: '700',
  },
});
