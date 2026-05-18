import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { testService } from '@/services';
import { useClasses, useSubjects, useTenant, useTests } from '@/hooks';
import { isoToDate } from '@/utils/format';

export default function EditTest() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const tests = useTests();
  const classes = useClasses();
  const subjects = useSubjects();

  const testQ = useQuery({
    queryKey: ['test', id ?? ''],
    enabled: !!id,
    queryFn: async () => {
      const r = await testService.get(id!);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data!;
    },
  });

  const classOptions = useMemo(
    () => (classes.items?.data ?? []).map((c) => ({ label: [c.name, c.section].filter(Boolean).join(' — '), value: c._id ?? c.id ?? '' })),
    [classes.items],
  );
  const subjectOptions = useMemo(
    () => (subjects.items ?? []).map((s) => ({ label: s.name, value: s._id ?? s.id ?? '' })),
    [subjects.items],
  );

  if (!canEdit) return <ScreenContainer><SectionHeader title="Edit Test" subtitle="Permission required" /></ScreenContainer>;
  if (testQ.isLoading) return <ScreenContainer><SectionHeader title="Edit Test" /><LoadingBlock /></ScreenContainer>;
  if (testQ.error || !testQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Edit Test" />
        <ErrorState message={(testQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => testQ.refetch()} />
      </ScreenContainer>
    );
  }

  const t = testQ.data;
  const initial = {
    name: t.name,
    description: t.description ?? '',
    class_id: t.class_id ?? '',
    subject_id: t.subject_id ?? '',
    start_date: isoToDate(t.start_date),
    total_marks: t.total_marks ?? '',
    passing_marks: t.passing_marks ?? '',
  };

  const fields: FieldDescriptor[] = [
    { key: 'name', label: 'Test name', required: true },
    { key: 'description', label: 'Description', type: 'multiline' },
    { key: 'class_id', label: 'Class', type: 'select', options: classOptions, required: true },
    { key: 'subject_id', label: 'Subject', type: 'select', options: subjectOptions, required: true },
    { key: 'start_date', label: 'Date', type: 'date', required: true },
    { key: 'total_marks', label: 'Total marks', type: 'number' },
    { key: 'passing_marks', label: 'Passing marks', type: 'number' },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="Edit Test" subtitle={t.name} />
      <EntityForm
        fields={fields}
        initial={initial}
        submitLabel="Save changes"
        loading={tests.updating}
        errorMessage={tests.updateError?.message}
        onSubmit={async (values) => {
          const payload: Record<string, unknown> = { ...values };
          if (typeof payload.total_marks === 'string') payload.total_marks = Number(payload.total_marks) || undefined;
          if (typeof payload.passing_marks === 'string') payload.passing_marks = Number(payload.passing_marks) || undefined;
          try {
            await tests.update({ id: id!, input: payload });
            Alert.alert('Updated', 'Test saved.');
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
