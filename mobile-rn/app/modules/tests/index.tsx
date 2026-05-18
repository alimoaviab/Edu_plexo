import { Alert, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useTests, useTenant } from '@/hooks';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatDate } from '@/utils/format';

export default function TestsList() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const tests = useTests();
  const items = tests.items ?? [];

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Tests"
          subtitle={tests.isLoading ? 'Loading…' : `${items.length} test${items.length === 1 ? '' : 's'}`}
          right={
            canEdit ? (
              <Pressable
                onPress={() => router.push('/modules/tests/new' as never)}
                style={({ pressed }) => [{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.85 }]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
      </View>
      {tests.isError ? (
        <ErrorState message={tests.error?.message ?? 'Failed.'} onRetry={() => tests.refetch()} />
      ) : tests.isLoading && !tests.items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState
          icon="clipboard"
          title="No tests"
          description={canEdit ? 'Create the first class test.' : 'Tests will appear here.'}
          action={canEdit ? { label: 'Schedule test', onPress: () => router.push('/modules/tests/new' as never) } : undefined}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(t, i) => t._id ?? t.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={tests.isFetching && !tests.isLoading} onRefresh={() => tests.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <ListItemCard
              title={item.name}
              subtitle={item.description}
              meta={formatDate(item.start_date)}
              icon="clipboard"
              badge={item.status ? { label: item.status, tone: item.status === 'active' ? 'success' : 'warning' } : undefined}
              onPress={() => router.push(`/modules/tests/${encodeURIComponent(item._id ?? item.id ?? '')}` as never)}
              onLongPress={
                canEdit
                  ? () =>
                      Alert.alert('Delete test', 'Remove this test?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await tests.remove(item._id ?? item.id ?? '');
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
