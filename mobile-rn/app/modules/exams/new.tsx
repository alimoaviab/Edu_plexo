import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useClasses, useExams, useSubjects, useTenant } from '@/hooks';

export default function NewExam() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
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

  if (!canEdit) return <ScreenContainer><SectionHeader title="New Exam" subtitle="Permission required" /></ScreenContainer>;

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
      key: 'status',
      label: 'Status',
      type: 'select',
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
      <SectionHeader title="New Exam" />
      <EntityForm
        fields={fields}
        initial={{ status: 'scheduled' }}
        submitLabel="Schedule exam"
        loading={exams.creating}
        errorMessage={exams.createError?.message}
        onSubmit={async (values) => {
          try {
            await exams.create({ ...values, type: 'exam' });
            Alert.alert('Scheduled', 'Exam created.');
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
