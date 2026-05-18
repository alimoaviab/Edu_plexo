import { Alert, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSubjects, useTenant } from '@/hooks';
import { colors, radius, spacing } from '@/theme/tokens';

export default function SubjectsList() {
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const subjects = useSubjects();
  const items = subjects.items ?? [];

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Subjects"
          subtitle={subjects.isLoading ? 'Loading…' : `${items.length} subject${items.length === 1 ? '' : 's'}`}
          right={
            isAdmin ? (
              <Pressable
                onPress={() => router.push('/modules/subjects/new' as never)}
                style={({ pressed }) => [{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.85 }]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
      </View>
      {subjects.isError ? (
        <ErrorState message={subjects.error?.message ?? 'Failed.'} onRetry={() => subjects.refetch()} />
      ) : subjects.isLoading && !subjects.items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState
          icon="book"
          title="No subjects"
          description={isAdmin ? 'Add the first subject.' : 'Subjects will appear here.'}
          action={isAdmin ? { label: 'Add subject', onPress: () => router.push('/modules/subjects/new' as never) } : undefined}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(s, i) => s._id ?? s.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={subjects.isFetching && !subjects.isLoading} onRefresh={() => subjects.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <ListItemCard
              title={item.name}
              subtitle={item.code ?? item.description ?? ''}
              icon="book"
              badge={item.is_optional ? { label: 'Optional', tone: 'info' } : undefined}
              onPress={() => router.push(`/modules/subjects/${encodeURIComponent(item._id ?? item.id ?? '')}` as never)}
              onLongPress={
                isAdmin
                  ? () =>
                      Alert.alert('Delete subject', 'Remove this subject?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await subjects.remove(item._id ?? item.id ?? '');
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
