/**
 * Time picker that produces a 24h `HH:mm` string — matches the timetable
 * + live class endpoint contract on the backend.
 */

import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { Icon } from '@/components/ui/Icon';
import { colors, radius, typography } from '@/theme/tokens';

interface TimeFieldProps {
  label?: string;
  value?: string; // HH:mm
  placeholder?: string;
  onChange: (hhmm: string) => void;
  disabled?: boolean;
}

function toHHMM(d: Date): string {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function fromHHMM(value: string | undefined): Date {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return new Date();
  const [h, m] = value.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function TimeField({
  label,
  value,
  placeholder = 'Pick a time',
  onChange,
  disabled,
}: TimeFieldProps) {
  const [open, setOpen] = useState(false);

  function handleChange(event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS !== 'ios') setOpen(false);
    if (event.type === 'dismissed' || !date) return;
    onChange(toHHMM(date));
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
        <Icon name="clock" size={16} color={colors.gray500} />
        <Text style={[styles.text, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
      </Pressable>
      {open ? (
        <DateTimePicker
          mode="time"
          value={fromHHMM(value)}
          onChange={handleChange}
          is24Hour
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
