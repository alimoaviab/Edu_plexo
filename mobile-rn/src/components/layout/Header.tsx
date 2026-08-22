import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Icon } from '@/components/ui/Icon';
import { useColors } from '@/theme/ThemeContext';
import { spacing, typography } from '@/theme/tokens';

interface HeaderProps {
  greeting?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenuPress?: () => void;
}

export function Header({
  greeting,
  title,
  subtitle,
  right,
  showBack = false,
  onBack,
  showMenu = false,
  onMenuPress,
}: HeaderProps) {
  const router = useRouter();
  const colors = useColors();

  return (
    <View style={styles.row}>
      {showBack ? (
        <Pressable
          onPress={onBack ?? (() => router.back())}
          style={({ pressed }) => [
            styles.back,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            pressed && styles.pressed,
          ]}
          hitSlop={8}
        >
          <View style={styles.backIcon}>
            <Icon name="chevron-right" size={20} color={colors.textPrimary} />
          </View>
        </Pressable>
      ) : null}
      {showMenu ? (
        <Pressable
          onPress={onMenuPress}
          style={({ pressed }) => [
            styles.back,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            pressed && styles.pressed,
          ]}
          hitSlop={8}
        >
          <Icon name="menu" size={22} color={colors.textPrimary} />
        </Pressable>
      ) : null}
      <View style={styles.text}>
        {greeting ? (
          <Text style={[styles.greeting, { color: colors.textMuted }]}>
            {greeting}
          </Text>
        ) : null}
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  backIcon: { transform: [{ rotate: '180deg' }] },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  text: { flex: 1, gap: 2 },
  greeting: {
    ...typography.bodySm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    ...typography.h2,
  },
  subtitle: {
    ...typography.bodyMd,
  },
  right: { flexShrink: 0 },
});
