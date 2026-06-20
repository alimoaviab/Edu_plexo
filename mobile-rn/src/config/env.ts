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
}

const extra = (Constants.expoConfig?.extra ?? {}) as AppExtra;

const stripTrailing = (value: string) => value.replace(/\/$/, '');

export const env = {
  apiBaseUrl: stripTrailing(extra.apiBaseUrl ?? 'https://app.eduplexo.com/api'),
  appName: extra.appName ?? 'EduPlexo',
} as const;

if (__DEV__) {
  // Surfaced in the Metro terminal / device logs on every launch so you can
  // confirm exactly which backend the app is hitting. If this prints the wrong
  // URL, restart Metro with `npx expo start -c` (env/app.config.js are read
  // only at Metro startup) and reload the app.
  // eslint-disable-next-line no-console
  console.log(`[eduplexo] API base URL => ${env.apiBaseUrl}`);
}
