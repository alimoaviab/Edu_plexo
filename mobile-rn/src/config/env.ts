/**
 * Centralised public env access for the mobile client. Pulls values from
 * `app.json` -> `expo.extra` so we never hard-code URLs in components.
 *
 * Path convention: `apiBaseUrl` is the host root (no `/api` suffix). Service
 * modules prepend `/api/...` themselves so the path strings match the web
 * client 1:1 and we can copy contracts over without translation.
 *
 * To switch environments, edit app.json -> expo.extra.apiBaseUrl, or pass
 * `EXPO_PUBLIC_API_URL` at build time.
 */

import Constants from 'expo-constants';

interface AppExtra {
  apiBaseUrl?: string;
  appName?: string;
}

const extra = (Constants.expoConfig?.extra ?? {}) as AppExtra;

const stripTrailing = (value: string) => value.replace(/\/+$/, '');
const stripApiSuffix = (value: string) => value.replace(/\/api$/, '');

const rawBase =
  process.env.EXPO_PUBLIC_API_URL ||
  extra.apiBaseUrl ||
  'https://app.eduplexo.com';

const baseUrl = stripApiSuffix(stripTrailing(rawBase));

export const env = {
  /** Host root, without trailing `/api`. e.g. `https://app.eduplexo.com`. */
  apiBaseUrl: baseUrl,
  /** Convenience: same value with `/api` suffix. */
  apiUrl: `${baseUrl}/api`,
  /** WebSocket URL derived from base — used by useWebSocket. */
  wsUrl: baseUrl.replace(/^http/, 'ws') + '/ws',
  appName: extra.appName ?? 'EduPlexo',
} as const;
