import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useClasses, useSubjects, useTeachers, useTenant, useTimetable } from '@/hooks';

export default function NewTimetable() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin';
  const timetable = useTimetable();
  const classes = useClasses();
  const subjects = useSubjects();
  const teachers = useTeachers();

  const classOptions = useMemo(
    () => (classes.items?.data ?? []).map((c) => ({ label: [c.name, c.section].filter(Boolean).join(' — '), value: c._id ?? c.id ?? '' })),
    [classes.items],
  );
  const subjectOptions = useMemo(
    () => (subjects.items ?? []).map((s) => ({ label: s.name, value: s._id ?? s.id ?? '' })),
    [subjects.items],
  );
  const teacherOptions = useMemo(() => {
    const arr = Array.isArray(teachers.items)
      ? (teachers.items as unknown[])
      : ((teachers.items as { items?: unknown[] } | undefined)?.items ?? []);
    return (arr as Array<{ _id?: string; id?: string; profile?: { first_name?: string; last_name?: string }; first_name?: string; last_name?: string }>).map((t) => ({
      label: [t.profile?.first_name ?? t.first_name, t.profile?.last_name ?? t.last_name].filter(Boolean).join(' ') || 'Teacher',
      value: t._id ?? t.id ?? '',
    }));
  }, [teachers.items]);

  if (!canEdit) return <ScreenContainer><SectionHeader title="Add Period" subtitle="Admin only" /></ScreenContainer>;

  const fields: FieldDescriptor[] = [
    { key: 'class_id', label: 'Class', type: 'select', options: classOptions, required: true },
    { key: 'subject_id', label: 'Subject', type: 'select', options: subjectOptions, required: true },
    { key: 'teacher_id', label: 'Teacher', type: 'select', options: teacherOptions, required: true },
    {
      key: 'day_of_week',
      label: 'Day',
      type: 'select',
      required: true,
      options: [
        { label: 'Monday', value: '1' },
        { label: 'Tuesday', value: '2' },
        { label: 'Wednesday', value: '3' },
        { label: 'Thursday', value: '4' },
        { label: 'Friday', value: '5' },
        { label: 'Saturday', value: '6' },
        { label: 'Sunday', value: '7' },
      ],
    },
    { key: 'period_number', label: 'Period number', type: 'number', required: true },
    { key: 'start_time', label: 'Start time', type: 'time', required: true },
    { key: 'end_time', label: 'End time', type: 'time', required: true },
    { key: 'room', label: 'Room' },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="Add Period" subtitle="Schedule one period at a time" />
      <EntityForm
        fields={fields}
        submitLabel="Add to timetable"
        loading={timetable.creating}
        errorMessage={timetable.createError?.message}
        onSubmit={async (values) => {
          const body = {
            ...values,
            day_of_week: Number(values.day_of_week),
            period_number: Number(values.period_number),
          };
          try {
            await timetable.create(body);
            Alert.alert('Added', 'Period saved.');
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
