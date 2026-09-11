/**
 * Mobile signup — mirrors the current school-admin onboarding flow.
 *
 * The Go backend reserves the school on the first request, emails a
 * six-digit OTP, and only activates the admin account after verification.
 */

import { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { api } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth-store';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { secureStorage, StorageKeys } from '@/utils/secure-storage';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

interface SignupForm {
  fullName: string;
  email: string;
  phone: string;
  schoolName: string;
  password: string;
  confirmPassword: string;
}

interface PendingSignup {
  pending_id: string;
  email: string;
  expires_in_seconds?: number;
  resend_cooldown_seconds?: number;
}

interface SignupResponse {
  token?: string;
  role?: string;
  pending_id?: string;
  email?: string;
  expires_in_seconds?: number;
  resend_cooldown_seconds?: number;
}

const initial: SignupForm = {
  fullName: '',
  email: '',
  phone: '',
  schoolName: '',
  password: '',
  confirmPassword: '',
};

function formatSeconds(value: number): string {
  const minutes = Math.floor(value / 60).toString().padStart(2, '0');
  const seconds = (value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function SignupScreen() {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>(initial);
  const [stage, setStage] = useState<'form' | 'verify'>('form');
  const [pending, setPending] = useState<PendingSignup | null>(null);
  const [otp, setOtp] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stage !== 'verify') return undefined;
    const timer = setInterval(() => {
      setTimeRemaining((value) => Math.max(0, value - 1));
      setResendCooldown((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [stage]);

  function update<K extends keyof SignupForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setNotice(null);
  }

  function validate(): string | null {
    if (!form.schoolName.trim()) return 'School / institution name is required.';
    if (!form.fullName.trim()) return 'Administrator name is required.';
    if (!form.phone.trim()) return 'Phone number is required.';
    if (!form.email.trim()) return 'Email address is required.';
    if (!EMAIL_REGEX.test(form.email.trim())) return 'Please enter a valid email address.';
    if (!form.password) return 'Password is required.';
    if (!PASSWORD_REGEX.test(form.password)) {
      return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.';
    }
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (!acceptedTerms) return 'You must accept the Terms & Conditions to continue.';
    return null;
  }

  async function handleSignup() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);

    const result = await api.post<SignupResponse, Record<string, string>>('/auth/signup', {
      schoolName: form.schoolName.trim(),
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: 'admin',
    });
    setLoading(false);

    if (!result.ok || !result.data) {
      setError(result.message ?? "We couldn't create your account. Please check your details.");
      return;
    }

    if (result.data.token) {
      await secureStorage.set(StorageKeys.token, result.data.token);
      await useAuthStore.getState().hydrate();
      router.replace('/(admin)');
      return;
    }

    if (!result.data.pending_id) {
      setError('The server returned an invalid verification session. Please try again.');
      return;
    }

    const nextPending: PendingSignup = {
      pending_id: result.data.pending_id,
      email: result.data.email ?? form.email.trim().toLowerCase(),
      expires_in_seconds: result.data.expires_in_seconds ?? 300,
      resend_cooldown_seconds: result.data.resend_cooldown_seconds ?? 60,
    };
    setPending(nextPending);
    setTimeRemaining(nextPending.expires_in_seconds ?? 300);
    setResendCooldown(nextPending.resend_cooldown_seconds ?? 60);
    setOtp('');
    setStage('verify');
    setNotice(`We sent a 6-digit verification code to ${nextPending.email}.`);
  }

  async function handleVerify() {
    if (!pending) return;
    if (!/^\d{6}$/.test(otp)) {
      setError('Verification code must be exactly 6 digits.');
      return;
    }

    setLoading(true);
    setError(null);
    const result = await api.post<SignupResponse, { pending_id: string; otp: string }>(
      '/auth/verify-otp',
      { pending_id: pending.pending_id, otp },
    );
    setLoading(false);

    if (!result.ok || !result.data?.token) {
      setError(result.message ?? 'That code could not be verified. Please try again.');
      return;
    }

    await secureStorage.set(StorageKeys.token, result.data.token);
    await useAuthStore.getState().hydrate();
    router.replace('/(admin)');
  }

  async function handleResend() {
    if (!pending || resendCooldown > 0) return;
    setLoading(true);
    setError(null);
    const result = await api.post<SignupResponse, { pending_id: string }>('/auth/resend-otp', {
      pending_id: pending.pending_id,
    });
    setLoading(false);

    if (!result.ok || !result.data) {
      setError(result.message ?? 'The verification code could not be resent.');
      return;
    }

    const expiry = result.data.expires_in_seconds ?? 300;
    const cooldown = result.data.resend_cooldown_seconds ?? 60;
    setTimeRemaining(expiry);
    setResendCooldown(cooldown);
    setOtp('');
    setNotice(`A new verification code was sent to ${pending.email}.`);
  }

  async function handleChangeEmail() {
    if (!pending) return;
    const nextEmail = form.email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(nextEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setChangingEmail(true);
    setError(null);
    const result = await api.post<SignupResponse, { pending_id: string; new_email: string }>(
      '/auth/change-email',
      { pending_id: pending.pending_id, new_email: nextEmail },
    );
    setChangingEmail(false);

    if (!result.ok || !result.data) {
      setError(result.message ?? 'The email address could not be updated.');
      return;
    }

    const updatedEmail = result.data.email ?? nextEmail;
    setPending((current) => (current ? { ...current, email: updatedEmail } : current));
    setTimeRemaining(result.data.expires_in_seconds ?? 300);
    setResendCooldown(result.data.resend_cooldown_seconds ?? 60);
    setOtp('');
    setShowChangeEmail(false);
    setNotice(`A new verification code was sent to ${updatedEmail}.`);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, shadows.floating]}>
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Image
                source={require('@assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.title}>{stage === 'form' ? 'Create School Account' : 'Verify Your Email'}</Text>
            <Text style={styles.subtitle}>{stage === 'form' ? 'REGISTER YOUR INSTITUTION' : 'SECURITY VERIFICATION'}</Text>
          </View>

          {stage === 'form' ? (
            <View style={styles.form}>
              <Input
                label="SCHOOL / INSTITUTION NAME"
                placeholder="Beacon Heights Academy"
                value={form.schoolName}
                onChangeText={(v) => update('schoolName', v)}
                autoCapitalize="words"
                autoComplete="organization"
              />
              <Input
                label="ADMINISTRATOR NAME"
                placeholder="Aisha Khan"
                value={form.fullName}
                onChangeText={(v) => update('fullName', v)}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
              />
              <Input
                label="PHONE NUMBER"
                placeholder="+92 300 1234567"
                value={form.phone}
                onChangeText={(v) => update('phone', v)}
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
              />
              <Input
                label="OFFICIAL EMAIL ADDRESS"
                placeholder="admin@school.edu"
                value={form.email}
                onChangeText={(v) => update('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
              <Input
                label="PASSWORD"
                placeholder="••••••••"
                value={form.password}
                onChangeText={(v) => update('password', v)}
                passwordToggle
                autoComplete="password-new"
                textContentType="newPassword"
              />
              <Input
                label="CONFIRM PASSWORD"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChangeText={(v) => update('confirmPassword', v)}
                passwordToggle
                autoComplete="password-new"
                textContentType="newPassword"
              />
              <Pressable style={styles.termsRow} onPress={() => setAcceptedTerms((value) => !value)}>
                <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                  {acceptedTerms ? <Icon name="check" size={14} color={colors.white} /> : null}
                </View>
                <Text style={styles.termsText}>
                  By continuing, you agree to the EduPlexo Terms & Conditions and Privacy Policy.
                </Text>
              </Pressable>
              <Button
                label={loading ? 'Sending Verification Code…' : 'Create Account'}
                onPress={handleSignup}
                loading={loading}
                size="lg"
                fullWidth
                iconRight={!loading ? <Icon name="arrow-right" size={18} color={colors.white} /> : undefined}
              />
            </View>
          ) : (
            <View style={styles.form}>
              {notice ? (
                <View style={styles.noticeBox}>
                  <Icon name="mail" size={18} color={colors.primary} />
                  <Text style={styles.noticeText}>{notice}</Text>
                </View>
              ) : null}
              <Text style={styles.verifyLabel}>ENTER 6-DIGIT CODE</Text>
              <TextInput
                value={otp}
                onChangeText={(value) => {
                  setOtp(value.replace(/\D/g, '').slice(0, 6));
                  setError(null);
                }}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                textContentType="oneTimeCode"
                placeholder="000000"
                placeholderTextColor={colors.textPlaceholder}
                style={styles.otpInput}
              />
              <View style={styles.timerRow}>
                <View style={styles.timerCopy}>
                  <Icon name="clock" size={15} color={timeRemaining <= 60 ? colors.error : colors.primary} />
                  <Text style={styles.timerText}>Expires in {formatSeconds(timeRemaining)}</Text>
                </View>
                <Pressable onPress={handleResend} disabled={resendCooldown > 0 || loading} hitSlop={8}>
                  <Text style={[styles.resendText, (resendCooldown > 0 || loading) && styles.disabledText]}>
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                  </Text>
                </Pressable>
              </View>
              {showChangeEmail ? (
                <View style={styles.changeEmailBox}>
                  <Input
                    label="UPDATE VERIFICATION EMAIL"
                    value={form.email}
                    onChangeText={(v) => update('email', v)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                  <Button label={changingEmail ? 'Saving…' : 'Update Email'} onPress={handleChangeEmail} loading={changingEmail} size="sm" />
                </View>
              ) : (
                <Pressable onPress={() => setShowChangeEmail(true)} hitSlop={8}>
                  <Text style={styles.changeEmailLink}>Change email address</Text>
                </Pressable>
              )}
              <Button
                label={loading ? 'Verifying Code…' : 'Verify & Activate Account'}
                onPress={handleVerify}
                loading={loading}
                size="lg"
                fullWidth
                iconRight={!loading ? <Icon name="arrow-right" size={18} color={colors.white} /> : undefined}
              />
            </View>
          )}

          {error ? (
            <View style={styles.errorBox}>
              <Icon name="shield" size={18} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.footer}>
            <Text style={styles.footerText}>{stage === 'verify' ? 'Need to start over? ' : 'Already part of the family? '}</Text>
            <Pressable onPress={() => router.replace('/(auth)/login')} hitSlop={8}>
              <Text style={styles.footerLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.white },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xl2,
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl2,
    borderWidth: 1,
    borderColor: colors.gray100,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  header: { alignItems: 'center', gap: 6 },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  logoImage: { width: '100%', height: '100%' },
  title: { ...typography.h1, color: colors.gray900, textAlign: 'center' },
  subtitle: { ...typography.labelXs, color: colors.gray400, letterSpacing: 1.5 },
  form: { gap: spacing.lg },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: colors.primary },
  termsText: { flex: 1, ...typography.caption, color: colors.gray600, lineHeight: 17 },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryContainer,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  noticeText: { flex: 1, ...typography.bodySm, color: colors.primaryDark, fontWeight: '700' },
  verifyLabel: { ...typography.labelXs, color: colors.gray500, textAlign: 'center', letterSpacing: 1.2 },
  otpInput: {
    height: 64,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.gray50,
    color: colors.gray900,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 10,
    paddingLeft: 10,
  },
  timerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timerCopy: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { ...typography.caption, color: colors.gray600, fontWeight: '700' },
  resendText: { ...typography.caption, color: colors.primary, fontWeight: '800' },
  disabledText: { color: colors.gray400 },
  changeEmailBox: { gap: spacing.sm, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.gray50 },
  changeEmailLink: { ...typography.bodySm, color: colors.primary, fontWeight: '800', textAlign: 'center', textDecorationLine: 'underline' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.errorLight,
  },
  errorText: { flex: 1, ...typography.bodySm, color: colors.error, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { ...typography.bodyMd, color: colors.gray400, fontWeight: '700' },
  footerLink: { ...typography.bodyMd, color: colors.primary, fontWeight: '700', textDecorationLine: 'underline' },
});
