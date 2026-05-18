/**
 * Linked Children switcher (parent portal). Lists all children connected
 * to the parent account. Tapping a card sets that child as the active
 * student context, which scopes every parent-side query to them.
 */

import { Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useParentChildren, useTenant } from '@/hooks';
import { useActiveChildStore } from '@/store/active-child-store';
import { colors, spacing } from '@/theme/tokens';

export default function LinkedChildren() {
  const { role } = useTenant();
  const isParent = role === 'parent';
  const childrenQ = useParentChildren();
  const activeId = useActiveChildStore((s) => s.studentId);
  const setActive = useActiveChildStore((s) => s.set);

  if (!isParent) {
    return (
      <ScreenContainer>
        <SectionHeader title="Linked Children" subtitle="Available to parents only." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader title="Linked Children" subtitle="Pick the child to view" />
      </View>
      {childrenQ.isLoading && !childrenQ.children.length ? (
        <LoadingBlock />
      ) : childrenQ.children.length === 0 ? (
        <EmptyState
          icon="family"
          title="No linked children"
          description="Contact your school admin to link your children to this account."
        />
      ) : (
        <FlatList
          data={childrenQ.children}
          keyExtractor={(c) => c.student_id ?? c.id ?? c.full_name ?? Math.random().toString()}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={childrenQ.isFetching} onRefresh={() => childrenQ.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => {
            const id = item.student_id ?? item.id ?? '';
            const isActive = id === activeId;
            return (
              <ListItemCard
                title={item.full_name ?? 'Student'}
                subtitle={[item.class_name, item.section].filter(Boolean).join(' · ')}
                meta={item.admission_no ? `Admission #${item.admission_no}` : undefined}
                icon="graduation"
                badge={isActive ? { label: 'Active', tone: 'success' } : undefined}
                onPress={async () => {
                  await setActive(id);
                  Alert.alert(
                    'Active child',
                    `${item.full_name ?? 'Student'} is now selected. All parent screens scope to this child.`,
                  );
                }}
              />
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({});
