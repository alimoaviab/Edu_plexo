# EduPlexo App Assets

Replace these placeholders with your real branding before publishing.

## Required files

| File | Size | Notes |
|------|------|-------|
| `app_icon.png` | 1024×1024 | Full-bleed launcher icon (used by `flutter_launcher_icons`). |
| `app_icon_foreground.png` | 1024×1024 | Logo on a transparent background. Center it in the inner 66% safe zone for adaptive icons. |
| `splash_logo.png` | 512×512 | Logo shown on the native splash screen. Transparent background, centered. |

After replacing the images, regenerate the native assets:

```bash
dart run flutter_launcher_icons
dart run flutter_native_splash:create
```

Until you add your own files, the app falls back to the vector "E" mark in
`android/app/src/main/res/drawable/ic_launcher_foreground.xml` so the build
still succeeds.
