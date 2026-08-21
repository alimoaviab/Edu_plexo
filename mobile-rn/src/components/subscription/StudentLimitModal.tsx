import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Icon } from '@/components/ui/Icon';
import { useAuthStore } from '@/store/auth-store';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

interface StudentLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCount?: number;
  limit?: number;
  planName?: string;
}

export function StudentLimitModal({
  isOpen,
  onClose,
  currentCount,
  limit,
  planName,
}: StudentLimitModalProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isOwner = user?.role === 'owner';

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    if (isOwner) {
      router.push('/(owner)/subscription' as never);
    } else {
      router.push('/(admin)/subscription' as never);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.modalCard, shadows.card]}>
          {/* Icon */}
          <View style={styles.iconCircle}>
            <Icon name="alert-triangle" size={32} color={colors.error} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Student Limit Reached</Text>

          {/* Description */}
          <Text style={styles.description}>
            {isOwner
              ? 'You have reached your subscription student limit. Please upgrade your plan to add more students.'
              : 'Your school has reached its subscription student limit. Please contact your School Owner to upgrade the subscription plan to add more students.'}
          </Text>

          {/* Usage Stats Box */}
          {currentCount !== undefined && limit !== undefined ? (
            <View style={styles.statsBox}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Current Students</Text>
                <Text style={styles.statValue}>{currentCount}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Plan Limit</Text>
                <Text style={styles.statValue}>{limit}</Text>
              </View>
              {planName ? (
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Current Plan</Text>
                  <Text style={styles.planBadge}>{planName}</Text>
                </View>
              ) : null}
              {/* Progress bar */}
              <View style={styles.barTrack}>
                <View style={styles.barFill} />
              </View>
            </View>
          ) : null}

          {/* Actions */}
          <View style={styles.actions}>
            {isOwner ? (
              <Pressable
                onPress={handleUpgrade}
                style={({ pressed }) => [styles.btnUpgrade, pressed && styles.pressed]}
              >
                <Text style={styles.btnUpgradeText}>Upgrade Plan</Text>
              </Pressable>
            ) : (
              <View style={styles.noticeBox}>
                <Text style={styles.noticeText}>
                  Contact your School Owner to increase student quota.
                </Text>
              </View>
            )}

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.btnClose, pressed && styles.pressed]}
            >
              <Text style={styles.btnCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.white,
    borderRadius: radius.xl2,
    padding: spacing.lg,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.gray900,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    ...typography.bodySm,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  statsBox: {
    width: '100%',
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 8,
    marginBottom: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    ...typography.caption,
    color: colors.gray500,
    fontWeight: '600',
  },
  statValue: {
    ...typography.bodySm,
    color: colors.gray900,
    fontWeight: '800',
  },
  planBadge: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  barTrack: {
    height: 6,
    backgroundColor: colors.gray200,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginTop: 4,
  },
  barFill: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.error,
    borderRadius: radius.full,
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
  },
  btnUpgrade: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnUpgradeText: {
    ...typography.bodySm,
    color: colors.white,
    fontWeight: '800',
  },
  noticeBox: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fef3c7',
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  noticeText: {
    ...typography.caption,
    color: '#92400e',
    fontWeight: '700',
    textAlign: 'center',
  },
  btnClose: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnCloseText: {
    ...typography.bodySm,
    color: colors.gray500,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});
