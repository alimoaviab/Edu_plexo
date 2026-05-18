import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSubjects, useTenant } from '@/hooks';

export default function NewSubject() {
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const subjects = useSubjects();

  if (!isAdmin) return <ScreenContainer><SectionHeader title="Add Subject" subtitle="Admin only" /></ScreenContainer>;

  const fields: FieldDescriptor[] = [
    { key: 'name', label: 'Subject name', required: true },
    { key: 'code', label: 'Subject code' },
    { key: 'description', label: 'Description', type: 'multiline' },
    { key: 'is_optional', label: 'Optional subject', type: 'switch' },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="Add Subject" />
      <EntityForm
        fields={fields}
        submitLabel="Create subject"
        loading={subjects.creating}
        errorMessage={subjects.createError?.message}
        onSubmit={async (values) => {
          try {
            await subjects.create(values);
            Alert.alert('Created', 'Subject added.');
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
