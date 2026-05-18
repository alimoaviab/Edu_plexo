/**
 * Empty / error / loading helper. Not a full state machine — screens still
 * render their own structure — just a consistent block to drop in when
 * there's nothing to show or the request failed.
 */

import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { colors, radius, spacing, typography } from '@/theme/tokens';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ icon = 'clipboard', title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconBubble}>
        <Icon name={icon} size={28} color={colors.gray400} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {action ? (
        <Pressable
          onPress={action.onPress}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          android_ripple={{ color: colors.primaryLight }}
        >
          <Text style={styles.buttonLabel}>{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconBubble, styles.errorBubble]}>
        <Icon name="shield" size={28} color={colors.error} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          android_ripple={{ color: colors.primaryLight }}
        >
          <Text style={styles.buttonLabel}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function LoadingBlock({ label }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.primary} />
      {label ? <Text style={styles.description}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBubble: { backgroundColor: colors.errorLight },
  title: {
    ...typography.h4,
    color: colors.gray900,
    textAlign: 'center',
  },
  description: {
    ...typography.bodyMd,
    color: colors.gray500,
    textAlign: 'center',
    maxWidth: 320,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
  },
  buttonLabel: {
    ...typography.bodyMd,
    color: colors.white,
    fontWeight: '700',
  },
  pressed: { opacity: 0.85 },
});
