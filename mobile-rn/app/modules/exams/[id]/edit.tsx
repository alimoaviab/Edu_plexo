import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { examService } from '@/services';
import { useClasses, useExams, useSubjects, useTenant } from '@/hooks';
import { isoToDate } from '@/utils/format';

export default function EditExam() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';

  const examQ = useQuery({
    queryKey: ['exam', id ?? ''],
    enabled: !!id,
    queryFn: async () => {
      const r = await examService.get(id!);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data!;
    },
  });
  const exams = useExams();
  const classes = useClasses();
  const subjects = useSubjects();

  const classOptions = useMemo(
    () => (classes.items?.data ?? []).map((c) => ({ label: [c.name, c.section].filter(Boolean).join(' — '), value: c._id ?? c.id ?? '' })),
    [classes.items],
  );
  const subjectOptions = useMemo(
    () => (subjects.items ?? []).map((s) => ({ label: s.name, value: s._id ?? s.id ?? '' })),
    [subjects.items],
  );

  if (!canEdit) return <ScreenContainer><SectionHeader title="Edit Exam" subtitle="Permission required" /></ScreenContainer>;
  if (examQ.isLoading) return <ScreenContainer><SectionHeader title="Edit Exam" /><LoadingBlock /></ScreenContainer>;
  if (examQ.error || !examQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Edit Exam" />
        <ErrorState message={(examQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => examQ.refetch()} />
      </ScreenContainer>
    );
  }

  const e = examQ.data;
  const initial = {
    name: e.name,
    description: e.description ?? '',
    class_id: e.class_id ?? '',
    subject_id: e.subject_id ?? '',
    start_date: isoToDate(e.start_date),
    end_date: isoToDate(e.end_date),
    total_marks: e.total_marks ?? '',
    passing_marks: e.passing_marks ?? '',
    status: e.status ?? '',
  };

  const fields: FieldDescriptor[] = [
    { key: 'name', label: 'Exam name', required: true },
    { key: 'description', label: 'Description', type: 'multiline' },
    { key: 'class_id', label: 'Class', type: 'select', options: classOptions, required: true },
    { key: 'subject_id', label: 'Subject', type: 'select', options: subjectOptions },
    { key: 'start_date', label: 'Start date', type: 'date', required: true },
    { key: 'end_date', label: 'End date', type: 'date' },
    { key: 'total_marks', label: 'Total marks', type: 'number' },
    { key: 'passing_marks', label: 'Passing marks', type: 'number' },
    {
      key: 'status', label: 'Status', type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="Edit Exam" subtitle={e.name} />
      <EntityForm
        fields={fields}
        initial={initial}
        submitLabel="Save changes"
        loading={exams.updating}
        errorMessage={exams.updateError?.message}
        onSubmit={async (values) => {
          const payload: Record<string, unknown> = { ...values };
          if (typeof payload.total_marks === 'string') payload.total_marks = Number(payload.total_marks) || undefined;
          if (typeof payload.passing_marks === 'string') payload.passing_marks = Number(payload.passing_marks) || undefined;
          try {
            await exams.update({ id: id!, input: payload });
            Alert.alert('Updated', 'Exam saved.');
            router.back();
          } catch (err) {
            Alert.alert('Error', (err as Error).message);
          }
        }}
        onCancel={() => router.back()}
      />
    </ScreenContainer>
  );
}
