/**
 * Edit Student — admin only. PATCH /api/students/{id} with the same body
 * shape as create (only changed fields need to be sent, but we send the
 * whole form for simplicity — the backend already merges on PATCH).
 */

import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useClasses, useStudent, useStudents, useTenant } from '@/hooks';
import { isoToDate } from '@/utils/format';

export default function EditStudent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';

  const studentQ = useStudent(id);
  const classesQ = useClasses();
  const students = useStudents();

  const classOptions = useMemo(
    () =>
      (classesQ.items?.data ?? []).map((c) => ({
        label: [c.name, c.section].filter(Boolean).join(' — '),
        value: c._id ?? c.id ?? '',
      })),
    [classesQ.items],
  );

  if (!isAdmin) {
    return (
      <ScreenContainer>
        <SectionHeader title="Edit Student" subtitle="Admin only" />
      </ScreenContainer>
    );
  }
  if (studentQ.isLoading) {
    return (
      <ScreenContainer>
        <SectionHeader title="Edit Student" />
        <LoadingBlock />
      </ScreenContainer>
    );
  }
  if (studentQ.error || !studentQ.student) {
    return (
      <ScreenContainer>
        <SectionHeader title="Edit Student" />
        <ErrorState
          title="Student not found"
          message={studentQ.error?.message ?? 'Refresh and try again.'}
          onRetry={() => studentQ.refetch()}
        />
      </ScreenContainer>
    );
  }

  const s = studentQ.student;
  const initial = {
    first_name: s.profile?.first_name ?? s.first_name ?? '',
    last_name: s.profile?.last_name ?? s.last_name ?? '',
    email: s.profile?.email ?? s.email ?? '',
    phone: s.profile?.phone ?? s.phone ?? '',
    date_of_birth: isoToDate(s.profile?.date_of_birth),
    gender: s.profile?.gender ?? '',
    class_id: s.class_id ?? '',
    roll_no: s.roll_no ?? '',
    admission_no: s.admission_no ?? '',
    admission_date: isoToDate(s.admission_date ?? s.enrollment_date),
    address: s.profile?.address ?? '',
    parent_name: s.parent_name ?? '',
    parent_phone: s.parent_phone ?? '',
    parent_email: s.parent_email ?? '',
  };

  const fields: FieldDescriptor[] = [
    { key: 'first_name', label: 'First name', required: true },
    { key: 'last_name', label: 'Last name', required: true },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'phone' },
    { key: 'date_of_birth', label: 'Date of birth', type: 'date' },
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
      ],
    },
    { key: 'class_id', label: 'Class', type: 'select', options: classOptions, required: true },
    { key: 'roll_no', label: 'Roll number' },
    { key: 'admission_no', label: 'Admission number' },
    { key: 'admission_date', label: 'Admission date', type: 'date' },
    { key: 'address', label: 'Address', type: 'multiline' },
    { key: 'parent_name', label: 'Parent name' },
    { key: 'parent_phone', label: 'Parent phone', type: 'phone' },
    { key: 'parent_email', label: 'Parent email', type: 'email' },
  ];

  async function handleSubmit(values: Record<string, unknown>) {
    const profile = {
      first_name: values.first_name as string,
      last_name: values.last_name as string,
      phone: values.phone as string,
      email: values.email as string,
      date_of_birth: values.date_of_birth as string,
      gender: values.gender as string,
      address: values.address as string,
    };
    const body: Record<string, unknown> = {
      profile,
      class_id: values.class_id,
      roll_no: values.roll_no,
      admission_no: values.admission_no,
      admission_date: values.admission_date,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone,
      parent_name: values.parent_name,
      parent_phone: values.parent_phone,
      parent_email: values.parent_email,
    };

    try {
      await students.update({ id: id!, input: body });
      Alert.alert('Updated', 'Student profile saved.');
      router.back();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  }

  return (
    <ScreenContainer flush>
      <SectionHeader title="Edit Student" subtitle={`Updating ${initial.first_name} ${initial.last_name}`} />
      <EntityForm
        fields={fields}
        initial={initial}
        submitLabel="Save changes"
        loading={students.updating}
        errorMessage={students.updateError?.message}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </ScreenContainer>
  );
}
