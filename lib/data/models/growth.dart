import 'package:flutter/material.dart';

import 'tier.dart';

/// A downloadable/shareable branded marketing asset.
enum CreativeFormat { whatsapp, instagram, poster, festival }

extension CreativeFormatX on CreativeFormat {
  String get label => switch (this) {
        CreativeFormat.whatsapp => 'WhatsApp',
        CreativeFormat.instagram => 'Instagram',
        CreativeFormat.poster => 'Poster',
        CreativeFormat.festival => 'Festival',
      };
  IconData get icon => switch (this) {
        CreativeFormat.whatsapp => Icons.chat_bubble_outline,
        CreativeFormat.instagram => Icons.camera_alt_outlined,
        CreativeFormat.poster => Icons.image_outlined,
        CreativeFormat.festival => Icons.celebration_outlined,
      };
}

class MarketingCreative {
  const MarketingCreative({
    required this.id,
    required this.title,
    required this.format,
    required this.accent,
  });

  final String id;
  final String title;
  final CreativeFormat format;
  final Color accent;
}

/// A digital-presence / growth service the dealer can request in-app.
class GrowthService {
  const GrowthService({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.minTier,
  });

  final String id;
  final String title;
  final String description;
  final IconData icon;
  final DealerTier minTier;
}

enum GrowthRequestStatus { requested, inReview, scheduled, completed }

extension GrowthRequestStatusX on GrowthRequestStatus {
  String get label => switch (this) {
        GrowthRequestStatus.requested => 'Requested',
        GrowthRequestStatus.inReview => 'In Review',
        GrowthRequestStatus.scheduled => 'Scheduled',
        GrowthRequestStatus.completed => 'Completed',
      };
}

class GrowthServiceRequest {
  const GrowthServiceRequest({
    required this.id,
    required this.service,
    required this.status,
    required this.requestedAt,
  });

  final String id;
  final GrowthService service;
  final GrowthRequestStatus status;
  final DateTime requestedAt;
}

/// A learning-center module: a short training video plus a quiz that awards
/// points on completion (drives engagement + product knowledge).
class LearningModule {
  const LearningModule({
    required this.id,
    required this.title,
    required this.durationMinutes,
    required this.pointsAwarded,
    required this.accent,
    required this.icon,
    this.completed = false,
  });

  final String id;
  final String title;
  final int durationMinutes;
  final int pointsAwarded;
  final Color accent;
  final IconData icon;
  final bool completed;

  LearningModule copyWith({bool? completed}) => LearningModule(
        id: id,
        title: title,
        durationMinutes: durationMinutes,
        pointsAwarded: pointsAwarded,
        accent: accent,
        icon: icon,
        completed: completed ?? this.completed,
      );
}
