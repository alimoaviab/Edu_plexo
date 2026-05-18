import { Alert, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useLiveClasses, useTenant } from '@/hooks';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatDateTime } from '@/utils/format';

export default function LiveClassesList() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const live = useLiveClasses();
  const items = live.items ?? [];

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Live Classes"
          subtitle={live.isLoading ? 'Loading…' : `${items.length} session${items.length === 1 ? '' : 's'}`}
          right={
            canEdit ? (
              <Pressable
                onPress={() => router.push('/modules/live-classes/new' as never)}
                style={({ pressed }) => [{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.85 }]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
      </View>
      {live.isError ? (
        <ErrorState message={live.error?.message ?? 'Failed.'} onRetry={() => live.refetch()} />
      ) : live.isLoading && !live.items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState
          icon="video"
          title="No live classes"
          description={canEdit ? 'Schedule the first session.' : 'No upcoming sessions.'}
          action={canEdit ? { label: 'Schedule', onPress: () => router.push('/modules/live-classes/new' as never) } : undefined}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(l, i) => l._id ?? l.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={live.isFetching && !live.isLoading} onRefresh={() => live.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <ListItemCard
              title={item.title}
              subtitle={item.description}
              meta={formatDateTime(item.scheduled_at)}
              icon="video"
              badge={item.status ? { label: item.status, tone: item.status === 'live' ? 'success' : 'info' } : undefined}
              onPress={() => router.push(`/modules/live-classes/${encodeURIComponent(item._id ?? item.id ?? '')}` as never)}
              onLongPress={
                canEdit
                  ? () =>
                      Alert.alert('Delete session', 'Remove this session?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await live.remove(item._id ?? item.id ?? '');
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
