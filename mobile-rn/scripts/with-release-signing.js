/**
 * Expo config plugin: dedicated release signing for the Android build.
 *
 * The generated `android/app/build.gradle` signs release builds with the
 * debug keystore by default. That means every rebuild ships a different app
 * identity — sideloaded APKs with an unstable signing identity are a known
 * trigger for Google Play Protect "harmful file" warnings, and installs
 * over a previous build fail or loop.
 *
 * This plugin injects a gradle `release` signing config that reads
 * `android/keystore.properties` (created once by
 * `scripts/generate-release-keystore.sh`, git-ignored) at build time.
 * Passwords never enter gradle files or the repo. When the keystore has not
 * been generated yet, the release build still signs with the debug keystore
 * so local builds keep working — and gradle prints a loud warning instead
 * of silently shipping an unstable identity.
 */

const { withAppBuildGradle } = require('@expo/config-plugins');

const SIGNING_CONFIGS_ANCHOR = `    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }`;

const SIGNING_CONFIGS_WITH_RELEASE = `    // Release signing reads android/keystore.properties (git-ignored) at
    // build time. Injected by mobile-rn/scripts/with-release-signing.js —
    // see scripts/generate-release-keystore.sh for one-time setup.
    def keystoreProperties = new Properties()
    def keystorePropertiesFile = rootProject.file("keystore.properties")
    if (keystorePropertiesFile.exists()) {
        keystorePropertiesFile.withInputStream { keystoreProperties.load(it) }
    } else {
        logger.warn("eduplexo-signing: android/keystore.properties not found — release APK will be DEBUG-signed. Run scripts/generate-release-keystore.sh for the production identity.")
    }
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }`;

// Anchor on the release buildType's signingConfig line followed by the
// shrinkResources line — the debug buildType also contains
// `signingConfig signingConfigs.debug`, so a bare match would be ambiguous.
const RELEASE_SIGNING_ANCHOR = `        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug`;

const RELEASE_SIGNING_WITH_PROPS = `        release {
            if (keystorePropertiesFile.exists()) {
                signingConfig signingConfigs.release
            } else {
                logger.warn("eduplexo-signing: DEBUG-signed release APK (no keystore.properties) — do not distribute.")
                signingConfig signingConfigs.debug
            }`;

const withReleaseSigning = (config) => {
  return withAppBuildGradle(config, (modConfig) => {
    let contents = modConfig.modResults?.contents ?? '';

    if (!contents.includes(SIGNING_CONFIGS_ANCHOR)) {
      console.warn(
        '[with-release-signing] app/build.gradle does not match the expected Expo template — release signing NOT configured.',
      );
      return modConfig;
    }

    contents = contents.replace(SIGNING_CONFIGS_ANCHOR, SIGNING_CONFIGS_WITH_RELEASE);
    contents = contents.replace(RELEASE_SIGNING_ANCHOR, RELEASE_SIGNING_WITH_PROPS);

    if (!contents.includes('signingConfigs.release')) {
      console.warn(
        '[with-release-signing] release buildType anchor not found — release APK would remain DEBUG-signed.',
      );
    }

    modConfig.modResults.contents = contents;
    return modConfig;
  });
};

module.exports = withReleaseSigning;
