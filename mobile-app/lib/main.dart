// EduPlexo Mobile Wrapper
// Entry point. Sets up theming, system UI and routes to BrowserScreen.

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'config/app_config.dart';
import 'screens/browser_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Edge-to-edge UI for a modern Android 13+ feel.
  SystemChrome.setEnabledSystemUIMode(
    SystemUiMode.edgeToEdge,
    overlays: SystemUiOverlay.values,
  );

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppConfig.brandPrimary,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // Lock to portrait by default (most school apps are portrait-first).
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(const EduPlexoApp());
}

class EduPlexoApp extends StatelessWidget {
  const EduPlexoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConfig.appName,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppConfig.brandPrimary,
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: Colors.white,
        progressIndicatorTheme: const ProgressIndicatorThemeData(
          color: AppConfig.brandPrimary,
        ),
      ),
      home: const BrowserScreen(),
    );
  }
}
