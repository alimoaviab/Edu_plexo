import { Alert, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useBehavior, useTenant } from '@/hooks';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatDate } from '@/utils/format';

export default function BehaviorList() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const behavior = useBehavior();
  const items = behavior.items ?? [];

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Student Behavior"
          subtitle={behavior.isLoading ? 'Loading…' : `${items.length} note${items.length === 1 ? '' : 's'}`}
          right={
            canEdit ? (
              <Pressable
                onPress={() => router.push('/modules/behavior/new' as never)}
                style={({ pressed }) => [{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.85 }]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
      </View>
      {behavior.isError ? (
        <ErrorState message={behavior.error?.message ?? 'Failed.'} onRetry={() => behavior.refetch()} />
      ) : behavior.isLoading && !behavior.items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState
          icon="shield"
          title="No behavior notes"
          description={canEdit ? 'Add the first behavior note.' : 'No notes recorded yet.'}
          action={canEdit ? { label: 'Add note', onPress: () => router.push('/modules/behavior/new' as never) } : undefined}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(b, i) => b._id ?? b.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={behavior.isFetching && !behavior.isLoading} onRefresh={() => behavior.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <ListItemCard
              title={item.category ?? item.notes ?? 'Behavior note'}
              subtitle={item.notes}
              meta={`${formatDate(item.occurrence_date ?? item.created_at)}${item.severity ? ' · ' + item.severity : ''}`}
              icon="shield"
              badge={
                item.type
                  ? {
                      label: item.type,
                      tone: item.type === 'positive' ? 'success' : item.type === 'negative' ? 'error' : 'neutral',
                    }
                  : undefined
              }
              onPress={() => router.push(`/modules/behavior/${encodeURIComponent(item._id ?? item.id ?? '')}` as never)}
              onLongPress={
                canEdit
                  ? () =>
                      Alert.alert('Delete note', 'Remove this behavior note?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await behavior.remove(item._id ?? item.id ?? '');
                            } catch (err) {
                              Alert.alert('Error', (err as Error).message);
                            }
                          },
                        },
                      ])
                  : undefined
              }
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}
