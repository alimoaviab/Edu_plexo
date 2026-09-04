import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar, SectionHeader } from '@/components/dashboard/widgets';
import { fetchOwnerBudgets, fetchOwnerFinance } from '@/modules/owner/api';
import type { FinanceTrendPoint, OwnerBudget, SchoolFinance } from '@/modules/owner/types';
import { formatCurrency, formatNumber } from '@/utils/format';
import { colors, radius, spacing, typography } from '@/theme/tokens';

const accentOf = (rate: number) => (rate >= 65 ? 'success' : rate >= 40 ? 'warning' : 'error');

export default function OwnerFinanceScreen() {
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['owner-finance'],
    queryFn: fetchOwnerFinance,
  });
  const { data: budgetsRes } = useQuery({
    queryKey: ['owner-budgets'],
    queryFn: () => fetchOwnerBudgets(),
  });

  const summary = data?.summary || { collected: 0, pending: 0, collection_rate: 0, expenses: 0, net_position: 0 };
  const schoolRows: SchoolFinance[] = data?.schools || [];
  const trend: FinanceTrendPoint[] = data?.trend || [];
  const budgets: OwnerBudget[] = budgetsRes?.budgets || [];

  const trendBars = useMemo(() => {
    const maxAbs = Math.max(
      1,
      ...trend.map((t) => Math.max(Math.abs(t.income), Math.abs(t.expense))),
    );
    return trend.map((t) => ({
      label: t.month.replace(/^\d{4}-/, ''),
      incomePct: Math.max(2, (t.income / maxAbs) * 100),
      expensePct: Math.max(2, (t.expense / maxAbs) * 100),
    }));
  }, [trend]);

  const kpis = [
    { label: 'Revenue', value: formatCurrency(summary.collected), icon: 'wallet' as const, color: colors.success, bg: colors.successLight },
    { label: 'Expenses', value: formatCurrency(summary.expenses), icon: 'clipboard' as const, color: colors.error, bg: colors.errorLight },
    { label: 'Net', value: formatCurrency(summary.net_position), icon: 'chart' as const, color: summary.net_position >= 0 ? colors.primary : colors.error, bg: summary.net_position >= 0 ? colors.primaryLight : colors.errorLight },
  ];

  return (
    <ScreenContainer scroll>
      <Header title="Finance & Budgets" subtitle="Portfolio revenue, spend and plans" />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetch} />}
        scrollEnabled={false}
      >
        <View style={styles.kpiRow}>
          {kpis.map((k) => (
            <View key={k.label} style={styles.kpiCard}>
              <View style={[styles.kpiIcon, { backgroundColor: k.bg }]}>
                <Icon name={k.icon} size={15} color={k.color} />
              </View>
              <Text style={[styles.kpiValue, { color: k.color }]} numberOfLines={1} adjustsFontSizeToFit>
                {k.value}
              </Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </View>

        <SectionHeader title="Revenue vs expenses" subtitle="Last 12 months (invoice collections vs expense dates)" />
        <View style={styles.card}>
          {trendBars.length === 0 && <Text style={styles.empty}>No trend data yet.</Text>}
          {trendBars.map((t) => (
            <View key={t.label} style={styles.trendRow}>
              <Text style={styles.trendLabel}>{t.label}</Text>
              <View style={styles.trendTrack}>
                <View style={[styles.trendFill, { width: `${t.incomePct}%`, backgroundColor: colors.success }]} />
              </View>
              <View style={styles.trendTrack}>
                <View style={[styles.trendFill, { width: `${t.expensePct}%`, backgroundColor: colors.error }]} />
              </View>
            </View>
          ))}
          <View style={styles.legend}>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.success }]} /><Text style={styles.legendText}>Income</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.error }]} /><Text style={styles.legendText}>Expenses</Text></View>
            <Text style={styles.legendHint}>Collection rate {summary.collection_rate}% · Pending {formatCurrency(summary.pending)}</Text>
          </View>
        </View>

        <SectionHeader title="Campus position" subtitle="Revenue, spend and net per campus" />
        {schoolRows.map((r) => (
          <View key={r.school_id} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.schoolName}>{r.school_name}</Text>
              <Text style={[styles.netBadge, { color: r.net_position >= 0 ? colors.success : colors.error, backgroundColor: r.net_position >= 0 ? colors.successLight : colors.errorLight }]}>
                Net {formatCurrency(r.net_position)}
              </Text>
            </View>
            <View style={styles.schoolStats}>
              <Text style={styles.schoolStat}>Revenue <Text style={styles.schoolStatStrong}>{formatCurrency(r.collected)}</Text></Text>
              <Text style={styles.schoolStat}>Pending <Text style={styles.schoolStatStrong}>{formatCurrency(r.pending)}</Text></Text>
              <Text style={styles.schoolStat}>Expenses <Text style={styles.schoolStatStrong}>{formatCurrency(r.expenses)}</Text></Text>
            </View>
            <ProgressBar value={r.collection_rate} accent={accentOf(r.collection_rate) as 'success' | 'warning' | 'error'} />
            <Text style={styles.utilLabel}>{r.collection_rate}% collection rate</Text>
          </View>
        ))}
        {!isLoading && schoolRows.length === 0 && <Text style={styles.empty}>No schools yet.</Text>}

        <SectionHeader title="Budgets" subtitle="Planned vs actual spend from expense records" />
        {!budgetsRes?.available && (
          <View style={styles.card}><Text style={styles.empty}>Budget planning is not enabled on this backend.</Text></View>
        )}
        {budgetsRes?.available && budgets.length === 0 && (
          <View style={styles.card}><Text style={styles.empty}>No budgets yet — create one on the web portal.</Text></View>
        )}
        {budgets.map((b) => (
          <View key={b.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.schoolName}>{b.name}</Text>
              <Text style={styles.budgetUtil}>{b.utilization}% used</Text>
            </View>
            <Text style={styles.budgetMeta}>
              {b.school_name} · {b.period_label || `${(b.start_date || '').slice(0, 10)} → ${(b.end_date || '').slice(0, 10)}`}
            </Text>
            <ProgressBar value={b.utilization} accent={b.utilization >= 90 ? 'error' : b.utilization >= 70 ? 'warning' : 'success'} />
            <Text style={styles.budgetAmounts}>
              Planned {formatCurrency(b.planned_amount)} · Actual {formatCurrency(b.actual_amount)} · Remaining {formatCurrency(b.remaining)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  kpiRow: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.sm },
  kpiCard: {
    flex: 1, backgroundColor: colors.white, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.gray200, padding: spacing.md, gap: 4,
  },
  kpiIcon: { width: 28, height: 28, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  kpiValue: { ...typography.bodySm, fontWeight: '800', marginTop: 2 },
  kpiLabel: { ...typography.labelXs, color: colors.gray500, fontWeight: '700' },
  card: {
    backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.gray200, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.sm,
  },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  trendLabel: { width: 34, ...typography.labelXs, color: colors.gray500, fontWeight: '700' },
  trendTrack: { flex: 1, height: 8, borderRadius: radius.full, backgroundColor: colors.gray100, overflow: 'hidden' },
  trendFill: { height: 8, borderRadius: radius.full },
  legend: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: radius.full },
  legendText: { ...typography.labelXs, color: colors.gray500 },
  legendHint: { marginLeft: 'auto', ...typography.labelXs, color: colors.gray400, flexShrink: 1, textAlign: 'right' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  schoolName: { ...typography.bodyMd, fontWeight: '800', color: colors.gray900 },
  netBadge: { ...typography.labelXs, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full, overflow: 'hidden' },
  schoolStats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  schoolStat: { ...typography.bodySm, color: colors.gray500 },
  schoolStatStrong: { color: colors.gray800, fontWeight: '800' },
  utilLabel: { ...typography.labelXs, color: colors.gray400 },
  budgetUtil: { ...typography.labelXs, color: colors.primary, fontWeight: '800' },
  budgetMeta: { ...typography.bodySm, color: colors.gray500 },
  budgetAmounts: { ...typography.bodySm, color: colors.gray500 },
  empty: { textAlign: 'center', color: colors.gray400, ...typography.bodyMd, paddingVertical: spacing.md },
});
