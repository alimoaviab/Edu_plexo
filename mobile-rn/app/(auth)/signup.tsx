/**
 * Mobile signup — streamlined owner account / institution registration.
 * Role selection bar is removed; account creation registers the school owner
 * and institution directly.
 */

import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { api } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

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

const initial: SignupForm = {
  fullName: '',
  email: '',
  phone: '',
  schoolName: '',
  password: '',
  confirmPassword: '',
};

export default function SignupScreen() {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof SignupForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  }

  function validate(): string | null {
    if (!form.fullName.trim()) return 'Full legal name is required.';
    if (!form.email.trim()) return 'Email address is required.';
    if (!EMAIL_REGEX.test(form.email.trim())) return 'Please enter a valid email address.';
    if (!form.phone.trim()) return 'Phone number is required.';
    if (!form.password) return 'Password is required.';
    if (!PASSWORD_REGEX.test(form.password)) {
      return 'Password must be at least 8 characters long with uppercase, lowercase, number, and special character (@$!%*?&).';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  }

  async function handleSubmit() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const body = {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      schoolName: form.schoolName.trim() || `${form.fullName.trim()}'s Institution`,
      password: form.password,
      confirmPassword: form.confirmPassword,
      role: 'owner',
    };

    const result = await api.post<{ ok: boolean }>('/auth/signup', body);
    setLoading(false);

    if (!result.ok) {
      setError(result.message ?? "We couldn't create your account. Please check your details.");
      return;
    }
    router.replace('/(auth)/login');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>REGISTER YOUR INSTITUTION</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="FULL LEGAL NAME"
              placeholder="Aisha Khan"
              value={form.fullName}
              onChangeText={(v) => update('fullName', v)}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
            />
            <Input
              label="WORK EMAIL"
              placeholder="owner@school.com"
              value={form.email}
              onChangeText={(v) => update('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
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
              label="SCHOOL / INSTITUTION NAME"
              placeholder="Eduplexo Academy (Optional)"
              value={form.schoolName}
              onChangeText={(v) => update('schoolName', v)}
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

            {error ? (
              <View style={styles.errorBox}>
                <Icon name="shield" size={18} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Button
              label={loading ? 'Creating Account…' : 'Create Account'}
              onPress={handleSubmit}
              loading={loading}
              size="lg"
              fullWidth
              iconRight={
                !loading ? <Icon name="arrow-right" size={18} color={colors.white} /> : undefined
              }
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already part of the family? </Text>
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
  title: { ...typography.h1, color: colors.gray900 },
  subtitle: { ...typography.labelXs, color: colors.gray400, letterSpacing: 1.5 },
  form: { gap: spacing.lg },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.errorLight,
  },
  errorText: { flex: 1, ...typography.bodySm, color: colors.error, fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { ...typography.bodyMd, color: colors.gray400, fontWeight: '700' },
  footerLink: {
    ...typography.bodyMd,
    color: colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
