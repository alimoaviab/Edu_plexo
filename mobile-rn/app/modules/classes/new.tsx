import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useClasses, useTenant } from '@/hooks';

export default function NewClass() {
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const classes = useClasses();

  if (!isAdmin) {
    return <ScreenContainer><SectionHeader title="Add Class" subtitle="Admin only" /></ScreenContainer>;
  }

  const fields: FieldDescriptor[] = [
    { key: 'name', label: 'Class name', required: true, placeholder: 'e.g. Grade 7' },
    { key: 'section', label: 'Section', placeholder: 'A / B / C' },
    { key: 'grade_level', label: 'Grade level', type: 'number' },
    { key: 'capacity', label: 'Capacity', type: 'number' },
    { key: 'description', label: 'Description', type: 'multiline' },
  ];

  async function handleSubmit(values: Record<string, unknown>) {
    try {
      await classes.create(values);
      Alert.alert('Created', 'Class added.');
      router.back();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  }

  return (
    <ScreenContainer flush>
      <SectionHeader title="Add Class" />
      <EntityForm
        fields={fields}
        submitLabel="Create class"
        loading={classes.creating}
        errorMessage={classes.createError?.message}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </ScreenContainer>
  );
}
