// BrowserScreen
// Hosts the InAppWebView and wires up:
//  - JavaScript + DOM/local storage + cookies (session persistence)
//  - File chooser, camera, mic permissions
//  - Downloads via system download manager
//  - Pull-to-refresh
//  - Loading indicator
//  - Hardware back button -> WebView back navigation
//  - Offline / error fallback screen

import 'dart:async';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:url_launcher/url_launcher.dart';

import '../config/app_config.dart';
import '../widgets/error_view.dart';
import '../widgets/loading_overlay.dart';

class BrowserScreen extends StatefulWidget {
  const BrowserScreen({super.key});

  @override
  State<BrowserScreen> createState() => _BrowserScreenState();
}

class _BrowserScreenState extends State<BrowserScreen> {
  InAppWebViewController? _webViewController;
  PullToRefreshController? _pullToRefreshController;

  double _progress = 0;
  bool _isFirstLoad = true;
  bool _hasError = false;
  bool _isOffline = false;

  StreamSubscription<List<ConnectivityResult>>? _connectivitySub;

  // WebView settings — production-ready defaults.
  final InAppWebViewSettings _settings = InAppWebViewSettings(
    // Performance / rendering
    useShouldOverrideUrlLoading: true,
    mediaPlaybackRequiresUserGesture: false,
    transparentBackground: true,

    // Storage / sessions
    javaScriptEnabled: true,
    javaScriptCanOpenWindowsAutomatically: true,
    domStorageEnabled: true,
    databaseEnabled: true,
    cacheEnabled: true,
    thirdPartyCookiesEnabled: true,

    // Mobile UX
    supportZoom: false,
    builtInZoomControls: false,
    displayZoomControls: false,
    useWideViewPort: true,
    loadWithOverviewMode: true,

    // Mixed content (only if your site has any http subresources; otherwise leave NEVER)
    mixedContentMode: MixedContentMode.MIXED_CONTENT_COMPATIBILITY_MODE,

    // Hardware acceleration prevents white-screen flashes on Android.
    hardwareAcceleration: true,

    // Allow camera/mic access without per-page prompts (we still ask OS permission).
    allowsInlineMediaPlayback: true,

    // Custom UA so backend can identify mobile app traffic (optional, read-only).
    userAgent: '',

    // File access
    allowFileAccess: true,
    allowFileAccessFromFileURLs: true,
    allowUniversalAccessFromFileURLs: true,
    allowContentAccess: true,

    // iOS-specific: enable native swipe-back gesture and inline media.
    allowsBackForwardNavigationGestures: true,
    allowsAirPlayForMediaPlayback: true,
    allowsPictureInPictureMediaPlayback: true,
    suppressesIncrementalRendering: false,

    // Disable text selection long-press menu for cleaner UX (optional).
    disableLongPressContextMenuOnLinks: false,
  );

  @override
  void initState() {
    super.initState();

    _pullToRefreshController = PullToRefreshController(
      settings: PullToRefreshSettings(color: AppConfig.brandAccent),
      onRefresh: _onRefresh,
    );

    _watchConnectivity();
    _checkInitialConnectivity();
  }

  @override
  void dispose() {
    _connectivitySub?.cancel();
    super.dispose();
  }

  // ---------------------------------------------------------------------------
  // Connectivity
  // ---------------------------------------------------------------------------

  void _watchConnectivity() {
    _connectivitySub = Connectivity().onConnectivityChanged.listen((results) {
      final online = results.any((r) => r != ConnectivityResult.none);
      if (!online && mounted) {
        setState(() => _isOffline = true);
      } else if (online && _isOffline && mounted) {
        setState(() => _isOffline = false);
        _webViewController?.reload();
      }
    });
  }

  Future<void> _checkInitialConnectivity() async {
    final results = await Connectivity().checkConnectivity();
    final online = results.any((r) => r != ConnectivityResult.none);
    if (!online && mounted) {
      setState(() => _isOffline = true);
    }
  }

  // ---------------------------------------------------------------------------
  // Refresh & navigation
  // ---------------------------------------------------------------------------

  Future<void> _onRefresh() async {
    if (Platform.isAndroid) {
      await _webViewController?.reload();
    } else {
      final url = await _webViewController?.getUrl();
      if (url != null) {
        await _webViewController?.loadUrl(urlRequest: URLRequest(url: url));
      }
    }
    _pullToRefreshController?.endRefreshing();
  }

  Future<bool> _handleBackPress() async {
    final controller = _webViewController;
    if (controller == null) return true;

    if (await controller.canGoBack()) {
      await controller.goBack();
      return false; // don't pop the route
    }

    // At root — confirm exit.
    final shouldExit = await _confirmExit();
    return shouldExit;
  }

