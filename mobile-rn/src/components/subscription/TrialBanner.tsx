import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { useSubscription } from '@/modules/subscription/useSubscription';

export function TrialBanner() {
  const { subscription, loading, isTrial, daysRemaining, isExpired } = useSubscription();

  if (loading || !subscription) return null;
  if (!isTrial && !isExpired) return null;

  return (
    <View style={[styles.container, isExpired ? styles.expiredContainer : styles.trialContainer]}>
      <View style={styles.iconBox}>
        <Icon
          name={isExpired ? 'shield' : 'sparkles'}
          size={18}
          color={isExpired ? colors.error : colors.primary}
        />
      </View>
      <View style={styles.content}>
        {isExpired ? (
          <Text style={styles.expiredTitle}>Trial Expired</Text>
        ) : (
          <Text style={styles.trialTitle}>Growth Trial Active ({daysRemaining} days remaining)</Text>
        )}
        <Text style={styles.subtitle}>
          {isExpired
            ? 'Please upgrade your plan on the web portal to unlock full access.'
            : 'You are currently on a 14-day free trial of Eduplexo Growth plan.'}
        </Text>
      </View>
    </View>
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
    gap: spacing.md,
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
    fontWeight: '700',
    color: '#1e40af',
  },
  expiredTitle: {
    ...typography.bodySm,
    fontWeight: '700',
    color: colors.error,
  },
  subtitle: {
    ...typography.labelXs,
    color: colors.gray600,
    marginTop: 2,
  },
});
