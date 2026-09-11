#!/usr/bin/env bash
# ./build-latest-apk.sh
# Build the current EduPlexo mobile app from any working directory.
# The release APK is always copied to the repository root as:
#   eduplexo-latest.apk

set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
MOBILE_DIR="$ROOT_DIR/mobile-rn"
APK_SOURCE="$MOBILE_DIR/android/app/build/outputs/apk/release/app-release.apk"
APK_DEST="$ROOT_DIR/eduplexo-latest.apk"

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

if command -v open >/dev/null 2>&1; then
  open -R "$APK_DEST" >/dev/null 2>&1 || true
fi
