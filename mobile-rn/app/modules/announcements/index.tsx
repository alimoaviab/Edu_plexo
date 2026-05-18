import { Alert, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useAnnouncements, useTenant } from '@/hooks';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatDateTime } from '@/utils/format';

export default function AnnouncementsList() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const announcements = useAnnouncements();
  const items = announcements.items ?? [];

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Announcements"
          subtitle={announcements.isLoading ? 'Loading…' : `${items.length} announcement${items.length === 1 ? '' : 's'}`}
          right={
            canEdit ? (
              <Pressable
                onPress={() => router.push('/modules/announcements/new' as never)}
                style={({ pressed }) => [{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.85 }]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
      </View>
      {announcements.isError ? (
        <ErrorState message={announcements.error?.message ?? 'Failed.'} onRetry={() => announcements.refetch()} />
      ) : announcements.isLoading && !announcements.items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState
          icon="megaphone"
          title="No announcements"
          description={canEdit ? 'Be the first to share an update.' : 'Announcements will appear here.'}
          action={canEdit ? { label: 'New announcement', onPress: () => router.push('/modules/announcements/new' as never) } : undefined}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(a, i) => a._id ?? a.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={announcements.isFetching && !announcements.isLoading} onRefresh={() => announcements.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <ListItemCard
              title={item.title}
              subtitle={item.body}
              meta={formatDateTime(item.created_at)}
              icon="megaphone"
              badge={item.pinned ? { label: 'Pinned', tone: 'warning' } : undefined}
              onPress={() => router.push(`/modules/announcements/${encodeURIComponent(item._id ?? item.id ?? '')}` as never)}
              onLongPress={
                canEdit
                  ? () =>
                      Alert.alert('Delete announcement', 'Remove this announcement?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await announcements.remove(item._id ?? item.id ?? '');
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
