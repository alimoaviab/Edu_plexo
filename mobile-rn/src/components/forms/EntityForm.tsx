/**
 * Generic entity form scaffold. The screen passes a list of field
 * descriptors and the form renders the right input. Avoids boilerplate
 * duplication across 15+ create/edit screens.
 */

import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { DateField } from '@/components/ui/DateField';
import { Input } from '@/components/ui/Input';
import { Picker, type PickerOption } from '@/components/ui/Picker';
import { TimeField } from '@/components/ui/TimeField';
import { colors, spacing, typography } from '@/theme/tokens';

export type FieldType = 'text' | 'multiline' | 'number' | 'email' | 'phone' | 'date' | 'time' | 'password' | 'select' | 'switch';

export interface FieldDescriptor {
  key: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  options?: PickerOption[];
  required?: boolean;
  helper?: string;
  /** When `select` is multi, store as `string[]` and select multiple. (Not impl here — single only.) */
  disabled?: boolean;
}

export interface EntityFormProps<T extends Record<string, unknown>> {
  fields: FieldDescriptor[];
  initial?: Partial<T>;
  submitLabel: string;
  cancelLabel?: string;
  onSubmit: (values: Partial<T>) => Promise<void> | void;
  onCancel?: () => void;
  loading?: boolean;
  errorMessage?: string | null;
  extra?: React.ReactNode;
}

export function EntityForm<T extends Record<string, unknown>>({
  fields,
  initial,
  submitLabel,
  cancelLabel = 'Cancel',
  onSubmit,
  onCancel,
  loading,
  errorMessage,
  extra,
}: EntityFormProps<T>) {
  const [values, setValues] = useState<Record<string, unknown>>(
    () => ({ ...(initial ?? {}) }),
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function setField(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): { ok: boolean; firstMissing?: string } {
    for (const f of fields) {
      if (f.required) {
        const v = values[f.key];
        if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
          return { ok: false, firstMissing: f.label };
        }
      }
    }
    return { ok: true };
  }

  async function handleSubmit() {
    const v = validate();
    if (!v.ok) {
      const missing: Record<string, boolean> = {};
      for (const f of fields) if (f.required) missing[f.key] = true;
      setTouched(missing);
      return;
    }
    await onSubmit(values as Partial<T>);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fields}>
          {fields.map((f) => (
            <FormField
              key={f.key}
              field={f}
              value={values[f.key]}
              onChange={(v) => setField(f.key, v)}
              showError={touched[f.key]}
            />
          ))}
        </View>

        {extra}

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          {onCancel ? (
            <Button
              label={cancelLabel}
              onPress={onCancel}
              variant="secondary"
              fullWidth
            />
          ) : null}
          <Button
            label={loading ? 'Saving…' : submitLabel}
            onPress={handleSubmit}
            loading={loading}
            size="lg"
            fullWidth
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface FormFieldProps {
  field: FieldDescriptor;
  value: unknown;
  onChange: (value: unknown) => void;
  showError?: boolean;
}

function FormField({ field, value, onChange, showError }: FormFieldProps) {
  const error = showError && field.required && !value ? `${field.label} is required` : undefined;

  if (field.type === 'select') {
    return (
      <Picker
        label={field.label}
        value={typeof value === 'string' ? value : ''}
        placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`}
        options={field.options ?? []}
        onChange={(v) => onChange(v)}
        disabled={field.disabled}
        clearable={!field.required}
      />
    );
  }

  if (field.type === 'switch') {
    return (
      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>{field.label}</Text>
          {field.helper ? <Text style={styles.helper}>{field.helper}</Text> : null}
        </View>
        <Switch
          value={!!value}
          onValueChange={(v) => onChange(v)}
          disabled={field.disabled}
        />
      </View>
    );
  }

  if (field.type === 'date') {
    return (
      <DateField
        label={field.label}
        value={typeof value === 'string' ? value : ''}
        placeholder={field.placeholder}
        onChange={(iso) => onChange(iso)}
        disabled={field.disabled}
      />
    );
  }

  if (field.type === 'time') {
    return (
      <TimeField
        label={field.label}
        value={typeof value === 'string' ? value : ''}
        placeholder={field.placeholder}
        onChange={(hhmm) => onChange(hhmm)}
        disabled={field.disabled}
      />
    );
  }

  if (field.type === 'multiline') {
    return (
    <Input
      label={field.label}
      placeholder={field.placeholder ?? ''}
      value={typeof value === 'string' ? value : ''}
      onChangeText={(t) => onChange(t)}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      error={error}
    />
  );
  }

  const isPassword = field.type === 'password';
  const keyboardType =
    field.type === 'number'
      ? 'number-pad'
      : field.type === 'email'
        ? 'email-address'
        : field.type === 'phone'
          ? 'phone-pad'
          : 'default';

  return (
    <Input
      label={field.label}
      placeholder={field.placeholder ?? field.label}
      value={typeof value === 'string' ? value : value != null ? String(value) : ''}
      onChangeText={(t) => onChange(field.type === 'number' ? Number(t) || 0 : t)}
      keyboardType={keyboardType}
      autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
      passwordToggle={isPassword}
      editable={!field.disabled}
      error={error}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingBottom: spacing.xl3 },
  fields: { gap: spacing.md, paddingHorizontal: spacing.base, paddingTop: spacing.sm },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
  },
  errorBox: {
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.errorLight,
    borderRadius: 12,
  },
  errorText: { ...typography.bodySm, color: colors.error, fontWeight: '700' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: 8,
    gap: spacing.md,
  },
  switchLabel: { ...typography.bodyMd, color: colors.gray900, fontWeight: '600' },
  helper: { ...typography.bodySm, color: colors.gray500, marginTop: 2 },
});
