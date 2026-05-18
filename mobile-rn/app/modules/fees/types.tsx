/**
 * Fee Types — admin-only catalog of charge categories (Tuition, Bus, Lab,
 * etc.) that get attached to classes via the Class Fee Components manager.
 */

import { useState } from 'react';
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
import { SectionHeader } from '@/components/ui/SectionHeader';
import { feeService } from '@/services';
import { useTenant } from '@/hooks';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export default function FeeTypesScreen() {
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const typesQ = useQuery({
    queryKey: ['fee-types'],
    queryFn: async () => {
      const r = await feeService.types();
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: { name: string; code?: string; is_recurring?: boolean }) => {
      const r = await feeService.createType(input);
      if (!r.ok) throw new Error(r.message ?? 'Create failed.');
      return r.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fee-types'] }),
  });

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Fee Types"
          subtitle="Catalog of charges"
          right={
            isAdmin ? (
              <Pressable
                onPress={() => setShowForm(true)}
                style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
      </View>
      {typesQ.isError ? (
        <ErrorState message={(typesQ.error as Error)?.message ?? 'Failed.'} onRetry={() => typesQ.refetch()} />
      ) : typesQ.isLoading && !typesQ.data ? (
        <LoadingBlock />
      ) : (typesQ.data ?? []).length === 0 ? (
        <EmptyState
          icon="wallet"
          title="No fee types"
          description={isAdmin ? 'Add categories like Tuition, Bus, Lab.' : 'No types defined.'}
          action={isAdmin ? { label: 'Add type', onPress: () => setShowForm(true) } : undefined}
        />
      ) : (
        <FlatList
          data={typesQ.data ?? []}
          keyExtractor={(t, i) => t._id ?? t.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={typesQ.isFetching && !typesQ.isLoading} onRefresh={() => typesQ.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <ListItemCard
              title={item.name}
              subtitle={item.code ?? item.description ?? ''}
              icon="wallet"
              badge={item.is_recurring ? { label: 'Recurring', tone: 'info' } : undefined}
            />
          )}
        />
      )}

      {showForm ? (
        <NewTypeModal
          onClose={() => setShowForm(false)}
          onSave={async (input) => {
            try {
              await createMutation.mutateAsync(input);
              setShowForm(false);
            } catch (err) {
              Alert.alert('Error', (err as Error).message);
            }
          }}
        />
      ) : null}
    </ScreenContainer>
  );
}

function NewTypeModal({
  onClose, onSave,
}: { onClose: () => void; onSave: (i: { name: string; code?: string; is_recurring?: boolean }) => Promise<void> }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [recurring, setRecurring] = useState(true);
  const [saving, setSaving] = useState(false);

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>New fee type</Text>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>NAME</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Tuition" placeholderTextColor={colors.gray400} style={styles.input} />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>CODE</Text>
            <TextInput value={code} onChangeText={setCode} placeholder="TUI" placeholderTextColor={colors.gray400} style={styles.input} autoCapitalize="characters" />
          </View>
          <Pressable
            onPress={() => setRecurring((v) => !v)}
            style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
          >
            <Text style={styles.toggleLabel}>Recurring monthly</Text>
            <View style={[styles.toggleDot, recurring && styles.toggleDotActive]} />
          </Pressable>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button label="Cancel" variant="secondary" onPress={onClose} fullWidth />
            <Button
              label={saving ? 'Saving…' : 'Create'}
              onPress={async () => {
                if (!name.trim()) {
                  Alert.alert('Required', 'Name is required.');
                  return;
                }
                setSaving(true);
                await onSave({ name: name.trim(), code: code.trim() || undefined, is_recurring: recurring });
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
  toggleDot: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.gray300,
  },
  toggleDotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pressed: { opacity: 0.85 },
});
