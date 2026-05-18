import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { leaveService } from '@/services';
import { useApproveLeave, useLeave, useRejectLeave, useTenant } from '@/hooks';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { formatDate, formatDateTime } from '@/utils/format';

export default function LeaveDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const canApprove = role === 'admin' || role === 'super_admin';
  const leave = useLeave();
  const approve = useApproveLeave();
  const reject = useRejectLeave();

  const leaveQ = useQuery({
    queryKey: ['leave', id ?? ''],
    enabled: !!id,
    queryFn: async () => {
      const r = await leaveService.get(id!);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data!;
    },
  });

  const [reason, setReason] = useState('');

  if (leaveQ.isLoading) return <ScreenContainer><SectionHeader title="Leave" /><LoadingBlock /></ScreenContainer>;
  if (leaveQ.error || !leaveQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Leave" />
        <ErrorState message={(leaveQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => leaveQ.refetch()} />
      </ScreenContainer>
    );
  }

  const l = leaveQ.data;
  const tone = l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'error' : 'warning';
  const isPending = l.status === 'pending';
  const isOwner = leave.items?.some((it) => (it._id ?? it.id) === id);

  function handleDelete() {
    Alert.alert('Cancel request', 'Withdraw this leave request?', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Withdraw', style: 'destructive',
        onPress: async () => {
          try { await leave.remove(id!); router.back(); } catch (err) { Alert.alert('Error', (err as Error).message); }
        },
      },
    ]);
  }

  return (
    <ScreenContainer flush>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl3 }}>
        <View style={{ paddingHorizontal: spacing.base, gap: spacing.md }}>
          <SectionHeader
            title={l.leave_type ?? 'Leave request'}
            subtitle={`${formatDate(l.start_date)} → ${formatDate(l.end_date)}`}
          />

          <Card padding="lg">
            <Row label="Status">
              <Text style={[styles.badge, styles[`badge_${tone}`]]}>{l.status}</Text>
            </Row>
            <Row label="Requester type" value={l.requester_type ?? '—'} />
            <Row label="Requester" value={l.requester_id ?? '—'} />
            <Row label="Submitted" value={formatDateTime(l.created_at)} />
            <Row label="Reason">
              <Text style={styles.reasonText}>{l.reason ?? '—'}</Text>
            </Row>
            {l.rejection_reason ? (
              <Row label="Rejection reason">
                <Text style={styles.reasonText}>{l.rejection_reason}</Text>
              </Row>
            ) : null}
          </Card>

          {canApprove && isPending ? (
            <Card padding="lg">
              <Text style={styles.sectionTitle}>Decision</Text>
              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="Optional rejection reason"
                placeholderTextColor={colors.gray400}
                style={styles.input}
                multiline
                numberOfLines={3}
              />
              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
                <Button
                  label="Reject"
                  variant="danger"
                  onPress={() => {
                    reject.mutateAsync({ id: id!, reason: reason.trim() || 'Rejected' })
                      .then(() => Alert.alert('Rejected', 'Leave request rejected.'))
                      .catch((err) => Alert.alert('Error', err.message));
                  }}
                  fullWidth
                />
                <Button
                  label="Approve"
                  onPress={() => {
                    approve.mutateAsync(id!)
                      .then(() => Alert.alert('Approved', 'Leave request approved.'))
                      .catch((err) => Alert.alert('Error', err.message));
                  }}
                  fullWidth
                />
              </View>
            </Card>
          ) : null}

          {!canApprove && isPending && isOwner ? (
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
            >
              <Text style={styles.deleteText}>Withdraw request</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        {children ?? <Text style={styles.rowValue}>{value}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.gray100, gap: spacing.md },
  rowLabel: { ...typography.bodySm, color: colors.gray500, fontWeight: '600' },
  rowValue: { ...typography.bodyMd, color: colors.gray900, fontWeight: '600' },
  reasonText: { ...typography.bodyMd, color: colors.gray800, textAlign: 'right' },
  sectionTitle: { ...typography.h4, color: colors.gray900, marginBottom: spacing.sm },
  input: {
    minHeight: 80,
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    padding: 14,
    color: colors.gray900,
    ...typography.bodyMd,
  },
  badge: {
    ...typography.labelXs,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  badge_success: { backgroundColor: colors.successLight, color: colors.success },
  badge_warning: { backgroundColor: colors.warningLight, color: colors.warning },
  badge_error: { backgroundColor: colors.errorLight, color: colors.error },
  badge_neutral: { backgroundColor: colors.gray100, color: colors.gray700 },
  deleteBtn: {
    padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.errorLight,
    backgroundColor: colors.white, alignItems: 'center',
  },
  deleteText: { ...typography.bodyMd, color: colors.error, fontWeight: '700' },
  pressed: { opacity: 0.85 },
});
