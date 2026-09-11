#!/usr/bin/env bash
# ./build-latest-apk.sh
# Build the current EduPlexo mobile app from any working directory.
# The release APK is always copied to the repository root as:
#   eduplexo-latest.apk
#
# Signing:
#   With mobile-rn/android/keystore.properties present (created once via
#   scripts/generate-release-keystore.sh) the APK is signed with the stable
#   production identity. Without it, the release build signs with the debug
#   keystore and the script warns — do NOT distribute that artifact.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
if [[ -d "$SCRIPT_DIR/mobile-rn" ]]; then
  ROOT_DIR="$SCRIPT_DIR"
elif [[ -d "$SCRIPT_DIR/../mobile-rn" ]]; then
  ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
else
  echo "Could not locate the EduPlexo repository from: $SCRIPT_DIR" >&2
  exit 1
fi
MOBILE_DIR="$ROOT_DIR/mobile-rn"
APK_SOURCE="$MOBILE_DIR/android/app/build/outputs/apk/release/app-release.apk"
APK_DEST="$ROOT_DIR/eduplexo-latest.apk"
KEYSTORE_PROPS="$MOBILE_DIR/android/keystore.properties"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Node.js and npm are required. Install Node.js, then run this script again." >&2
  exit 1
fi

if [[ ! -d "$MOBILE_DIR" ]]; then
  echo "Could not find the mobile app at: $MOBILE_DIR" >&2
  exit 1
fi

cd "$MOBILE_DIR"

if [[ ! -d node_modules ]]; then
  echo "Installing mobile dependencies..."
  npm ci --no-audit --no-fund
fi

echo "Checking TypeScript..."
npm run typecheck

echo "Running lint..."
npm run lint

echo "Preparing Android project..."
npx expo prebuild --platform android --no-install

echo "Building release APK..."
npm run build:apk

if [[ ! -f "$APK_SOURCE" ]]; then
  echo "Build completed but no APK was found at: $APK_SOURCE" >&2
  exit 1
fi

cp "$APK_SOURCE" "$APK_DEST"

echo
echo "EduPlexo APK is ready:"
echo "  $APK_DEST"
echo "  SHA-256: $(shasum -a 256 "$APK_DEST" | awk '{print $1}')"

SIGNED_WITH_DEBUG=0
if command -v apksigner >/dev/null 2>&1; then
  echo
  echo "Verifying APK signature..."
  if apksigner verify --print-certs "$APK_DEST" 2>/dev/null | grep -q "androiddebugkey\|CN=Android Debug"; then
    SIGNED_WITH_DEBUG=1
  fi
elif [[ ! -f "$KEYSTORE_PROPS" ]]; then
  echo
  echo "NOTE: no keystore.properties and apksigner unavailable — assuming DEBUG-signed artifact."
  SIGNED_WITH_DEBUG=1
fi

if [[ "$SIGNED_WITH_DEBUG" == "1" ]]; then
  echo
  echo "⚠️  This APK is signed with the DEBUG keystore."
  echo "   It is for local testing only — do not distribute it."
  echo "   Run scripts/generate-release-keystore.sh once, then rebuild to"
  echo "   produce the stable production-signed release."
else
  echo
  echo "✅ APK is signed with the production release identity."
fi

echo
echo "Distribution note:"
echo "  Sideloaded APKs (installed outside Google Play) are always scanned by"
echo "  Google Play Protect. An unknown-but-consistent signing identity lowers"
echo "  the risk of a false 'harmful file' flag but cannot eliminate it — the"
echo "  long-term fix is distribution through Google Play, which requires a"
echo "  developer account and an AAB produced from the same keystore."

if command -v open >/dev/null 2>&1; then
  open -R "$APK_DEST" >/dev/null 2>&1 || true
fi
