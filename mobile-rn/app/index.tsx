/**
 * Entry point — Expo Router lands here on cold start.
 * Respects auth state to redirect to the proper role home or login screen.
 */
import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/theme/tokens';

const ROLE_HOME: Record<string, string> = {
  owner: '/(owner)',
  admin: '/(admin)',
  super_admin: '/(admin)',
  teacher: '/(teacher)',
  student: '/(student)',
};

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated) {
    return <View style={styles.boot} />;
  }

  if (user) {
    const home = ROLE_HOME[user.role] ?? '/(admin)';
    return <Redirect href={home as never} />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

