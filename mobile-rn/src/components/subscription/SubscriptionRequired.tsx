import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Icon } from '@/components/ui/Icon';
import type { CurrentSubscription } from '@/modules/subscription/types';
import { useAuthStore } from '@/store/auth-store';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

interface SubscriptionRequiredProps {
  current?: CurrentSubscription | null;
}

export function SubscriptionRequired({ current }: SubscriptionRequiredProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const sub = current?.subscription;
  const isExpired = sub?.status === 'expired' || sub?.status === 'cancelled' || sub?.status === 'canceled';
  const isOwner = user?.role === 'owner';

  const title = isOwner
    ? isExpired
      ? 'Your Subscription Has Expired'
      : 'Please Choose Your Subscription Plan'
    : isExpired
    ? 'Subscription Expired'
    : 'Subscription Inactive';

  const description = isOwner
    ? isExpired
      ? 'Your institution subscription has ended. Please renew or upgrade your plan to restore full access across all your campuses.'
      : 'You have not activated your Free Trial or Subscription. Please choose a plan to continue managing your institution.'
    : "Your school's subscription plan is currently inactive or has expired. Please contact your School Owner to renew or activate the plan.";

  const handleAction = () => {
    if (isOwner) {
      router.push('/(owner)/subscription' as never);
    } else {
      router.push('/(admin)/subscription' as never);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, shadows.card]}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: isExpired ? colors.errorLight : colors.primaryLight },
          ]}
        >
          <Icon
            name={isExpired ? 'alert-triangle' : 'lock'}
            size={32}
            color={isExpired ? colors.error : colors.primary}
          />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {isOwner ? (
          <Pressable
            onPress={handleAction}
            style={({ pressed }) => [styles.btnAction, pressed && styles.pressed]}
          >
            <Text style={styles.btnActionText}>Manage Subscription</Text>
            <Icon name="chevron-right" size={16} color={colors.white} />
          </Pressable>
        ) : (
          <View style={styles.adminNotice}>
            <Icon name="lock" size={14} color={colors.gray500} />
            <Text style={styles.adminNoticeText}>
              Please contact your <Text style={styles.bold}>School Owner</Text> to renew or activate
              the subscription.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.xl2,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.gray900,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    ...typography.bodySm,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  btnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.lg,
  },
  btnActionText: {
    ...typography.bodySm,
    color: colors.white,
    fontWeight: '800',
  },
  adminNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  adminNoticeText: {
    ...typography.caption,
    color: colors.gray600,
    flex: 1,
    lineHeight: 16,
  },
  bold: {
    fontWeight: '800',
    color: colors.gray800,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
