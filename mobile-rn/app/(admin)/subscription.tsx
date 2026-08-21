import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { CurrentPlanCard } from '@/components/subscription/CurrentPlanCard';
import { Icon } from '@/components/ui/Icon';
import { useSubscription } from '@/modules/subscription/useSubscription';
import { useAuthStore } from '@/store/auth-store';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

const CORE_MODULES = [
  'Student Directory',
  'Teacher Management',
  'Classes & Timetable',
  'Attendance Tracking',
  'Homework & Exams',
  'Results & Marksheets',
  'Fee Collection',
  'Announcements',
  'Parent & Student Portals',
  'Certificates',
  'Question Bank',
  'Live Classes',
];

export default function AdminSubscriptionScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isOwner = user?.role === 'owner';

  const {
    current,
    subscription,
    isLoading,
    isRefreshing,
    refetch,
    studentsUsed,
    studentsLimit,
    daysRemaining,
  } = useSubscription();

  const allowedModulesList = useMemo(() => {
    if (!current?.allowed_modules) return CORE_MODULES;
    const list = Object.entries(current.allowed_modules)
      .filter(([_, allowed]) => allowed)
      .map(([mod]) => mod);
    return list.length > 0 ? list : CORE_MODULES;
  }, [current?.allowed_modules]);

  if (isLoading) {
    return (
      <ScreenContainer scroll>
        <Header showBack greeting="Administration" title="Subscription Status" />
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading subscription status...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer flush>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.padded}>
          <Header
            showBack
            greeting="Administration"
            title="School Subscription"
            subtitle="View current plan status, student seat allocation, and enabled modules"
          />

          {/* Centralized Owner Governance Notice */}
          <View style={[styles.governanceNotice, shadows.card]}>
            <View style={styles.govIconBox}>
              <Icon name="shield" size={22} color={colors.white} />
            </View>
            <View style={styles.govContent}>
              <View style={styles.govTitleRow}>
                <Text style={styles.govTitle}>Subscription Managed by School Owner</Text>
                <View style={styles.centralizedBadge}>
                  <Text style={styles.centralizedBadgeText}>CENTRALIZED</Text>
                </View>
              </View>
              <Text style={styles.govDescription}>
                Your school's subscription plan, student capacity limit, billing renewals, and feature
                packages are managed centrally by the <Text style={styles.bold}>School Owner</Text>.
              </Text>
              <Text style={styles.govSubtext}>
                Need to add more students or unlock additional premium modules? Please contact your
                School Owner or administrator.
              </Text>

              {isOwner ? (
                <Pressable
                  onPress={() => router.push('/(owner)/subscription' as never)}
                  style={({ pressed }) => [styles.btnOwnerManage, pressed && styles.pressed]}
                >
                  <Text style={styles.btnOwnerManageText}>Manage Billing as Owner</Text>
                  <Icon name="chevron-right" size={14} color={colors.primary} />
                </Pressable>
              ) : null}
            </View>
          </View>

          {/* Current Plan Overview Card */}
          <CurrentPlanCard
            subscription={subscription}
            studentsUsed={studentsUsed}
            studentsLimit={studentsLimit}
            daysRemaining={daysRemaining}
          />

          {/* Included Features & Active Modules */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Icon name="check-circle" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Included Modules & Features</Text>
            </View>
            <Text style={styles.modulesCount}>
              {allowedModulesList.length} Active Modules
            </Text>
          </View>

          <View style={styles.modulesGrid}>
            {allowedModulesList.map((item) => (
              <View key={item} style={[styles.moduleItem, shadows.card]}>
                <Icon name="check-circle" size={14} color={colors.success} />
                <Text style={styles.moduleItemText} numberOfLines={1}>
                  {item.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xl3,
  },
  padded: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
  },
  loadingCenter: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    ...typography.bodySm,
    color: colors.gray500,
    fontWeight: '600',
  },
  governanceNotice: {
    backgroundColor: '#eff6ff',
    borderRadius: radius.xl2,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  govIconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  govContent: {
    flex: 1,
    gap: 4,
  },
  govTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  govTitle: {
    ...typography.bodySm,
    color: colors.gray900,
    fontWeight: '800',
  },
  centralizedBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  centralizedBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '900',
    fontSize: 9,
  },
  govDescription: {
    ...typography.caption,
    color: colors.gray700,
    lineHeight: 16,
    marginTop: 2,
  },
  govSubtext: {
    ...typography.caption,
    color: colors.gray500,
    fontSize: 10,
    marginTop: 2,
  },
  bold: {
    fontWeight: '800',
    color: colors.gray900,
  },
  btnOwnerManage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  btnOwnerManageText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.gray900,
    fontWeight: '800',
  },
  modulesCount: {
    ...typography.caption,
    color: colors.gray500,
    fontWeight: '700',
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moduleItem: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  moduleItemText: {
    ...typography.caption,
    color: colors.gray800,
    fontWeight: '700',
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
});
