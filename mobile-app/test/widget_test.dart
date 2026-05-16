// Smoke test — verifies the app boots without crashing.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:eduplexo/main.dart';

void main() {
  testWidgets('App boots and renders Scaffold', (WidgetTester tester) async {
    await tester.pumpWidget(const EduPlexoApp());
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.byType(Scaffold), findsOneWidget);
  });
}
