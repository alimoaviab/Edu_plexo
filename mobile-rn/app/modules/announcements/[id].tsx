import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';

import { Card } from '@/components/ui/Card';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { useAnnouncements, useTenant } from '@/hooks';
import { colors, spacing, typography } from '@/theme/tokens';
import { formatDateTime } from '@/utils/format';

export default function AnnouncementDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const announcements = useAnnouncements();

  const item = useMemo(
    () => (announcements.items ?? []).find((a) => (a._id ?? a.id) === id),
    [announcements.items, id],
  );

  if (announcements.isLoading) return <ScreenContainer><SectionHeader title="Announcement" /><LoadingBlock /></ScreenContainer>;
  if (!item) {
    return (
      <ScreenContainer>
        <SectionHeader title="Announcement" />
        <ErrorState title="Announcement not found" message="This may have been removed." onRetry={() => announcements.refetch()} />
      </ScreenContainer>
    );
  }

  if (!canEdit) {
    return (
      <ScreenContainer flush>
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl3 }}>
          <View style={{ paddingHorizontal: spacing.base, gap: spacing.md }}>
            <SectionHeader title={item.title} subtitle={formatDateTime(item.created_at)} />
            <Card padding="lg">
              <Text style={styles.body}>{item.body ?? ''}</Text>
            </Card>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const initial = {
    title: item.title,
    body: item.body ?? '',
    audience: item.audience ?? 'all',
    pinned: !!item.pinned,
  };
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
      <SectionHeader title="Edit Announcement" subtitle={item.title} />
      <EntityForm
        fields={fields}
        initial={initial}
        submitLabel="Save"
        loading={announcements.updating}
        errorMessage={announcements.updateError?.message}
        onSubmit={async (values) => {
          try {
            await announcements.update({ id: id!, input: values });
            Alert.alert('Updated', 'Announcement saved.');
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

const styles = StyleSheet.create({
  body: { ...typography.bodyLg, color: colors.gray800, lineHeight: 24 },
});
