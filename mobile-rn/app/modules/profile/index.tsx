/**
 * Self profile — pulls the current user's profile shape from /api/students/{id}
 * or /api/teachers/{id} based on role and `profileId` in the JWT. Read-only;
 * editing self goes through the role-specific module screens.
 */

import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { studentService, teacherService } from '@/services';
import { useTenant } from '@/hooks';
import { useAuthStore } from '@/store/auth-store';
import { colors, spacing, typography } from '@/theme/tokens';
import { fullName, formatDate } from '@/utils/format';

export default function MyProfile() {
  const { role, profileId } = useTenant();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const profileQ = useQuery({
    queryKey: ['my-profile', role, profileId ?? ''],
    enabled: !!profileId && (role === 'teacher' || role === 'student'),
    queryFn: async () => {
      if (role === 'teacher') {
        const r = await teacherService.get(profileId!);
        if (!r.ok) throw new Error(r.message ?? 'Lookup failed');
        return r.data!;
      }
      const r = await studentService.get(profileId!);
      if (!r.ok) throw new Error(r.message ?? 'Lookup failed');
      return r.data!;
    },
  });

  function confirmLogout() {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  }

  return (
    <ScreenContainer flush>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl3 }}>
        <View style={{ paddingHorizontal: spacing.base, gap: spacing.md }}>
          <SectionHeader title="My Profile" />

          <Card padding="lg">
            <Row label="Email" value={user?.email ?? '—'} />
            <Row label="Role" value={user?.role ?? '—'} />
            <Row label="School" value={user?.schoolId ?? '—'} />
            <Row label="Academic Year" value={user?.activeAcademicYearId ?? '—'} />
          </Card>

          {profileQ.isLoading ? <LoadingBlock /> : null}
          {profileQ.error ? (
            <ErrorState message={(profileQ.error as Error).message} onRetry={() => profileQ.refetch()} />
          ) : null}

          {profileQ.data && role === 'teacher' ? (
            <Card padding="lg">
              <Text style={styles.section}>Teacher details</Text>
              <Row label="Name" value={fullName((profileQ.data as { profile?: { first_name?: string; last_name?: string; full_name?: string } }).profile) || '—'} />
              <Row label="Designation" value={(profileQ.data as { designation?: string }).designation ?? '—'} />
              <Row label="Employee #" value={(profileQ.data as { employee_id?: string }).employee_id ?? '—'} />
              <Row label="Joined" value={formatDate((profileQ.data as { date_of_joining?: string }).date_of_joining)} />
            </Card>
          ) : null}

          {profileQ.data && role === 'student' ? (
            <Card padding="lg">
              <Text style={styles.section}>Student details</Text>
              <Row label="Name" value={fullName((profileQ.data as { profile?: { first_name?: string; last_name?: string; full_name?: string } }).profile) || '—'} />
              <Row label="Class" value={(profileQ.data as { class_id?: string }).class_id ?? '—'} />
              <Row label="Roll #" value={(profileQ.data as { roll_no?: string }).roll_no ?? '—'} />
              <Row label="Admission #" value={(profileQ.data as { admission_no?: string }).admission_no ?? '—'} />
              <Row label="Admission date" value={formatDate((profileQ.data as { admission_date?: string }).admission_date)} />
            </Card>
          ) : null}

          <Button label="Sign out" variant="danger" onPress={confirmLogout} fullWidth />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.h4, color: colors.gray900, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.gray100, gap: spacing.md },
  rowLabel: { ...typography.bodySm, color: colors.gray500, fontWeight: '600' },
  rowValue: { ...typography.bodyMd, color: colors.gray900, fontWeight: '600', flex: 1, textAlign: 'right' },
});
