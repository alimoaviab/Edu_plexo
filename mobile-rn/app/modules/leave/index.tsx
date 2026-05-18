import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useApproveLeave, useLeave, useRejectLeave, useTenant } from '@/hooks';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatDate } from '@/utils/format';

export default function LeaveList() {
  const router = useRouter();
  const { role } = useTenant();
  const canApprove = role === 'admin' || role === 'super_admin';
  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';

  const requesterType = isTeacher ? 'teacher' : isStudent ? 'student' : undefined;
  const leave = useLeave(requesterType);
  const approve = useApproveLeave();
  const reject = useRejectLeave();
  const items = leave.items ?? [];

  function handleApprove(id: string) {
    approve.mutateAsync(id).catch((err) => Alert.alert('Error', err.message));
  }

  function handleReject(id: string) {
    Alert.alert('Reject leave', 'This will mark the request as rejected.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () =>
          reject.mutateAsync({ id, reason: 'Rejected by admin' }).catch((err) => Alert.alert('Error', err.message)),
      },
    ]);
  }

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title={canApprove ? 'Leave Approvals' : 'Leave Requests'}
          subtitle={leave.isLoading ? 'Loading…' : `${items.length} request${items.length === 1 ? '' : 's'}`}
          right={
            !canApprove ? (
              <Pressable
                onPress={() => router.push('/modules/leave/new' as never)}
                style={({ pressed }) => [{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.85 }]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
      </View>
      {leave.isError ? (
        <ErrorState message={leave.error?.message ?? 'Failed.'} onRetry={() => leave.refetch()} />
      ) : leave.isLoading && !leave.items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState
          icon="clock"
          title="No leave requests"
          description={canApprove ? 'There are no pending requests.' : 'Apply for leave when you need time off.'}
          action={!canApprove ? { label: 'Apply for leave', onPress: () => router.push('/modules/leave/new' as never) } : undefined}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(l, i) => l._id ?? l.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={leave.isFetching && !leave.isLoading} onRefresh={() => leave.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => {
            const tone =
              item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'error' : 'warning';
            const isPending = item.status === 'pending';
            return (
              <View style={{ gap: 8 }}>
                <ListItemCard
                  title={item.leave_type ?? 'Leave'}
                  subtitle={item.reason}
                  meta={`${formatDate(item.start_date)} → ${formatDate(item.end_date)}${item.requester_type ? ' · ' + item.requester_type : ''}`}
                  icon="clock"
                  badge={item.status ? { label: item.status, tone } : undefined}
                  onPress={() => router.push(`/modules/leave/${encodeURIComponent(item._id ?? item.id ?? '')}` as never)}
                />
                {canApprove && isPending ? (
                  <View style={styles.actions}>
                    <Pressable
                      onPress={() => handleApprove(item._id ?? item.id ?? '')}
                      style={({ pressed }) => [styles.approveBtn, pressed && styles.pressed]}
                    >
                      <Icon name="check-circle" size={16} color={colors.success} />
                      <View style={{ width: 6 }} />
                    </Pressable>
                    <Pressable
                      onPress={() => handleReject(item._id ?? item.id ?? '')}
                      style={({ pressed }) => [styles.rejectBtn, pressed && styles.pressed]}
                    >
                      <Icon name="logout" size={16} color={colors.error} />
                    </Pressable>
                  </View>
                ) : null}
              </View>
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: 8 },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.successLight,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.errorLight,
  },
  pressed: { opacity: 0.85 },
});
