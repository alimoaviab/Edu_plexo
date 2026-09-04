import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { CurrentPlanCard, getPlanDisplayName } from '@/components/subscription/CurrentPlanCard';
import { PricingCard } from '@/components/subscription/PricingCard';
import { Icon } from '@/components/ui/Icon';
import type { Plan } from '@/modules/subscription/types';
import { useSubscription } from '@/modules/subscription/useSubscription';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { formatDate } from '@/utils/format';

export default function OwnerSubscriptionScreen() {
  const router = useRouter();
  const {
    subscription,
    plans,
    history,
    isLoading,
    isRefreshing,
    refetch,
    startTrial,
    isStartingTrial,
    isUpgrading,
    canTrial,
    daysRemaining,
    studentsUsed,
    studentsLimit,
  } = useSubscription();

  const dedupedHistory = useMemo(() => {
    const seen = new Set<string>();
    return history.filter((entry) => {
      const key = `${entry.action}::${entry.plan_name}::${entry.start_date}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [history]);

  const handleStartTrial = async (plan: Plan) => {
    Alert.alert(
      'Start Free Trial',
      `Activate free trial for ${plan.display_name} with all premium modules unlocked?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Trial',
          onPress: async () => {
            const success = await startTrial(plan.name);
            if (success) {
              Alert.alert('Trial Activated!', 'Your free trial has been activated successfully.');
            } else {
              Alert.alert('Error', 'Failed to start trial. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleUpgrade = (plan: Plan) => {
    router.push({
      pathname: '/(owner)/payment',
      params: {
        planId: plan.id,
        planName: plan.name,
        displayName: plan.display_name,
        price: String(plan.price),
        studentLimit: String(plan.student_limit),
      },
    } as never);
  };

  const handleCustomPlan = () => {
    router.push('/(owner)/custom-plan' as never);
  };

  if (isLoading) {
    return (
      <ScreenContainer scroll>
        <Header showBack greeting="Owner Portal" title="Subscription & Billing" />
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading subscription plans...</Text>
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
            greeting="Owner Portal"
            title="Subscription & Billing"
            subtitle="Manage plan tiers, student limits and institutional billing"
          />

          {/* Current Plan Overview */}
          <CurrentPlanCard
            subscription={subscription}
            studentsUsed={studentsUsed}
            studentsLimit={studentsLimit}
            daysRemaining={daysRemaining}
          />

          {/* Available Plans Section */}
          <View style={styles.sectionHeaderWrap}>
            <View style={styles.sectionTitleRow}>
              <Icon name="sparkles" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Available Plans</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Select a tier to scale your school capacity and unlock advanced modules
            </Text>
          </View>

          <View style={styles.plansContainer}>
            {plans.map((plan) => {
              const isCurrent = subscription?.plan_name === plan.name;
              return (
                <PricingCard
                  key={plan.name}
                  plan={plan}
                  isCurrentPlan={isCurrent}
                  canTrial={canTrial}
                  onStartTrial={() => handleStartTrial(plan)}
                  onUpgrade={() => handleUpgrade(plan)}
                  onManualSubscribe={handleCustomPlan}
                  isUpgrading={isUpgrading}
                  isStartingTrial={isStartingTrial}
                  sub={subscription}
                />
              );
            })}
          </View>

          {/* Subscription History Section */}
          {dedupedHistory.length > 0 ? (
            <View style={styles.historySection}>
              <View style={styles.sectionTitleRow}>
                <Icon name="wallet" size={18} color={colors.primary} />
                <Text style={styles.sectionTitle}>Billing History</Text>
              </View>

              <View style={[styles.historyCard, shadows.card]}>
                {dedupedHistory.map((item, index) => {
                  const isPaid = item.payment_status?.toLowerCase() === 'paid';
                  const isLast = index === dedupedHistory.length - 1;
                  return (
                    <View
                      key={item.id || index}
                      style={[styles.historyRow, !isLast && styles.historyBorder]}
                    >
                      <View style={styles.historyLeft}>
                        <Text style={styles.historyPlan}>{getPlanDisplayName(item.plan_name)}</Text>
                        <Text style={styles.historyAction}>
                          {item.action ? item.action.replace(/_/g, ' ') : 'Subscription'}
                        </Text>
                        <Text style={styles.historyDates}>
                          {formatDate(item.start_date)} — {formatDate(item.end_date)}
                        </Text>
                      </View>

                      <View style={styles.historyRight}>
                        <Text style={styles.historyAmount}>
                          {item.amount > 0 ? `PKR ${item.amount.toLocaleString()}` : 'Free'}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            isPaid ? styles.statusBadgePaid : styles.statusBadgePending,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeLabel,
                              isPaid ? styles.statusLabelPaid : styles.statusLabelPending,
                            ]}
                          >
                            {(item.payment_status || 'paid').toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
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
  sectionHeaderWrap: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.gray900,
    fontWeight: '800',
  },
  sectionSubtitle: {
    ...typography.bodySm,
    color: colors.gray500,
    lineHeight: 18,
  },
  plansContainer: {
    gap: spacing.sm,
  },
  historySection: {
    marginTop: spacing.xl,
  },
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl2,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  historyBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  historyLeft: {
    flex: 1,
    gap: 2,
  },
  historyPlan: {
    ...typography.bodySm,
    color: colors.gray900,
    fontWeight: '800',
  },
  historyAction: {
    ...typography.caption,
    color: colors.gray600,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  historyDates: {
    ...typography.caption,
    color: colors.gray400,
    fontSize: 10,
  },
  historyRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  historyAmount: {
    ...typography.bodySm,
    color: colors.gray900,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  statusBadgePaid: {
    backgroundColor: colors.successLight,
  },
  statusBadgePending: {
    backgroundColor: colors.warningLight,
  },
  statusBadgeLabel: {
    ...typography.caption,
    fontWeight: '800',
    fontSize: 10,
  },
  statusLabelPaid: {
    color: colors.success,
  },
  statusLabelPending: {
    color: colors.warning,
  },
});