  Future<bool> _confirmExit() async {
    final result = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Exit EduPlexo?'),
        content: const Text('Are you sure you want to close the app?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Exit'),
          ),
        ],
      ),
    );
    return result ?? false;
  }

  // ---------------------------------------------------------------------------
  // Permissions (camera / mic / storage)
  // ---------------------------------------------------------------------------

  Future<void> _ensurePermissions() async {
    await [
      Permission.camera,
      Permission.microphone,
      Permission.photos,
      Permission.notification,
    ].request();
  }

  // ---------------------------------------------------------------------------
  // Build
  // ---------------------------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        final shouldPop = await _handleBackPress();
        if (shouldPop && mounted) {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SafeArea(
          top: true,
          bottom: false,
          child: _isOffline
              ? ErrorView(
                  title: 'No internet connection',
                  message: 'Please check your network and try again.',
                  onRetry: _checkInitialConnectivity,
                )
              : _hasError
                  ? ErrorView(
                      title: 'Something went wrong',
                      message: 'We couldn\u0027t load EduPlexo. Tap retry to try again.',
                      onRetry: () {
                        setState(() => _hasError = false);
                        _webViewController?.reload();
                      },
                    )
                  : Stack(
                      children: [
                        InAppWebView(
                          initialUrlRequest: URLRequest(
                            url: WebUri(AppConfig.siteUrl),
                          ),
                          initialSettings: _settings,
                          pullToRefreshController: _pullToRefreshController,
                          onWebViewCreated: (controller) {
                            _webViewController = controller;
                          },
                          onLoadStart: (_, __) {
                            if (mounted) setState(() => _hasError = false);
                          },
                          onLoadStop: (_, __) async {
                            _pullToRefreshController?.endRefreshing();
                            if (mounted) {
                              setState(() {
                                _progress = 1;
                                _isFirstLoad = false;
                              });
                            }
                          },
                          onProgressChanged: (_, progress) {
                            if (progress == 100) {
                              _pullToRefreshController?.endRefreshing();
                            }
                            if (mounted) {
                              setState(() => _progress = progress / 100);
                            }
                          },
                          onPermissionRequest: (controller, request) async {
                            // Grant camera/mic/etc. when the website asks.
                            await _ensurePermissions();
                            return PermissionResponse(
                              resources: request.resources,
                              action: PermissionResponseAction.GRANT,
                            );
                          },
                          onReceivedError: (_, __, error) {
                            if (kDebugMode) {
                              debugPrint('WebView error: ${error.description}');
                            }
                            if (mounted) {
                              setState(() => _hasError = true);
                            }
                          },
                          onReceivedHttpError: (_, __, response) {
                            if (kDebugMode) {
                              debugPrint('HTTP ${response.statusCode}');
                            }
                          },
                          onDownloadStartRequest: (_, request) async {
                            // Hand off downloads to the system browser/download manager.
                            final uri = Uri.parse(request.url.toString());
                            if (await canLaunchUrl(uri)) {
                              await launchUrl(uri,
                                  mode: LaunchMode.externalApplication);
                            }
                          },
                          shouldOverrideUrlLoading: (controller, action) async {
                            final uri = action.request.url;
                            if (uri == null) {
                              return NavigationActionPolicy.ALLOW;
                            }

                            final scheme = uri.scheme;

                            // Open special schemes externally.
                            if (scheme == 'mailto' ||
                                scheme == 'tel' ||
                                scheme == 'sms' ||
                                scheme == 'whatsapp' ||
                                scheme == 'intent') {
                              if (await canLaunchUrl(uri)) {
                                await launchUrl(uri,
                                    mode: LaunchMode.externalApplication);
                              }
                              return NavigationActionPolicy.CANCEL;
                            }

                            // Stay inside the app for our own domain; open everything
                            // else in the device browser.
                            final host = uri.host.toLowerCase();
                            final isAllowed = AppConfig.allowedHosts
                                .any((h) => host == h || host.endsWith('.$h'));

                            if (!isAllowed && (scheme == 'http' || scheme == 'https')) {
                              await launchUrl(uri,
                                  mode: LaunchMode.externalApplication);
                              return NavigationActionPolicy.CANCEL;
                            }

                            return NavigationActionPolicy.ALLOW;
                          },
                        ),

                        // Top progress bar shown while pages load.
                        if (_progress < 1)
                          Positioned(
                            top: 0,
                            left: 0,
                            right: 0,
                            child: LinearProgressIndicator(
                              value: _progress,
                              minHeight: 2.5,
                              backgroundColor: Colors.transparent,
                              valueColor: const AlwaysStoppedAnimation<Color>(
                                AppConfig.brandAccent,
                              ),
                            ),
                          ),

                        // Centered loader on the very first page load only,
                        // so users don't see a white screen while bootstrapping.
                        if (_isFirstLoad && _progress < 1)
                          const LoadingOverlay(),
                      ],
                    ),
        ),
      ),
    );
  }
}
