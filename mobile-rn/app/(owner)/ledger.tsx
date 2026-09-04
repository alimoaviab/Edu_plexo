import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/dashboard/widgets';
import { api } from '@/api/client';
import { fetchOwnerLedger } from '@/modules/owner/api';
import type { LedgerItem } from '@/modules/owner/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { colors, radius, spacing, typography } from '@/theme/tokens';

interface SchoolRef {
  school_id: string;
  name: string;
}

export default function OwnerLedgerScreen() {
  const [kind, setKind] = useState('');
  const [school, setSchool] = useState('');
  const [q, setQ] = useState('');
  const [appliedQ, setAppliedQ] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['owner-ledger', { kind, school, appliedQ, page }],
    queryFn: () => fetchOwnerLedger({ type: kind || undefined, school: school || undefined, q: appliedQ || undefined, page, limit: 50 }),
  });

  const { data: schoolRows } = useQuery({
    queryKey: ['owner-schools'],
    queryFn: async () => {
      const result = await api.get<SchoolRef[]>('/owner/schools');
      return result.ok && Array.isArray(result.data) ? result.data : [];
    },
  });

  const items: LedgerItem[] = data?.items || [];
  const summary = data?.summary || { income: 0, expense: 0, net: 0 };
  const pagination = data?.pagination || { total: 0, pages: 1, page: 1 };

  const kpis = useMemo(
    () => [
      { label: 'Income', value: formatCurrency(summary.income), color: colors.success, icon: 'wallet' as const },
      { label: 'Expenses', value: formatCurrency(summary.expense), color: colors.error, icon: 'clipboard' as const },
      { label: 'Net', value: formatCurrency(summary.net), color: summary.net >= 0 ? colors.primary : colors.error, icon: 'chart' as const },
    ],
    [summary],
  );

  return (
    <ScreenContainer scroll>
      <Header title="Ledger" subtitle="Business money movement" />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetch} />}
        scrollEnabled={false}
      >
        <View style={styles.kpiRow}>
          {kpis.map((k) => (
            <View key={k.label} style={styles.kpiCard}>
              <Icon name={k.icon} size={16} color={k.color} />
              <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.filters}>
          <View style={styles.segment}>
            {[
              { value: '', label: 'All' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
            ].map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => setKind(opt.value)}
                style={[styles.segmentItem, kind === opt.value && styles.segmentItemActive]}
              >
                <Text style={[styles.segmentText, kind === opt.value && styles.segmentTextActive]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Pressable onPress={() => setSchool('')} style={[styles.chip, school === '' && styles.chipActive]}>
              <Text style={[styles.chipText, school === '' && styles.chipTextActive]}>All campuses</Text>
            </Pressable>
            {(schoolRows || []).map((s) => (
              <Pressable key={s.school_id} onPress={() => setSchool(s.school_id)} style={[styles.chip, school === s.school_id && styles.chipActive]}>
                <Text style={[styles.chipText, school === s.school_id && styles.chipTextActive]}>{s.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Receipt, reference or note"
              placeholderTextColor={colors.gray400}
              value={q}
              onChangeText={setQ}
              onSubmitEditing={() => { setAppliedQ(q.trim()); setPage(1); }}
              returnKeyType="search"
            />
            <Pressable style={styles.searchButton} onPress={() => { setAppliedQ(q.trim()); setPage(1); }}>
              <Text style={styles.searchButtonText}>Search</Text>
            </Pressable>
          </View>
        </View>

        {isLoading && <Text style={styles.empty}>Loading ledger…</Text>}
        {!isLoading && items.length === 0 && <Text style={styles.empty}>No entries match these filters.</Text>}

        {items.map((it) => (
          <View key={it.id} style={styles.entry}>
            <View style={styles.entryTop}>
              <View style={[styles.typeDot, { backgroundColor: it.kind === 'income' ? colors.success : colors.error }]} />
              <Text style={styles.entryTitle} numberOfLines={1}>{it.description}</Text>
              <Text style={[styles.entryAmount, { color: it.kind === 'income' ? colors.success : colors.error }]}>
                {it.kind === 'income' ? '+' : '−'}{formatCurrency(it.credit || it.debit)}
              </Text>
            </View>
            <View style={styles.entryMeta}>
              <Text style={styles.entryMetaText}>{it.school_name}</Text>
              <Text style={styles.entryMetaText}>· {it.category}</Text>
              <Text style={styles.entryMetaText}>· {formatDate(it.date, true)}</Text>
              {it.reference ? <Text style={styles.entryRef}>· {it.reference}</Text> : null}
            </View>
          </View>
        ))}

        {pagination.total > 0 && (
          <View style={styles.pager}>
            <Pressable
              disabled={page <= 1}
              onPress={() => setPage((p) => p - 1)}
              style={[styles.pageButton, page <= 1 && styles.pageDisabled]}
            >
              <Text style={styles.pageText}>Previous</Text>
            </Pressable>
            <Text style={styles.pageCount}>
              {pagination.total} entries · page {pagination.page} / {pagination.pages}
            </Text>
            <Pressable
              disabled={page >= pagination.pages}
              onPress={() => setPage((p) => p + 1)}
              style={[styles.pageButton, page >= pagination.pages && styles.pageDisabled]}
            >
              <Text style={styles.pageText}>Next</Text>
            </Pressable>
          </View>
        )}

        <SectionHeader title="What's here" subtitle="Fee collections (income) and campus expenses — same records your school teams keep" />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  kpiRow: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.sm },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: spacing.md,
    gap: 4,
  },
  kpiValue: { ...typography.bodyMd, fontWeight: '800', marginTop: 2 },
  kpiLabel: { ...typography.labelXs, color: colors.gray500, fontWeight: '700' },
  filters: { gap: spacing.sm, marginBottom: spacing.sm },
  segment: { flexDirection: 'row', backgroundColor: colors.gray100, borderRadius: radius.md, padding: 3 },
  segmentItem: { flex: 1, paddingVertical: 8, borderRadius: radius.md, alignItems: 'center' },
  segmentItemActive: { backgroundColor: colors.white },
  segmentText: { ...typography.bodySm, color: colors.gray500, fontWeight: '700' },
  segmentTextActive: { color: colors.primary, fontWeight: '800' },
  chips: { gap: spacing.sm, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.full,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray200,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.bodySm, color: colors.gray600, fontWeight: '700' },
  chipTextActive: { color: colors.white },
  searchRow: { flexDirection: 'row', gap: spacing.sm },
  searchInput: {
    flex: 1, height: 40, borderRadius: radius.md, borderWidth: 1, borderColor: colors.gray200,
    paddingHorizontal: 12, ...typography.bodySm, backgroundColor: colors.white,
  },
  searchButton: { height: 40, paddingHorizontal: 16, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  searchButtonText: { ...typography.bodySm, color: colors.white, fontWeight: '800' },
  entry: {
    backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.gray200,
    padding: spacing.md, marginBottom: spacing.sm, gap: 6,
  },
  entryTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  typeDot: { width: 8, height: 8, borderRadius: radius.full },
  entryTitle: { flex: 1, ...typography.bodyMd, fontWeight: '700', color: colors.gray900 },
  entryAmount: { ...typography.bodyMd, fontWeight: '800' },
  entryMeta: { flexDirection: 'row', flexWrap: 'wrap', ...typography.bodySm, color: colors.gray400 },
  entryMetaText: { color: colors.gray400 },
  entryRef: { color: colors.gray400 },
  pager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: spacing.sm },
  pageButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.md, backgroundColor: colors.primary },
  pageDisabled: { opacity: 0.4 },
  pageText: { ...typography.bodySm, color: colors.white, fontWeight: '800' },
  pageCount: { ...typography.bodySm, color: colors.gray500 },
  empty: { textAlign: 'center', color: colors.gray400, ...typography.bodyMd, paddingVertical: spacing.lg },
});
