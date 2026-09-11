import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { CurrentPlanCard } from '@/components/subscription/CurrentPlanCard';
import { Icon } from '@/components/ui/Icon';
import { useSubscription } from '@/modules/subscription/useSubscription';
import { env } from '@/config/env';
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
  const {
    current,
    subscription,
    isLoading,
    isRefreshing,
    refetch,
    error,
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

  // Opens the configured web portal (env.webPortalUrl — never hardcoded in
  // components). No tokens are appended; the user signs in there themselves.
  const openWebPortal = () => {
    Linking.openURL(env.webPortalUrl).catch(() => {
      // Linking.openURL only rejects if no app can handle https links —
      // effectively unreachable, but never crash the screen over it.
      console.warn('No handler available for web portal URL:', env.webPortalUrl);
    });
  };

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

          {error ? (
            <Pressable
              onPress={refetch}
              style={({ pressed }) => [styles.errorBanner, pressed && styles.pressed]}
            >
              <Icon name="alert-triangle" size={16} color={colors.error} />
              <Text style={styles.errorText} numberOfLines={2}>
                {error} · Tap to retry
              </Text>
            </Pressable>
          ) : null}


          {/* Current Plan Overview Card */}
          <CurrentPlanCard
            subscription={subscription}
            studentsUsed={studentsUsed}
            studentsLimit={studentsLimit}
            daysRemaining={daysRemaining}
          />

          {/* Payments & upgrades happen on the web portal — link out instead
              of duplicating the payment flow in the app. */}
          <View style={[styles.paymentCard, shadows.card]}>
            <View style={styles.paymentIconBox}>
              <Icon name="wallet" size={20} color={colors.primary} />
            </View>
            <View style={styles.paymentContent}>
              <Text style={styles.paymentTitle}>Payments & Upgrade</Text>
              <Text style={styles.paymentDescription}>
                To upgrade, renew, or complete payment, open the Eduplex web portal and sign in with
                your school account.
              </Text>
              <Pressable
                onPress={openWebPortal}
                style={({ pressed }) => [styles.webButton, pressed && styles.pressed]}
                android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
              >
                <Icon name="shield" size={16} color={colors.white} />
                <Text style={styles.webButtonText}>Open Eduplex Web</Text>
              </Pressable>
            </View>
          </View>

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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.errorLight,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.error,
    flex: 1,
    fontWeight: '700',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.xl2,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  paymentIconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentContent: {
    flex: 1,
    gap: 6,
  },
  paymentTitle: {
    ...typography.bodySm,
    color: colors.gray900,
    fontWeight: '800',
  },
  paymentDescription: {
    ...typography.caption,
    color: colors.gray600,
    lineHeight: 16,
  },
  webButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    marginTop: 4,
  },
  webButtonText: {
    ...typography.bodySm,
    color: colors.white,
    fontWeight: '800',
  },
});
