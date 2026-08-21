import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import type { Plan, Subscription } from '@/modules/subscription/types';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

interface PricingCardProps {
  plan: Plan;
  isCurrentPlan: boolean;
  canTrial: boolean;
  onStartTrial: () => void;
  onUpgrade: () => void;
  onManualSubscribe: () => void;
  isUpgrading: boolean;
  isStartingTrial: boolean;
  sub: Subscription | null;
}

export function PricingCard({
  plan,
  isCurrentPlan,
  canTrial,
  onStartTrial,
  onUpgrade,
  onManualSubscribe,
  isUpgrading,
  isStartingTrial,
  sub,
}: PricingCardProps) {
  const isExpired = sub?.status === 'expired' || sub?.status === 'cancelled' || sub?.status === 'canceled';

  return (
    <View
      style={[
        styles.card,
        plan.popular ? styles.cardPopular : styles.cardDefault,
        isCurrentPlan ? styles.cardCurrent : null,
        shadows.card,
      ]}
    >
      {/* Popular Badge */}
      {plan.popular ? (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
        </View>
      ) : null}

      {/* Current Badge */}
      {isCurrentPlan ? (
        <View style={styles.currentBadge}>
          <Text style={styles.currentBadgeText}>CURRENT</Text>
        </View>
      ) : null}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.planName}>{plan.display_name}</Text>
        <View style={styles.priceWrap}>
          {plan.is_custom ? (
            <Text style={styles.customPriceText}>Custom Modules</Text>
          ) : (
            <View style={styles.priceRow}>
              <Text style={styles.priceNumber}>{plan.price.toLocaleString()}</Text>
              <Text style={styles.priceUnit}>PKR/mo</Text>
            </View>
          )}
        </View>
        <Text style={styles.capacityText}>
          Up to <Text style={styles.capacityHighlight}>{plan.student_limit}+</Text> students
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Features */}
      <View style={styles.featuresList}>
        {(plan.features || []).map((feature, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.checkWrap}>
              <Icon name="check" size={12} color={colors.primary} />
            </View>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Action Button */}
      <View style={styles.actionWrap}>
        {plan.is_custom ? (
          <Pressable
            onPress={onManualSubscribe}
            style={({ pressed }) => [styles.btnOutline, pressed && styles.pressed]}
          >
            <Text style={styles.btnOutlineText}>Build Your Own Plan</Text>
          </Pressable>
        ) : isCurrentPlan ? (
          <View style={styles.btnDisabled}>
            <Text style={styles.btnDisabledText}>Current Plan</Text>
          </View>
        ) : canTrial && !plan.is_custom ? (
          <Pressable
            onPress={onStartTrial}
            disabled={isStartingTrial}
            style={({ pressed }) => [styles.btnPrimary, pressed && styles.pressed]}
          >
            {isStartingTrial ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <>
                <Icon name="gift" size={16} color={colors.white} />
                <Text style={styles.btnPrimaryText}>Start Free Trial</Text>
              </>
            )}
          </Pressable>
        ) : (
          <Pressable
            onPress={onUpgrade}
            disabled={isUpgrading}
            style={({ pressed }) => [
              plan.popular ? styles.btnPrimary : styles.btnDark,
              pressed && styles.pressed,
            ]}
          >
            {isUpgrading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.btnPrimaryText}>
                {isExpired ? 'Renew Subscription' : 'Upgrade Plan'}
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl2,
    borderWidth: 1.5,
    padding: spacing.md,
    marginBottom: spacing.md,
    position: 'relative',
  },
  cardDefault: {
    borderColor: colors.cardBorder,
  },
  cardPopular: {
    borderColor: colors.primary,
  },
  cardCurrent: {
    borderColor: colors.success,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  popularBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  currentBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  currentBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  header: {
    alignItems: 'center',
    paddingTop: 6,
  },
  planName: {
    ...typography.h3,
    color: colors.gray900,
    fontWeight: '800',
  },
  priceWrap: {
    marginTop: 6,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceNumber: {
    ...typography.h1,
    color: colors.gray900,
    fontWeight: '900',
    fontSize: 28,
  },
  priceUnit: {
    ...typography.caption,
    color: colors.gray500,
    fontWeight: '700',
  },
  customPriceText: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '800',
  },
  capacityText: {
    ...typography.caption,
    color: colors.gray500,
    fontWeight: '500',
  },
  capacityHighlight: {
    fontWeight: '800',
    color: colors.gray800,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginVertical: spacing.md,
  },
  featuresList: {
    gap: 10,
    marginBottom: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    ...typography.bodySm,
    color: colors.gray700,
    flex: 1,
  },
  actionWrap: {
    marginTop: 6,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.lg,
  },
  btnPrimaryText: {
    ...typography.bodySm,
    color: colors.white,
    fontWeight: '800',
  },
  btnDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray900,
    paddingVertical: 12,
    borderRadius: radius.lg,
  },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
  },
  btnOutlineText: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: '800',
  },
  btnDisabled: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray100,
    paddingVertical: 12,
    borderRadius: radius.lg,
  },
  btnDisabledText: {
    ...typography.bodySm,
    color: colors.gray400,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
