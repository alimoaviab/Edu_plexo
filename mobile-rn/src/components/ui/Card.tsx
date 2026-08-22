import { StyleSheet, View, type ViewProps } from 'react-native';

import { useColors } from '@/theme/ThemeContext';
import { radius, shadows, spacing } from '@/theme/tokens';

interface CardProps extends ViewProps {
  variant?: 'default' | 'flat';
  padding?: keyof typeof spacing;
}

export function Card({
  variant = 'default',
  padding = 'lg',
  style,
  children,
  ...rest
}: CardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          padding: spacing[padding],
        },
        variant === 'default' && shadows.card,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
  },
});
