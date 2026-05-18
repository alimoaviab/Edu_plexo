import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, LoadingBlock } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSubscription, useTenant } from '@/hooks';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { formatCurrency, formatDate } from '@/utils/format';

export default function SubscriptionScreen() {
  const sub = useSubscription();
  const { role } = useTenant();
  const canManage = role === 'admin' || role === 'super_admin';

  if (sub.isLoading) return <ScreenContainer><SectionHeader title="Subscription" /><LoadingBlock /></ScreenContainer>;
  if (!sub.current) {
    return (
      <ScreenContainer>
        <SectionHeader title="Subscription" />
        <ErrorState title="No subscription data" message="Could not retrieve subscription information." onRetry={() => sub.refetch()} />
      </ScreenContainer>
    );
  }

  const cur = sub.current;
  const subscription = cur.subscription;

  async function handleStartTrial() {
    try {
      await sub.startTrial();
      Alert.alert('Started', 'Trial started successfully.');
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  }

  async function handleUpgrade(planName: string, studentLimit?: number) {
    Alert.alert('Upgrade plan', `Upgrade to "${planName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Upgrade',
        onPress: async () => {
          try {
            await sub.upgrade({ planName, studentLimit });
            Alert.alert('Submitted', 'Upgrade request sent. Verify via the admin panel.');
          } catch (err) {
            Alert.alert('Error', (err as Error).message);
          }
        },
      },
    ]);
  }

  return (
    <ScreenContainer flush>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl3 }}>
        <View style={{ paddingHorizontal: spacing.base, gap: spacing.md }}>
          <SectionHeader title="Subscription" subtitle="Plan, billing and usage" />

          <Card padding="lg">
            <Text style={styles.heading}>Current Plan</Text>
            <Row label="Plan" value={subscription?.plan_name ?? '—'} />
            <Row label="Price" value={subscription ? formatCurrency(subscription.price, subscription.currency) : '—'} />
            <Row label="Students" value={`${cur.students_used} / ${cur.students_limit}`} />
            <Row label="Status" value={subscription?.status ?? '—'} />
            <Row label="Days left" value={String(cur.days_remaining)} />
            {subscription ? (
              <>
                <Row label="Start" value={formatDate(subscription.start_date)} />
                <Row label="Ends" value={formatDate(subscription.end_date)} />
              </>
            ) : null}
            {cur.is_expired ? <Text style={styles.expired}>Subscription expired</Text> : null}

            {canManage && cur.can_trial ? (
              <View style={{ marginTop: spacing.md }}>
                <Button label="Start Free Trial" onPress={handleStartTrial} variant="secondary" fullWidth />
              </View>
            ) : null}
          </Card>

          <Text style={styles.heading}>Plans</Text>
          {sub.plans.length === 0 ? (
            <Text style={styles.muted}>No plans available right now.</Text>
          ) : (
            sub.plans.map((plan) => (
              <Card key={plan.id} padding="lg" style={plan.popular ? styles.popularCard : undefined}>
                <View style={styles.planRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.planName}>{plan.display_name ?? plan.name}</Text>
                    <Text style={styles.planMeta}>
                      {formatCurrency(plan.price, plan.currency)} · up to {plan.student_limit} students
                    </Text>
                    {plan.popular ? <Text style={styles.popularBadge}>Most popular</Text> : null}
                  </View>
                  {canManage ? (
                    <Button
                      label="Upgrade"
                      size="sm"
                      onPress={() => handleUpgrade(plan.name, plan.student_limit)}
                    />
                  ) : null}
                </View>
                {plan.features?.length ? (
                  <View style={{ marginTop: spacing.sm, gap: 4 }}>
                    {plan.features.map((f) => (
                      <Text key={f} style={styles.feature}>
                        • {f}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { ...typography.h4, color: colors.gray900 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: colors.gray100 },
  rowLabel: { ...typography.bodySm, color: colors.gray500, fontWeight: '600' },
  rowValue: { ...typography.bodyMd, color: colors.gray900, fontWeight: '600' },
  expired: { ...typography.bodySm, color: colors.error, fontWeight: '700', marginTop: spacing.sm },
  popularCard: { borderColor: colors.primary, borderWidth: 2 },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  planName: { ...typography.h4, color: colors.gray900 },
  planMeta: { ...typography.bodySm, color: colors.gray500, marginTop: 2 },
  popularBadge: {
    ...typography.labelXs,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginTop: 6,
  },
  feature: { ...typography.bodySm, color: colors.gray600 },
  muted: { ...typography.bodySm, color: colors.gray500 },
});
