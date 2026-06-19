import 'package:flutter/material.dart';

/// Brand + semantic color palette for SGF Shakti.
///
/// The palette is intentionally restrained and aspirational — a deep indigo
/// "ink" as the primary surface accent, a warm gold for points/rewards, and
/// per-tier metallic gradients used on badges and progress rings.
class AppColors {
  AppColors._();

  // Core brand
  static const Color primary = Color(0xFF4338CA); // indigo 700
  static const Color primaryDark = Color(0xFF312E81); // indigo 900
  static const Color primarySoft = Color(0xFFEEF2FF); // indigo 50

  // Accent — points / rewards / value
  static const Color gold = Color(0xFFD4A017);
  static const Color goldSoft = Color(0xFFFBF3DC);

  // Neutrals
  static const Color ink = Color(0xFF0F172A); // slate 900
  static const Color textPrimary = Color(0xFF111827);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textMuted = Color(0xFF9CA3AF);
  static const Color border = Color(0xFFE5E7EB);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color background = Color(0xFFF6F7FB);
  static const Color scrim = Color(0x0F0F172A);

  // Semantic
  static const Color success = Color(0xFF059669);
  static const Color successSoft = Color(0xFFD1FAE5);
  static const Color warning = Color(0xFFD97706);
  static const Color warningSoft = Color(0xFFFEF3C7);
  static const Color danger = Color(0xFFDC2626);
  static const Color dangerSoft = Color(0xFFFEE2E2);
  static const Color info = Color(0xFF2563EB);

  // Tier accents (single representative color; full gradients in [tierGradient]).
  static const Color bronze = Color(0xFFB07A48);
  static const Color silver = Color(0xFF8E97A6);
  static const Color goldTier = Color(0xFFD4A017);
  static const Color platinum = Color(0xFF5B6B8C);
  static const Color diamond = Color(0xFF3BC4D6);

  /// Hero gradient used on the dashboard header.
  static const LinearGradient heroGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF4338CA), Color(0xFF6D28D9), Color(0xFF312E81)],
  );

  static const LinearGradient goldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFF3D27A), Color(0xFFD4A017), Color(0xFFA9780F)],
  );
}
