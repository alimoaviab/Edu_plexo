import { useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/client';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Icon } from '@/components/ui/Icon';
import { todayIso } from '@/modules/admin/record-utils';
import { formatDate, formatTime } from '@/utils/format';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

interface TeacherAttendanceRecord {
  id: string;
  teacher_id: string;
  teacher_name?: string;
  date: string;
  status: 'present' | 'late' | 'absent' | 'excused';
  check_in_time?: string;
  check_out_time?: string;
  working_hours?: number;
}

export default function TeacherAttendanceScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [statusFilter, setStatusFilter] = useState<string>(''); // empty means All
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch teacher attendance records from the Go backend endpoint
  const attendanceQuery = useQuery({
    queryKey: ['admin-teacher-attendance', selectedDate, statusFilter],
    queryFn: async () => {
      const queryParams: Record<string, string> = {
        start_date: selectedDate,
        end_date: selectedDate,
      };
      if (statusFilter) {
        queryParams.status = statusFilter;
      }
      
      const result = await api.get<TeacherAttendanceRecord[]>('/admin/attendance/teachers', {
        query: queryParams,
      });

      if (!result.ok) {
        throw new Error(result.message ?? 'Failed to load teacher attendance records.');
      }
      return result.data ?? [];
    },
  });

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  // Client-side search by teacher name
  const filteredRecords = useMemo(() => {
    const records = attendanceQuery.data ?? [];
    if (!searchQuery.trim()) return records;
    const query = searchQuery.toLowerCase();
    return records.filter((r) => r.teacher_name?.toLowerCase().includes(query));
  }, [attendanceQuery.data, searchQuery]);

  const stats = useMemo(() => {
    const records = attendanceQuery.data ?? [];
    const total = records.length;
    const present = records.filter(r => r.status === 'present' || r.status === 'late').length;
    const absent = records.filter(r => r.status === 'absent').length;
    return { total, present, absent };
  }, [attendanceQuery.data]);

  return (
    <ScreenContainer flush>
      <Header
        showBack
        onBack={() => router.replace('/(admin)')}
        greeting="Staff Attendance"
        title="Teacher Records"
        subtitle={`Summary for ${formatDate(selectedDate, true)}`}
      />

      {/* Date Navigation & Search Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.dateNavigator}>
          <Pressable onPress={() => changeDate(-1)} style={styles.navButton}>
            <View style={styles.rotateLeft}>
              <Icon name="chevron-right" size={20} color={colors.primary} strokeWidth={2.5} />
            </View>
          </Pressable>
          <Text style={styles.dateText}>{formatDate(selectedDate, true)}</Text>
          <Pressable onPress={() => changeDate(1)} style={styles.navButton}>
            <Icon name="chevron-right" size={20} color={colors.primary} strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon name="users" size={16} color={colors.gray400} />
          <TextInput
            placeholder="Search by teacher name..."
            placeholderTextColor={colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <View style={styles.clearIcon}>
                <Icon name="logout" size={16} color={colors.gray400} />
              </View>
            </Pressable>
          ) : null}
        </View>

        {/* Status Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_OPTIONS.map((opt) => {
            const active = statusFilter === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setStatusFilter(opt.value)}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Main List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={attendanceQuery.isRefetching}
            onRefresh={() => attendanceQuery.refetch()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Simple Top Metrics Banner */}
        {attendanceQuery.data ? (
          <View style={styles.miniStatsRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatVal}>{stats.total}</Text>
              <Text style={styles.miniStatLbl}>Total Staff</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={[styles.miniStatVal, { color: colors.success }]}>{stats.present}</Text>
              <Text style={styles.miniStatLbl}>Present</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={[styles.miniStatVal, { color: colors.error }]}>{stats.absent}</Text>
              <Text style={styles.miniStatLbl}>Absent</Text>
            </View>
          </View>
        ) : null}

        {attendanceQuery.isLoading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.stateText}>Loading teacher records...</Text>
          </View>
        ) : attendanceQuery.isError ? (
          <View style={styles.stateContainer}>
            <Icon name="bell" size={40} color={colors.error} />
            <Text style={styles.errorText}>Unable to load report</Text>
            <Text style={styles.errorSubtext}>{attendanceQuery.error.message}</Text>
          </View>
        ) : filteredRecords.length === 0 ? (
          <View style={styles.stateContainer}>
            <Icon name="clipboard" size={40} color={colors.gray400} />
            <Text style={styles.stateText}>No records found</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredRecords.map((record) => (
              <TeacherCard key={record.id || record.teacher_id} record={record} />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function TeacherCard({ record }: { record: TeacherAttendanceRecord }) {
  const badgeStyle = STATUS_BADGES[record.status] ?? STATUS_BADGES.absent;
  const initial = record.teacher_name ? record.teacher_name.charAt(0).toUpperCase() : 'T';

  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.teacherName} numberOfLines={1}>
            {record.teacher_name ?? 'Unknown Teacher'}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
          <Text style={[styles.badgeText, { color: badgeStyle.fg }]}>
            {record.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.timeSection}>
        <View style={styles.timeCol}>
          <View style={styles.timeLabelRow}>
            <Icon name="clock" size={12} color={colors.gray400} />
            <Text style={styles.timeLabel}>Check In</Text>
          </View>
          <Text style={styles.timeValue}>{formatTime(record.check_in_time) || '--:--'}</Text>
        </View>

        <View style={styles.timeCol}>
          <View style={styles.timeLabelRow}>
            <Icon name="clock" size={12} color={colors.gray400} />
            <Text style={styles.timeLabel}>Check Out</Text>
          </View>
          <Text style={styles.timeValue}>{formatTime(record.check_out_time) || '--:--'}</Text>
        </View>

        <View style={styles.timeCol}>
          <View style={styles.timeLabelRow}>
            <Icon name="chart" size={12} color={colors.gray400} />
            <Text style={styles.timeLabel}>Hours</Text>
          </View>
          <Text style={styles.timeValue}>
            {record.working_hours !== undefined && record.working_hours !== null
              ? `${Number(record.working_hours).toFixed(1)} hrs`
              : '--'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const FILTER_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Present', value: 'present' },
  { label: 'Late', value: 'late' },
  { label: 'Absent', value: 'absent' },
  { label: 'Excused', value: 'excused' },
];

const STATUS_BADGES = {
  present: { bg: colors.successLight, fg: colors.success },
  late: { bg: colors.warningLight, fg: colors.warning },
  absent: { bg: colors.errorLight, fg: colors.error },
  excused: { bg: colors.gray100, fg: colors.gray700 },
} as const;

const styles = StyleSheet.create({
  controlsContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    gap: spacing.sm,
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  rotateLeft: {
    transform: [{ rotate: '180deg' }],
  },
  dateText: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.gray800,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.sm,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.xs,
    fontSize: 13,
    color: colors.gray900,
    paddingVertical: 0,
  },
  clearIcon: {
    transform: [{ rotate: '180deg' }],
  },
  filterScroll: {
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterPillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray600,
  },
  filterTextActive: {
    color: colors.primary,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing.xl4,
  },
  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  miniStat: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  miniStatVal: {
    ...typography.h3,
    fontWeight: '800',
    color: colors.gray900,
  },
  miniStatLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gray400,
    marginTop: 2,
  },
  stateContainer: {
    paddingVertical: spacing.xl5,
    alignItems: 'center',
    gap: spacing.sm,
  },
  stateText: {
    ...typography.bodyMd,
    color: colors.gray500,
    fontWeight: '600',
  },
  errorText: {
    ...typography.bodyMd,
    color: colors.error,
    fontWeight: '700',
  },
  errorSubtext: {
    fontSize: 11,
    color: colors.gray500,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  list: {
    gap: spacing.base,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  teacherName: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.gray900,
    flex: 1,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginVertical: spacing.md,
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeCol: {
    alignItems: 'center',
    flex: 1,
  },
  timeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gray400,
  },
  timeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray800,
  },
});
