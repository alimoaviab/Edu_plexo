# EduPlexo Mobile (Browser Runner)

A lightweight Flutter wrapper that turns the live EduPlexo SaaS website into
native **Android and iOS** apps. It does **not** rebuild any portal — it loads
`https://YOURDOMAIN.com` inside a hardened WebView so all four portals
(Admin, Teacher, Student, Parent) just work.

---

## Features

- Full-screen WebView with smooth pull-to-refresh
- Native splash screen (no white flash on cold start) — both platforms
- Modern adaptive launcher icon (Android) + iOS app icon
- JavaScript, DOM Storage, IndexedDB, cookies → session/login persistence works
- File uploads, camera capture, microphone, downloads
- Hardware back button on Android, swipe-back gesture on iOS
- Top progress bar + branded loader on first paint
- Offline / network-error screen with retry
- External links (mailto, tel, third-party domains) open in the device browser
- Production-ready: minSdk 26 (Android 8+), iOS 13+, R8 minification, signed releases

---

## 1. Install dependencies (one time per machine)

### 1.1 Install Flutter

```bash
brew install --cask flutter
flutter doctor
```

For iOS you also need:

```bash
# Install Xcode from the Mac App Store, then:
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
sudo xcodebuild -license accept

# CocoaPods (iOS dependency manager)
sudo gem install cocoapods
```

For Android:

```bash
flutter doctor --android-licenses
```

Run `flutter doctor` again — both **Android toolchain** and **Xcode** should
show green.

### 1.2 Install project dependencies

```bash
cd mobile-app
flutter pub get
```

For iOS, also install the CocoaPods:

```bash
cd ios
pod install
cd ..
```

### 1.3 Generate splash + launcher icons (once you add real art)

Drop `app_icon.png`, `app_icon_foreground.png`, and `splash_logo.png` into
`assets/images/`, then:

```bash
dart run flutter_launcher_icons
dart run flutter_native_splash:create
```

This regenerates icons and splash screens for **both** Android and iOS.

### 1.4 Point the app at your real domain

Edit `lib/config/app_config.dart`:

```dart
static const String siteUrl = 'https://YOURDOMAIN.com';
static const List<String> allowedHosts = [
  'YOURDOMAIN.com',
  'www.YOURDOMAIN.com',
];
```

---

## 2. Connect a device

### 2.1 Android phone with ADB

1. **Settings → About phone → tap Build number 7 times** to enable Developer Options.
2. **Settings → Developer options → USB debugging** ON.
3. Plug into the Mac, accept the **Allow USB debugging** prompt.
4. Verify:

   ```bash
   adb devices
   ```

   Expected:
   ```
   List of devices attached
   R58M12345AB    device
   ```

   If you see `unauthorized`, replug and accept the prompt. If empty,
   `adb kill-server && adb start-server`.

### 2.2 iPhone via USB

1. Plug the iPhone into the Mac with a USB cable.
2. On the iPhone, tap **Trust This Computer** when prompted.
3. **Settings → Privacy & Security → Developer Mode** → ON (iOS 16+).
4. Verify:

   ```bash
   xcrun devicectl list devices
   # or
   flutter devices
   ```

   You should see your iPhone listed.

5. **First time only:** open `ios/Runner.xcworkspace` in Xcode, select the
   **Runner** target, go to **Signing & Capabilities**, and pick your
   **Team** (free Apple ID works for sideloading; paid $99/yr account is
   required to publish to App Store).

---

## 3. Run on a real device

```bash
flutter run                           # auto-picks the only device
flutter devices                       # list available targets
flutter run -d <device-id>            # pick a specific one
```

While running:
- `r` hot reload
- `R` hot restart
- `q` quit

---

## 4. Build release artifacts

### 4.1 Android — APK / App Bundle

```bash
# Universal APK (works on any device)
flutter build apk --release

# Smaller per-architecture APKs (recommended for sideloading)
flutter build apk --release --split-per-abi

# App Bundle for Google Play
flutter build appbundle --release
```

Outputs:
- `build/app/outputs/flutter-apk/app-release.apk`
- `build/app/outputs/flutter-apk/app-arm64-v8a-release.apk` (most modern phones)
- `build/app/outputs/bundle/release/app-release.aab`

### 4.2 iOS — IPA for App Store

```bash
flutter build ipa --release
```

Output: `build/ios/ipa/eduplexo.ipa`

Upload to App Store Connect with the free Apple **Transporter** app from the
Mac App Store, or via Xcode → **Window → Organizer → Distribute App**.

### 4.3 Sign Android release builds

1. Generate an upload keystore (one time):

   ```bash
   keytool -genkey -v -keystore ~/eduplexo-upload.jks \
     -keyalg RSA -keysize 2048 -validity 10000 -alias eduplexo
   ```

2. Create `mobile-app/android/key.properties`:

   ```properties
   storePassword=YOUR_KEYSTORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=eduplexo
   storeFile=/Users/YOU/eduplexo-upload.jks
   ```

3. `key.properties` and `.jks` files are already in `.gitignore`. Rebuild —
   `flutter build apk --release` now uses your real signing config.

### 4.4 Sign iOS release builds

1. Open `ios/Runner.xcworkspace` in Xcode.
2. Select **Runner** target → **Signing & Capabilities**.
3. Check **Automatically manage signing** and choose your **Team**.
4. Bump the bundle ID if `com.eduplexo.app` is taken on App Store Connect.
5. Re-run `flutter build ipa --release`.

---

## 5. Test before store upload

### 5.1 Sideload to a phone

