import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { classService } from '@/services';
import { useClasses, useTenant } from '@/hooks';
import { qk } from '@/api/query-keys';

export default function EditClass() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const classes = useClasses();

  const classQ = useQuery({
    queryKey: qk.classDetail(id ?? ''),
    enabled: !!id,
    queryFn: async () => {
      const result = await classService.get(id!);
      if (!result.ok) throw new Error(result.message ?? 'Lookup failed');
      return result.data!;
    },
  });

  if (!isAdmin) return <ScreenContainer><SectionHeader title="Edit Class" subtitle="Admin only" /></ScreenContainer>;
  if (classQ.isLoading) return <ScreenContainer><SectionHeader title="Edit Class" /><LoadingBlock /></ScreenContainer>;
  if (classQ.error || !classQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Edit Class" />
        <ErrorState message={(classQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => classQ.refetch()} />
      </ScreenContainer>
    );
  }

  const c = classQ.data;
  const initial = {
    name: c.name,
    section: c.section ?? '',
    grade_level: c.grade_level ?? '',
    capacity: c.capacity ?? '',
    description: c.description ?? '',
  };
  const fields: FieldDescriptor[] = [
    { key: 'name', label: 'Class name', required: true },
    { key: 'section', label: 'Section' },
    { key: 'grade_level', label: 'Grade level', type: 'number' },
    { key: 'capacity', label: 'Capacity', type: 'number' },
    { key: 'description', label: 'Description', type: 'multiline' },
  ];

  async function handleSubmit(values: Record<string, unknown>) {
    try {
      await classes.update({ id: id!, input: values });
      Alert.alert('Updated', 'Class saved.');
      router.back();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  }

  return (
    <ScreenContainer flush>
      <SectionHeader title="Edit Class" subtitle={c.name} />
      <EntityForm
        fields={fields}
        initial={initial}
        submitLabel="Save changes"
        loading={classes.updating}
        errorMessage={classes.updateError?.message}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </ScreenContainer>
  );
}
