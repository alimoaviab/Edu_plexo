import { useMemo } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components/ui/Card';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { EntityForm, type FieldDescriptor } from '@/components/forms/EntityForm';
import { Icon } from '@/components/ui/Icon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { liveClassService } from '@/services';
import { useClasses, useLiveClasses, useSubjects, useTenant } from '@/hooks';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { formatDateTime } from '@/utils/format';

export default function LiveClassDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const canEdit = role === 'admin' || role === 'super_admin' || role === 'teacher';
  const live = useLiveClasses();
  const classes = useClasses();
  const subjects = useSubjects();

  const liveQ = useQuery({
    queryKey: ['live-class', id ?? ''],
    enabled: !!id,
    queryFn: async () => {
      const r = await liveClassService.get(id!);
      if (!r.ok) throw new Error(r.message ?? 'Failed.');
      return r.data!;
    },
  });

  const classOptions = useMemo(
    () => (classes.items?.data ?? []).map((c) => ({ label: [c.name, c.section].filter(Boolean).join(' — '), value: c._id ?? c.id ?? '' })),
    [classes.items],
  );
  const subjectOptions = useMemo(
    () => (subjects.items ?? []).map((s) => ({ label: s.name, value: s._id ?? s.id ?? '' })),
    [subjects.items],
  );

  if (liveQ.isLoading) return <ScreenContainer><SectionHeader title="Live Class" /><LoadingBlock /></ScreenContainer>;
  if (liveQ.error || !liveQ.data) {
    return (
      <ScreenContainer>
        <SectionHeader title="Live Class" />
        <ErrorState message={(liveQ.error as Error)?.message ?? 'Refresh.'} onRetry={() => liveQ.refetch()} />
      </ScreenContainer>
    );
  }

  const lc = liveQ.data;

  if (!canEdit) {
    return (
      <ScreenContainer flush>
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl3 }}>
          <View style={{ paddingHorizontal: spacing.base, gap: spacing.md }}>
            <SectionHeader title={lc.title} subtitle={formatDateTime(lc.scheduled_at)} />
            <Card padding="lg">
              <Text style={styles.body}>{lc.description ?? ''}</Text>
              <Text style={styles.meta}>Duration: {lc.duration_minutes ?? '—'} min</Text>
            </Card>
            {lc.meeting_url ? (
              <Pressable
                onPress={() => Linking.openURL(lc.meeting_url!).catch(() => Alert.alert('Error', 'Could not open URL.'))}
                style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
              >
                <Icon name="video" size={18} color={colors.white} />
                <Text style={styles.primaryBtnText}>Join meeting</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const initial = {
    title: lc.title,
    description: lc.description ?? '',
    class_id: lc.class_id ?? '',
    subject_id: lc.subject_id ?? '',
    scheduled_at: lc.scheduled_at ?? '',
    duration_minutes: lc.duration_minutes ?? 60,
    meeting_url: lc.meeting_url ?? '',
  };

  const fields: FieldDescriptor[] = [
    { key: 'title', label: 'Session title', required: true },
    { key: 'description', label: 'Description', type: 'multiline' },
    { key: 'class_id', label: 'Class', type: 'select', options: classOptions, required: true },
    { key: 'subject_id', label: 'Subject', type: 'select', options: subjectOptions },
    { key: 'scheduled_at', label: 'Scheduled at', placeholder: 'YYYY-MM-DDTHH:mm', required: true },
    { key: 'duration_minutes', label: 'Duration (minutes)', type: 'number' },
    { key: 'meeting_url', label: 'Meeting URL' },
  ];

  return (
    <ScreenContainer flush>
      <SectionHeader title="Edit Live Class" subtitle={lc.title} />
      <EntityForm
        fields={fields}
        initial={initial}
        submitLabel="Save changes"
        loading={live.updating}
        errorMessage={live.updateError?.message}
        onSubmit={async (values) => {
          try {
            await live.update({ id: id!, input: values });
            Alert.alert('Updated', 'Session saved.');
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
  meta: { ...typography.bodySm, color: colors.gray500, marginTop: spacing.sm },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: radius.lg, backgroundColor: colors.primary,
  },
  primaryBtnText: { ...typography.bodyLg, color: colors.white, fontWeight: '700' },
  pressed: { opacity: 0.85 },
});
