/**
 * Homework detail.
 *
 * Teacher view: list of submissions per student with marks input.
 * Student view: shows the assignment + a Submit panel (text + optional file).
 * Parent view: read-only view of their child's submission status.
 */

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { homeworkService, studentService } from '@/services';
import { useHomework, useTenant } from '@/hooks';
import type { HomeworkRow, HomeworkSubmission } from '@/services/types';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { fullName, formatDate, formatDateTime } from '@/utils/format';
import { pickDocument, pickImage } from '@/utils/uploads';

export default function HomeworkDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role, studentId } = useTenant();
  const isTeacher = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const isStudent = role === 'student';
  const isParent = role === 'parent';
  const queryClient = useQueryClient();
  const homework = useHomework();

  const hwQ = useQuery({
    queryKey: ['homework', id ?? ''],
    enabled: !!id,
    queryFn: async () => {
      const r = await homeworkService.get(id!);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data!;
    },
  });

  const studentsQ = useQuery({
    queryKey: ['students-for-homework', hwQ.data?.class_id ?? ''],
    enabled: isTeacher && !!hwQ.data?.class_id,
    queryFn: async () => {
      const r = await studentService.list({
        class_id: hwQ.data!.class_id!,
        status: 'active',
      });
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data ?? [];
    },
  });

  if (hwQ.isLoading) return <ScreenContainer><SectionHeader title="Homework" /><LoadingBlock /></ScreenContainer>;
  if (hwQ.error || !hwQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Homework" />
        <ErrorState message={(hwQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => hwQ.refetch()} />
      </ScreenContainer>
    );
  }

  const hw = hwQ.data;

  function handleDelete() {
    Alert.alert('Delete homework', 'Remove this assignment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try { await homework.remove(id!); router.back(); } catch (err) { Alert.alert('Error', (err as Error).message); }
        },
      },
    ]);
  }

  return (
    <ScreenContainer flush>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xl3 }}
        refreshControl={<RefreshControl refreshing={hwQ.isLoading} onRefresh={() => hwQ.refetch()} tintColor={colors.primary} />}
      >
        <View style={{ paddingHorizontal: spacing.base, gap: spacing.md }}>
          <SectionHeader
            title={hw.title}
            subtitle={`Due ${formatDate(hw.due_date)}`}
            right={
              isTeacher ? (
                <Pressable
                  onPress={() => router.push(`/modules/homework/${encodeURIComponent(id!)}/edit` as never)}
                  style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
                >
                  <Icon name="settings" size={18} color={colors.gray700} />
                </Pressable>
              ) : null
            }
          />

          <Card padding="lg">
            <Text style={styles.body}>{hw.description ?? ''}</Text>
          </Card>

          {isStudent ? (
            <StudentSubmissionPanel hw={hw} studentId={studentId ?? ''} onSaved={() => hwQ.refetch()} />
          ) : null}

          {isParent ? (
            <ParentSubmissionView hw={hw} studentId={studentId ?? ''} />
          ) : null}

          {isTeacher ? (
            <TeacherGradingPanel
              hw={hw}
              students={studentsQ.data ?? []}
              loading={studentsQ.isLoading}
              onSaved={() => {
                hwQ.refetch();
                queryClient.invalidateQueries({ queryKey: ['homework'] });
              }}
            />
          ) : null}

          {isTeacher ? (
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
            >
              <Icon name="logout" size={18} color={colors.error} />
              <Text style={styles.deleteText}>Delete homework</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Student submission
// ────────────────────────────────────────────────────────────────────────

function StudentSubmissionPanel({
  hw, studentId, onSaved,
}: { hw: HomeworkRow; studentId: string; onSaved: () => void }) {
  const existing = (hw.submissions ?? []).find((s) => s.student_id === studentId);
  const [text, setText] = useState(existing?.text ?? '');
  const [submissionUrl, setSubmissionUrl] = useState(existing?.submission_url ?? '');
  const [saving, setSaving] = useState(false);

  async function handleAttach(kind: 'image' | 'document') {
    const att = kind === 'image' ? await pickImage() : await pickDocument();
    if (att) {
      // No upload pipeline yet — store the local URI as the submission URL so
      // the teacher at least sees the attachment was made. When the backend
      // gains a presigned-url endpoint, replace this with the upload step.
      setSubmissionUrl(att.uri);
      Alert.alert('Attached', `${att.name} attached locally. Save submission to record it.`);
    }
  }

  async function handleSubmit() {
    if (!studentId) {
      Alert.alert('No student profile', 'This account is not linked to a student profile.');
      return;
    }
    if (!text.trim() && !submissionUrl) {
      Alert.alert('Empty submission', 'Add some text or attach a file first.');
      return;
    }
    setSaving(true);
    const others = (hw.submissions ?? []).filter((s) => s.student_id !== studentId);
    const next: HomeworkSubmission = {
      student_id: studentId,
      submitted_at: new Date().toISOString(),
      text: text.trim() || undefined,
      submission_url: submissionUrl || undefined,
      status: 'submitted',
    };
    const r = await homeworkService.update(hw._id ?? hw.id ?? '', {
      submissions: [...others, next],
    });
    setSaving(false);
    if (!r.ok) {
      Alert.alert('Error', r.message ?? 'Submission failed.');
      return;
    }
    Alert.alert('Submitted', 'Your submission has been recorded.');
    onSaved();
  }

  return (
    <Card padding="lg">
      <Text style={styles.sectionTitle}>My Submission</Text>
      {existing?.submitted_at ? (
        <Text style={styles.muted}>Submitted {formatDateTime(existing.submitted_at)}</Text>
      ) : null}
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type your submission here…"
        placeholderTextColor={colors.gray400}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        style={styles.bigInput}
      />
      {submissionUrl ? (
        <Text style={styles.attachmentLabel} numberOfLines={1}>Attachment: {submissionUrl}</Text>
      ) : null}
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Button label="Photo" variant="secondary" size="sm" onPress={() => handleAttach('image')} fullWidth />
        <Button label="File" variant="secondary" size="sm" onPress={() => handleAttach('document')} fullWidth />
      </View>
      {existing?.marks_obtained != null ? (
        <Card padding="md" style={{ backgroundColor: colors.successLight, marginTop: spacing.sm, borderColor: colors.successLight }}>
          <Text style={[styles.sectionTitle, { color: colors.success }]}>Graded: {existing.marks_obtained}</Text>
          {existing.feedback ? <Text style={styles.body}>{existing.feedback}</Text> : null}
        </Card>
      ) : null}
      <View style={{ marginTop: spacing.sm }}>
        <Button
          label={saving ? 'Saving…' : existing ? 'Update submission' : 'Submit'}
          onPress={handleSubmit}
          loading={saving}
          fullWidth
        />
      </View>
    </Card>
  );
}

function ParentSubmissionView({ hw, studentId }: { hw: HomeworkRow; studentId: string }) {
  const sub = (hw.submissions ?? []).find((s) => s.student_id === studentId);
  if (!sub) {
    return (
      <Card padding="lg" style={{ backgroundColor: colors.warningLight, borderColor: colors.warningLight }}>
        <Text style={[styles.sectionTitle, { color: colors.warning }]}>Not submitted yet</Text>
      </Card>
    );
  }
  return (
    <Card padding="lg">
      <Text style={styles.sectionTitle}>Submitted</Text>
      <Text style={styles.muted}>{formatDateTime(sub.submitted_at)}</Text>
      {sub.text ? <Text style={[styles.body, { marginTop: spacing.sm }]}>{sub.text}</Text> : null}
      {sub.marks_obtained != null ? (
        <Text style={[styles.sectionTitle, { color: colors.success, marginTop: spacing.sm }]}>
          Graded: {sub.marks_obtained}
        </Text>
      ) : null}
      {sub.feedback ? <Text style={styles.body}>{sub.feedback}</Text> : null}
    </Card>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Teacher grading
// ────────────────────────────────────────────────────────────────────────

function TeacherGradingPanel({
  hw, students, loading, onSaved,
}: {
  hw: HomeworkRow;
  students: Array<{
    _id?: string;
    id?: string;
    profile?: { first_name?: string; last_name?: string; full_name?: string };
    first_name?: string;
    last_name?: string;
    full_name?: string;
    roll_no?: string;
  }>;
  loading: boolean;
  onSaved: () => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, { marks: string; feedback: string }>>({});

  useEffect(() => {
    const seed: Record<string, { marks: string; feedback: string }> = {};
    for (const s of hw.submissions ?? []) {
      seed[s.student_id] = {
        marks: s.marks_obtained != null ? String(s.marks_obtained) : '',
        feedback: s.feedback ?? '',
      };
    }
    setDrafts(seed);
  }, [hw.submissions]);

  const submittedIds = useMemo(
    () => new Set((hw.submissions ?? []).map((s) => s.student_id)),
    [hw.submissions],
  );

  const save = useMutation({
    mutationFn: async () => {
      // Merge drafts back into submissions array.
      const map = new Map<string, HomeworkSubmission>();
      for (const s of hw.submissions ?? []) map.set(s.student_id, { ...s });
      for (const [sid, d] of Object.entries(drafts)) {
        if (!d.marks.trim() && !d.feedback.trim()) continue;
        const existing = map.get(sid) ?? { student_id: sid, status: 'graded' };
        const marks = d.marks.trim() ? Number(d.marks) : existing.marks_obtained;
        map.set(sid, {
          ...existing,
          marks_obtained: typeof marks === 'number' && !Number.isNaN(marks) ? marks : existing.marks_obtained,
          feedback: d.feedback.trim() || existing.feedback,
          status: 'graded',
        });
      }
      const r = await homeworkService.update(hw._id ?? hw.id ?? '', {
        submissions: Array.from(map.values()),
      });
      if (!r.ok) throw new Error(r.message ?? 'Save failed.');
      return r.data;
    },
    onSuccess: () => {
      onSaved();
      Alert.alert('Saved', 'Grades updated.');
    },
    onError: (err) => Alert.alert('Error', (err as Error).message),
  });

  if (loading) return <Card padding="lg"><Text style={styles.muted}>Loading roster…</Text></Card>;

  return (
    <Card padding="lg">
      <Text style={styles.sectionTitle}>Submissions</Text>
      <Text style={styles.muted}>
        {(hw.submissions ?? []).length} of {students.length} submitted
      </Text>

      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        {students.map((s) => {
          const sid = s._id ?? s.id ?? '';
          const submitted = submittedIds.has(sid);
          const d = drafts[sid] ?? { marks: '', feedback: '' };
          const name =
            fullName(s.profile) ||
            fullName({ first_name: s.first_name, last_name: s.last_name, full_name: s.full_name }) ||
            'Student';
          return (
            <View key={sid} style={[styles.gradeRow, shadows.card]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.gradeName}>{name}</Text>
                <Text style={styles.gradeMeta}>
                  {submitted ? 'Submitted' : 'Not submitted'}
                  {s.roll_no ? ` · Roll #${s.roll_no}` : ''}
                </Text>
              </View>
              <TextInput
                value={d.marks}
                onChangeText={(t) =>
                  setDrafts((prev) => ({ ...prev, [sid]: { ...d, marks: t } }))
                }
                placeholder="Marks"
                placeholderTextColor={colors.gray400}
                keyboardType="number-pad"
                style={styles.gradeInput}
              />
            </View>
          );
        })}
      </View>

      <View style={{ marginTop: spacing.md }}>
        <Button
          label={save.isPending ? 'Saving…' : 'Save grades'}
          onPress={() => save.mutate()}
          loading={save.isPending}
          fullWidth
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { ...typography.bodyLg, color: colors.gray800, lineHeight: 24 },
  sectionTitle: { ...typography.h4, color: colors.gray900 },
  muted: { ...typography.bodySm, color: colors.gray500, marginTop: 4 },
  attachmentLabel: { ...typography.bodySm, color: colors.gray700, marginTop: 6 },
  bigInput: {
    minHeight: 100,
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    padding: 14,
    color: colors.gray900,
    ...typography.bodyMd,
    marginTop: spacing.sm,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center',
    ...shadows.card,
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  gradeName: { ...typography.bodyMd, color: colors.gray900, fontWeight: '700' },
  gradeMeta: { ...typography.bodySm, color: colors.gray500 },
  gradeInput: {
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
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.errorLight,
    backgroundColor: colors.white, marginTop: spacing.lg,
  },
  deleteText: { ...typography.bodyMd, color: colors.error, fontWeight: '700' },
  pressed: { opacity: 0.85 },
});
