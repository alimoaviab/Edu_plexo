/**
 * Owner Dashboard — executive portfolio overview, NOT an Admin workspace.
 *
 * Data comes from GET /api/owner/dashboard (owner-only). The owner is a
 * multi-school owner/governance user: they see portfolio KPIs, quick links
 * to My Schools / Onboard Campus / Subscription, and can never switch into
 * an Admin context. Every school-level metric here is aggregated server-side
 * across the schools the authenticated owner actually owns.
 */

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
import { Card } from '@/components/ui/Card';
import { fetchOwnerDashboard } from '@/modules/dashboard/api';
import type { OwnerDashboard } from '@/modules/dashboard/types';
import { useAuthStore } from '@/store/auth-store';
import { compactNumber, titleCase } from '@/utils/format';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.78;

const QUICK_ACTIONS: { key: string; label: string; icon: IconName; href: string }[] = [
  { key: 'schools', label: 'My Schools', icon: 'building', href: '/(owner)/schools' },
  { key: 'onboard', label: 'Onboard Campus', icon: 'plus', href: '/(owner)/schools' },
  { key: 'analytics', label: 'Analytics', icon: 'chart', href: '/(owner)/analytics' },
  { key: 'ledger', label: 'Ledger', icon: 'clipboard', href: '/(owner)/ledger' },
  { key: 'finance', label: 'Finance', icon: 'wallet', href: '/(owner)/finance' },
  { key: 'alerts', label: 'Alerts', icon: 'bell', href: '/(owner)/alerts' },
  { key: 'subscription', label: 'Subscription', icon: 'shield', href: '/(owner)/subscription' },
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

export default function OwnerDashboardScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const dashboardQuery = useQuery({
    queryKey: ['owner-dashboard'],
    queryFn: fetchOwnerDashboard,
  });

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -SIDEBAR_WIDTH, duration: 220, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => {
      setSidebarVisible(false);
    });
  };

  function confirmLogout() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          closeSidebar();
          logout();
        },
      },
    ]);
  }

  const sections: ProfileSection[] = [
    {
      title: 'Owner Portal',
      items: [
        { key: 'schools', label: 'My Schools', description: 'Portfolio overview', icon: 'building', accent: 'primary', href: '/(owner)/schools' },
        { key: 'subscription', label: 'Subscription', description: 'Plan & billing', icon: 'wallet', accent: 'success', href: '/(owner)/subscription' },
      ],
    },
    {
      title: 'Session',
      items: [
        { key: 'logout', label: 'Sign Out', description: 'End this session', icon: 'logout', accent: 'error', onPress: confirmLogout },
      ],
    },
  ];

  const data = dashboardQuery.data;
  const loading = dashboardQuery.isLoading;
  const dash = (value?: number) => (loading ? '-' : compactNumber(value ?? 0));

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
            title={user?.email ? 'Executive Dashboard' : 'Owner Portal'}
            subtitle="Portfolio overview"
            showMenu={true}
            onMenuPress={openSidebar}
          />

          {dashboardQuery.isError ? (
            <Card style={styles.errorCard}>
              <Text style={styles.errorText}>{(dashboardQuery.error as Error).message}</Text>
              <Text style={styles.retryText} onPress={() => dashboardQuery.refetch()}>Tap to retry</Text>
            </Card>
          ) : null}

          <View style={styles.statsGrid}>
            <Metric label="Schools" value={dash(data?.total_schools)} icon="building" accent="primary" href="/(owner)/schools" />
            <Metric label="Campuses" value={dash(data?.total_campuses)} icon="building" accent="success" href="/(owner)/schools" />
            <Metric label="Students" value={dash(data?.total_students)} icon="graduation" accent="primary" href="/(owner)/schools" />
            <Metric label="Teachers" value={dash(data?.total_teachers)} icon="users" accent="success" href="/(owner)/schools" />
            <Metric label="Active Subs" value={dash(data?.active_subscriptions)} icon="wallet" accent="primary" href="/(owner)/subscription" />
          </View>

          {!loading && (data?.expiring_subscriptions ?? 0) > 0 ? (
            <Card style={styles.alertCard}>
              <Icon name="bell" size={16} color={colors.warning} />
              <Text style={styles.alertText}>
                {data!.expiring_subscriptions} subscription{data!.expiring_subscriptions === 1 ? '' : 's'} renewing within 15 days.
              </Text>
            </Card>
          ) : null}

          <SectionHeader title="Quick Actions" />
          <QuickActions actions={QUICK_ACTIONS} />

          <SectionHeader title="My Schools" subtitle="Tap to open the portfolio" />
          <ListCard rows={toSchoolRows(data)} emptyText="No schools yet — onboard your first campus." />

          {!loading && !data?.total_schools ? (
            <Pressable onPress={() => router.push('/(owner)/schools' as never)} style={({ pressed }) => [styles.onboardCta, pressed && styles.pressed]}>
              <Icon name="plus" size={18} color={colors.white} />
              <Text style={styles.onboardCtaText}>Onboard Your First Campus</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>

      {/* Sidebar Drawer */}
      <Modal transparent visible={sidebarVisible} onRequestClose={closeSidebar} animationType="none">
        <View style={styles.sidebarContainer}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar}>
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
          </Pressable>

          <Animated.View
            style={[styles.sidebarPanel, { transform: [{ translateX: slideAnim }] }]}
          >
            <SafeAreaView style={styles.sidebarInner} edges={['top', 'left', 'bottom']}>
              <View style={styles.sidebarHeader}>
                <View style={styles.sidebarUserSection}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>
                      {user?.email ? user.email.charAt(0).toUpperCase() : 'O'}
                    </Text>
                  </View>
                  <View style={styles.userTextContainer}>
                    <Text style={styles.userNameText} numberOfLines={1}>
                      Owner Account
                    </Text>
                    <Text style={styles.userEmailText} numberOfLines={1}>
                      {user?.email ?? 'owner@eduplexo.com'}
                    </Text>
                  </View>
                </View>
                <Pressable onPress={closeSidebar} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
                  <Icon name="chevron-right" size={22} color={colors.primary} />
                </Pressable>
              </View>

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

interface MetricProps {
  label: string;
  value: string;
  icon: IconName;
  accent: 'primary' | 'success';
  href: string;
}

function Metric({ label, value, icon, accent, href }: MetricProps) {
  const router = useRouter();
  const fg = accent === 'primary' ? colors.primary : colors.success;
  const bg = accent === 'primary' ? colors.primaryLight : colors.successLight;
  return (
    <Pressable
      onPress={() => router.push(href as never)}
      style={({ pressed }) => [styles.metric, shadows.card, pressed && styles.pressed]}
      android_ripple={{ color: colors.gray100 }}
    >
      <View style={[styles.metricIcon, { backgroundColor: bg }]}>
        <Icon name={icon} size={15} color={fg} />
      </View>
      <Text style={styles.metricValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.metricLabel} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

function toSchoolRows(data?: OwnerDashboard): ListRow[] {
  const school = (raw: Record<string, unknown>, index: number): ListRow => ({
    key: String(raw.school_id ?? raw.id ?? raw._id ?? index),
    title: String(raw.name ?? 'School'),
    subtitle: raw.city ? `Branch ${String(raw.code ?? raw.school_id ?? '')} · ${String(raw.city)}` : `Branch ${String(raw.code ?? raw.school_id ?? '')}`,
    meta: raw.status ? titleCase(String(raw.status)) : undefined,
    icon: 'building',
    accent: raw.status === 'active' ? 'success' : 'neutral',
  });
  return (data?.schools ?? []).slice(0, 5).map((raw, index) => school(raw as Record<string, unknown>, index));
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl3 },
  padded: { paddingHorizontal: spacing.base, paddingBottom: spacing.xl },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
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
  errorCard: { marginBottom: spacing.md, gap: 4, backgroundColor: colors.errorLight, borderColor: colors.errorLight },
  errorText: { ...typography.bodySm, color: colors.error, fontWeight: '600' },
  retryText: { ...typography.bodySm, color: colors.error, fontWeight: '800' },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.warningLight,
    borderColor: colors.warningLight,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  alertText: { ...typography.bodySm, color: colors.warning, fontWeight: '700', flex: 1 },
  onboardCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
  },
  onboardCtaText: { ...typography.bodyMd, color: colors.white, fontWeight: '800' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  sidebarContainer: { flex: 1, flexDirection: 'row' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
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
  sidebarInner: { flex: 1 },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.primary,
  },
  sidebarUserSection: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.bodyLg, color: colors.primary, fontWeight: '800' },
  userTextContainer: { flex: 1, gap: 1 },
  userNameText: { ...typography.bodyMd, color: colors.white, fontWeight: '700' },
  userEmailText: { ...typography.caption, color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '180deg' }],
  },
  sidebarScroll: { flex: 1, backgroundColor: colors.surface },
  sidebarScrollContent: { padding: spacing.md, paddingBottom: spacing.xl3 },
  sidebarSection: { marginBottom: spacing.lg },
  sidebarSectionTitle: {
    ...typography.caption,
    color: colors.gray500,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  sidebarList: { gap: spacing.xs },
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
  sidebarIconWrap: { width: 32, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  sidebarRowText: { flex: 1, gap: 1 },
  sidebarRowTitle: { ...typography.bodySm, color: colors.gray900, fontWeight: '700' },
  sidebarRowDescription: { fontSize: 10, color: colors.gray500 },
});