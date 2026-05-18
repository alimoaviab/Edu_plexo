import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { homeworkService } from '@/services';
import { useClasses, useHomework, useSubjects, useTenant } from '@/hooks';
import { isoToDate } from '@/utils/format';

export default function EditHomework() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';

  const hwQ = useQuery({
    queryKey: ['homework', id ?? ''],
    enabled: !!id,
    queryFn: async () => {
      const r = await homeworkService.get(id!);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data!;
    },
  });
  const homework = useHomework();
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

  if (!canEdit) return <ScreenContainer><SectionHeader title="Edit Homework" subtitle="Permission required" /></ScreenContainer>;
  if (hwQ.isLoading) return <ScreenContainer><SectionHeader title="Edit Homework" /><LoadingBlock /></ScreenContainer>;
  if (hwQ.error || !hwQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Edit Homework" />
        <ErrorState message={(hwQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => hwQ.refetch()} />
      </ScreenContainer>
    );
  }

  const h = hwQ.data;
  const initial = {
    title: h.title,
    description: h.description ?? '',
    class_id: h.class_id ?? '',
    subject_id: h.subject_id ?? '',
    due_date: isoToDate(h.due_date),
  };
  const fields: FieldDescriptor[] = [
    { key: 'title', label: 'Title', required: true },
    { key: 'description', label: 'Instructions', type: 'multiline', required: true },
    { key: 'class_id', label: 'Class', type: 'select', options: classOptions, required: true },
    { key: 'subject_id', label: 'Subject', type: 'select', options: subjectOptions, required: true },
    { key: 'due_date', label: 'Due date', type: 'date', required: true },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="Edit Homework" subtitle={h.title} />
      <EntityForm
        fields={fields}
        initial={initial}
        submitLabel="Save changes"
        loading={homework.updating}
        errorMessage={homework.updateError?.message}
        onSubmit={async (values) => {
          try {
            await homework.update({ id: id!, input: values });
            Alert.alert('Updated', 'Homework saved.');
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
