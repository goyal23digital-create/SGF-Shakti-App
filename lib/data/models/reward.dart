import 'package:flutter/material.dart';

import 'tier.dart';

enum RewardCategory { electronics, lifestyle, travel, business }

extension RewardCategoryX on RewardCategory {
  String get label => switch (this) {
        RewardCategory.electronics => 'Electronics',
        RewardCategory.lifestyle => 'Lifestyle',
        RewardCategory.travel => 'Travel',
        RewardCategory.business => 'Business Credits',
      };
}

class Reward {
  const Reward({
    required this.id,
    required this.name,
    required this.category,
    required this.pointsRequired,
    required this.icon,
    required this.accent,
    this.minTier = DealerTier.bronze,
    this.tagline = '',
    this.inStock = true,
  });

  final String id;
  final String name;
  final RewardCategory category;
  final int pointsRequired;
  final IconData icon;
  final Color accent;

  /// Some aspirational rewards are gated behind a tier (status signaling).
  final DealerTier minTier;
  final String tagline;
  final bool inStock;
}

enum RedemptionStatus { requested, approved, fulfilled, cancelled }

extension RedemptionStatusX on RedemptionStatus {
  String get label => switch (this) {
        RedemptionStatus.requested => 'Requested',
        RedemptionStatus.approved => 'Approved',
        RedemptionStatus.fulfilled => 'Fulfilled',
        RedemptionStatus.cancelled => 'Cancelled',
      };
}

class Redemption {
  const Redemption({
    required this.id,
    required this.reward,
    required this.pointsSpent,
    required this.requestedAt,
    required this.status,
  });

  final String id;
  final Reward reward;
  final int pointsSpent;
  final DateTime requestedAt;
  final RedemptionStatus status;
}
