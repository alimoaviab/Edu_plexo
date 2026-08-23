/**
 * Root layout — installs providers and gates routing on auth hydration.
 *
 * The auth store reads the JWT from secure storage on first mount. Until
 * that finishes we keep the splash screen visible so the user never sees
 * a flash of the login screen when they're already signed in.
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

import { useAuthStore } from '@/store/auth-store';
import { queryClient } from '@/api/query-client';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { colors } from '@/theme/tokens';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';

SplashScreen.preventAutoHideAsync().catch(() => {});


const ROLE_HOME: Record<string, string> = {
  owner: '/(owner)',
  admin: '/(admin)',
  super_admin: '/(admin)',
  teacher: '/(teacher)',
  parent: '/(parent)',
  student: '/(student)',
};

function ProtectedRouter() {
  const segments = useSegments();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    SplashScreen.hideAsync().catch(() => {});

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (user && inAuthGroup) {
      const home = ROLE_HOME[user.role] ?? '/(admin)';
      router.replace(home as never);
    }
  }, [hydrated, segments, user, router]);

  if (!hydrated) {
    return <View style={styles.boot} />;
  }

  return <Slot />;
}

function ThemeAwareStatusBar() {
  const { isDark, colors } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.surface} />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <ThemeAwareStatusBar />
              <ProtectedRouter />
            </QueryClientProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
