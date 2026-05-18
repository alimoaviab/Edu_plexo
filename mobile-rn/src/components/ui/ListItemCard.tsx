import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

interface ListItemCardProps {
  title: string;
  subtitle?: string;
  meta?: string;
  icon?: IconName;
  iconColor?: string;
  iconBg?: string;
  badge?: { label: string; tone?: 'success' | 'warning' | 'error' | 'info' | 'neutral' };
  onPress?: () => void;
  onLongPress?: () => void;
  right?: React.ReactNode;
}

const toneMap = {
  success: { bg: colors.successLight, fg: colors.success },
  warning: { bg: colors.warningLight, fg: colors.warning },
  error: { bg: colors.errorLight, fg: colors.error },
  info: { bg: colors.infoLight, fg: colors.info },
  neutral: { bg: colors.gray100, fg: colors.gray700 },
} as const;

export function ListItemCard({
  title,
  subtitle,
  meta,
  icon,
  iconColor = colors.primary,
  iconBg = colors.primaryLight,
  badge,
  onPress,
  onLongPress,
  right,
}: ListItemCardProps) {
  const badgeStyle = badge ? toneMap[badge.tone ?? 'neutral'] : null;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.row, shadows.card, pressed && styles.pressed]}
      android_ripple={{ color: colors.gray100 }}
    >
      {icon ? (
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <Icon name={icon} size={20} color={iconColor} />
        </View>
      ) : null}

      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
        {meta ? (
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>

      {badge && badgeStyle ? (
        <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
          <Text style={[styles.badgeText, { color: badgeStyle.fg }]}>
            {badge.label}
          </Text>
        </View>
      ) : null}

      {right ? <View>{right}</View> : <Icon name="chevron-right" size={18} color={colors.gray400} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.95 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.bodyMd, fontWeight: '700', color: colors.gray900 },
  subtitle: { ...typography.bodySm, color: colors.gray600, marginTop: 2 },
  meta: { ...typography.bodySm, color: colors.gray400, marginTop: 4 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: {
    ...typography.bodySm,
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
