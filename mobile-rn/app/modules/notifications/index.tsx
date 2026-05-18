import { FlatList, Pressable, RefreshControl, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useNotifications } from '@/hooks';
import { colors, spacing } from '@/theme/tokens';
import { formatDateTime } from '@/utils/format';

export default function NotificationsScreen() {
  const notifs = useNotifications();
  const items = notifs.items ?? [];

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Notifications"
          subtitle={`${notifs.unreadCount} unread`}
        />
      </View>
      {notifs.isLoading && !items.length ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState icon="bell" title="All caught up" description="No notifications right now." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(n, i) => n._id ?? n.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={notifs.isFetching} onRefresh={() => notifs.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                if (!item.read) notifs.markRead(item._id ?? item.id ?? '');
              }}
            >
              <ListItemCard
                title={item.title ?? item.type ?? 'Notification'}
                subtitle={item.body}
                meta={formatDateTime(item.created_at)}
                icon="bell"
                badge={item.read ? undefined : { label: 'New', tone: 'info' }}
              />
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
}
