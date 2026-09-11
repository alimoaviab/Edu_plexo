#!/usr/bin/env bash
# Generate the EduPlexo production release keystore.
#
# The release APK must be signed with the SAME certificate every time.
# Historically the release build fell back to the debug keystore, so every
# rebuild shipped a different identity and sideloaded installs drew Google
# Play Protect "harmful file" warnings. This script creates the real
# production keystore once; keep the file and both passwords safe — losing
# them means the app identity cannot be updated on devices any more.
#
# Usage:
#   ./scripts/generate-release-keystore.sh
#
# Result:
#   mobile-rn/android/app/eduplexo-release.keystore   (git-ignored, never commit)
#   mobile-rn/android/keystore.properties             (git-ignored, never commit)

set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="$ROOT_DIR/mobile-rn/android/app"
KEYSTORE="$APP_DIR/eduplexo-release.keystore"
PROPS="$ROOT_DIR/mobile-rn/android/keystore.properties"

if ! command -v keytool >/dev/null 2>&1; then
  echo "keytool not found. Install the JDK (e.g. via Android Studio) and retry." >&2
  exit 1
fi

if [[ -f "$KEYSTORE" ]]; then
  echo "Keystore already exists at: $KEYSTORE"
  echo "Refusing to overwrite — reuse the existing keystore so the app identity stays stable."
  exit 0
fi

echo "== EduPlexo release keystore generation =="
read -r -p "Keystore password (min 6 chars): " STORE_PASS
read -r -p "Key password (min 6 chars): " KEY_PASS
read -r -p "Certificate CN (e.g. EduPlexo Release): " CERT_CN
read -r -p "Certificate organisation (e.g. EduPlexo): " CERT_OU

if [[ -z "$STORE_PASS" || -z "$KEY_PASS" || -z "$CERT_CN" || -z "$CERT_OU" ]]; then
  echo "All values are required." >&2
  exit 1
fi

mkdir -p "$APP_DIR"

keytool -genkeypair -v \
  -keystore "$KEYSTORE" \
  -storetype PKCS12 \
  -storepass "$STORE_PASS" \
  -keypass "$KEY_PASS" \
  -alias eduplexo-release \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=$CERT_CN, O=$CERT_OU"

cat > "$PROPS" <<EOF
storeFile=eduplexo-release.keystore
storePassword=$STORE_PASS
keyAlias=eduplexo-release
keyPassword=$KEY_PASS
EOF

echo
echo "Keystore created:"
echo "  $KEYSTORE"
echo "  $PROPS"
echo
echo "Both files are git-ignored. Back them up securely — the release"
echo "identity depends on them and they cannot be recovered if lost."
