import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/dashboard/widgets';
import { fetchOwnerAlerts } from '@/modules/owner/api';
import type { OwnerAlert } from '@/modules/owner/types';
import { colors, radius, spacing, typography } from '@/theme/tokens';

const sevColor: Record<OwnerAlert['severity'], string> = {
  CRITICAL: colors.error,
  WARNING: colors.warning,
  INFO: colors.primary,
};
const sevBg: Record<OwnerAlert['severity'], string> = {
  CRITICAL: colors.errorLight,
  WARNING: colors.warningLight,
  INFO: colors.primaryLight,
};

export default function OwnerAlertsScreen() {
  const router = useRouter();
  const [sevFilter, setSevFilter] = useState<'' | OwnerAlert['severity']>('');

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['owner-alerts'],
    queryFn: fetchOwnerAlerts,
  });

  const counts = useMemo(() => {
    const all: OwnerAlert[] = data?.alerts || [];
    return {
      CRITICAL: all.filter((a) => a.severity === 'CRITICAL').length,
      WARNING: all.filter((a) => a.severity === 'WARNING').length,
      INFO: all.filter((a) => a.severity === 'INFO').length,
    };
  }, [data]);

  const alerts = useMemo(
    () => (data?.alerts || []).filter((a: OwnerAlert) => !sevFilter || a.severity === sevFilter),
    [data, sevFilter],
  );

  const openAction = (href: string, schoolId?: string) => {
    if (href.startsWith('/owner/subscription')) router.push('/(owner)/subscription' as never);
    else if (href.startsWith('/owner/schools')) router.push('/(owner)/schools' as never);
    else router.push(schoolId ? (`/(owner)/analytics?school=${schoolId}` as never) : ('/(owner)/analytics' as never));
  };

  const chips: { value: '' | OwnerAlert['severity']; label: string; count: number }[] = [
    { value: '', label: 'All', count: counts.CRITICAL + counts.WARNING + counts.INFO },
    { value: 'CRITICAL', label: 'Critical', count: counts.CRITICAL },
    { value: 'WARNING', label: 'Warnings', count: counts.WARNING },
    { value: 'INFO', label: 'Info', count: counts.INFO },
  ];

  return (
    <ScreenContainer scroll>
      <Header title="Alerts & Insights" subtitle="Issues needing your attention" />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetch} />}
        scrollEnabled={false}
      >
        <View style={styles.kpiRow}>
          {(['CRITICAL', 'WARNING', 'INFO'] as const).map((sev) => (
            <Pressable key={sev} onPress={() => setSevFilter(sevFilter === sev ? '' : sev)} style={styles.kpiCard}>
              <View style={[styles.kpiIcon, { backgroundColor: sevBg[sev] }]}>
                <Icon name={sev === 'INFO' ? 'info' : 'alert-triangle'} size={16} color={sevColor[sev]} />
              </View>
              <Text style={[styles.kpiValue, { color: sevColor[sev] }]}>{counts[sev]}</Text>
              <Text style={styles.kpiLabel}>{sev === 'CRITICAL' ? 'Critical' : sev === 'WARNING' ? 'Warnings' : 'Info'}</Text>
            </Pressable>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {chips.map((c) => (
            <Pressable key={c.value} onPress={() => setSevFilter(c.value)} style={[styles.chip, sevFilter === c.value && styles.chipActive]}>
              <Text style={[styles.chipText, sevFilter === c.value && styles.chipTextActive]}>
                {c.label}{c.value !== '' ? ` (${c.count})` : ''}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {isLoading && <Text style={styles.empty}>Checking your portfolio…</Text>}
        {!isLoading && alerts.length === 0 && (
          <View style={styles.clearCard}>
            <Text style={styles.clearEmoji}>🎉</Text>
            <Text style={styles.clearTitle}>All clear</Text>
            <Text style={styles.clearSub}>No {sevFilter.toLowerCase() || ''} alerts right now.</Text>
          </View>
        )}

        {alerts.map((a) => (
          <View key={a.id} style={styles.alert}>
            <View style={[styles.alertBar, { backgroundColor: sevColor[a.severity] }]} />
            <View style={styles.alertBody}>
              <View style={styles.alertTop}>
                <View style={[styles.alertIcon, { backgroundColor: sevBg[a.severity] }]}>
                  <Icon name={a.severity === 'INFO' ? 'info' : 'alert-triangle'} size={15} color={sevColor[a.severity]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertTitle}>{a.title}</Text>
                  <Text style={styles.alertSeverity} numberOfLines={1}>
                    {a.severity} · {a.category}
                  </Text>
                </View>
              </View>
              <Text style={styles.alertMessage}>{a.message}</Text>
              <View style={styles.alertMeta}>
                {a.school_name ? <Text style={styles.alertMetaText}>{a.school_name}</Text> : null}
                {a.metric ? <Text style={styles.alertMetaText}>{a.metric}</Text> : null}
              </View>
              {a.action?.href ? (
                <Pressable style={styles.actionButton} onPress={() => openAction(a.action.href, a.school_id)}>
                  <Text style={styles.actionText}>{a.action.label}</Text>
                  <Icon name="arrow-right" size={14} color={colors.white} />
                </Pressable>
              ) : null}
            </View>
          </View>
        ))}

        <SectionHeader title="Insights" subtitle="Alerts are computed from live fee, attendance, activity and subscription data" />
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
  kpiIcon: { width: 30, height: 30, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  kpiValue: { ...typography.h4, fontWeight: '900' },
  kpiLabel: { ...typography.labelXs, color: colors.gray500, fontWeight: '700' },
  chips: { gap: spacing.sm, paddingBottom: spacing.sm },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray200,
  },
  chipActive: { backgroundColor: colors.gray900, borderColor: colors.gray900 },
  chipText: { ...typography.bodySm, color: colors.gray600, fontWeight: '800' },
  chipTextActive: { color: colors.white },
  alert: {
    flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.gray200, marginBottom: spacing.sm, overflow: 'hidden',
  },
  alertBar: { width: 4 },
  alertBody: { flex: 1, padding: spacing.md, gap: spacing.sm },
  alertTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  alertIcon: { width: 32, height: 32, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  alertTitle: { ...typography.bodyMd, fontWeight: '800', color: colors.gray900 },
  alertSeverity: { ...typography.labelXs, color: colors.gray400, textTransform: 'capitalize' },
  alertMessage: { ...typography.bodySm, color: colors.gray600, lineHeight: 19 },
  alertMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  alertMetaText: { ...typography.labelXs, color: colors.gray400 },
  actionButton: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.md, backgroundColor: colors.primary,
  },
  actionText: { ...typography.bodySm, color: colors.white, fontWeight: '800' },
  clearCard: { alignItems: 'center', padding: spacing.xl, backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.gray200, gap: 4 },
  clearEmoji: { fontSize: 32 },
  clearTitle: { ...typography.bodyMd, fontWeight: '800', color: colors.gray900 },
  clearSub: { ...typography.bodySm, color: colors.gray400 },
  empty: { textAlign: 'center', color: colors.gray400, ...typography.bodyMd, paddingVertical: spacing.lg },
});
