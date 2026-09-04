import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar, SectionHeader } from '@/components/dashboard/widgets';
import { fetchOwnerAnalytics } from '@/modules/owner/api';
import type { OwnerSchoolAnalytics } from '@/modules/owner/types';
import { formatCurrency, formatNumber } from '@/utils/format';
import { colors, radius, spacing, typography } from '@/theme/tokens';

type Accent = 'primary' | 'success' | 'warning' | 'error' | 'neutral';
const accentOf = (rate: number): Accent =>
  rate >= 65 ? 'success' : rate >= 40 ? 'warning' : 'error';

export default function OwnerAnalyticsScreen() {
  const [schoolFilter, setSchoolFilter] = useState('');
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['owner-analytics'],
    queryFn: fetchOwnerAnalytics,
  });

  const rows: OwnerSchoolAnalytics[] = useMemo(
    () => (data?.per_school || []).filter((r) => !schoolFilter || r.school_id === schoolFilter),
    [data, schoolFilter],
  );
  const totals = useMemo(() => {
    if (rows.length === 0) {
      return { students: 0, teachers: 0, classes: 0, collected: 0, pending: 0, revenue30: 0 };
    }
    return rows.reduce(
      (acc, r) => ({
        students: acc.students + r.students,
        teachers: acc.teachers + r.teachers,
        classes: acc.classes + r.classes,
        collected: acc.collected + r.revenue,
        pending: acc.pending + r.pending,
        revenue30: acc.revenue30 + r.revenue_30d,
      }),
      { students: 0, teachers: 0, classes: 0, collected: 0, pending: 0, revenue30: 0 },
    );
  }, [rows]);
  const rate =
    totals.collected + totals.pending > 0
      ? Math.round((totals.collected * 100) / (totals.collected + totals.pending))
      : 0;

  const stats = [
    { label: 'Students', value: formatNumber(totals.students), accent: 'primary' as Accent },
    { label: 'Teachers', value: formatNumber(totals.teachers), accent: 'success' as Accent },
    { label: 'Collection rate', value: `${rate}%`, accent: accentOf(rate) },
    { label: 'Pending fees', value: formatCurrency(totals.pending), accent: 'error' as Accent },
  ];

  return (
    <ScreenContainer scroll>
      <Header title="Portfolio Analytics" subtitle="Cross-campus comparison" />
      {!isLoading && (data?.per_school?.length ?? 0) > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          style={{ marginHorizontal: -spacing.lg }}
        >
          <Pressable
            onPress={() => setSchoolFilter('')}
            style={[styles.chip, schoolFilter === '' && styles.chipActive]}
          >
            <Text style={[styles.chipText, schoolFilter === '' && styles.chipTextActive]}>All campuses</Text>
          </Pressable>
          {(data?.per_school || []).map((r) => (
            <Pressable
              key={r.school_id}
              onPress={() => setSchoolFilter(r.school_id)}
              style={[styles.chip, schoolFilter === r.school_id && styles.chipActive]}
            >
              <Text style={[styles.chipText, schoolFilter === r.school_id && styles.chipTextActive]}>
                {r.school_name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetch} />}
        scrollEnabled={false}
      >
        <View style={styles.statGrid}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {isLoading && <Text style={styles.empty}>Loading portfolio analytics…</Text>}

        {!isLoading && rows.length === 0 && (
          <Text style={styles.empty}>No owned campuses to compare yet.</Text>
        )}

        {rows.map((r) => {
          const barAccent = accentOf(r.collection_rate);
          return (
            <View key={r.school_id} style={styles.card}>
              <View style={styles.rowBetween}>
                <View style={styles.rowFlex}>
                  <View style={styles.schoolIcon}>
                    <Icon name="building" size={18} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.schoolName}>{r.school_name}</Text>
                    <Text style={styles.schoolMeta}>{r.code || r.school_id}</Text>
                  </View>
                </View>
                <Text style={[styles.badge, { color: colors.primary, backgroundColor: colors.primaryLight }]}>
                  {r.collection_rate}% collected
                </Text>
              </View>

              <View style={styles.metricRow}>
                {[
                  { label: 'Students', value: String(r.students) },
                  { label: 'Teachers', value: String(r.teachers) },
                  { label: 'Classes', value: String(r.classes) },
                  { label: 'New 30d', value: String(r.new_students_30d) },
                ].map((m) => (
                  <View key={m.label} style={styles.metric}>
                    <Text style={styles.metricValue}>{m.value}</Text>
                    <Text style={styles.metricLabel}>{m.label}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.barRow}>
                <Text style={styles.barLabel}>
                  Collections {formatCurrency(r.revenue)} · {r.attendance_records > 0 ? `${Math.round(r.attendance_rate)}% attendance` : 'no attendance data'}
                </Text>
                <ProgressBar value={r.collection_rate} accent={barAccent} />
              </View>
            </View>
          );
        })}

        <SectionHeader title="Trends" subtitle="Last 30 days from live records" />
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.trendValue}>{formatCurrency(totals.revenue30)}</Text>
              <Text style={styles.trendLabel}>Fee collections (30d)</Text>
            </View>
            <View style={styles.trendIcon}>
              <Icon name="chart" size={20} color={colors.success} />
            </View>
          </View>
          <Text style={styles.trendSub}>
            Pending {formatCurrency(totals.pending)} across {rows.length} campus{rows.length === 1 ? '' : 'es'}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  chips: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.bodySm, color: colors.gray600, fontWeight: '700' },
  chipTextActive: { color: colors.white },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginVertical: spacing.sm },
  statCard: {
    flexGrow: 1,
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: spacing.md,
  },
  statValue: { ...typography.h3, color: colors.gray900 },
  statLabel: { ...typography.bodySm, color: colors.gray500, fontWeight: '600' },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: spacing.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowFlex: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  schoolIcon: {
    width: 36, height: 36, borderRadius: radius.md,
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  schoolName: { ...typography.bodyMd, fontWeight: '800', color: colors.gray900 },
  schoolMeta: { ...typography.bodySm, color: colors.gray400 },
  badge: { ...typography.labelXs, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full, overflow: 'hidden' },
  metricRow: { flexDirection: 'row', gap: spacing.sm },
  metric: { flex: 1, backgroundColor: colors.gray50, borderRadius: radius.md, paddingVertical: 8, alignItems: 'center' },
  metricValue: { ...typography.bodyMd, fontWeight: '800', color: colors.gray900 },
  metricLabel: { ...typography.labelXs, color: colors.gray500 },
  barRow: { gap: 6 },
  barLabel: { ...typography.bodySm, color: colors.gray500 },
  trendIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.successLight, alignItems: 'center', justifyContent: 'center' },
  trendValue: { ...typography.h3, color: colors.success },
  trendLabel: { ...typography.bodySm, color: colors.gray500 },
  trendSub: { ...typography.bodySm, color: colors.gray400 },
  empty: { textAlign: 'center', color: colors.gray400, ...typography.bodyMd, paddingVertical: spacing.xl },
});
