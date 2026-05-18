import { Alert, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useHomework, useTenant } from '@/hooks';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatDate } from '@/utils/format';

export default function HomeworkList() {
  const router = useRouter();
  const { role, profileId, userId, studentId } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';

  const filters = role === 'teacher'
    ? { teacher_id: profileId || userId }
    : role === 'student' || role === 'parent'
      ? { student_id: studentId }
      : undefined;

  const homework = useHomework(filters);
  const items = homework.items ?? [];

  // Parent: prefer the child-scoped endpoint when there's a selected child;
  // it returns the same shape and respects the parent's school/year scope.
  // (When the active child changes the hook re-runs because studentId is
  // part of the query key.)

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Homework"
          subtitle={homework.isLoading ? 'Loading…' : `${items.length} assignment${items.length === 1 ? '' : 's'}`}
          right={
            canEdit ? (
              <Pressable
                onPress={() => router.push('/modules/homework/new' as never)}
                style={({ pressed }) => [{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.85 }]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
      </View>
      {homework.isError ? (
        <ErrorState message={homework.error?.message ?? 'Failed.'} onRetry={() => homework.refetch()} />
      ) : homework.isLoading && !homework.items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState
          icon="book"
          title="No homework"
          description={canEdit ? 'Create the first assignment.' : 'No assignments due.'}
          action={canEdit ? { label: 'Add homework', onPress: () => router.push('/modules/homework/new' as never) } : undefined}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(h, i) => h._id ?? h.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={homework.isFetching && !homework.isLoading} onRefresh={() => homework.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => {
            const submissions = item.submissions ?? [];
            const total = submissions.length;
            const graded = submissions.filter((s) => s.marks_obtained !== undefined).length;
            return (
              <ListItemCard
                title={item.title}
                subtitle={item.description}
                meta={`Due ${formatDate(item.due_date)}${total ? ' · ' + graded + '/' + total + ' graded' : ''}`}
                icon="book"
                onPress={() => router.push(`/modules/homework/${encodeURIComponent(item._id ?? item.id ?? '')}` as never)}
                onLongPress={
                  canEdit
                    ? () =>
                        Alert.alert('Delete homework', 'Remove this assignment?', [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                await homework.remove(item._id ?? item.id ?? '');
                              } catch (err) {
                                Alert.alert('Error', (err as Error).message);
                              }
                            },
                          },
                        ])
                    : undefined
                }
              />
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}
