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
  QuickActions,
  SectionHeader,
  type ListRow,
} from '@/components/dashboard/widgets';
import { fetchTeacherPortal } from '@/modules/dashboard/api';
import type { TeacherPortal } from '@/modules/dashboard/types';
import { useAuthStore } from '@/store/auth-store';
import { compactNumber, formatDate, formatTime } from '@/utils/format';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.78;

const QUICK_ACTIONS: { key: string; label: string; icon: IconName; href: string }[] = [
  { key: 'attendance', label: 'Mark Attendance', icon: 'check-circle', href: '/(teacher)/module/attendance' },
  { key: 'homework', label: 'Add Homework', icon: 'book', href: '/(teacher)/module/homework' },
  { key: 'marks', label: 'Enter Marks', icon: 'star', href: '/(teacher)/module/results' },
  { key: 'leave', label: 'Apply Leave', icon: 'clock', href: '/(teacher)/module/leave' },
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

export default function TeacherDashboard() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const query = useQuery({ queryKey: ['teacher-portal'], queryFn: fetchTeacherPortal });
  
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const data = query.data;
  const teacherName = data?.teacher
    ? `${data.teacher.first_name ?? ''} ${data.teacher.last_name ?? ''}`.trim()
    : 'Teacher';

  const stats = data?.operationalStats;
  const todayAtt = stats?.todayAttendance;

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
        { key: 'classes', label: 'My Classes', description: 'Sections you teach', icon: 'graduation', accent: 'primary', href: '/(teacher)/module/classes' },
        { key: 'timetable', label: 'Timetable', description: 'Weekly schedule', icon: 'calendar', accent: 'success', href: '/(teacher)/module/timetable' },
        { key: 'attendance', label: 'Attendance', description: 'Mark students', icon: 'check-circle', accent: 'success', href: '/(teacher)/module/attendance' },
        { key: 'homework', label: 'Homework', description: 'Assign & grade', icon: 'book', accent: 'primary', href: '/(teacher)/module/homework' },
      ],
    },
    {
      title: 'Evaluations',
      items: [
        { key: 'tests', label: 'Tests', description: 'Class tests', icon: 'clipboard', accent: 'warning', href: '/(teacher)/module/tests' },
        { key: 'exams', label: 'Exams', description: 'Term exams', icon: 'clipboard', accent: 'warning', href: '/(teacher)/module/exams' },
        { key: 'results', label: 'Results', description: 'Enter marks', icon: 'star', accent: 'success', href: '/(teacher)/module/results' },
        { key: 'question-papers', label: 'Question Papers', description: 'Build papers', icon: 'clipboard', accent: 'warning', href: '/(teacher)/module/question-papers' },
      ],
    },
    {
      title: 'Operations',
      items: [
        { key: 'live-classes', label: 'Live Classes', description: 'Online sessions', icon: 'video', accent: 'primary', href: '/(teacher)/module/live-classes' },
        { key: 'behavior', label: 'Behavior', description: 'Notes & incidents', icon: 'shield', accent: 'warning', href: '/(teacher)/module/behavior' },
        { key: 'leave', label: 'My Leave', description: 'Apply / track', icon: 'clock', accent: 'warning', href: '/(teacher)/module/leave' },
        { key: 'events', label: 'Events', description: 'School calendar', icon: 'megaphone', accent: 'primary', href: '/(teacher)/module/events' },
        { key: 'announcements', label: 'Announcements', description: 'Post notices', icon: 'megaphone', accent: 'primary', href: '/(teacher)/module/announcements' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { key: 'schedules', label: 'Schedule', description: 'Reminders', icon: 'calendar', accent: 'success', href: '/(teacher)/module/schedules' },
        { key: 'messages', label: 'Messages', description: 'Conversations', icon: 'mail', accent: 'primary', href: '/(teacher)/module/messages' },
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
            refreshing={query.isRefetching}
            onRefresh={() => query.refetch()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.padded}>
          <Header
            greeting="Teacher"
            title={teacherName || 'Workspace'}
            subtitle={data?.school?.name ?? "Today's plan"}
            showMenu={true}
            onMenuPress={openSidebar}
          />

          {query.isError ? (
            <Card style={styles.errorCard}>
              <Text style={styles.errorText}>{(query.error as Error).message}</Text>
              <Text style={styles.retryText} onPress={() => query.refetch()}>Tap to retry</Text>
            </Card>
          ) : null}

          <View style={styles.statsRow}>
            <StatTile
              label="Periods Today"
              value={data ? compactNumber(data.todaySchedule?.length ?? 0) : '—'}
              accent="primary"
              icon={<Icon name="calendar" size={20} color={colors.primary} />}
            />
            <StatTile
              label="Pending Marks"
              value={data ? compactNumber(stats?.pendingGrading ?? 0) : '—'}
              accent="warning"
              icon={<Icon name="clipboard" size={20} color={colors.warning} />}
            />
          </View>
          <View style={styles.statsRow}>
            <StatTile
              label="Attendance Marked"
              value={todayAtt ? `${todayAtt.marked}/${todayAtt.total}` : '—'}
              accent="success"
              icon={<Icon name="check-circle" size={20} color={colors.success} />}
            />
            <StatTile
              label="Homework Pending"
              value={data ? compactNumber(stats?.homeworkStatus?.pending ?? 0) : '—'}
              accent="primary"
              icon={<Icon name="book" size={20} color={colors.primary} />}
            />
          </View>

          {data?.alerts && data.alerts.length > 0 ? (
            <>
              <SectionHeader title="Alerts" />
              <ListCard rows={toAlertRows(data)} />
            </>
          ) : null}

          <SectionHeader title="Today's Schedule" />
          <ListCard rows={toScheduleRows(data)} emptyText="No periods scheduled today." />

          <SectionHeader title="Quick Actions" />
          <QuickActions actions={QUICK_ACTIONS} />

          <SectionHeader title="My Classes" />
          <ListCard rows={toClassRows(data)} emptyText="No classes assigned yet." />

          <SectionHeader title="Announcements" />
          <ListCard rows={toAnnouncementRows(data)} emptyText="No announcements." />
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
                      {user?.email ? user.email.charAt(0).toUpperCase() : 'T'}
                    </Text>
                  </View>
                  <View style={styles.userTextContainer}>
                    <Text style={styles.userNameText} numberOfLines={1}>
                      {teacherName}
                    </Text>
                    <Text style={styles.userEmailText} numberOfLines={1}>
                      {user?.email ?? 'teacher@eduplexo.com'}
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

function toScheduleRows(data?: TeacherPortal): ListRow[] {
  return (data?.todaySchedule ?? []).map((slot, index) => ({
    key: slot.id ?? String(index),
    title: `${slot.subject_name ?? 'Class'} · ${slot.class_name ?? ''}`.trim(),
    subtitle: slot.room ? `Room ${slot.room}` : undefined,
    meta: slot.start_time ? `${formatTime(slot.start_time)}` : undefined,
    icon: slot.attendance_marked ? 'check-circle' : 'clock',
    accent: slot.attendance_marked ? 'success' : 'warning',
  }));
}

function toClassRows(data?: TeacherPortal): ListRow[] {
  return (data?.classes ?? []).map((cls, index) => ({
    key: cls.id ?? String(index),
    title: `${cls.name ?? 'Class'}${cls.section ? ` - ${cls.section}` : ''}`,
    subtitle: `${compactNumber(cls.studentCount ?? 0)} students · ${compactNumber(cls.pendingHomework ?? 0)} pending HW`,
    meta: cls.upcomingExams ? `${cls.upcomingExams} exams` : undefined,
    icon: 'graduation',
    accent: 'primary',
  }));
}

function toAlertRows(data?: TeacherPortal): ListRow[] {
  const accentFor: Record<string, ListRow['accent']> = {
    red: 'error',
    orange: 'warning',
    green: 'success',
    blue: 'primary',
  };
  return (data?.alerts ?? []).map((alert, index) => ({
    key: `${alert.type}-${index}`,
    title: alert.title,
    subtitle: alert.message,
    icon: 'shield',
    accent: accentFor[alert.priority] ?? 'primary',
  }));
}

function toAnnouncementRows(data?: TeacherPortal): ListRow[] {
  return (data?.announcements ?? []).slice(0, 5).map((a, index) => ({
    key: a.id ?? String(index),
    title: a.title,
    subtitle: a.message,
    meta: a.date ? formatDate(a.date) : undefined,
    icon: 'megaphone',
    accent: 'primary',
  }));
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl3 },
  padded: { paddingHorizontal: spacing.base, paddingBottom: spacing.xl },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  errorCard: { marginBottom: spacing.md, gap: 4, backgroundColor: colors.errorLight, borderColor: colors.errorLight },
  errorText: { ...typography.bodySm, color: colors.error, fontWeight: '600' },
  retryText: { ...typography.bodySm, color: colors.error, fontWeight: '800' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  
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
