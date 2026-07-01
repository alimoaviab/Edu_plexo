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
import { classTitle, recordSubtitle, recordTitle } from '@/modules/admin/record-utils';
import { compactNumber } from '@/utils/format';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

const CLASS_PICKER_DEFINITION: AdminModuleDefinition = {
  ...ADMIN_MODULE_BY_KEY.classes,
  pageSize: 100,
};

const STUDENT_PICKER_DEFINITION: AdminModuleDefinition = {
  ...ADMIN_MODULE_BY_KEY.students,
  pageSize: 200,
};

export default function StudentsScreen() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<AdminRecord | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<AdminRecord | null>(null);
  const selectedClassId = selectedClass ? getRecordId(selectedClass) : '';

  const classesQuery = useQuery({
    queryKey: ['admin-flow-classes'],
    queryFn: () => listAdminRecords(CLASS_PICKER_DEFINITION, { page: 1 }),
  });

  const studentsQuery = useQuery({
    queryKey: ['admin-flow-students', selectedClassId],
    queryFn: () =>
      listAdminRecords(STUDENT_PICKER_DEFINITION, {
        page: 1,
        filters: { class_id: selectedClassId },
      }),
    enabled: !!selectedClassId && !selectedStudent,
  });

  const studentDetailQuery = useQuery({
    queryKey: ['admin-flow-student-detail', selectedStudent ? getRecordId(selectedStudent) : ''],
    queryFn: () => getAdminRecord(ADMIN_MODULE_BY_KEY.students, selectedStudent ?? {}),
    enabled: !!selectedStudent,
  });

  if (selectedStudent) {
    const detail = studentDetailQuery.data ?? selectedStudent;
    return (
      <ScreenContainer scroll>
        <Header
          showBack
          onBack={() => setSelectedStudent(null)}
          greeting="Student Profile"
          title={recordTitle(detail, ADMIN_MODULE_BY_KEY.students, 'Student')}
          subtitle={selectedClass ? classTitle(selectedClass) : 'Complete backend profile'}
          right={<ManageButton label="Manage" icon="settings" onPress={() => router.push('/(admin)/module/students' as never)} />}
        />
        {studentDetailQuery.isFetching ? <InlineLoading label="Refreshing profile" /> : null}
        <RecordProfile
          record={detail}
          fallbackTitle="Student"
          icon="graduation"
          subtitle={recordSubtitle(detail, ['admission_no', 'roll_no', 'section', 'status'])}
        />
      </ScreenContainer>
    );
  }

  if (selectedClass) {
    return (
      <ScreenContainer scroll>
        <Header
          showBack
          onBack={() => setSelectedClass(null)}
          greeting="Students"
          title={classTitle(selectedClass)}
          subtitle="Select a student to open the complete profile"
          right={<ManageButton label="Add" onPress={() => router.push('/(admin)/module/students' as never)} />}
        />
        {studentsQuery.isLoading ? (
          <StateCard loading title="Loading students" />
        ) : studentsQuery.isError ? (
          <StateCard title="Unable to load students" message={studentsQuery.error.message} />
        ) : studentsQuery.data?.items.length ? (
          <View style={styles.list}>
            {studentsQuery.data.items.map((student) => (
              <EntityRow
                key={getRecordId(student)}
                icon="graduation"
                title={recordTitle(student, ADMIN_MODULE_BY_KEY.students, 'Student')}
                subtitle={recordSubtitle(student, ['admission_no', 'roll_no', 'section', 'guardian.phone'])}
                onPress={() => setSelectedStudent(student)}
              />
            ))}
          </View>
        ) : (
          <StateCard title="No students" message="No students were returned for this class." />
        )}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <Header
        greeting="Student Management"
        title="Students"
        subtitle="Choose a class first"
        right={<ManageButton label="Add" onPress={() => router.push('/(admin)/module/students' as never)} />}
      />
      {classesQuery.isLoading ? (
        <StateCard loading title="Loading classes" />
      ) : classesQuery.isError ? (
        <StateCard title="Unable to load classes" message={classesQuery.error.message} />
      ) : classesQuery.data?.items.length ? (
        <View style={styles.grid}>
          {classesQuery.data.items.map((item) => (
            <ClassCard key={getRecordId(item)} record={item} onPress={() => setSelectedClass(item)} />
          ))}
        </View>
      ) : (
        <StateCard title="No classes" message="Create classes from the existing Classes module." />
      )}
    </ScreenContainer>
  );
}

function ClassCard({ record, onPress }: { record: AdminRecord; onPress: () => void }) {
  const count = record.student_count ?? record.students_count ?? record.total_students ?? record.capacity;
  const teacher = record.class_teacher_name ?? record.teacher_name;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.classCard, shadows.card, pressed && styles.pressed]}>
      <View style={styles.classIcon}>
        <Icon name="graduation" size={22} color={colors.primary} />
      </View>
      <Text style={styles.classTitle} numberOfLines={1}>
        {classTitle(record)}
      </Text>
      <Text style={styles.classMeta} numberOfLines={1}>
        {count ? `${compactNumber(String(count))} students` : 'Student list'}
      </Text>
      {teacher ? (
        <Text style={styles.classMeta} numberOfLines={1}>
          {String(teacher)}
        </Text>
      ) : null}
    </Pressable>
  );
}

function EntityRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: 'graduation' | 'users';
  title: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, shadows.card, pressed && styles.pressed]}>
      <View style={styles.rowIcon}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingBottom: spacing.xl3 },
  classCard: {
    width: '47%',
    flexGrow: 1,
    minHeight: 128,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
    gap: spacing.xs,
  },
  classIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classTitle: { ...typography.bodyLg, color: colors.gray900, fontWeight: '800' },
  classMeta: { ...typography.bodySm, color: colors.gray500 },
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
