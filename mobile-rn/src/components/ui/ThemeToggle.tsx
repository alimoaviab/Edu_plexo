import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useTheme, type Theme } from '@/theme/ThemeContext';
import { Icon } from '@/components/ui/Icon';
import { radius, spacing, typography } from '@/theme/tokens';

interface ThemeToggleProps {
  variant?: 'button' | 'segmented';
  showLabel?: boolean;
  style?: ViewStyle;
}

const themeOptions: Array<{
  value: Theme;
  label: string;
  icon: 'sun' | 'moon' | 'laptop';
}> = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'Auto', icon: 'laptop' },
];

export function ThemeToggle({
  variant = 'button',
  showLabel = false,
  style,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, isDark, setTheme, toggleTheme } = useTheme();
  const { colors } = useTheme();

  if (variant === 'segmented') {
    return (
      <View
        style={[
          styles.segmentedContainer,
          {
            backgroundColor: colors.surfaceMuted,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        {themeOptions.map((opt) => {
          const isSelected = theme === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => setTheme(opt.value)}
              style={({ pressed }) => [
                styles.segmentItem,
                isSelected && [
                  styles.segmentItemSelected,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ],
                pressed && { opacity: 0.7 },
              ]}
            >
              <Icon
                name={opt.icon}
                size={16}
                color={
                  isSelected
                    ? opt.icon === 'sun'
                      ? '#F59E0B'
                      : colors.primary
                    : colors.textMuted
                }
              />
              {showLabel ? (
                <Text
                  style={[
                    styles.segmentLabel,
                    {
                      color: isSelected ? colors.textPrimary : colors.textMuted,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    );
  }

  // 1-Click Interactive Toggle Button
  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel={`Current theme: ${resolvedTheme}. Tap to switch to ${isDark ? 'light' : 'dark'} mode.`}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isDark ? colors.surfaceMuted : colors.surface,
          borderColor: colors.border,
        },
        pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
        style,
      ]}
    >
      <Icon
        name={isDark ? 'sun' : 'moon'}
        size={18}
        color={isDark ? '#F59E0B' : colors.textPrimary}
      />
      {showLabel ? (
        <Text
          style={[
            styles.buttonLabel,
            { color: colors.textPrimary },
          ]}
        >
          {isDark ? 'Dark' : 'Light'}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  buttonLabel: {
    ...typography.label,
  },
  segmentedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  segmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  segmentItemSelected: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentLabel: {
    ...typography.caption,
  },
});
