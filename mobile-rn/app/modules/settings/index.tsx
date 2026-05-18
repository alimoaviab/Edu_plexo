import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSettings, useTenant } from '@/hooks';

export default function SettingsScreen() {
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin';
  const settings = useSettings();

  if (settings.isLoading && !settings.settings) return <ScreenContainer><SectionHeader title="School Profile" /><LoadingBlock /></ScreenContainer>;
  if (settings.error && !settings.settings) {
    return (
      <ScreenContainer>
        <SectionHeader title="School Profile" />
        <ErrorState message={settings.error.message} onRetry={() => settings.refetch()} />
      </ScreenContainer>
    );
  }

  const s = settings.settings ?? {};
  const initial = {
    school_name: s.school_name ?? '',
    email: s.email ?? '',
    phone: s.phone ?? '',
    address: s.address ?? '',
    city: s.city ?? '',
    country: s.country ?? '',
    timezone: s.timezone ?? '',
    currency: s.currency ?? '',
    language: s.language ?? '',
  };

  const fields: FieldDescriptor[] = [
    { key: 'school_name', label: 'School name' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'phone' },
    { key: 'address', label: 'Address', type: 'multiline' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'timezone', label: 'Timezone', placeholder: 'e.g. Asia/Karachi' },
    { key: 'currency', label: 'Currency', placeholder: 'PKR / USD' },
    { key: 'language', label: 'Language', placeholder: 'en' },
  ];

  if (!canEdit) {
    return (
      <ScreenContainer flush>
        <SectionHeader title="School Profile" />
        <EntityForm
          fields={fields.map((f) => ({ ...f, disabled: true }))}
          initial={initial}
          submitLabel="Read only"
          onSubmit={async () => undefined}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer flush>
      <SectionHeader title="School Profile" subtitle="Workspace, contact and branding" />
      <EntityForm
        fields={fields}
        initial={initial}
        submitLabel="Save settings"
        loading={settings.updating}
        errorMessage={settings.updateError?.message}
        onSubmit={async (values) => {
          try {
            await settings.update(values);
            Alert.alert('Saved', 'Settings updated.');
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
