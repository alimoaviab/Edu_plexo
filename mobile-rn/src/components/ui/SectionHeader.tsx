import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Icon } from '@/components/ui/Icon';
import { colors, radius, spacing, typography } from '@/theme/tokens';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

/**
 * Page header used by the deep module screens. Follows the same visual
 * language as `Header` but adds a back affordance for stack navigation.
 */
export function SectionHeader({ title, subtitle, showBack = true, right }: SectionHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}
            hitSlop={12}
          >
            <Icon name="arrow-right" size={18} color={colors.gray700} />
          </Pressable>
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  back: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '180deg' }],
  },
  title: { ...typography.h2, color: colors.gray900 },
  subtitle: { ...typography.bodySm, color: colors.gray500, marginTop: 2 },
  pressed: { opacity: 0.6 },
});
