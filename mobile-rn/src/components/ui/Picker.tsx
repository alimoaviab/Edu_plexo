/**
 * Lightweight modal-based picker. Mirrors the web's `<select>` UX without
 * pulling in a native picker (which is platform-divergent and slows builds).
 *
 * Use cases: choose class/section, pick an academic year, select a subject,
 * pick a status filter.
 */

import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface PickerOption {
  label: string;
  value: string;
  description?: string;
}

interface PickerProps {
  label?: string;
  value?: string;
  placeholder?: string;
  options: PickerOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Allow clearing the selection (renders a "Clear" pill on top). */
  clearable?: boolean;
}

export function Picker({
  label,
  value,
  placeholder = 'Select…',
  options,
  onChange,
  disabled,
  clearable,
}: PickerProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.field,
          pressed && styles.fieldPressed,
          disabled && styles.fieldDisabled,
        ]}
        android_ripple={{ color: colors.gray100 }}
      >
        <Text
          style={[styles.fieldText, !selected && styles.placeholderText]}
          numberOfLines={1}
        >
          {selected?.label ?? placeholder}
        </Text>
        <Icon name="chevron-right" size={16} color={colors.gray500} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            style={styles.sheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label ?? 'Choose'}</Text>
              {clearable ? (
                <Pressable
                  onPress={() => {
                    onChange('');
                    setOpen(false);
                  }}
                  hitSlop={8}
                >
                  <Text style={styles.clearLabel}>Clear</Text>
                </Pressable>
              ) : null}
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => {
                const active = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      active && styles.optionActive,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionText, active && styles.optionTextActive]}>
                        {item.label}
                      </Text>
                      {item.description ? (
                        <Text style={styles.optionDescription}>
                          {item.description}
                        </Text>
                      ) : null}
                    </View>
                    {active ? (
                      <Icon name="check-circle" size={18} color={colors.primary} />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    ...typography.labelXs,
    color: colors.gray400,
    marginLeft: 8,
    textTransform: 'none',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 18,
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 8,
  },
  fieldPressed: { opacity: 0.85 },
  fieldDisabled: { opacity: 0.55 },
  fieldText: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.gray900,
    flex: 1,
  },
  placeholderText: { color: colors.gray400, fontWeight: '400' },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl2,
    borderTopRightRadius: radius.xl2,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  sheetHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: { ...typography.h3, color: colors.gray900 },
  clearLabel: {
    ...typography.bodyMd,
    color: colors.primary,
    fontWeight: '700',
  },
  separator: { height: 1, backgroundColor: colors.gray100, marginHorizontal: spacing.lg },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  optionActive: { backgroundColor: colors.primaryLight },
  optionPressed: { opacity: 0.7 },
  optionText: { ...typography.bodyLg, color: colors.gray800, fontWeight: '600' },
  optionTextActive: { color: colors.primary },
  optionDescription: { ...typography.bodySm, color: colors.gray500, marginTop: 2 },
});
