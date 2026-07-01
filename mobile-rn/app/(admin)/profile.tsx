import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useAuthStore } from '@/store/auth-store';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

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

export default function ProfileScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  function confirmLogout() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  }

  const sections: ProfileSection[] = [
    {
      title: 'Profile',
      items: [
        { key: 'my-profile', label: 'My Profile', description: user?.email ?? 'Admin account', icon: 'shield', accent: 'primary', href: '/(admin)/module/settings' },
        { key: 'academic-year', label: 'Academic Year', description: 'Sessions and active year', icon: 'calendar', accent: 'success', href: '/(admin)/module/academic-years' },
        { key: 'school-profile', label: 'School Profile', description: 'School identity and contact info', icon: 'graduation', accent: 'primary', href: '/(admin)/module/settings' },
        { key: 'subscription', label: 'Subscription', description: 'Plan, limits and billing', icon: 'wallet', accent: 'success', href: '/(admin)/module/subscription' },
        { key: 'preferences', label: 'Preferences', description: 'Workspace preferences', icon: 'settings', accent: 'neutral', href: '/(admin)/module/settings' },
        { key: 'settings', label: 'Settings', description: 'System configuration', icon: 'settings', accent: 'neutral', href: '/(admin)/module/settings' },
        { key: 'logout', label: 'Sign Out', description: 'End this session', icon: 'logout', accent: 'error', onPress: confirmLogout },
      ],
    },
    {
      title: 'Core Records',
      items: [
        { key: 'students', label: 'Student Records', description: 'Existing student CRUD', icon: 'graduation', accent: 'primary', href: '/(admin)/module/students' },
        { key: 'teachers', label: 'Teacher Records', description: 'Existing teacher CRUD', icon: 'users', accent: 'primary', href: '/(admin)/module/teachers' },
        { key: 'attendance', label: 'Attendance Records', description: 'Attendance CRUD and filters', icon: 'check-circle', accent: 'success', href: '/(admin)/module/attendance' },
        { key: 'attendance-sheet', label: 'Attendance Sheet', description: 'Class attendance sheet', icon: 'clipboard', accent: 'success', href: '/(admin)/module/attendance-sheet' },
      ],
    },
    {
      title: 'Academic Setup',
      items: [
        { key: 'classes', label: 'Classes', description: 'Sections and classroom setup', icon: 'graduation', accent: 'primary', href: '/(admin)/module/classes' },
        { key: 'subjects', label: 'Subjects', description: 'Curriculum and subject owners', icon: 'book', accent: 'primary', href: '/(admin)/module/subjects' },
        { key: 'academic-years', label: 'Academic Years', description: 'School sessions', icon: 'calendar', accent: 'success', href: '/(admin)/module/academic-years' },
        { key: 'timetable', label: 'Timetable', description: 'Class and teacher schedules', icon: 'calendar', accent: 'success', href: '/(admin)/module/timetable' },
        { key: 'chapters', label: 'Chapters', description: 'Syllabus chapter catalog', icon: 'book', accent: 'primary', href: '/(admin)/module/chapters' },
      ],
    },
    {
      title: 'Learning & Exams',
      items: [
        { key: 'exams', label: 'Exams', description: 'Term exams and schedules', icon: 'clipboard', accent: 'warning', href: '/(admin)/module/exams' },
        { key: 'tests', label: 'Tests', description: 'Class tests and quizzes', icon: 'clipboard', accent: 'warning', href: '/(admin)/module/tests' },
        { key: 'results', label: 'Results', description: 'Marks and transcripts', icon: 'star', accent: 'success', href: '/(admin)/module/results' },
        { key: 'homework', label: 'Homework', description: 'Assignments and submissions', icon: 'book', accent: 'primary', href: '/(admin)/module/homework' },
        { key: 'live-classes', label: 'Live Classes', description: 'Online sessions', icon: 'video', accent: 'primary', href: '/(admin)/module/live-classes' },
        { key: 'question-bank', label: 'Question Bank', description: 'Question moderation', icon: 'book', accent: 'primary', href: '/(admin)/module/question-bank' },
        { key: 'question-papers', label: 'Question Papers', description: 'Generated and saved papers', icon: 'clipboard', accent: 'warning', href: '/(admin)/module/question-papers' },
        { key: 'certificates', label: 'Certificates', description: 'Issued certificates', icon: 'star', accent: 'success', href: '/(admin)/module/certificates' },
        { key: 'certificate-templates', label: 'Certificate Templates', description: 'Template designer', icon: 'star', accent: 'success', href: '/(admin)/module/certificate-templates' },
      ],
    },
    {
      title: 'Operations',
      items: [
        { key: 'behavior', label: 'Student Behavior', description: 'Discipline and merit notes', icon: 'shield', accent: 'warning', href: '/(admin)/module/behavior' },
        { key: 'leave', label: 'Teacher Leave', description: 'Leave applications and approvals', icon: 'clock', accent: 'warning', href: '/(admin)/module/leave' },
        { key: 'announcements', label: 'Announcements', description: 'School notices', icon: 'megaphone', accent: 'primary', href: '/(admin)/module/announcements' },
        { key: 'events', label: 'Events', description: 'School calendar', icon: 'calendar', accent: 'success', href: '/(admin)/module/events' },
        { key: 'messages', label: 'Messages', description: 'Conversations', icon: 'mail', accent: 'primary', href: '/(admin)/module/messages' },
        { key: 'broadcasts', label: 'Broadcasts', description: 'Group communications', icon: 'megaphone', accent: 'primary', href: '/(admin)/module/broadcasts' },
        { key: 'schedules', label: 'Schedules', description: 'Reminders and meetings', icon: 'calendar', accent: 'success', href: '/(admin)/module/schedules' },
        { key: 'notifications', label: 'Notifications', description: 'System notifications', icon: 'bell', accent: 'primary', href: '/(admin)/module/notifications' },
      ],
    },
    {
      title: 'Finance',
      items: [
        { key: 'fees', label: 'Fees', description: 'Vouchers and student fees', icon: 'wallet', accent: 'success', href: '/(admin)/module/fees' },
        { key: 'fee-ledger', label: 'Fee Ledger', description: 'Collection state', icon: 'wallet', accent: 'success', href: '/(admin)/module/fee-ledger' },
        { key: 'fee-dashboard', label: 'Fee Dashboard', description: 'Finance overview', icon: 'chart', accent: 'success', href: '/(admin)/module/fee-dashboard' },
        { key: 'fee-classes-summary', label: 'Class Fee Summary', description: 'Class-wise fee state', icon: 'chart', accent: 'success', href: '/(admin)/module/fee-classes-summary' },
        { key: 'class-fees', label: 'Class Fees', description: 'Class fee components', icon: 'wallet', accent: 'success', href: '/(admin)/module/class-fees' },
        { key: 'fee-types', label: 'Fee Types', description: 'Fee category setup', icon: 'wallet', accent: 'success', href: '/(admin)/module/fee-types' },
        { key: 'fee-payments', label: 'Fee Payments', description: 'Payments and receipts', icon: 'wallet', accent: 'success', href: '/(admin)/module/fee-payments' },
        { key: 'fee-daily-collection', label: 'Daily Collection', description: 'Daily fee collection', icon: 'wallet', accent: 'success', href: '/(admin)/module/fee-daily-collection' },
        { key: 'fee-adjustments', label: 'Fee Adjustments', description: 'Adjustments and corrections', icon: 'wallet', accent: 'success', href: '/(admin)/module/fee-adjustments' },
        { key: 'fee-discounts', label: 'Fee Discounts', description: 'Discount rules', icon: 'wallet', accent: 'success', href: '/(admin)/module/fee-discounts' },
        { key: 'scholarships', label: 'Scholarships', description: 'Scholarship setup', icon: 'star', accent: 'success', href: '/(admin)/module/scholarships' },
        { key: 'wallet', label: 'Wallet', description: 'Wallet balance', icon: 'wallet', accent: 'success', href: '/(admin)/module/wallet' },
        { key: 'wallet-transactions', label: 'Wallet Transactions', description: 'Wallet ledger', icon: 'wallet', accent: 'success', href: '/(admin)/module/wallet-transactions' },
        { key: 'payment-methods', label: 'Payment Methods', description: 'Payment configuration', icon: 'wallet', accent: 'success', href: '/(admin)/module/payment-methods' },
      ],
    },
    {
      title: 'Subscription & System',
      items: [
        { key: 'subscription-plans', label: 'Subscription Plans', description: 'Available packages', icon: 'wallet', accent: 'primary', href: '/(admin)/module/subscription-plans' },
        { key: 'subscription-history', label: 'Subscription History', description: 'Plan changes and invoices', icon: 'clock', accent: 'primary', href: '/(admin)/module/subscription-history' },
        { key: 'domain-status', label: 'Domain Status', description: 'Domain and tenant status', icon: 'shield', accent: 'neutral', href: '/(admin)/module/domain-status' },
      ],
    },
  ];

  return (
    <ScreenContainer scroll>
      <Header greeting="Account" title="Profile" subtitle={user?.email ?? 'Admin'} />
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.list}>
            {section.items.map((item) => (
              <ProfileRow
                key={item.key}
                item={item}
                onPress={item.onPress ?? (item.href ? () => router.push(item.href as never) : undefined)}
              />
            ))}
          </View>
        </View>
      ))}
    </ScreenContainer>
  );
}

function ProfileRow({ item, onPress }: { item: ProfileItem; onPress?: () => void }) {
  const palette = tintMap[item.accent];
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, shadows.card, pressed && styles.pressed]}
      android_ripple={{ color: colors.gray100 }}
    >
      <View style={[styles.iconWrap, { backgroundColor: palette.bg }]}>
        <Icon name={item.icon} size={20} color={palette.fg} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {item.label}
        </Text>
        {item.description ? (
          <Text style={styles.rowDescription} numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
      </View>
      <Icon name="chevron-right" size={18} color={colors.gray400} />
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

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    ...typography.h4,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  list: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { ...typography.bodyMd, color: colors.gray900, fontWeight: '800' },
  rowDescription: { ...typography.bodySm, color: colors.gray500 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
