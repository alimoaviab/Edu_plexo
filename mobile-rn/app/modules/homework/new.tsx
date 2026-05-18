import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useClasses, useHomework, useSubjects, useTenant } from '@/hooks';

export default function NewHomework() {
  const router = useRouter();
  const { role, profileId, userId } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
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

  if (!canEdit) return <ScreenContainer><SectionHeader title="New Homework" subtitle="Permission required" /></ScreenContainer>;

  const fields: FieldDescriptor[] = [
    { key: 'title', label: 'Title', required: true },
    { key: 'description', label: 'Instructions', type: 'multiline', required: true },
    { key: 'class_id', label: 'Class', type: 'select', options: classOptions, required: true },
    { key: 'subject_id', label: 'Subject', type: 'select', options: subjectOptions, required: true },
    { key: 'due_date', label: 'Due date', type: 'date', required: true },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="New Homework" />
      <EntityForm
        fields={fields}
        submitLabel="Assign"
        loading={homework.creating}
        errorMessage={homework.createError?.message}
        onSubmit={async (values) => {
          const body = {
            ...values,
            teacher_id: role === 'teacher' ? profileId || userId : undefined,
          };
          try {
            await homework.create(body);
            Alert.alert('Created', 'Homework assigned.');
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
