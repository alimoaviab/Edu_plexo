/**
 * Bulk marks entry for a test. Same shape as the exam variant — backend
 * treats /api/tests/{id}/results identically to /api/exams/{id}/results
 * since tests are exams with type=test.
 */

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { api } from '@/api/client';
import { resultService, studentService, testService } from '@/services';
import { useTenant } from '@/hooks';
import type { ResultRow } from '@/services/types';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { fullName } from '@/utils/format';

interface Draft {
  marks: string;
  grade: string;
}

export default function TestResultsEntry() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';

  const testQ = useQuery({
    queryKey: ['test', id ?? ''],
    enabled: !!id,
    queryFn: async () => {
      const r = await testService.get(id!);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data!;
    },
  });

  const studentsQ = useQuery({
    queryKey: ['students-for-test', testQ.data?.class_id ?? ''],
    enabled: !!testQ.data?.class_id,
    queryFn: async () => {
      const r = await studentService.list({
        class_id: testQ.data!.class_id!,
        status: 'active',
      });
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data ?? [];
    },
  });

  const resultsQ = useQuery({
    queryKey: ['results-for-test', id ?? ''],
    enabled: !!id,
    queryFn: async () => {
      const r = await api.get<ResultRow[]>(`/api/tests/${id}/results`);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data ?? [];
    },
  });

  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  useEffect(() => {
    const seed: Record<string, Draft> = {};
    for (const s of studentsQ.data ?? []) {
      const sid = s._id ?? s.id ?? '';
      if (!sid) continue;
      seed[sid] = { marks: '', grade: '' };
    }
    for (const r of resultsQ.data ?? []) {
      const sid = r.student_id;
      if (!sid) continue;
      seed[sid] = {
        marks: r.marks_obtained != null ? String(r.marks_obtained) : '',
        grade: r.grade ?? '',
      };
    }
    setDrafts(seed);
  }, [studentsQ.data, resultsQ.data]);

  const save = useMutation({
    mutationFn: async () => {
      const test = testQ.data!;
      let count = 0;
      let failures = 0;
      for (const s of studentsQ.data ?? []) {
        const sid = s._id ?? s.id ?? '';
        if (!sid) continue;
        const d = drafts[sid];
        if (!d || !d.marks.trim()) continue;
        const marks = Number(d.marks);
        if (Number.isNaN(marks)) continue;
        const r = await api.post(`/api/tests/${id}/results`, {
          student_id: sid,
          subject_id: test.subject_id,
          marks_obtained: marks,
          total_marks: test.total_marks,
          grade: d.grade || undefined,
        });
        if (r.ok) count++;
        else failures++;
      }
      return { count, failures };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['results-for-test', id ?? ''] });
      queryClient.invalidateQueries({ queryKey: ['results'] });
      if (data.failures > 0) Alert.alert('Partial save', `Saved ${data.count}, failed ${data.failures}.`);
      else Alert.alert('Saved', `Saved marks for ${data.count} student${data.count === 1 ? '' : 's'}.`);
    },
    onError: (err) => Alert.alert('Error', (err as Error).message),
  });

  const totalEntered = useMemo(
    () => Object.values(drafts).filter((d) => d.marks.trim()).length,
    [drafts],
  );

  // Suppress unused warning
  void resultService;

  if (!canEdit) return <ScreenContainer><SectionHeader title="Results" subtitle="Permission required" /></ScreenContainer>;
  if (testQ.isLoading || studentsQ.isLoading) return <ScreenContainer><SectionHeader title="Marks Entry" /><LoadingBlock /></ScreenContainer>;
  if (testQ.error || !testQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Marks Entry" />
        <ErrorState message={(testQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => testQ.refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader title="Marks Entry" subtitle={`${testQ.data.name} · ${totalEntered} entered`} />
      </View>

      <FlatList
        data={studentsQ.data ?? []}
        keyExtractor={(s, i) => s._id ?? s.id ?? String(i)}
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: 110 }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => {
          const sid = item._id ?? item.id ?? '';
          const d = drafts[sid] ?? { marks: '', grade: '' };
          const name =
            fullName(item.profile) ||
            fullName({ first_name: item.first_name, last_name: item.last_name, full_name: item.full_name }) ||
            'Student';
          return (
            <View style={[styles.row, shadows.card]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.studentName} numberOfLines={1}>{name}</Text>
                <Text style={styles.studentMeta}>{item.roll_no ? `Roll #${item.roll_no}` : ''}</Text>
              </View>
              <TextInput
                placeholder="Marks"
                placeholderTextColor={colors.gray400}
                keyboardType="number-pad"
                value={d.marks}
                onChangeText={(t) => setDrafts((prev) => ({ ...prev, [sid]: { ...d, marks: t } }))}
                style={styles.input}
              />
              <TextInput
                placeholder="Grade"
                placeholderTextColor={colors.gray400}
                value={d.grade}
                onChangeText={(t) => setDrafts((prev) => ({ ...prev, [sid]: { ...d, grade: t } }))}
                style={[styles.input, { width: 60 }]}
                autoCapitalize="characters"
                maxLength={3}
              />
            </View>
          );
        }}
      />

      <View style={styles.saveBar}>
        <Button
          label={save.isPending ? 'Saving…' : `Save ${totalEntered} mark${totalEntered === 1 ? '' : 's'}`}
          onPress={() => save.mutate()}
          loading={save.isPending}
          disabled={totalEntered === 0}
          size="lg"
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md,
    backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cardBorder,
  },
  studentName: { ...typography.bodyMd, fontWeight: '700', color: colors.gray900 },
  studentMeta: { ...typography.bodySm, color: colors.gray500 },
  input: {
    width: 80, height: 40, paddingHorizontal: 10, borderRadius: radius.md, backgroundColor: colors.gray50,
    color: colors.gray900, ...typography.bodyMd, fontWeight: '700', textAlign: 'center',
  },
  saveBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.base,
    backgroundColor: colors.white, borderTopWidth: 1, borderColor: colors.cardBorder,
  },
});
