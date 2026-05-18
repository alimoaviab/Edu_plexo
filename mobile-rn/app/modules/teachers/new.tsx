import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useTeachers, useTenant } from '@/hooks';

export default function NewTeacher() {
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const teachers = useTeachers();

  const fields: FieldDescriptor[] = [
    { key: 'first_name', label: 'First name', required: true },
    { key: 'last_name', label: 'Last name', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'phone' },
    { key: 'employee_id', label: 'Employee ID' },
    { key: 'designation', label: 'Designation' },
    { key: 'qualifications', label: 'Qualifications' },
    { key: 'date_of_joining', label: 'Date of joining', type: 'date' },
    { key: 'password', label: 'Initial password', type: 'password', required: true, helper: 'The teacher uses this to log in. They can change it later.' },
  ];

  if (!isAdmin) {
    return (
      <ScreenContainer>
        <SectionHeader title="Add Teacher" subtitle="Admin only" />
      </ScreenContainer>
    );
  }

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
      password: values.password,
    };
    try {
      await teachers.create(body);
      Alert.alert('Created', 'Teacher added.');
      router.back();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  }

  return (
    <ScreenContainer flush>
      <SectionHeader title="Add Teacher" subtitle="Account, profile and assignment" />
      <EntityForm
        fields={fields}
        submitLabel="Create teacher"
        loading={teachers.creating}
        errorMessage={teachers.createError?.message}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </ScreenContainer>
  );
}
