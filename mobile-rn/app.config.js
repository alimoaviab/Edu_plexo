// @ts-check
/**
 * Dynamic Expo config.
 *
 * Loads the static config from app.json, then lets the API base URL be
 * overridden per-environment via EXPO_PUBLIC_API_URL (read from a local .env
 * file by the Expo CLI). This avoids hard-coding a LAN IP that changes every
 * time your router/DHCP hands out a new address.
 *
 *   • Local device / emulator hitting the Docker backend on your Mac:
 *       EXPO_PUBLIC_API_URL=http://<your-mac-LAN-ip>:8080/api   (see .env)
 *   • Production / EAS builds (no .env):
 *       falls back to app.json -> expo.extra.apiBaseUrl
 *
 * Find your Mac's LAN IP with:  ipconfig getifaddr en0
 */

/** @param {{ config: import('@expo/config-types').ExpoConfig }} ctx */
module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? config.extra?.apiBaseUrl,
  },
});
