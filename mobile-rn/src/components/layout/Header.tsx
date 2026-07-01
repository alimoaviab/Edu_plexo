import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Icon } from '@/components/ui/Icon';
import { colors, spacing, typography } from '@/theme/tokens';

interface HeaderProps {
  greeting?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export function Header({ greeting, title, subtitle, right, showBack = false, onBack }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.row}>
      {showBack ? (
        <Pressable
          onPress={onBack ?? (() => router.back())}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          hitSlop={8}
        >
          <View style={styles.backIcon}>
            <Icon name="chevron-right" size={20} color={colors.gray700} />
          </View>
        </Pressable>
      ) : null}
      <View style={styles.text}>
        {greeting ? <Text style={styles.greeting}>{greeting}</Text> : null}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  backIcon: { transform: [{ rotate: '180deg' }] },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  text: { flex: 1, gap: 2 },
  greeting: {
    ...typography.bodySm,
    color: colors.gray500,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    ...typography.h2,
    color: colors.gray900,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.gray500,
  },
  right: { flexShrink: 0 },
});
