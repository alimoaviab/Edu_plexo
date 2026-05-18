import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useTeachers, useTenant } from '@/hooks';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { fullName } from '@/utils/format';

export default function TeachersList() {
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const [search, setSearch] = useState('');
  const teachers = useTeachers();

  const items = useMemo(() => {
    const arr = Array.isArray(teachers.items)
      ? (teachers.items as unknown[])
      : ((teachers.items as { items?: unknown[] } | undefined)?.items ?? []);
    return arr as Array<{
      _id?: string;
      id?: string;
      profile?: { first_name?: string; last_name?: string; full_name?: string; email?: string; phone?: string };
      first_name?: string;
      last_name?: string;
      full_name?: string;
      email?: string;
      phone?: string;
      designation?: string;
      employee_id?: string;
      status?: string;
    }>;
  }, [teachers.items]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter((t) => {
      const name = (
        fullName(t.profile) ||
        fullName({ first_name: t.first_name, last_name: t.last_name, full_name: t.full_name }) ||
        ''
      ).toLowerCase();
      const emp = (t.employee_id ?? '').toLowerCase();
      return name.includes(q) || emp.includes(q);
    });
  }, [items, search]);

  return (
    <ScreenContainer flush>
      <View style={styles.padded}>
        <SectionHeader
          title="Teachers"
          subtitle={teachers.isLoading ? 'Loading…' : `${filtered.length} teacher${filtered.length === 1 ? '' : 's'}`}
          right={
            isAdmin ? (
              <Pressable
                onPress={() => router.push('/modules/teachers/new' as never)}
                style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />

        <View style={styles.searchBox}>
          <Icon name="users" size={16} color={colors.gray400} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search teachers"
            placeholderTextColor={colors.gray400}
            style={styles.searchInput}
            autoCapitalize="none"
          />
        </View>
      </View>

      {teachers.isError ? (
        <ErrorState message={teachers.error?.message ?? 'Failed.'} onRetry={() => teachers.refetch()} />
      ) : teachers.isLoading && !teachers.items ? (
        <LoadingBlock />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="users"
          title="No teachers"
          description={isAdmin ? 'Add the first teacher to get started.' : 'Teachers will appear once added.'}
          action={isAdmin ? { label: 'Add teacher', onPress: () => router.push('/modules/teachers/new' as never) } : undefined}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(t, i) => t._id ?? t.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={
            <RefreshControl
              refreshing={teachers.isFetching && !teachers.isLoading}
              onRefresh={() => teachers.refetch()}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => {
            const name =
              fullName(item.profile) ||
              fullName({ first_name: item.first_name, last_name: item.last_name, full_name: item.full_name }) ||
              'Unnamed';
            const subtitle = item.designation ?? item.profile?.email ?? item.email ?? '';
            return (
              <ListItemCard
                title={name}
                subtitle={subtitle}
                meta={item.employee_id ? `Employee #${item.employee_id}` : undefined}
                icon="graduation"
                badge={item.status ? { label: item.status, tone: item.status === 'active' ? 'success' : 'neutral' } : undefined}
                onPress={() =>
                  router.push(`/modules/teachers/${encodeURIComponent(item._id ?? item.id ?? '')}` as never)
                }
              />
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: spacing.base, gap: spacing.sm, paddingBottom: spacing.md },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
  },
  searchInput: { flex: 1, ...typography.bodyMd, color: colors.gray900, padding: 0 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
});
