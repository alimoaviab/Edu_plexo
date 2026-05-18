import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useAnnouncements, useTenant } from '@/hooks';

export default function NewAnnouncement() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const announcements = useAnnouncements();

  if (!canEdit) return <ScreenContainer><SectionHeader title="New Announcement" subtitle="Permission required" /></ScreenContainer>;

  const fields: FieldDescriptor[] = [
    { key: 'title', label: 'Title', required: true },
    { key: 'body', label: 'Message', type: 'multiline', required: true },
    {
      key: 'audience',
      label: 'Audience',
      type: 'select',
      options: [
        { label: 'Everyone', value: 'all' },
        { label: 'Teachers', value: 'teachers' },
        { label: 'Parents', value: 'parents' },
        { label: 'Students', value: 'students' },
      ],
    },
    { key: 'pinned', label: 'Pin to top', type: 'switch' },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="New Announcement" />
      <EntityForm
        fields={fields}
        initial={{ audience: 'all', pinned: false }}
        submitLabel="Send announcement"
        loading={announcements.creating}
        errorMessage={announcements.createError?.message}
        onSubmit={async (values) => {
          try {
            await announcements.create(values);
            Alert.alert('Sent', 'Announcement broadcast.');
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
