/**
 * Class Fee Components manager — pick a class, see its monthly fee
 * components (Tuition, Bus, Lab, etc.), add or toggle on/off, delete.
 */

import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { Picker } from '@/components/ui/Picker';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { feeService } from '@/services';
import { useClasses, useTenant } from '@/hooks';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { formatCurrency } from '@/utils/format';

export default function ClassFeeComponents() {
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const queryClient = useQueryClient();

  const classesQ = useClasses();
  const [classId, setClassId] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const classOptions = useMemo(
    () =>
      (classesQ.items?.data ?? []).map((c) => ({
        label: [c.name, c.section].filter(Boolean).join(' — '),
        value: c._id ?? c.id ?? '',
      })),
    [classesQ.items],
  );

  const componentsQ = useQuery({
    queryKey: ['class-fees', classId],
    enabled: !!classId,
    queryFn: async () => {
      const r = await feeService.classFees(classId);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data ?? [];
    },
  });

  const typesQ = useQuery({
    queryKey: ['fee-types'],
    queryFn: async () => {
      const r = await feeService.types();
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data ?? [];
    },
  });

  const toggle = useMutation({
    mutationFn: async (feeId: string) => {
      const r = await feeService.toggleClassFee(classId, feeId);
      if (!r.ok) throw new Error(r.message ?? 'Toggle failed.');
      return r.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['class-fees', classId] }),
  });

  const remove = useMutation({
    mutationFn: async (feeId: string) => {
      const r = await feeService.deleteClassFee(classId, feeId);
      if (!r.ok) throw new Error(r.message ?? 'Delete failed.');
      return r.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['class-fees', classId] }),
  });

  const add = useMutation({
    mutationFn: async (input: { fee_type_id: string; amount: number; is_optional?: boolean }) => {
      const r = await feeService.addClassFee(classId, input);
      if (!r.ok) throw new Error(r.message ?? 'Add failed.');
      return r.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['class-fees', classId] }),
  });

  if (!isAdmin) return <ScreenContainer><SectionHeader title="Fee Components" subtitle="Admin only" /></ScreenContainer>;

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Class Fee Components"
          subtitle="Configure monthly charges per class"
          right={
            classId ? (
              <Pressable
                onPress={() => setShowAdd(true)}
                style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
        <Picker
          label="Class"
          value={classId}
          onChange={setClassId}
          options={classOptions}
          placeholder="Pick a class"
        />
      </View>

      {!classId ? (
        <EmptyState icon="wallet" title="Pick a class" description="Choose a class to view its fee components." />
      ) : componentsQ.isError ? (
        <ErrorState message={(componentsQ.error as Error)?.message ?? 'Failed.'} onRetry={() => componentsQ.refetch()} />
      ) : componentsQ.isLoading && !componentsQ.data ? (
        <LoadingBlock />
      ) : (componentsQ.data ?? []).length === 0 ? (
        <EmptyState
          icon="wallet"
          title="No components"
          description="Add a fee type and amount to get started."
          action={{ label: 'Add component', onPress: () => setShowAdd(true) }}
        />
      ) : (
        <FlatList
          data={componentsQ.data ?? []}
          keyExtractor={(c, i) => c._id ?? c.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={componentsQ.isFetching && !componentsQ.isLoading} onRefresh={() => componentsQ.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => {
            const inactive = item.is_active === false;
            return (
              <ListItemCard
                title={item.fee_type_name ?? 'Fee'}
                subtitle={formatCurrency(item.amount, item.currency)}
                icon="wallet"
                badge={
                  inactive
                    ? { label: 'Inactive', tone: 'neutral' }
                    : item.is_optional
                      ? { label: 'Optional', tone: 'info' }
                      : { label: 'Active', tone: 'success' }
                }
                onPress={() => toggle.mutate(item._id ?? item.id ?? '')}
                onLongPress={() =>
                  Alert.alert('Remove component', 'Remove this fee component?', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Remove', style: 'destructive',
                      onPress: () => remove.mutate(item._id ?? item.id ?? ''),
                    },
                  ])
                }
              />
            );
          }}
        />
      )}

      {showAdd ? (
        <AddComponentModal
          types={typesQ.data ?? []}
          onClose={() => setShowAdd(false)}
          onSave={async (input) => {
            try {
              await add.mutateAsync(input);
              setShowAdd(false);
            } catch (err) {
              Alert.alert('Error', (err as Error).message);
            }
          }}
        />
      ) : null}
    </ScreenContainer>
  );
}

function AddComponentModal({
  types, onClose, onSave,
}: {
  types: Array<{ _id?: string; id?: string; name: string }>;
  onClose: () => void;
  onSave: (input: { fee_type_id: string; amount: number; is_optional?: boolean }) => Promise<void>;
}) {
  const [feeTypeId, setFeeTypeId] = useState('');
  const [amount, setAmount] = useState('');
  const [optional, setOptional] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Add fee component</Text>
          <Picker
            label="Fee type"
            value={feeTypeId}
            onChange={setFeeTypeId}
            options={types.map((t) => ({ label: t.name, value: t._id ?? t.id ?? '' }))}
            placeholder="Pick a type"
          />
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>AMOUNT</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={colors.gray400}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>
          <Pressable
            onPress={() => setOptional((v) => !v)}
            style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
          >
            <Text style={styles.toggleLabel}>Optional</Text>
            <View style={[styles.toggleDot, optional && styles.toggleDotActive]} />
          </Pressable>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button label="Cancel" variant="secondary" onPress={onClose} fullWidth />
            <Button
              label={saving ? 'Saving…' : 'Add'}
              onPress={async () => {
                const num = Number(amount);
                if (!feeTypeId) {
                  Alert.alert('Required', 'Pick a fee type.');
                  return;
                }
                if (!num || num <= 0) {
                  Alert.alert('Invalid amount', 'Enter a positive number.');
                  return;
                }
                setSaving(true);
                await onSave({ fee_type_id: feeTypeId, amount: num, is_optional: optional });
                setSaving(false);
              }}
              loading={saving}
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white, borderTopLeftRadius: radius.xl2, borderTopRightRadius: radius.xl2,
    padding: spacing.lg, gap: spacing.md,
  },
  sheetTitle: { ...typography.h2, color: colors.gray900 },
  field: { gap: 6 },
  fieldLabel: { ...typography.labelXs, color: colors.gray500 },
  input: {
    backgroundColor: colors.gray50, borderRadius: radius.lg, paddingHorizontal: 14,
    paddingVertical: 12, ...typography.bodyMd, color: colors.gray900,
  },
  toggle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.gray50, borderRadius: radius.lg, paddingHorizontal: 14, height: 52,
  },
  toggleLabel: { ...typography.bodyMd, color: colors.gray800, fontWeight: '600' },
  toggleDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.gray300 },
  toggleDotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pressed: { opacity: 0.85 },
});
