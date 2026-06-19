import 'package:flutter/material.dart';

/// 4-pt spacing scale and shared radii / shadows.
class AppSpacing {
  AppSpacing._();

  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
  static const double xxl = 32;
  static const double xxxl = 48;

  // Page horizontal padding.
  static const EdgeInsets page = EdgeInsets.symmetric(horizontal: lg);
}

class AppRadius {
  AppRadius._();

  static const double sm = 10;
  static const double md = 14;
  static const double lg = 20;
  static const double xl = 28;
  static const double pill = 999;

  static const BorderRadius card = BorderRadius.all(Radius.circular(20));
  static const BorderRadius chip = BorderRadius.all(Radius.circular(999));
}

class AppShadows {
  AppShadows._();

  static const List<BoxShadow> card = [
    BoxShadow(
      color: Color(0x0F0F172A),
      blurRadius: 24,
      offset: Offset(0, 8),
    ),
  ];

  static const List<BoxShadow> soft = [
    BoxShadow(
      color: Color(0x0A0F172A),
      blurRadius: 12,
      offset: Offset(0, 4),
    ),
  ];
}
