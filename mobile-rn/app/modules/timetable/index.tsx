import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { Picker } from '@/components/ui/Picker';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useClasses, useTenant, useTimetable } from '@/hooks';
import { colors, radius, spacing, typography } from '@/theme/tokens';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function TimetableScreen() {
  const router = useRouter();
  const { role, profileId, userId, classId } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin';

  const isTeacher = role === 'teacher';
  const isStudent = role === 'student' || role === 'parent';

  const classesQ = useClasses();
  const classOptions = useMemo(
    () => (classesQ.items?.data ?? []).map((c) => ({ label: [c.name, c.section].filter(Boolean).join(' — '), value: c._id ?? c.id ?? '' })),
    [classesQ.items],
  );

  const today = (() => {
    const d = new Date().getDay();
    return d === 0 ? 7 : d;
  })();
  const [day, setDay] = useState<number>(today);
  const [selectedClass, setSelectedClass] = useState<string>(isStudent ? classId ?? '' : '');

  const timetableFilters: { class_id?: string; teacher_id?: string; day_of_week: number } = {
    day_of_week: day,
  };
  if (isTeacher) timetableFilters.teacher_id = profileId || userId;
  else if (isStudent) timetableFilters.class_id = classId || selectedClass;
  else if (selectedClass) timetableFilters.class_id = selectedClass;

  const timetable = useTimetable(timetableFilters);
  const items = (timetable.items ?? []).slice().sort(
    (a, b) => (a.period_number ?? 0) - (b.period_number ?? 0),
  );

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Timetable"
          subtitle={timetable.isLoading ? 'Loading…' : `${items.length} period${items.length === 1 ? '' : 's'}`}
          right={
            canEdit ? (
              <Pressable
                onPress={() => router.push('/modules/timetable/new' as never)}
                style={({ pressed }) => [{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.85 }]}
                hitSlop={8}
              >
                <Icon name="plus" size={18} color={colors.white} />
              </Pressable>
            ) : null
          }
        />

        <View style={styles.dayRow}>
          {DAY_LABELS.map((label, idx) => {
            const value = idx + 1;
            const active = value === day;
            return (
              <Pressable
                key={label}
                onPress={() => setDay(value)}
                style={[styles.dayChip, active && styles.dayChipActive]}
                android_ripple={{ color: colors.primaryLight }}
              >
                <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {!isTeacher && !isStudent ? (
          <Picker
            label="Class"
            value={selectedClass}
            onChange={setSelectedClass}
            options={classOptions}
            placeholder="All classes"
            clearable
          />
        ) : null}
      </View>

      {timetable.isError ? (
        <ErrorState message={timetable.error?.message ?? 'Failed.'} onRetry={() => timetable.refetch()} />
      ) : timetable.isLoading && !timetable.items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState icon="calendar" title="No periods" description={`No periods scheduled for ${DAY_LABELS[day - 1]}.`} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(t, i) => t._id ?? t.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={timetable.isFetching && !timetable.isLoading} onRefresh={() => timetable.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <ListItemCard
              title={`Period ${item.period_number ?? '—'}`}
              subtitle={`${item.start_time ?? ''} – ${item.end_time ?? ''}${item.room ? ' · ' + item.room : ''}`}
              meta={`Subject ${item.subject_id ?? ''} · Class ${item.class_id ?? ''}`}
              icon="calendar"
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  dayRow: { flexDirection: 'row', gap: 6, paddingVertical: spacing.md },
  dayChip: {
    flex: 1,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipActive: { backgroundColor: colors.primary },
  dayLabel: { ...typography.bodySm, color: colors.gray600, fontWeight: '700' },
  dayLabelActive: { color: colors.white },
});
