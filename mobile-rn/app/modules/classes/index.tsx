import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useClasses, useTenant } from '@/hooks';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatCount } from '@/utils/format';

export default function ClassesList() {
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const classes = useClasses();
  const items = useMemo(() => classes.items?.data ?? [], [classes.items]);

  return (
    <ScreenContainer flush>
      <View style={styles.padded}>
        <SectionHeader
          title="Classes"
          subtitle={classes.isLoading ? 'Loading…' : `${formatCount(items.length)} classes`}
          right={
            isAdmin ? (
              <Pressable
                onPress={() => router.push('/modules/classes/new' as never)}
                style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
      </View>

      {classes.isError ? (
        <ErrorState message={classes.error?.message ?? 'Failed.'} onRetry={() => classes.refetch()} />
      ) : classes.isLoading && !classes.items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState
          icon="graduation"
          title="No classes yet"
          description={isAdmin ? 'Create the first class.' : 'Classes will appear here.'}
          action={isAdmin ? { label: 'Add class', onPress: () => router.push('/modules/classes/new' as never) } : undefined}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(c, i) => c._id ?? c.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={
            <RefreshControl
              refreshing={classes.isFetching && !classes.isLoading}
              onRefresh={() => classes.refetch()}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <ListItemCard
              title={[item.name, item.section].filter(Boolean).join(' — ')}
              subtitle={item.description ?? `Capacity ${item.capacity ?? '—'}`}
              meta={item.grade_level ? `Grade ${item.grade_level}` : undefined}
              icon="graduation"
              badge={
                item.status
                  ? { label: item.status, tone: item.status === 'active' ? 'success' : 'neutral' }
                  : undefined
              }
              onPress={() => router.push(`/modules/classes/${encodeURIComponent(item._id ?? item.id ?? '')}` as never)}
              onLongPress={
                isAdmin
                  ? () =>
                      Alert.alert('Delete class', 'Remove this class?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await classes.remove(item._id ?? item.id ?? '');
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

const styles = StyleSheet.create({
  padded: { paddingHorizontal: spacing.base, paddingBottom: spacing.md },
  addBtn: {
    width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
});
