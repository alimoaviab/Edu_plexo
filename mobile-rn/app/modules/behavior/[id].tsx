import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { behaviorService } from '@/services';
import { useBehavior, useStudents, useTenant } from '@/hooks';
import { fullName, isoToDate } from '@/utils/format';

export default function BehaviorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const behavior = useBehavior();
  const students = useStudents();

  const noteQ = useQuery({
    queryKey: ['behavior', id ?? ''],
    enabled: !!id,
    queryFn: async () => {
      const r = await behaviorService.get(id!);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data!;
    },
  });

  const studentOptions = useMemo(
    () =>
      (students.items ?? []).map((s) => ({
        label:
          fullName(s.profile) ||
          fullName({ first_name: s.first_name, last_name: s.last_name, full_name: s.full_name }) ||
          'Student',
        value: s._id ?? s.id ?? '',
      })),
    [students.items],
  );

  if (noteQ.isLoading) return <ScreenContainer><SectionHeader title="Behavior" /><LoadingBlock /></ScreenContainer>;
  if (noteQ.error || !noteQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Behavior" />
        <ErrorState message={(noteQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => noteQ.refetch()} />
      </ScreenContainer>
    );
  }
  const b = noteQ.data;

  if (!canEdit) {
    return (
      <ScreenContainer>
        <SectionHeader title={b.category ?? 'Behavior note'} subtitle={b.notes ?? ''} />
      </ScreenContainer>
    );
  }

  const initial = {
    student_id: b.student_id,
    category: b.category ?? '',
    type: b.type ?? 'neutral',
    severity: b.severity ?? 'low',
    notes: b.notes ?? '',
    occurrence_date: isoToDate(b.occurrence_date),
  };

  const fields: FieldDescriptor[] = [
    { key: 'student_id', label: 'Student', type: 'select', options: studentOptions, required: true },
    { key: 'category', label: 'Category' },
    {
      key: 'type', label: 'Type', type: 'select',
      options: [
        { label: 'Positive', value: 'positive' },
        { label: 'Negative', value: 'negative' },
        { label: 'Neutral', value: 'neutral' },
      ],
    },
    {
      key: 'severity', label: 'Severity', type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    },
    { key: 'notes', label: 'Notes', type: 'multiline', required: true },
    { key: 'occurrence_date', label: 'Date', type: 'date' },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="Edit Behavior Note" />
      <EntityForm
        fields={fields}
        initial={initial}
        submitLabel="Save"
        loading={behavior.updating}
        errorMessage={behavior.updateError?.message}
        onSubmit={async (values) => {
          try {
            await behavior.update({ id: id!, input: values });
            Alert.alert('Updated', 'Note saved.');
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
