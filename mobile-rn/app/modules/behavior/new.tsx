import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useBehavior, useStudents, useTenant } from '@/hooks';
import { fullName, todayIso } from '@/utils/format';

export default function NewBehavior() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const behavior = useBehavior();
  const students = useStudents();

  if (!canEdit) return <ScreenContainer><SectionHeader title="New Note" subtitle="Permission required" /></ScreenContainer>;

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

  const fields: FieldDescriptor[] = [
    { key: 'student_id', label: 'Student', type: 'select', options: studentOptions, required: true },
    { key: 'category', label: 'Category', placeholder: 'e.g. Punctuality, Honesty' },
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      options: [
        { label: 'Positive', value: 'positive' },
        { label: 'Negative', value: 'negative' },
        { label: 'Neutral', value: 'neutral' },
      ],
    },
    {
      key: 'severity',
      label: 'Severity',
      type: 'select',
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
      <SectionHeader title="New Behavior Note" />
      <EntityForm
        fields={fields}
        initial={{ type: 'neutral', severity: 'low', occurrence_date: todayIso() }}
        submitLabel="Save note"
        loading={behavior.creating}
        errorMessage={behavior.createError?.message}
        onSubmit={async (values) => {
          try {
            await behavior.create(values);
            Alert.alert('Saved', 'Note added.');
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
