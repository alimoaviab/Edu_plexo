import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Icon } from '@/components/ui/Icon';
import type { Subscription } from '@/modules/subscription/types';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { formatDate } from '@/utils/format';

interface CurrentPlanCardProps {
  subscription: Subscription | null;
  studentsUsed: number;
  studentsLimit?: number;
  daysRemaining?: number;
}

export function getPlanDisplayName(name: string): string {
  const map: Record<string, string> = {
    basic: 'Basic Plan',
    standard: 'Standard Plan',
    premium: 'Premium Plan',
    enterprise: 'Enterprise Plan',
  };
  if (map[name]) return map[name];
  if (name && name.includes(',')) return 'Custom Built Plan';
  if (name) return name.charAt(0).toUpperCase() + name.slice(1);
  return 'No Active Plan';
}

export function CurrentPlanCard({
  subscription,
  studentsUsed,
  studentsLimit,
  daysRemaining,
}: CurrentPlanCardProps) {
  const isTrial = subscription?.status === 'trial';
  const isActive = subscription?.status === 'active';
  const isExpired =
    subscription?.status === 'expired' ||
    subscription?.status === 'cancelled' ||
    subscription?.status === 'canceled' ||
    subscription?.status === 'suspended';

  const limit = subscription?.student_limit ?? studentsLimit ?? 0;
  const planName = subscription?.plan_name ?? '';
  const price = subscription?.price ?? 0;

  const usagePercent = limit > 0 ? Math.min(100, Math.round((studentsUsed / limit) * 100)) : 0;
  const remainingSlots = Math.max(0, limit - studentsUsed);

  const progressBarColor =
    usagePercent >= 100 ? colors.error : usagePercent >= 80 ? colors.warning : colors.success;

  if (isTrial) {
    return (
      <LinearGradient
        colors={['#2563EB', '#4338CA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.trialCard, shadows.card]}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <Text style={styles.trialTitle}>Free Trial</Text>
            <View style={styles.trialBadge}>
              <Icon name="sparkles" size={12} color="#FBBF24" />
              <Text style={styles.trialBadgeText}>
                {daysRemaining != null && daysRemaining > 0 ? `${daysRemaining}d remaining` : 'Active Trial'}
              </Text>
            </View>
          </View>
          <View style={styles.iconCircle}>
            <Icon name="gift" size={24} color={colors.white} />
          </View>
        </View>

        <Text style={styles.trialSubtitle}>
          All features unlocked · Up to {limit > 0 ? limit : 200} students
        </Text>

        {subscription?.end_date ? (
          <Text style={styles.trialExpiry}>
            Trial ends: {formatDate(subscription.end_date)}
            {daysRemaining != null && daysRemaining > 0 ? ` (${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left)` : ''}
          </Text>
        ) : null}

        {/* Feature Pills */}
        <View style={styles.pillsWrap}>
          {['All Modules', 'Unlimited Teachers', 'Parent & Student Portals', 'Reports & Analytics'].map((f) => (
            <View key={f} style={styles.pill}>
              <Icon name="check" size={10} color="#FBBF24" />
              <Text style={styles.pillText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Student Usage */}
        <View style={styles.trialUsageSection}>
          <View style={styles.usageTextRow}>
            <Text style={styles.trialUsageLabel}>Student Quota Usage</Text>
            <Text style={styles.trialUsageCount}>
              {studentsUsed} / {limit} ({usagePercent}%)
            </Text>
          </View>
          <View style={styles.progressBarTrackTrial}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${usagePercent}%`, backgroundColor: usagePercent >= 100 ? '#F87171' : '#34D399' },
              ]}
            />
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.planTitle}>
            {subscription ? getPlanDisplayName(planName) : 'No Active Plan'}
          </Text>
          <View
            style={[
              styles.statusBadge,
              isActive
                ? styles.statusActive
                : isExpired
                ? styles.statusExpired
                : styles.statusInactive,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                isActive
                  ? styles.statusTextActive
                  : isExpired
                  ? styles.statusTextExpired
                  : styles.statusTextInactive,
              ]}
            >
              {subscription ? (isExpired ? 'EXPIRED' : subscription.status.toUpperCase()) : 'INACTIVE'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.iconCircleStandard,
            { backgroundColor: isActive ? colors.primaryLight : colors.gray100 },
          ]}
        >
          <Icon
            name={isExpired ? 'alert-triangle' : 'shield'}
            size={22}
            color={isExpired ? colors.error : isActive ? colors.primary : colors.gray500}
          />
        </View>
      </View>

      {subscription ? (
        <View style={styles.priceRow}>
          <Text style={styles.priceValue}>
            {price === 0 ? 'Free' : `PKR ${price.toLocaleString()}`}
          </Text>
          <Text style={styles.pricePeriod}>/month</Text>
        </View>
      ) : (
        <Text style={styles.noPlanSubtitle}>
          Subscribe to a plan or start your free trial to manage your school seamlessly.
        </Text>
      )}

      {/* Student Usage Bar */}
      {subscription ? (
        <View style={styles.usageSection}>
          <View style={styles.usageTextRow}>
            <Text style={styles.usageLabel}>Student Capacity</Text>
            <Text style={styles.usageCount}>
              {studentsUsed} / {limit} students
            </Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${usagePercent}%`, backgroundColor: progressBarColor },
              ]}
            />
          </View>

          <View style={styles.usageFooterRow}>
            <Text style={styles.usageSubtext}>{usagePercent}% capacity used</Text>
            <Text style={styles.usageSubtext}>{remainingSlots} seats remaining</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  trialCard: {
    borderRadius: radius.xl2,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl2,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flex: 1,
    gap: 6,
  },
  trialTitle: {
    ...typography.h2,
    color: colors.white,
    fontWeight: '800',
  },
  planTitle: {
    ...typography.h2,
    color: colors.gray900,
    fontWeight: '800',
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  trialBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '800',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusActive: {
    backgroundColor: colors.successLight,
  },
  statusExpired: {
    backgroundColor: colors.errorLight,
  },
  statusInactive: {
    backgroundColor: colors.gray100,
  },
  statusBadgeText: {
    ...typography.caption,
    fontWeight: '800',
  },
  statusTextActive: {
    color: colors.success,
  },
  statusTextExpired: {
    color: colors.error,
  },
  statusTextInactive: {
    color: colors.gray600,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleStandard: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trialSubtitle: {
    ...typography.bodySm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginTop: 8,
  },
  trialExpiry: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
    marginTop: 2,
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  pillText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    fontSize: 11,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 10,
  },
  priceValue: {
    ...typography.h1,
    color: colors.gray900,
    fontWeight: '900',
  },
  pricePeriod: {
    ...typography.bodySm,
    color: colors.gray500,
    fontWeight: '600',
  },
  noPlanSubtitle: {
    ...typography.bodySm,
    color: colors.gray500,
    marginTop: 8,
    lineHeight: 18,
  },
  usageSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  trialUsageSection: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  usageTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  usageLabel: {
    ...typography.caption,
    color: colors.gray500,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trialUsageLabel: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  usageCount: {
    ...typography.bodySm,
    color: colors.gray900,
    fontWeight: '800',
  },
  trialUsageCount: {
    ...typography.bodySm,
    color: colors.white,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.gray100,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressBarTrackTrial: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  usageFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  usageSubtext: {
    ...typography.caption,
    color: colors.gray400,
    fontWeight: '600',
  },
});
