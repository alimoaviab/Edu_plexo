import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useClasses, useSubjects, useTenant, useTests } from '@/hooks';

export default function NewTest() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const tests = useTests();
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

  if (!canEdit) return <ScreenContainer><SectionHeader title="New Test" subtitle="Permission required" /></ScreenContainer>;

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
      <SectionHeader title="New Test" />
      <EntityForm
        fields={fields}
        submitLabel="Schedule test"
        loading={tests.creating}
        errorMessage={tests.createError?.message}
        onSubmit={async (values) => {
          try {
            await tests.create({ ...values, type: 'test' });
            Alert.alert('Scheduled', 'Test created.');
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
