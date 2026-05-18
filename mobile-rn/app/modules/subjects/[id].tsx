import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { subjectService } from '@/services';
import { useSubjects, useTenant } from '@/hooks';
import { qk } from '@/api/query-keys';

export default function SubjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const subjects = useSubjects();

  const subjectQ = useQuery({
    queryKey: qk.subject(id ?? ''),
    enabled: !!id,
    queryFn: async () => {
      const result = await subjectService.get(id!);
      if (!result.ok) throw new Error(result.message ?? 'Lookup failed');
      return result.data!;
    },
  });

  if (subjectQ.isLoading) return <ScreenContainer><SectionHeader title="Subject" /><LoadingBlock /></ScreenContainer>;
  if (subjectQ.error || !subjectQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Subject" />
        <ErrorState message={(subjectQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => subjectQ.refetch()} />
      </ScreenContainer>
    );
  }

  const s = subjectQ.data;
  const initial = { name: s.name, code: s.code ?? '', description: s.description ?? '', is_optional: !!s.is_optional };

  if (!isAdmin) {
    return (
      <ScreenContainer>
        <SectionHeader title={s.name} subtitle={s.code ?? s.description ?? ''} />
      </ScreenContainer>
    );
  }

  const fields: FieldDescriptor[] = [
    { key: 'name', label: 'Subject name', required: true },
    { key: 'code', label: 'Subject code' },
    { key: 'description', label: 'Description', type: 'multiline' },
    { key: 'is_optional', label: 'Optional subject', type: 'switch' },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="Edit Subject" subtitle={s.name} />
      <EntityForm
        fields={fields}
        initial={initial}
        submitLabel="Save"
        loading={subjects.updating}
        errorMessage={subjects.updateError?.message}
        onSubmit={async (values) => {
          try {
            await subjects.update({ id: id!, input: values });
            Alert.alert('Updated', 'Subject saved.');
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
