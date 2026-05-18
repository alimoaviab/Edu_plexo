import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components/ui/Card';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { testService } from '@/services';
import { useTenant, useTests } from '@/hooks';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { formatDate } from '@/utils/format';

export default function TestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const tests = useTests();

  const testQ = useQuery({
    queryKey: ['test', id ?? ''],
    enabled: !!id,
    queryFn: async () => {
      const r = await testService.get(id!);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data!;
    },
  });

  if (testQ.isLoading) return <ScreenContainer><SectionHeader title="Test" /><LoadingBlock /></ScreenContainer>;
  if (testQ.error || !testQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Test" />
        <ErrorState message={(testQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => testQ.refetch()} />
      </ScreenContainer>
    );
  }

  const t = testQ.data;
  function handleDelete() {
    Alert.alert('Delete test', 'Remove this test?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try { await tests.remove(id!); router.back(); } catch (err) { Alert.alert('Error', (err as Error).message); }
        },
      },
    ]);
  }

  return (
    <ScreenContainer flush>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xl3 }}
        refreshControl={<RefreshControl refreshing={testQ.isLoading} onRefresh={() => testQ.refetch()} tintColor={colors.primary} />}
      >
        <View style={{ paddingHorizontal: spacing.base, gap: spacing.md }}>
          <SectionHeader
            title={t.name}
            subtitle={t.description ?? 'Test details'}
            right={
              canEdit ? (
                <Pressable
                  onPress={() => router.push(`/modules/tests/${encodeURIComponent(id!)}/edit` as never)}
                  style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
                >
                  <Icon name="settings" size={18} color={colors.gray700} />
                </Pressable>
              ) : null
            }
          />

          <Card padding="lg">
            <Row label="Class" value={t.class_id ?? '—'} />
            <Row label="Subject" value={t.subject_id ?? '—'} />
            <Row label="Date" value={formatDate(t.start_date)} />
            <Row label="Total marks" value={String(t.total_marks ?? '—')} />
            <Row label="Passing marks" value={String(t.passing_marks ?? '—')} />
            <Row label="Status" value={t.status ?? '—'} />
          </Card>

          {canEdit ? (
            <Pressable
              onPress={() => router.push(`/modules/tests/${encodeURIComponent(id!)}/results` as never)}
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            >
              <Icon name="star" size={18} color={colors.white} />
              <Text style={styles.primaryBtnText}>Enter Results</Text>
            </Pressable>
          ) : null}

          {canEdit ? (
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
            >
              <Icon name="logout" size={18} color={colors.error} />
              <Text style={styles.deleteText}>Delete test</Text>
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
  iconBtn: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center',
    ...shadows.card,
  },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: radius.lg, backgroundColor: colors.primary, marginTop: spacing.sm,
  },
  primaryBtnText: { ...typography.bodyLg, color: colors.white, fontWeight: '700' },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.errorLight,
    backgroundColor: colors.white, marginTop: spacing.lg,
  },
  deleteText: { ...typography.bodyMd, color: colors.error, fontWeight: '700' },
  pressed: { opacity: 0.85 },
});
