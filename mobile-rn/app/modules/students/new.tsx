/**
 * Create Student — admin-only. Body shape mirrors the web's
 * StudentForm so the same /api/students POST handler accepts it.
 */

import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useClasses, useStudents, useTenant } from '@/hooks';

export default function NewStudent() {
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';

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
    {
      key: 'parent_email',
      label: 'Parent email (links existing account if found)',
      type: 'email',
      helper: 'Optional. If a parent account exists with this email, the student will be linked.',
    },
  ];

  if (!isAdmin) {
    return (
      <ScreenContainer>
        <SectionHeader title="Add Student" subtitle="Admin only" />
      </ScreenContainer>
    );
  }

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
      // legacy flat fields web also accepts
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone,
      parent_name: values.parent_name,
      parent_phone: values.parent_phone,
      parent_email: values.parent_email,
    };

    try {
      await students.create(body);
      Alert.alert('Created', 'Student added.');
      router.back();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  }

  return (
    <ScreenContainer flush>
      <SectionHeader title="Add Student" subtitle="Profile, class and parent linkage" />
      <EntityForm
        fields={fields}
        submitLabel="Create student"
        loading={students.creating}
        errorMessage={students.createError?.message}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </ScreenContainer>
  );
}
