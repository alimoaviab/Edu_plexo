import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { teacherService } from '@/services';
import { useTeachers, useTenant } from '@/hooks';
import { qk } from '@/api/query-keys';
import { isoToDate } from '@/utils/format';

export default function EditTeacher() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const teachers = useTeachers();

  const teacherQ = useQuery({
    queryKey: qk.teacher(id ?? ''),
    enabled: !!id,
    queryFn: async () => {
      const result = await teacherService.get(id!);
      if (!result.ok) throw new Error(result.message ?? 'Lookup failed');
      return result.data!;
    },
  });

  if (!isAdmin) return <ScreenContainer><SectionHeader title="Edit Teacher" subtitle="Admin only" /></ScreenContainer>;
  if (teacherQ.isLoading) return <ScreenContainer><SectionHeader title="Edit Teacher" /><LoadingBlock /></ScreenContainer>;
  if (teacherQ.error || !teacherQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Edit Teacher" />
        <ErrorState title="Not found" message={(teacherQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => teacherQ.refetch()} />
      </ScreenContainer>
    );
  }

  const t = teacherQ.data;
  const initial = {
    first_name: t.profile?.first_name ?? t.first_name ?? '',
    last_name: t.profile?.last_name ?? t.last_name ?? '',
    email: t.profile?.email ?? t.email ?? '',
    phone: t.profile?.phone ?? t.phone ?? '',
    employee_id: t.employee_id ?? '',
    designation: t.designation ?? '',
    qualifications: t.qualifications ?? '',
    date_of_joining: isoToDate(t.date_of_joining),
  };

  const fields: FieldDescriptor[] = [
    { key: 'first_name', label: 'First name', required: true },
    { key: 'last_name', label: 'Last name', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'phone' },
    { key: 'employee_id', label: 'Employee ID' },
    { key: 'designation', label: 'Designation' },
    { key: 'qualifications', label: 'Qualifications' },
    { key: 'date_of_joining', label: 'Date of joining', type: 'date' },
  ];

  async function handleSubmit(values: Record<string, unknown>) {
    const profile = {
      first_name: values.first_name as string,
      last_name: values.last_name as string,
      phone: values.phone as string,
      email: values.email as string,
    };
    const body: Record<string, unknown> = {
      profile,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone,
      employee_id: values.employee_id,
      designation: values.designation,
      qualifications: values.qualifications,
      date_of_joining: values.date_of_joining,
    };
    try {
      await teachers.update({ id: id!, input: body });
      Alert.alert('Updated', 'Teacher saved.');
      router.back();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  }

  return (
    <ScreenContainer flush>
      <SectionHeader title="Edit Teacher" subtitle={`Updating ${initial.first_name} ${initial.last_name}`} />
      <EntityForm
        fields={fields}
        initial={initial}
        submitLabel="Save changes"
        loading={teachers.updating}
        errorMessage={teachers.updateError?.message}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </ScreenContainer>
  );
}
