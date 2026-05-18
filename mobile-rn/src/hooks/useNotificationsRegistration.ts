/**
 * Push notification setup. Requests permission, gets the Expo push token,
 * configures a high-priority Android channel, and silently posts the token
 * to the backend (best-effort — the backend endpoint is /api/notifications/register
 * if/when it ships, otherwise this is a no-op).
 *
 * Local notification handler shows alerts and updates the badge while the
 * app is in foreground.
 */

import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { api } from '@/api/client';
import { prefStorage } from '@/utils/secure-storage';

const TOKEN_KEY = 'push_token';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function configureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'General',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#2563EB',
  });
}

async function registerToken(): Promise<string | null> {
  try {
    const settings = await Notifications.getPermissionsAsync();
    let granted = settings.granted;
    if (!granted && settings.canAskAgain) {
      const next = await Notifications.requestPermissionsAsync();
      granted = next.granted;
    }
    if (!granted) return null;

    await configureAndroidChannel();

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId ??
      undefined;
    const token = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    return token.data;
  } catch {
    return null;
  }
}

export function useNotificationsRegistration({ enabled }: { enabled: boolean }) {
  const sentRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      const cached = await prefStorage.get(TOKEN_KEY);
      const token = await registerToken();
      if (cancelled || !token) return;

      // Only post when the token actually changed since last sync.
      if (cached === token && sentRef.current === token) return;
      sentRef.current = token;
      await prefStorage.set(TOKEN_KEY, token);

      // Best-effort backend sync — fails silently if the endpoint isn't
      // wired up yet. Same shape the web /super-admin push registry uses.
      try {
        await api.post('/api/notifications/register', {
          token,
          platform: Platform.OS,
        });
      } catch {
        // ignore — this endpoint may not exist yet on the backend.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);
}
