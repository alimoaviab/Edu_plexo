import { Alert, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useExams, useTenant } from '@/hooks';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatDate } from '@/utils/format';

export default function ExamsList() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const exams = useExams({ type: 'exam' });
  const items = exams.items ?? [];

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Exams"
          subtitle={exams.isLoading ? 'Loading…' : `${items.length} exam${items.length === 1 ? '' : 's'}`}
          right={
            canEdit ? (
              <Pressable
                onPress={() => router.push('/modules/exams/new' as never)}
                style={({ pressed }) => [{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.85 }]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
      </View>
      {exams.isError ? (
        <ErrorState message={exams.error?.message ?? 'Failed.'} onRetry={() => exams.refetch()} />
      ) : exams.isLoading && !exams.items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState
          icon="clipboard"
          title="No exams"
          description={canEdit ? 'Schedule the first exam.' : 'Exams will appear here.'}
          action={canEdit ? { label: 'Schedule exam', onPress: () => router.push('/modules/exams/new' as never) } : undefined}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(e, i) => e._id ?? e.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={exams.isFetching && !exams.isLoading} onRefresh={() => exams.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <ListItemCard
              title={item.name}
              subtitle={item.description}
              meta={`${formatDate(item.start_date)}${item.end_date ? ' → ' + formatDate(item.end_date) : ''}`}
              icon="clipboard"
              badge={item.status ? { label: item.status, tone: item.status === 'active' ? 'success' : item.status === 'cancelled' ? 'error' : 'warning' } : undefined}
              onPress={() => router.push(`/modules/exams/${encodeURIComponent(item._id ?? item.id ?? '')}` as never)}
              onLongPress={
                canEdit
                  ? () =>
                      Alert.alert('Delete exam', 'Remove this exam?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await exams.remove(item._id ?? item.id ?? '');
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
