import { Alert, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useEvents, useTenant } from '@/hooks';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatDate, formatDateTime } from '@/utils/format';

export default function EventsList() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin';
  const events = useEvents();
  const items = events.items ?? [];

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Events"
          subtitle={events.isLoading ? 'Loading…' : `${items.length} event${items.length === 1 ? '' : 's'}`}
          right={
            canEdit ? (
              <Pressable
                onPress={() => router.push('/modules/events/new' as never)}
                style={({ pressed }) => [{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.85 }]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
      </View>
      {events.isError ? (
        <ErrorState message={events.error?.message ?? 'Failed.'} onRetry={() => events.refetch()} />
      ) : events.isLoading && !events.items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No events"
          description={canEdit ? 'Schedule the first event.' : 'No events yet.'}
          action={canEdit ? { label: 'New event', onPress: () => router.push('/modules/events/new' as never) } : undefined}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(e, i) => e._id ?? e.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={events.isFetching && !events.isLoading} onRefresh={() => events.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <ListItemCard
              title={item.title}
              subtitle={item.description}
              meta={`${formatDate(item.start_date)} ${item.location ? '· ' + item.location : ''}`}
              icon="calendar"
              badge={item.event_type ? { label: item.event_type, tone: 'info' } : undefined}
              onPress={() => router.push(`/modules/events/${encodeURIComponent(item._id ?? item.id ?? '')}` as never)}
              onLongPress={
                canEdit
                  ? () =>
                      Alert.alert('Delete event', 'Remove this event?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await events.remove(item._id ?? item.id ?? '');
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