**Android:**
```bash
adb install -r build/app/outputs/flutter-apk/app-release.apk
# If signature mismatch:
adb uninstall com.eduplexo.app
```

**iOS** (requires Apple Developer account):
```bash
# After flutter build ipa --release
# 1. Open build/ios/archive/Runner.xcarchive in Xcode → Distribute App
# 2. Or upload to TestFlight for invited testers
```

For free Apple ID sideloading without a paid account:
```bash
flutter run --release -d <iphone-id>
```
The app installs but expires after 7 days.

### 5.2 Manual smoke test checklist

Run through this on **both** an Android and an iPhone:

- [ ] App launches without a white screen on cold start
- [ ] Splash logo appears, then the website loads
- [ ] Top progress bar fills smoothly
- [ ] Login persists after killing and reopening the app
- [ ] All four portals load: admin, teacher, student, parent
- [ ] Pull-to-refresh works on any page
- [ ] Hardware back (Android) / swipe-from-left (iOS) navigates back
- [ ] Pressing back on home shows **Exit?** dialog (Android only)
- [ ] File upload (e.g., student profile photo) opens the system picker
- [ ] Camera capture works (e.g., live photo upload)
- [ ] Microphone permission prompt appears for live class
- [ ] Downloads (PDF report cards, fee receipts) open in the system viewer
- [ ] External links (`mailto:`, `tel:`, payment gateway) open externally
- [ ] Toggle airplane mode → offline screen with **Retry** button
- [ ] Re-enable network → tap retry → site reloads
- [ ] Rotate device → no white flash, page state preserved
- [ ] Background → resume → session still alive

### 5.3 Pre-launch reports

- **Google Play Console** runs an automated pre-launch report on real devices
  for every Internal testing track upload. Wait for the email before promoting
  to production.
- **App Store Connect TestFlight** lets you invite up to 10 000 external
  testers via email or public link before submitting for review.

---

## Project structure

```
mobile-app/
├── lib/                            # Cross-platform Dart code (shared)
│   ├── main.dart                   # Entry, theming, system UI
│   ├── config/app_config.dart      # siteUrl, brand colors, allowed hosts
│   ├── screens/browser_screen.dart # WebView + navigation logic
│   └── widgets/
│       ├── loading_overlay.dart
│       └── error_view.dart
│
├── android/                        # Android-specific
│   ├── app/
│   │   ├── build.gradle            # minSdk 26, release signing, R8
│   │   ├── proguard-rules.pro
│   │   └── src/main/
│   │       ├── AndroidManifest.xml # permissions, splash theme
│   │       ├── kotlin/com/eduplexo/app/MainActivity.kt
│   │       └── res/                # icons, splash, themes
│   ├── build.gradle
│   └── settings.gradle
│
├── ios/                            # iOS-specific
│   ├── Runner/
│   │   ├── Info.plist              # privacy strings, ATS, URL schemes
│   │   ├── AppDelegate.swift
│   │   ├── Runner-Bridging-Header.h
│   │   ├── Assets.xcassets/        # AppIcon + LaunchImage
│   │   └── Base.lproj/             # storyboards
│   ├── Flutter/                    # build configs
│   ├── Podfile                     # CocoaPods deps, iOS 13 target
│   ├── Runner.xcodeproj/
│   └── Runner.xcworkspace/         # OPEN THIS in Xcode, not the .xcodeproj
│
├── assets/images/                  # Drop branding here
├── pubspec.yaml
└── README.md
```

---

## Command cheat sheet

```bash
# Install
flutter pub get
cd ios && pod install && cd ..

# Devices
adb devices                    # Android
flutter devices                # Both platforms

# Run
flutter run                    # auto-pick device
flutter run -d <id>            # pick specific device

# Build
flutter build apk --release                 # Android APK
flutter build apk --release --split-per-abi # smaller per-arch APKs
flutter build appbundle --release           # Google Play AAB
flutter build ipa --release                 # iOS IPA

# Install on device
adb install -r build/app/outputs/flutter-apk/app-release.apk
```

---

## Troubleshooting

**`flutter: command not found`**
Add to PATH: `export PATH="$PATH:$HOME/development/flutter/bin"`.

**`pod install` fails on iOS**
```bash
cd ios
pod repo update
pod install --repo-update
```

**Xcode says "no profiles for 'com.eduplexo.app' were found"**
Open `ios/Runner.xcworkspace`, select Runner target → Signing & Capabilities,
pick your team, optionally change the bundle ID if taken.

**Android build fails with Java version error**
The build needs Java 17:
```bash
brew install --cask zulu@17
flutter config --jdk-dir "/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home"
```

**WebView shows a white screen on cold launch**
Already handled by the native splash + `LoadingOverlay`. If it persists,
verify `siteUrl` is HTTPS and reachable.

**Camera or file picker doesn't open on iOS**
Apple requires the privacy strings in `Info.plist` (already provided). If the
user tapped "Don't Allow", send them to **Settings → EduPlexo → Camera** to
re-enable.

**Session lost between app launches**
Cookies and DOM storage persist by default on both platforms. If your site
sets cookies with `SameSite=None`, make sure they're also `Secure` — both
WKWebView (iOS) and Android WebView drop them otherwise.

**iOS build fails with "Unsupported architecture x86_64" on Apple Silicon**
Add this to your `ios/Podfile` post_install block (already done):
```ruby
config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = 'arm64'
```
…wait, actually Apple Silicon needs the **opposite**. If you hit this, comment
that line out — modern Flutter handles it automatically.
