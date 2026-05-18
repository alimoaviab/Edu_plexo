import { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { useEvents, useTenant } from '@/hooks';
import { colors, spacing, typography } from '@/theme/tokens';
import { formatDate, isoToDate } from '@/utils/format';

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin';
  const events = useEvents();

  const item = useMemo(() => (events.items ?? []).find((e) => (e._id ?? e.id) === id), [events.items, id]);

  if (events.isLoading) return <ScreenContainer><SectionHeader title="Event" /><LoadingBlock /></ScreenContainer>;
  if (!item) {
    return (
      <ScreenContainer>
        <SectionHeader title="Event" />
        <ErrorState title="Event not found" message="It may have been removed." onRetry={() => events.refetch()} />
      </ScreenContainer>
    );
  }

  if (!canEdit) {
    return (
      <ScreenContainer flush>
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl3 }}>
          <View style={{ paddingHorizontal: spacing.base, gap: spacing.md }}>
            <SectionHeader title={item.title} subtitle={`${formatDate(item.start_date)}${item.location ? ' · ' + item.location : ''}`} />
            <Card padding="lg">
              <Text style={styles.body}>{item.description ?? ''}</Text>
            </Card>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const initial = {
    title: item.title,
    description: item.description ?? '',
    event_type: item.event_type ?? '',
    start_date: isoToDate(item.start_date),
    end_date: isoToDate(item.end_date),
    location: item.location ?? '',
  };
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
      <SectionHeader title="Edit Event" subtitle={item.title} />
      <EntityForm
        fields={fields}
        initial={initial}
        submitLabel="Save"
        loading={events.updating}
        errorMessage={events.updateError?.message}
        onSubmit={async (values) => {
          try {
            await events.update({ id: id!, input: values });
            Alert.alert('Updated', 'Event saved.');
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
