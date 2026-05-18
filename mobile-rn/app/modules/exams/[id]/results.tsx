/**
 * Bulk marks entry for an exam.
 *
 * Loads the class roster + existing results for this exam, lets the teacher
 * type marks per student, then saves them with one POST per row to
 * /api/exams/{id}/results. The backend upserts so re-saving is safe.
 *
 * Closes the gap the web has via /exams/:id/results.
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { examService, resultService, studentService } from '@/services';
import { useTenant } from '@/hooks';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { fullName } from '@/utils/format';

interface Draft {
  marks: string; // keep as string for the input
  grade: string;
  remarks: string;
}

export default function ResultsEntry() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const queryClient = useQueryClient();

  const examQ = useQuery({
    queryKey: ['exam', id ?? ''],
    enabled: !!id,
    queryFn: async () => {
      const r = await examService.get(id!);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data!;
    },
  });

  const studentsQ = useQuery({
    queryKey: ['students-for-exam', examQ.data?.class_id ?? ''],
    enabled: !!examQ.data?.class_id,
    queryFn: async () => {
      const r = await studentService.list({
        class_id: examQ.data!.class_id!,
        status: 'active',
      });
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data ?? [];
    },
  });

  const resultsQ = useQuery({
    queryKey: ['results-for-exam', id ?? ''],
    enabled: !!id,
    queryFn: async () => {
      const r = await resultService.forExam(id!);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data ?? [];
    },
  });

  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  // Seed drafts when results load.
  useEffect(() => {
    const seed: Record<string, Draft> = {};
    for (const s of studentsQ.data ?? []) {
      const sid = s._id ?? s.id ?? '';
      if (!sid) continue;
      seed[sid] = { marks: '', grade: '', remarks: '' };
    }
    for (const r of resultsQ.data ?? []) {
      const sid = r.student_id;
      if (!sid) continue;
      seed[sid] = {
        marks: r.marks_obtained != null ? String(r.marks_obtained) : '',
        grade: r.grade ?? '',
        remarks: r.remarks ?? '',
      };
    }
    setDrafts(seed);
  }, [studentsQ.data, resultsQ.data]);

  const save = useMutation({
    mutationFn: async () => {
      const exam = examQ.data!;
      const students = studentsQ.data ?? [];
      let count = 0;
      let failures = 0;
      for (const s of students) {
        const sid = s._id ?? s.id ?? '';
        if (!sid) continue;
        const d = drafts[sid];
        if (!d || !d.marks.trim()) continue; // skip blanks
        const marks = Number(d.marks);
        if (Number.isNaN(marks)) continue;
        const r = await resultService.saveForExam(id!, {
          student_id: sid,
          subject_id: exam.subject_id,
          marks_obtained: marks,
          total_marks: exam.total_marks,
          grade: d.grade || undefined,
          remarks: d.remarks || undefined,
        });
        if (r.ok) count++;
        else failures++;
      }
      return { count, failures };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['results-for-exam', id ?? ''] });
      queryClient.invalidateQueries({ queryKey: ['results'] });
      if (data.failures > 0) {
        Alert.alert('Partial save', `Saved ${data.count}, failed ${data.failures}.`);
      } else {
        Alert.alert('Saved', `Saved marks for ${data.count} student${data.count === 1 ? '' : 's'}.`);
      }
    },
    onError: (err) => Alert.alert('Error', (err as Error).message),
  });

  const totalEntered = useMemo(
    () => Object.values(drafts).filter((d) => d.marks.trim()).length,
    [drafts],
  );

  if (!canEdit) {
    return <ScreenContainer><SectionHeader title="Results" subtitle="Permission required" /></ScreenContainer>;
  }
  if (examQ.isLoading || studentsQ.isLoading) {
    return <ScreenContainer><SectionHeader title="Marks Entry" /><LoadingBlock /></ScreenContainer>;
  }
  if (examQ.error || !examQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Marks Entry" />
        <ErrorState message={(examQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => examQ.refetch()} />
      </ScreenContainer>
    );
  }

  const exam = examQ.data;

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader
          title="Marks Entry"
          subtitle={`${exam.name} · ${totalEntered} entered`}
        />
      </View>

      <FlatList
        data={studentsQ.data ?? []}
        keyExtractor={(s, i) => s._id ?? s.id ?? String(i)}
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: 110 }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => {
          const sid = item._id ?? item.id ?? '';
          const d = drafts[sid] ?? { marks: '', grade: '', remarks: '' };
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
                onChangeText={(t) =>
                  setDrafts((prev) => ({ ...prev, [sid]: { ...d, marks: t } }))
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Grade"
                placeholderTextColor={colors.gray400}
                value={d.grade}
                onChangeText={(t) =>
                  setDrafts((prev) => ({ ...prev, [sid]: { ...d, grade: t } }))
                }
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  studentName: { ...typography.bodyMd, fontWeight: '700', color: colors.gray900 },
  studentMeta: { ...typography.bodySm, color: colors.gray500 },
  input: {
    width: 80,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: colors.gray50,
    color: colors.gray900,
    ...typography.bodyMd,
    fontWeight: '700',
    textAlign: 'center',
  },
  saveBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.base,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.cardBorder,
  },
});
