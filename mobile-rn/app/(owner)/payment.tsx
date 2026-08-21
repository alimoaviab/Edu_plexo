import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { useSubscription } from '@/modules/subscription/useSubscription';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

const BANK_ACCOUNTS = [
  {
    id: 'alfalah',
    bank: 'Bank Alfalah',
    type: 'Bank Transfer',
    icon: 'building' as const,
    color: colors.primary,
    rows: [
      { label: 'Account Name', value: 'Ali Moavia' },
      { label: 'Account Number', value: '59705002080213', highlight: true },
    ],
  },
  {
    id: 'easypaisa',
    bank: 'Easypaisa',
    type: 'Mobile Wallet',
    icon: 'wallet' as const,
    color: colors.success,
    rows: [
      { label: 'Account Name', value: 'Ali Moavia' },
      { label: 'Mobile Number', value: '0306-4944326', highlight: true },
    ],
  },
  {
    id: 'habibmetro',
    bank: 'Habib Metro Bank',
    type: 'Bank Transfer',
    icon: 'building' as const,
    color: '#7c3aed',
    rows: [
      { label: 'Account Name', value: 'Ali Moavia' },
      { label: 'Account Number', value: '6984729308714105093', highlight: true },
    ],
  },
];

export default function OwnerPaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    planId?: string;
    planName?: string;
    displayName?: string;
    price?: string;
    studentLimit?: string;
  }>();

  const { submitPaymentProof, isSubmittingPayment } = useSubscription();

  const [transactionId, setTransactionId] = useState('');
  const [smsText, setSmsText] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const planId = params.planId || 'plan_standard';
  const displayName = params.displayName || 'Standard Plan';
  const price = Number(params.price || 8000);
  const studentLimit = Number(params.studentLimit || 300);

  const handleCopy = (value: string, key: string) => {
    Clipboard.setString(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = async () => {
    if (!transactionId.trim() && !smsText.trim()) {
      Alert.alert('Required Info', 'Please enter a Transaction / Reference ID or paste the confirmation SMS.');
      return;
    }

    const txId = transactionId.trim() || smsText.slice(0, 50).trim() || `MOBILE_${Date.now()}`;
    const result = await submitPaymentProof({
      plan_id: planId,
      transaction_id: txId,
      amount: price,
      notes: smsText.trim(),
    });

    if (result.ok) {
      Alert.alert(
        'Proof Submitted!',
        'Payment proof submitted successfully! Our team will verify and activate your plan within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(owner)/subscription' as never),
          },
        ],
      );
    } else {
      Alert.alert('Submission Error', result.message || 'Failed to submit payment proof. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScreenContainer flush>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.padded}>
            <Header
              showBack
              greeting="Owner Portal"
              title="Upgrade Subscription"
              subtitle="Complete bank or wallet transfer to activate your plan"
            />

            {/* Plan Summary Banner */}
            <LinearGradient
              colors={['#2563EB', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.summaryBanner, shadows.card]}
            >
              <View style={styles.bannerLeft}>
                <View style={styles.bannerIconBox}>
                  <Icon name="sparkles" size={24} color={colors.white} />
                </View>
                <View>
                  <Text style={styles.bannerSub}>You are upgrading to</Text>
                  <Text style={styles.bannerPlanName}>{displayName}</Text>
                  <Text style={styles.bannerCapacity}>
                    Up to {studentLimit.toLocaleString()} students
                  </Text>
                </View>
              </View>

              <View style={styles.bannerRight}>
                <Text style={styles.bannerPriceSub}>Monthly Price</Text>
                <Text style={styles.bannerPrice}>PKR {price.toLocaleString()}</Text>
                <Text style={styles.bannerPriceSub}>/month</Text>
              </View>
            </LinearGradient>

            {/* Step 1: Send Payment */}
            <View style={styles.stepSection}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumberCircle}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <Text style={styles.stepTitle}>Send Payment</Text>
              </View>

              <Text style={styles.stepSubtitle}>
                Transfer <Text style={styles.boldText}>PKR {price.toLocaleString()}</Text> to any of
                the official accounts below:
              </Text>

              <View style={styles.accountsList}>
                {BANK_ACCOUNTS.map((acc) => (
                  <View key={acc.id} style={[styles.accountCard, shadows.card]}>
                    <View style={styles.accHeader}>
                      <View style={[styles.accIconBox, { backgroundColor: `${acc.color}15` }]}>
                        <Icon name={acc.icon} size={18} color={acc.color} />
                      </View>
                      <View>
                        <Text style={styles.accBank}>{acc.bank}</Text>
                        <Text style={styles.accType}>{acc.type}</Text>
                      </View>
                    </View>

                    <View style={styles.accRows}>
                      {acc.rows.map((row) => {
                        const copyKey = `${acc.id}-${row.label}`;
                        const isCopied = copiedKey === copyKey;
                        return (
                          <View key={row.label} style={styles.accRow}>
                            <Text style={styles.accRowLabel}>{row.label}</Text>
                            <View style={styles.accRowRight}>
                              <Text
                                style={[
                                  styles.accRowValue,
                                  row.highlight ? styles.accRowHighlight : null,
                                ]}
                                numberOfLines={1}
                              >
                                {row.value}
                              </Text>
                              <Pressable
                                onPress={() => handleCopy(row.value, copyKey)}
                                style={({ pressed }) => [
                                  styles.copyBtn,
                                  isCopied ? styles.copyBtnSuccess : styles.copyBtnDefault,
                                  pressed && styles.pressed,
                                ]}
                              >
                                <Icon
                                  name={isCopied ? 'check' : 'copy'}
                                  size={12}
                                  color={isCopied ? colors.success : colors.primary}
                                />
                                <Text
                                  style={[
                                    styles.copyBtnText,
                                    isCopied ? styles.copyTextSuccess : styles.copyTextDefault,
                                  ]}
                                >
                                  {isCopied ? 'Copied' : 'Copy'}
                                </Text>
                              </Pressable>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>

              {/* Info Box */}
              <View style={styles.infoBox}>
                <Icon name="info" size={16} color="#B45309" />
                <Text style={styles.infoText}>
                  After sending payment, enter your transaction ID or paste the confirmation SMS below.
                  Our team activates your subscription within <Text style={styles.boldText}>24 hours</Text>.
                </Text>
              </View>
            </View>

            {/* Step 2: Submit Proof */}
            <View style={styles.stepSection}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumberCircle}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <Text style={styles.stepTitle}>Submit Proof</Text>
              </View>

              <View style={[styles.proofFormCard, shadows.card]}>
                <Input
                  label="Transaction / Reference ID *"
                  placeholder="e.g. TXN9876543210"
                  value={transactionId}
                  onChangeText={setTransactionId}
                />

                <View style={styles.textareaWrap}>
                  <Text style={styles.inputLabel}>Confirmation SMS / Bank Note (optional)</Text>
                  <TextInput
                    style={styles.textarea}
                    multiline
                    numberOfLines={4}
                    placeholder="Paste the confirmation message or transaction details received from your bank/wallet..."
                    placeholderTextColor={colors.gray400}
                    value={smsText}
                    onChangeText={setSmsText}
                    textAlignVertical="top"
                  />
                </View>

                <Button
                  label={isSubmittingPayment ? 'Submitting…' : 'Submit Payment Proof'}
                  loading={isSubmittingPayment}
                  disabled={isSubmittingPayment || (!transactionId.trim() && !smsText.trim())}
                  onPress={handleSubmit}
                  iconLeft={<Icon name="check-circle" size={18} color={colors.white} />}
                  fullWidth
                />

                <Button
                  label="Cancel and go back"
                  variant="secondary"
                  onPress={() => router.back()}
                  fullWidth
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    paddingBottom: spacing.xl3,
  },
  padded: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
  },
  summaryBanner: {
    borderRadius: radius.xl2,
    padding: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerSub: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  bannerPlanName: {
    ...typography.h2,
    color: colors.white,
    fontWeight: '800',
  },
  bannerCapacity: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
  },
  bannerRight: {
    alignItems: 'flex-end',
  },
  bannerPriceSub: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  bannerPrice: {
    ...typography.h2,
    color: colors.white,
    fontWeight: '900',
  },
  stepSection: {
    marginBottom: spacing.xl,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  stepNumberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: '900',
  },
  stepTitle: {
    ...typography.h3,
    color: colors.gray900,
    fontWeight: '800',
  },
  stepSubtitle: {
    ...typography.bodySm,
    color: colors.gray600,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  boldText: {
    fontWeight: '800',
    color: colors.gray900,
  },
  accountsList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  accountCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  accHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  accIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accBank: {
    ...typography.bodySm,
    color: colors.gray900,
    fontWeight: '800',
  },
  accType: {
    ...typography.caption,
    color: colors.gray400,
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  accRows: {
    gap: 8,
  },
  accRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  accRowLabel: {
    ...typography.caption,
    color: colors.gray500,
    fontWeight: '600',
    width: 95,
  },
  accRowRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  accRowValue: {
    ...typography.bodySm,
    color: colors.gray800,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  accRowHighlight: {
    color: colors.primary,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  copyBtnDefault: {
    backgroundColor: colors.primaryLight,
  },
  copyBtnSuccess: {
    backgroundColor: colors.successLight,
  },
  copyBtnText: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 10,
  },
  copyTextDefault: {
    color: colors.primary,
  },
  copyTextSuccess: {
    color: colors.success,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fef3c7',
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  infoText: {
    ...typography.caption,
    color: '#92400e',
    lineHeight: 16,
    flex: 1,
  },
  proofFormCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl2,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    gap: spacing.md,
  },
  textareaWrap: {
    gap: 6,
  },
  inputLabel: {
    ...typography.bodySm,
    color: colors.gray700,
    fontWeight: '700',
  },
  textarea: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 90,
    backgroundColor: colors.gray50,
    ...typography.bodySm,
    color: colors.gray900,
  },
  pressed: {
    opacity: 0.8,
  },
});
