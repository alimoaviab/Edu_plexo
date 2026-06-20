/**
 * Teacher Dashboard — wired to GET /api/teachers/session (the same teacher
 * portal payload the web teacher dashboard consumes). Surfaces operational
 * KPIs, alerts, today's schedule, the teacher's classes, a navigable module
 * grid and recent announcements.
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
  QuickActions,
  SectionHeader,
  type ListRow,
  type ModuleGridItem,
} from '@/components/dashboard/widgets';
import { fetchTeacherPortal } from '@/modules/dashboard/api';
import type { TeacherPortal } from '@/modules/dashboard/types';
import { compactNumber, formatDate, formatTime } from '@/utils/format';
import { colors, spacing, typography } from '@/theme/tokens';

const MODULES: ModuleGridItem[] = [
  { key: 'classes', label: 'My Classes', description: 'Sections you teach', icon: 'graduation', accent: 'primary', href: '/(teacher)/module/classes' },
  { key: 'timetable', label: 'Timetable', description: 'Weekly schedule', icon: 'calendar', accent: 'success', href: '/(teacher)/module/timetable' },
  { key: 'attendance', label: 'Attendance', description: 'Mark students', icon: 'check-circle', accent: 'success', href: '/(teacher)/module/attendance' },
  { key: 'homework', label: 'Homework', description: 'Assign & grade', icon: 'book', accent: 'primary', href: '/(teacher)/module/homework' },
  { key: 'tests', label: 'Tests', description: 'Class tests', icon: 'clipboard', accent: 'warning', href: '/(teacher)/module/tests' },
  { key: 'exams', label: 'Exams', description: 'Term exams', icon: 'clipboard', accent: 'warning', href: '/(teacher)/module/exams' },
  { key: 'results', label: 'Results', description: 'Enter marks', icon: 'star', accent: 'success', href: '/(teacher)/module/results' },
  { key: 'live-classes', label: 'Live Classes', description: 'Online sessions', icon: 'video', accent: 'primary', href: '/(teacher)/module/live-classes' },
  { key: 'behavior', label: 'Behavior', description: 'Notes & incidents', icon: 'shield', accent: 'warning', href: '/(teacher)/module/behavior' },
  { key: 'leave', label: 'My Leave', description: 'Apply / track', icon: 'clock', accent: 'warning', href: '/(teacher)/module/leave' },
  { key: 'events', label: 'Events', description: 'School calendar', icon: 'megaphone', accent: 'primary', href: '/(teacher)/module/events' },
  { key: 'announcements', label: 'Announcements', description: 'Post notices', icon: 'megaphone', accent: 'primary', href: '/(teacher)/module/announcements' },
  { key: 'question-papers', label: 'Question Papers', description: 'Build papers', icon: 'clipboard', accent: 'warning', href: '/(teacher)/module/question-papers' },
  { key: 'schedules', label: 'Schedule', description: 'Reminders', icon: 'calendar', accent: 'success', href: '/(teacher)/module/schedules' },
  { key: 'messages', label: 'Messages', description: 'Conversations', icon: 'mail', accent: 'primary', href: '/(teacher)/module/messages' },
];

const QUICK_ACTIONS: { key: string; label: string; icon: IconName; href: string }[] = [
  { key: 'attendance', label: 'Mark Attendance', icon: 'check-circle', href: '/(teacher)/module/attendance' },
  { key: 'homework', label: 'Add Homework', icon: 'book', href: '/(teacher)/module/homework' },
  { key: 'marks', label: 'Enter Marks', icon: 'star', href: '/(teacher)/module/results' },
  { key: 'leave', label: 'Apply Leave', icon: 'clock', href: '/(teacher)/module/leave' },
];

export default function TeacherDashboard() {
  const query = useQuery({ queryKey: ['teacher-portal'], queryFn: fetchTeacherPortal });
  const data = query.data;
  const teacherName = data?.teacher
    ? `${data.teacher.first_name ?? ''} ${data.teacher.last_name ?? ''}`.trim()
    : 'Teacher';

  const stats = data?.operationalStats;
  const todayAtt = stats?.todayAttendance;

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

          <SectionHeader title="Modules" subtitle="Tap to open" />
          <ModuleGrid items={MODULES} />

          <SectionHeader title="Announcements" />
          <ListCard rows={toAnnouncementRows(data)} emptyText="No announcements." />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

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
  padded: { paddingHorizontal: spacing.base },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  errorCard: { marginBottom: spacing.md, gap: 4, backgroundColor: colors.errorLight, borderColor: colors.errorLight },
  errorText: { ...typography.bodySm, color: colors.error, fontWeight: '600' },
  retryText: { ...typography.bodySm, color: colors.error, fontWeight: '800' },
});
