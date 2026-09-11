/**
 * Centralised public env access for the mobile client. Pulls values from
 * `app.json` -> `expo.extra` so we never hard-code URLs in components.
 *
 * To switch environments, edit app.json or pass `--env` to a build script.
 */

import Constants from 'expo-constants';

interface AppExtra {
  apiBaseUrl?: string;
  appName?: string;
  webPortalUrl?: string;
}

const extra = (Constants.expoConfig?.extra ?? {}) as AppExtra;

const stripTrailing = (value: string) => value.replace(/\/$/, '');

const rawBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  extra.apiBaseUrl ||
  'https://api.eduplexo.com/api';

// The school web portal (sign in with the same school account). Payments,
// upgrades and owner billing live here — the mobile app links out instead of
// duplicating the payment flow.
const rawWebPortalUrl =
  process.env.EXPO_PUBLIC_WEB_PORTAL_URL ||
  extra.webPortalUrl ||
  'https://app.eduplexo.com';

export const env = {
  apiBaseUrl: stripTrailing(rawBaseUrl),
  webPortalUrl: stripTrailing(rawWebPortalUrl),
  appName: extra.appName ?? 'EduPlexo',
} as const;

if (__DEV__) {
  // Surfaced in the Metro terminal / device logs on every launch so you can
  // confirm exactly which backend the app is hitting. If this prints the wrong
  // URL, restart Metro with `npx expo start -c` (env/app.config.js are read
  // only at Metro startup) and reload the app.
  // eslint-disable-next-line no-console
  console.log(`[eduplexo] API base URL => ${env.apiBaseUrl}`);
  // eslint-disable-next-line no-console
  console.log(`[eduplexo] Web portal URL => ${env.webPortalUrl}`);
}
