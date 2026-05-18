/**
 * Native date picker that produces a YYYY-MM-DD string. Uses the modal
 * variant on Android (no inline calendar UI) so it slots into the existing
 * form layout without changing visuals.
 */

import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { Icon } from '@/components/ui/Icon';
import { colors, radius, typography } from '@/theme/tokens';
import { formatDate } from '@/utils/format';

interface DateFieldProps {
  label?: string;
  value?: string; // YYYY-MM-DD
  placeholder?: string;
  onChange: (iso: string) => void;
  /** Restrict to past or future dates. */
  mode?: 'date' | 'time' | 'datetime';
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

function toIso(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function DateField({
  label,
  value,
  placeholder = 'Pick a date',
  onChange,
  mode = 'date',
  minDate,
  maxDate,
  disabled,
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const initial = value ? new Date(value) : new Date();

  function handleChange(event: DateTimePickerEvent, date?: Date) {
    // Android dismisses the picker on every interaction; close it.
    if (Platform.OS !== 'ios') setOpen(false);
    if (event.type === 'dismissed' || !date) return;
    onChange(toIso(date));
  }

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.field,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
        android_ripple={{ color: colors.gray100 }}
      >
        <Icon name="calendar" size={16} color={colors.gray500} />
        <Text style={[styles.text, !value && styles.placeholder]} numberOfLines={1}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </Pressable>

      {open ? (
        <DateTimePicker
          mode={mode}
          value={initial}
          onChange={handleChange}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      ) : null}
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
    gap: 10,
    height: 52,
    paddingHorizontal: 18,
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.55 },
  text: {
    flex: 1,
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.gray900,
  },
  placeholder: { color: colors.gray400, fontWeight: '400' },
});
