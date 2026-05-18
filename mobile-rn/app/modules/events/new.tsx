import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useEvents, useTenant } from '@/hooks';

export default function NewEvent() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin';
  const events = useEvents();

  if (!canEdit) return <ScreenContainer><SectionHeader title="New Event" subtitle="Admin only" /></ScreenContainer>;

  const fields: FieldDescriptor[] = [
    { key: 'title', label: 'Title', required: true },
    { key: 'description', label: 'Description', type: 'multiline' },
    {
      key: 'event_type',
      label: 'Type',
      type: 'select',
      options: [
        { label: 'Holiday', value: 'holiday' },
        { label: 'Sport', value: 'sport' },
        { label: 'Cultural', value: 'cultural' },
        { label: 'Academic', value: 'academic' },
        { label: 'Other', value: 'other' },
      ],
    },
    { key: 'start_date', label: 'Start date', type: 'date', required: true },
    { key: 'end_date', label: 'End date', type: 'date' },
    { key: 'location', label: 'Location' },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="New Event" />
      <EntityForm
        fields={fields}
        initial={{ event_type: 'academic' }}
        submitLabel="Create event"
        loading={events.creating}
        errorMessage={events.createError?.message}
        onSubmit={async (values) => {
          try {
            await events.create(values);
            Alert.alert('Created', 'Event added.');
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
