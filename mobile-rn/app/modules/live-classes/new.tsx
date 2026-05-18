import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useClasses, useLiveClasses, useSubjects, useTenant } from '@/hooks';

export default function NewLiveClass() {
  const router = useRouter();
  const { role, profileId, userId } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const live = useLiveClasses();
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

  if (!canEdit) return <ScreenContainer><SectionHeader title="Schedule Live Class" subtitle="Permission required" /></ScreenContainer>;

  const fields: FieldDescriptor[] = [
    { key: 'title', label: 'Session title', required: true },
    { key: 'description', label: 'Description', type: 'multiline' },
    { key: 'class_id', label: 'Class', type: 'select', options: classOptions, required: true },
    { key: 'subject_id', label: 'Subject', type: 'select', options: subjectOptions },
    { key: 'scheduled_at', label: 'Scheduled at', placeholder: 'YYYY-MM-DDTHH:mm', required: true },
    { key: 'duration_minutes', label: 'Duration (minutes)', type: 'number' },
    { key: 'meeting_url', label: 'Meeting URL' },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="Schedule Live Class" />
      <EntityForm
        fields={fields}
        initial={{ duration_minutes: 60 }}
        submitLabel="Schedule"
        loading={live.creating}
        errorMessage={live.createError?.message}
        onSubmit={async (values) => {
          try {
            await live.create({ ...values, teacher_id: profileId || userId });
            Alert.alert('Scheduled', 'Live class added.');
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
