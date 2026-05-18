import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components/ui/Card';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { teacherService } from '@/services';
import { useTeachers, useTenant } from '@/hooks';
import { qk } from '@/api/query-keys';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { fullName, formatDate } from '@/utils/format';

export default function TeacherDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';

  const teacherQ = useQuery({
    queryKey: qk.teacher(id ?? ''),
    enabled: !!id,
    queryFn: async () => {
      const result = await teacherService.get(id!);
      if (!result.ok) throw new Error(result.message ?? 'Lookup failed');
      return result.data!;
    },
  });
  const teachers = useTeachers();

  if (teacherQ.isLoading) return <ScreenContainer><SectionHeader title="Teacher" /><LoadingBlock /></ScreenContainer>;
  if (teacherQ.error || !teacherQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Teacher" />
        <ErrorState
          title="Teacher not found"
          message={(teacherQ.error as Error)?.message ?? 'Refresh and try again.'}
          onRetry={() => teacherQ.refetch()}
        />
      </ScreenContainer>
    );
  }
  const t = teacherQ.data;
  const name = fullName(t.profile) || fullName({ first_name: t.first_name, last_name: t.last_name, full_name: t.full_name }) || 'Teacher';

  function handleDelete() {
    Alert.alert('Delete teacher', 'This permanently removes the teacher account. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await teachers.remove(id!);
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
        refreshControl={<RefreshControl refreshing={teacherQ.isLoading} onRefresh={() => teacherQ.refetch()} tintColor={colors.primary} />}
      >
        <View style={{ paddingHorizontal: spacing.base, gap: spacing.md }}>
          <SectionHeader
            title={name}
            subtitle={t.designation ?? 'Teacher profile'}
            right={
              isAdmin ? (
                <Pressable
                  onPress={() => router.push(`/modules/teachers/${encodeURIComponent(id!)}/edit` as never)}
                  style={({ pressed }) => [styles.editBtn, pressed && styles.pressed]}
                  hitSlop={8}
                >
                  <Icon name="settings" size={18} color={colors.gray700} />
                </Pressable>
              ) : null
            }
          />

          <Card padding="lg">
            <Row label="Email" value={t.profile?.email ?? t.email ?? '—'} />
            <Row label="Phone" value={t.profile?.phone ?? t.phone ?? '—'} />
            <Row label="Employee #" value={t.employee_id ?? '—'} />
            <Row label="Joined" value={formatDate(t.date_of_joining)} />
            <Row label="Status" value={t.status ?? '—'} />
            <Row label="Qualifications" value={t.qualifications ?? '—'} />
          </Card>

          {isAdmin ? (
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
            >
              <Icon name="logout" size={18} color={colors.error} />
              <Text style={styles.deleteText}>Delete teacher</Text>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.gray100, gap: spacing.md },
  rowLabel: { ...typography.bodySm, color: colors.gray500, fontWeight: '600' },
  rowValue: { ...typography.bodyMd, color: colors.gray900, fontWeight: '600', flex: 1, textAlign: 'right' },
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
