/**
 * Students module — list with search + filter, plus an "Add" FAB for admins.
 * Mirrors the web's Students page in scope (filter by class, search by name,
 * tap a row to open the detail screen).
 */

import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { Picker } from '@/components/ui/Picker';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useClasses, useStudents, useTenant } from '@/hooks';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { fullName } from '@/utils/format';

export default function StudentsList() {
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';

  const [search, setSearch] = useState('');
  const [classId, setClassId] = useState<string>('');
  const [status, setStatus] = useState<string>('active');

  const classesQ = useClasses();
  const students = useStudents({ class_id: classId || undefined, status });

  const classOptions = useMemo(
    () =>
      (classesQ.items?.data ?? []).map((c) => ({
        label: [c.name, c.section].filter(Boolean).join(' — '),
        value: c._id ?? c.id ?? '',
      })),
    [classesQ.items],
  );

  const filtered = useMemo(() => {
    const items = students.items ?? [];
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter((s) => {
      const name = (
        fullName(s.profile) ||
        fullName({
          first_name: s.first_name,
          last_name: s.last_name,
          full_name: s.full_name,
        }) ||
        ''
      ).toLowerCase();
      const roll = (s.roll_no ?? s.admission_no ?? '').toLowerCase();
      return name.includes(q) || roll.includes(q);
    });
  }, [search, students.items]);

  return (
    <ScreenContainer flush>
      <View style={styles.padded}>
        <SectionHeader
          title="Students"
          subtitle={
            students.isLoading
              ? 'Loading…'
              : `${filtered.length} student${filtered.length === 1 ? '' : 's'}`
          }
          right={
            isAdmin ? (
              <Pressable
                onPress={() => router.push('/modules/students/new' as never)}
                style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />

        <View style={styles.toolbar}>
          <View style={styles.searchBox}>
            <Icon name="users" size={16} color={colors.gray400} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name or roll #"
              placeholderTextColor={colors.gray400}
              style={styles.searchInput}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Picker
                value={classId}
                onChange={setClassId}
                placeholder="All classes"
                options={classOptions}
                clearable
              />
            </View>
            <View style={{ flex: 1 }}>
              <Picker
                value={status}
                onChange={setStatus}
                placeholder="Status"
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                  { label: 'All', value: '' },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {students.isError ? (
        <ErrorState
          message={students.error?.message ?? 'Failed to load students.'}
          onRetry={() => students.refetch()}
        />
      ) : students.isLoading && !students.items ? (
        <LoadingBlock label="Loading students…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="users"
          title="No students found"
          description={
            isAdmin
              ? 'Create your first student to get started.'
              : 'Students will appear here once added by an admin.'
          }
          action={
            isAdmin
              ? {
                  label: 'Add student',
                  onPress: () =>
                    router.push('/modules/students/new' as never),
                }
              : undefined
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id ?? item.id ?? Math.random().toString()}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={
            <RefreshControl
              refreshing={students.isFetching && !students.isLoading}
              onRefresh={() => students.refetch()}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => {
            const name =
              fullName(item.profile) ||
              fullName({
                first_name: item.first_name,
                last_name: item.last_name,
                full_name: item.full_name,
              }) ||
              'Unnamed';
            const subtitle = [
              item.roll_no ? `Roll #${item.roll_no}` : null,
              item.admission_no ? `Adm #${item.admission_no}` : null,
            ]
              .filter(Boolean)
              .join(' · ');
            return (
              <ListItemCard
                title={name}
                subtitle={subtitle || item.email || item.profile?.email || ''}
                icon="graduation"
                badge={
                  item.status
                    ? {
                        label: item.status,
                        tone: item.status === 'active' ? 'success' : 'neutral',
                      }
                    : undefined
                }
                onPress={() =>
                  router.push(
                    `/modules/students/${encodeURIComponent(item._id ?? item.id ?? '')}` as never,
                  )
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
  padded: { paddingHorizontal: spacing.base },
  toolbar: { gap: spacing.sm, paddingBottom: spacing.md },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.gray900,
    padding: 0,
  },
  listContent: { paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 },
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
