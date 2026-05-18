/**
 * Student detail. Admins can edit/delete; teachers/parents/students see
 * the read-only profile.
 */

import { useMemo } from 'react';
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useStudent, useStudents, useTenant } from '@/hooks';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { fullName, formatDate } from '@/utils/format';

export default function StudentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useTenant();
  const isAdmin = role === 'admin' || role === 'super_admin';
  const isTeacher = role === 'teacher';
  const canEdit = isAdmin;
  const canDelete = isAdmin;

  const studentQ = useStudent(id);
  const students = useStudents();

  const name = useMemo(() => {
    const s = studentQ.student;
    if (!s) return 'Student';
    return (
      fullName(s.profile) ||
      fullName({
        first_name: s.first_name,
        last_name: s.last_name,
        full_name: s.full_name,
      }) ||
      'Student'
    );
  }, [studentQ.student]);

  function handleDelete() {
    Alert.alert(
      'Delete student',
      'This permanently removes the student. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await students.remove(id!);
              router.back();
            } catch (err) {
              Alert.alert('Error', (err as Error).message);
            }
          },
        },
      ],
    );
  }

  if (studentQ.isLoading) {
    return (
      <ScreenContainer>
        <SectionHeader title="Student" />
        <LoadingBlock label="Loading student…" />
      </ScreenContainer>
    );
  }
  if (studentQ.error) {
    return (
      <ScreenContainer>
        <SectionHeader title="Student" />
        <ErrorState message={studentQ.error.message} onRetry={() => studentQ.refetch()} />
      </ScreenContainer>
    );
  }

  const s = studentQ.student;
  if (!s) {
    return (
      <ScreenContainer>
        <SectionHeader title="Student" />
        <ErrorState title="Student not found" message="This student may have been removed." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer flush>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={studentQ.isLoading}
            onRefresh={() => studentQ.refetch()}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.padded}>
          <SectionHeader
            title={name}
            subtitle={
              s.class_id
                ? `Class ${s.class_id}${s.section ? ` · ${s.section}` : ''}`
                : 'Student profile'
            }
            right={
              canEdit ? (
                <Pressable
                  onPress={() =>
                    router.push(
                      `/modules/students/${encodeURIComponent(id!)}/edit` as never,
                    )
                  }
                  style={({ pressed }) => [styles.editBtn, pressed && styles.pressed]}
                  hitSlop={8}
                >
                  <Icon name="settings" size={18} color={colors.gray700} />
                </Pressable>
              ) : null
            }
          />

          <Card padding="lg">
            <DetailRow label="Email" value={s.profile?.email ?? s.email ?? '—'} />
            <DetailRow label="Phone" value={s.profile?.phone ?? s.phone ?? '—'} />
            <DetailRow label="Roll #" value={s.roll_no ?? '—'} />
            <DetailRow label="Admission #" value={s.admission_no ?? '—'} />
            <DetailRow
              label="Admission date"
              value={formatDate(s.admission_date ?? s.enrollment_date)}
            />
            <DetailRow label="Date of birth" value={formatDate(s.profile?.date_of_birth)} />
            <DetailRow label="Gender" value={s.profile?.gender ?? '—'} />
            <DetailRow label="Status" value={s.status ?? '—'} />
          </Card>

          <Text style={styles.section}>Guardian</Text>
          <Card padding="lg">
            <DetailRow label="Name" value={s.parent_name ?? '—'} />
            <DetailRow label="Phone" value={s.parent_phone ?? '—'} />
            <DetailRow label="Email" value={s.parent_email ?? '—'} />
            {s.parent_user_id ? (
              <DetailRow label="Linked account" value={s.parent_user_id} />
            ) : null}
          </Card>

          {(isAdmin || isTeacher) && s.profile?.address ? (
            <>
              <Text style={styles.section}>Address</Text>
              <Card padding="lg">
                <Text style={styles.address}>{s.profile.address}</Text>
              </Card>
            </>
          ) : null}

          {canDelete ? (
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.deleteBtn,
                pressed && styles.pressed,
              ]}
            >
              <Icon name="logout" size={18} color={colors.error} />
              <Text style={styles.deleteText}>Delete student</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl3 },
  padded: { paddingHorizontal: spacing.base, gap: spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.gray100,
    gap: spacing.md,
  },
  rowLabel: { ...typography.bodySm, color: colors.gray500, fontWeight: '600' },
  rowValue: {
    ...typography.bodyMd,
    color: colors.gray900,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  section: { ...typography.h4, color: colors.gray900, marginTop: spacing.md },
  address: { ...typography.bodyMd, color: colors.gray700, lineHeight: 22 },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.errorLight,
    backgroundColor: colors.white,
    marginTop: spacing.lg,
  },
  deleteText: { ...typography.bodyMd, color: colors.error, fontWeight: '700' },
  pressed: { opacity: 0.85 },
});
