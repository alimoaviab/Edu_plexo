/**
 * Fees module — role-aware view.
 *
 * - Admin: dashboard stats + list of monthly fee rows. Tap a row to record a payment.
 * - Parent / Student: read-only list of charges via /api/parent/fees or /api/student/fees.
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { feeService } from '@/services';
import {
  useFeeDashboardStats,
  useStudentFees,
  useTenant,
} from '@/hooks';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { formatCurrency, formatDate, todayIso } from '@/utils/format';
import type { FeeMonthlyRow } from '@/services/types';

export default function FeesScreen() {
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  if (!isAdmin) return <StudentParentFeesView />;
  return <AdminFeesView />;
}

function AdminFeesView() {
  const stats = useFeeDashboardStats();
  const queryClient = useQueryClient();
  const router = useRouter();

  const feesQ = useQuery({
    queryKey: ['fees-monthly'],
    queryFn: async () => {
      const result = await feeService.list();
      if (!result.ok) throw new Error(result.message ?? 'Failed.');
      return result.data ?? [];
    },
    staleTime: 30_000,
  });

  const [target, setTarget] = useState<FeeMonthlyRow | null>(null);

  function refresh() {
    stats.refetch();
    feesQ.refetch();
  }

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader title="Fees" subtitle="Billing & collections" />

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <SummaryTile label="Expected" value={formatCurrency(stats.stats?.totalExpected ?? 0)} />
          <SummaryTile label="Collected" value={formatCurrency(stats.stats?.totalPaid ?? 0)} />
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
          <SummaryTile label="Pending" value={String(stats.stats?.pendingCount ?? 0)} />
          <SummaryTile label="Collected %" value={`${stats.stats?.percentage ?? 0}%`} />
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
          <Pressable
            onPress={() => router.push('/modules/fees/types' as never)}
            style={({ pressed }) => [styles.linkChip, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.linkLabel}>Fee Types</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/modules/fees/components' as never)}
            style={({ pressed }) => [styles.linkChip, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.linkLabel}>Class Components</Text>
          </Pressable>
        </View>
      </View>

      {feesQ.isError ? (
        <ErrorState message={(feesQ.error as Error)?.message ?? 'Failed.'} onRetry={() => feesQ.refetch()} />
      ) : feesQ.isLoading && !feesQ.data ? (
        <LoadingBlock />
      ) : (feesQ.data ?? []).length === 0 ? (
        <EmptyState icon="wallet" title="No fees" description="No fee records yet. Generate fees from the web admin to populate this list." />
      ) : (
        <FlatList
          data={feesQ.data ?? []}
          keyExtractor={(f, i) => f._id ?? f.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={feesQ.isFetching && !feesQ.isLoading} onRefresh={refresh} tintColor={colors.primary} />}
          renderItem={({ item }) => {
            const effective = (item.amount ?? 0) + (item.adjustment_amount ?? 0);
            const paid = item.paid_amount ?? 0;
            const pending = effective - paid;
            const tone = paid >= effective ? 'success' : pending > 0 ? 'warning' : 'neutral';
            return (
              <ListItemCard
                title={item.student_name ?? `Student ${item.student_id}`}
                subtitle={`${item.month ?? ''} ${item.year ?? ''}`.trim()}
                meta={`Due ${formatDate(item.due_date)} · ${formatCurrency(pending)} pending`}
                icon="wallet"
                badge={item.status ? { label: item.status, tone } : undefined}
                onPress={() => setTarget(item)}
              />
            );
          }}
        />
      )}

      {target ? (
        <RecordPaymentModal
          fee={target}
          onClose={() => setTarget(null)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['fees-monthly'] });
            stats.refetch();
            setTarget(null);
          }}
        />
      ) : null}
    </ScreenContainer>
  );
}

function StudentParentFeesView() {
  const { studentId } = useTenant();
  const fees = useStudentFees(studentId);

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader title="Fee Charges" subtitle="Your fees" />
      </View>
      {fees.isLoading ? (
        <LoadingBlock />
      ) : fees.items.length === 0 ? (
        <EmptyState icon="wallet" title="No fees" description="No charges have been generated yet." />
      ) : (
        <FlatList
          data={fees.items}
          keyExtractor={(f, i) => f._id ?? f.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={fees.isLoading} onRefresh={() => fees.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => {
            const effective = (item.amount ?? 0) + (item.adjustment_amount ?? 0);
            const paid = item.paid_amount ?? 0;
            const pending = effective - paid;
            const tone = paid >= effective ? 'success' : pending > 0 ? 'warning' : 'neutral';
            return (
              <ListItemCard
                title={`${item.month ?? ''} ${item.year ?? ''}`.trim() || 'Fee'}
                subtitle={`Total ${formatCurrency(effective)} · Paid ${formatCurrency(paid)}`}
                meta={`Due ${formatDate(item.due_date)} · ${formatCurrency(pending)} pending`}
                icon="wallet"
                badge={item.status ? { label: item.status, tone } : undefined}
              />
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <Card padding="md" style={{ flex: 1 }}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </Card>
  );
}

function RecordPaymentModal({
  fee,
  onClose,
  onSaved,
}: {
  fee: FeeMonthlyRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const effective = (fee.amount ?? 0) + (fee.adjustment_amount ?? 0);
  const paid = fee.paid_amount ?? 0;
  const pending = Math.max(0, effective - paid);

  const [amount, setAmount] = useState(String(pending));
  const [method, setMethod] = useState('cash');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const num = Number(amount);
    if (!num || num <= 0) {
      Alert.alert('Invalid amount', 'Enter a positive amount.');
      return;
    }
    setSaving(true);
    const result = await feeService.recordPayment(fee._id ?? fee.id ?? '', {
      amount: num,
      payment_method: method,
      payment_date: todayIso(),
      transaction_id: transactionId || undefined,
      notes: notes || undefined,
    });
    setSaving(false);
    if (!result.ok) {
      Alert.alert('Error', result.message ?? 'Payment failed.');
      return;
    }
    onSaved();
  }

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Record Payment</Text>
          <Text style={styles.sheetSub}>{fee.student_name ?? `Student ${fee.student_id}`}</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>AMOUNT</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              placeholder="Amount"
              placeholderTextColor={colors.gray400}
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>METHOD</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
              {['cash', 'bank', 'card', 'easypaisa', 'jazzcash'].map((m) => {
                const active = method === m;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setMethod(m)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{m}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>TRANSACTION ID</Text>
            <TextInput
              value={transactionId}
              onChangeText={setTransactionId}
              placeholder="Optional"
              placeholderTextColor={colors.gray400}
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>NOTES</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Optional"
              placeholderTextColor={colors.gray400}
              style={[styles.input, { height: 80 }]}
              multiline
            />
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button label="Cancel" variant="secondary" onPress={onClose} fullWidth />
            <Button
              label={saving ? 'Saving…' : `Record ${formatCurrency(Number(amount))}`}
              onPress={handleSave}
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
  summaryLabel: { ...typography.labelXs, color: colors.gray500, textTransform: 'uppercase' },
  summaryValue: { ...typography.h3, color: colors.gray900, marginTop: 2 },

  linkChip: {
    flex: 1,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: { ...typography.bodySm, color: colors.primary, fontWeight: '700' },

  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl2,
    borderTopRightRadius: radius.xl2,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sheetTitle: { ...typography.h2, color: colors.gray900 },
  sheetSub: { ...typography.bodySm, color: colors.gray500 },
  field: { gap: 6 },
  fieldLabel: { ...typography.labelXs, color: colors.gray500 },
  input: {
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...typography.bodyMd,
    color: colors.gray900,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
  },
  chipActive: { backgroundColor: colors.primaryLight },
  chipLabel: { ...typography.bodySm, color: colors.gray700, fontWeight: '700' },
  chipLabelActive: { color: colors.primary },
});
