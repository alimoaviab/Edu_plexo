import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Icon } from '@/components/ui/Icon';
import { useSubscription } from '@/modules/subscription/useSubscription';
import { useAuthStore } from '@/store/auth-store';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export function TrialBanner() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isOwner = user?.role === 'owner';
  const { subscription, isLoading, isTrial, daysRemaining, isExpired } = useSubscription();

  if (isLoading || !subscription) return null;
  if (!isTrial && !isExpired) return null;

  const handlePress = () => {
    if (isOwner) {
      router.push('/(owner)/subscription' as never);
    } else {
      router.push('/(admin)/subscription' as never);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        isExpired ? styles.expiredContainer : styles.trialContainer,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconBox}>
        <Icon
          name={isExpired ? 'alert-triangle' : 'sparkles'}
          size={18}
          color={isExpired ? colors.error : colors.primary}
        />
      </View>
      <View style={styles.content}>
        {isExpired ? (
          <Text style={styles.expiredTitle}>Subscription Expired</Text>
        ) : (
          <Text style={styles.trialTitle}>Free Trial Active ({daysRemaining} days remaining)</Text>
        )}
        <Text style={styles.subtitle}>
          {isExpired
            ? 'Tap here to renew or upgrade your plan to unlock full access.'
            : 'You are currently on a 14-day free trial. Tap to view plans.'}
        </Text>
      </View>
      <Icon name="chevron-right" size={16} color={isExpired ? colors.error : colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  trialContainer: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  expiredContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  trialTitle: {
    ...typography.bodySm,
    fontWeight: '800',
    color: '#1e40af',
  },
  expiredTitle: {
    ...typography.bodySm,
    fontWeight: '800',
    color: colors.error,
  },
  subtitle: {
    ...typography.caption,
    color: colors.gray600,
    marginTop: 2,
    fontSize: 11,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
