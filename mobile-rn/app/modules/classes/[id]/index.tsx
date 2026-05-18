import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components/ui/Card';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { classService } from '@/services';
import { useClasses, useStudents, useTenant } from '@/hooks';
import { qk } from '@/api/query-keys';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { fullName } from '@/utils/format';

export default function ClassDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';

  const classQ = useQuery({
    queryKey: qk.classDetail(id ?? ''),
    enabled: !!id,
    queryFn: async () => {
      const result = await classService.get(id!);
      if (!result.ok) throw new Error(result.message ?? 'Lookup failed');
      return result.data!;
    },
  });
  const subjectsQ = useQuery({
    queryKey: qk.classSubjects(id ?? ''),
    enabled: !!id,
    queryFn: async () => {
      const result = await classService.subjects(id!);
      if (!result.ok) throw new Error(result.message ?? 'Subjects lookup failed');
      return result.data ?? [];
    },
  });
  const studentsQ = useStudents({ class_id: id });
  const classes = useClasses();

  if (classQ.isLoading) return <ScreenContainer><SectionHeader title="Class" /><LoadingBlock /></ScreenContainer>;
  if (classQ.error || !classQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Class" />
        <ErrorState message={(classQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => classQ.refetch()} />
      </ScreenContainer>
    );
  }

  const c = classQ.data;
  const studentList = studentsQ.items ?? [];

  function handleDelete() {
    Alert.alert('Delete class', 'Remove this class?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await classes.remove(id!);
            router.back();
          } catch (err) {
            Alert.alert('Error', (err as Error).message);
          }
        },
      },
    ]);
  }

  return (
    <ScreenContainer flush>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xl3 }}
        refreshControl={
          <RefreshControl
            refreshing={classQ.isLoading}
            onRefresh={() => {
              classQ.refetch();
              subjectsQ.refetch();
              studentsQ.refetch();
            }}
            tintColor={colors.primary}
          />
        }
      >
        <View style={{ paddingHorizontal: spacing.base, gap: spacing.md }}>
          <SectionHeader
            title={[c.name, c.section].filter(Boolean).join(' — ')}
            subtitle={c.description ?? `Grade ${c.grade_level ?? '—'}`}
            right={
              isAdmin ? (
                <Pressable
                  onPress={() => router.push(`/modules/classes/${encodeURIComponent(id!)}/edit` as never)}
                  style={({ pressed }) => [styles.editBtn, pressed && styles.pressed]}
                >
                  <Icon name="settings" size={18} color={colors.gray700} />
                </Pressable>
              ) : null
            }
          />

          <Card padding="lg">
            <Row label="Capacity" value={c.capacity ? String(c.capacity) : '—'} />
            <Row label="Class teacher" value={c.class_teacher_id ?? '—'} />
            <Row label="Status" value={c.status ?? '—'} />
            <Row label="Subjects" value={String((subjectsQ.data ?? []).length)} />
            <Row label="Students" value={String(studentList.length)} />
          </Card>

          <Text style={styles.section}>Subjects</Text>
          {(subjectsQ.data ?? []).length === 0 ? (
            <Text style={styles.muted}>No subjects mapped.</Text>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {(subjectsQ.data ?? []).map((s) => (
                <ListItemCard
                  key={s._id ?? s.id ?? s.name}
                  title={s.name}
                  subtitle={s.code ?? s.description ?? ''}
                  icon="book"
                />
              ))}
            </View>
          )}

          <Text style={styles.section}>Students ({studentList.length})</Text>
          {studentList.length === 0 ? (
            <Text style={styles.muted}>No students enrolled in this class.</Text>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {studentList.slice(0, 25).map((st) => (
                <ListItemCard
                  key={st._id ?? st.id ?? st.roll_no ?? Math.random().toString()}
                  title={
                    fullName(st.profile) ||
                    fullName({ first_name: st.first_name, last_name: st.last_name, full_name: st.full_name }) ||
                    'Student'
                  }
                  subtitle={st.roll_no ? `Roll #${st.roll_no}` : ''}
                  icon="users"
                  onPress={() =>
                    router.push(`/modules/students/${encodeURIComponent(st._id ?? st.id ?? '')}` as never)
                  }
                />
              ))}
              {studentList.length > 25 ? (
                <Text style={styles.muted}>… and {studentList.length - 25} more.</Text>
              ) : null}
            </View>
          )}

          {isAdmin ? (
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
            >
              <Icon name="logout" size={18} color={colors.error} />
              <Text style={styles.deleteText}>Delete class</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.gray100 },
  rowLabel: { ...typography.bodySm, color: colors.gray500, fontWeight: '600' },
  rowValue: { ...typography.bodyMd, color: colors.gray900, fontWeight: '600' },
  section: { ...typography.h4, color: colors.gray900, marginTop: spacing.md },
  muted: { ...typography.bodySm, color: colors.gray500 },
  editBtn: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center',
    ...shadows.card,
  },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.errorLight,
    backgroundColor: colors.white, marginTop: spacing.lg,
  },
  deleteText: { ...typography.bodyMd, color: colors.error, fontWeight: '700' },
  pressed: { opacity: 0.85 },
});
