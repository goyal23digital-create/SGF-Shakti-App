import 'package:flutter/material.dart';

enum AnnouncementKind { campaign, product, event, nudge }

class Announcement {
  const Announcement({
    required this.id,
    required this.title,
    required this.body,
    required this.kind,
    required this.icon,
    required this.accent,
    required this.publishedAt,
  });

  final String id;
  final String title;
  final String body;
  final AnnouncementKind kind;
  final IconData icon;
  final Color accent;
  final DateTime publishedAt;
}
