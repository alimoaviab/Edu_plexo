// Single source of truth for app-wide configuration.
// Replace `siteUrl` with your real domain before building release.

import 'package:flutter/material.dart';

class AppConfig {
  AppConfig._();

  static const String appName = 'EduPlexo';

  // Your live SaaS site. All four portals (admin/teacher/student/parent)
  // are served from here, so no per-portal config is needed.
  static const String siteUrl = 'eduplexo.com';

  // Brand colors — tweak to match your web theme.
  static const Color brandPrimary = Color(0xFF0F172A); // slate-900
  static const Color brandAccent = Color(0xFF2563EB);  // blue-600

  // User-Agent suffix so your backend can detect mobile-app traffic if needed.
  // Your backend logic stays untouched; this is read-only on the server side.
  static const String userAgentTag = 'EduPlexoApp/1.0';

  // Hosts allowed to load inside the WebView. Anything else opens in the
  // device browser (e.g. payment gateways, social logins, mailto links).
  // Add subdomains here if you split portals across hosts later.
  static const List<String> allowedHosts = [
    'YOURDOMAIN.com',
    'www.YOURDOMAIN.com',
  ];
}
