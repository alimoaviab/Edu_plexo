/**
 * Root layout — installs providers and gates routing on auth hydration.
 *
 * Uses PersistQueryClientProvider so the last good data shows up instantly
 * on cold starts; stale data is replaced by a background refetch when the
 * network returns.
 *
 * The WebSocket hub is mounted here so any module screen sees real-time
 * updates without each screen re-establishing the connection.
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { queryClient, queryPersister } from '@/api/query-client';
import { useAuthStore } from '@/store/auth-store';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useNotificationsRegistration } from '@/hooks/useNotificationsRegistration';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

const ROLE_HOME: Record<string, string> = {
  admin: '/(admin)',
  super_admin: '/(admin)',
  teacher: '/(teacher)',
  parent: '/(student)',
  student: '/(student)',
};

function ProtectedRouter() {
  const segments = useSegments();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  useWebSocket({ enabled: !!user });
  useNotificationsRegistration({ enabled: !!user });

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

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: queryPersister, maxAge: 24 * 60 * 60 * 1000 }}
        >
          <StatusBar style="dark" backgroundColor={colors.surface} />
          <ProtectedRouter />
        </PersistQueryClientProvider>
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
