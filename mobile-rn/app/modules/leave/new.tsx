import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useLeave, useTenant } from '@/hooks';

export default function NewLeave() {
  const router = useRouter();
  const { role } = useTenant();
  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';
  const requesterType = isTeacher ? 'teacher' : isStudent ? 'student' : undefined;
  const leave = useLeave(requesterType);

  if (!isTeacher && !isStudent) {
    return <ScreenContainer><SectionHeader title="Apply for Leave" subtitle="Only teachers and students apply." /></ScreenContainer>;
  }

  const fields: FieldDescriptor[] = [
    {
      key: 'leave_type',
      label: 'Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Sick leave', value: 'sick' },
        { label: 'Casual leave', value: 'casual' },
        { label: 'Emergency', value: 'emergency' },
        { label: 'Other', value: 'other' },
      ],
    },
    { key: 'start_date', label: 'Start date', type: 'date', required: true },
    { key: 'end_date', label: 'End date', type: 'date', required: true },
    { key: 'reason', label: 'Reason', type: 'multiline', required: true },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="Apply for Leave" />
      <EntityForm
        fields={fields}
        initial={{ leave_type: 'casual' }}
        submitLabel="Submit request"
        loading={leave.creating}
        errorMessage={leave.createError?.message}
        onSubmit={async (values) => {
          try {
            await leave.create({ ...values, requester_type: requesterType });
            Alert.alert('Submitted', 'Your leave request was sent for approval.');
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
