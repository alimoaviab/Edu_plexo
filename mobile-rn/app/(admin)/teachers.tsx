import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { RecordProfile } from '@/components/admin/RecordProfile';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { getAdminRecord, getRecordId, listAdminRecords } from '@/modules/admin/api';
import { ADMIN_MODULE_BY_KEY } from '@/modules/admin/config';
import type { AdminModuleDefinition, AdminRecord } from '@/modules/admin/types';
import { recordSubtitle, recordTitle } from '@/modules/admin/record-utils';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

const TEACHER_PICKER_DEFINITION: AdminModuleDefinition = {
  ...ADMIN_MODULE_BY_KEY.teachers,
  pageSize: 200,
};

export default function TeachersScreen() {
  const router = useRouter();
  const [selectedTeacher, setSelectedTeacher] = useState<AdminRecord | null>(null);

  const teachersQuery = useQuery({
    queryKey: ['admin-flow-teachers'],
    queryFn: () => listAdminRecords(TEACHER_PICKER_DEFINITION, { page: 1 }),
  });

  const teacherDetailQuery = useQuery({
    queryKey: ['admin-flow-teacher-detail', selectedTeacher ? getRecordId(selectedTeacher) : ''],
    queryFn: () => getAdminRecord(ADMIN_MODULE_BY_KEY.teachers, selectedTeacher ?? {}),
    enabled: !!selectedTeacher,
  });

  if (selectedTeacher) {
    const detail = teacherDetailQuery.data ?? selectedTeacher;
    return (
      <ScreenContainer scroll>
        <Header
          showBack
          onBack={() => setSelectedTeacher(null)}
          greeting="Teacher Profile"
          title={recordTitle(detail, ADMIN_MODULE_BY_KEY.teachers, 'Teacher')}
          subtitle="Complete backend profile"
          right={<ManageButton label="Manage" icon="settings" onPress={() => router.push('/(admin)/module/teachers' as never)} />}
        />
        {teacherDetailQuery.isFetching ? <InlineLoading label="Refreshing profile" /> : null}
        <RecordProfile
          record={detail}
          fallbackTitle="Teacher"
          icon="users"
          subtitle={recordSubtitle(detail, ['employee_no', 'email', 'phone', 'status'])}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <Header
        greeting="Faculty"
        title="Teachers"
        subtitle="Select a teacher to open the complete profile"
        right={<ManageButton label="Add" onPress={() => router.push('/(admin)/module/teachers' as never)} />}
      />
      {teachersQuery.isLoading ? (
        <StateCard loading title="Loading teachers" />
      ) : teachersQuery.isError ? (
        <StateCard title="Unable to load teachers" message={teachersQuery.error.message} />
      ) : teachersQuery.data?.items.length ? (
        <View style={styles.list}>
          {teachersQuery.data.items.map((teacher) => (
            <TeacherRow key={getRecordId(teacher)} record={teacher} onPress={() => setSelectedTeacher(teacher)} />
          ))}
        </View>
      ) : (
        <StateCard title="No teachers" message="Create teachers from the existing Teachers module." />
      )}
    </ScreenContainer>
  );
}

function TeacherRow({ record, onPress }: { record: AdminRecord; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, shadows.card, pressed && styles.pressed]}>
      <View style={styles.rowIcon}>
        <Icon name="users" size={20} color={colors.primary} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {recordTitle(record, ADMIN_MODULE_BY_KEY.teachers, 'Teacher')}
        </Text>
        <Text style={styles.rowSubtitle} numberOfLines={1}>
          {recordSubtitle(record, ['employee_no', 'email', 'phone', 'qualification']) || 'Teacher profile'}
        </Text>
      </View>
      <Icon name="chevron-right" size={18} color={colors.gray400} />
    </Pressable>
  );
}

function ManageButton({ label, icon = 'plus', onPress }: { label: string; icon?: IconName; onPress: () => void }) {
  return <Button label={label} size="sm" onPress={onPress} iconLeft={<Icon name={icon} size={15} color={colors.white} />} />;
}

function InlineLoading({ label }: { label: string }) {
  return (
    <View style={styles.inlineLoading}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={styles.inlineLoadingText}>{label}</Text>
    </View>
  );
}

function StateCard({ title, message, loading = false }: { title: string; message?: string; loading?: boolean }) {
  return (
    <Card style={styles.state}>
      {loading ? <ActivityIndicator color={colors.primary} /> : null}
      <Text style={styles.stateTitle}>{title}</Text>
      {message ? <Text style={styles.stateText}>{message}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm, paddingBottom: spacing.xl3 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { ...typography.bodyMd, color: colors.gray900, fontWeight: '800' },
  rowSubtitle: { ...typography.bodySm, color: colors.gray500 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  state: { alignItems: 'center', gap: spacing.sm },
  stateTitle: { ...typography.bodyLg, color: colors.gray900, fontWeight: '800', textAlign: 'center' },
  stateText: { ...typography.bodySm, color: colors.gray500, textAlign: 'center' },
  inlineLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  inlineLoadingText: { ...typography.bodySm, color: colors.gray500, fontWeight: '700' },
});
