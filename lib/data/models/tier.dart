import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';

/// The five loyalty tiers, in ascending order.
///
/// Tier is derived from a dealer's *quarterly* points total measured against
/// admin-configured thresholds (see [DealerTierX.threshold]). Higher tiers
/// unlock progressively more aspirational benefits.
enum DealerTier { bronze, silver, gold, platinum, diamond }

extension DealerTierX on DealerTier {
  String get label => switch (this) {
        DealerTier.bronze => 'Bronze',
        DealerTier.silver => 'Silver',
        DealerTier.gold => 'Gold',
        DealerTier.platinum => 'Platinum',
        DealerTier.diamond => 'Diamond',
      };

  /// Default quarterly threshold (admin-configurable in production via the
  /// gamification_config collection). The starting tier requires 0 points.
  int get threshold => switch (this) {
        DealerTier.bronze => 0,
        DealerTier.silver => 5000,
        DealerTier.gold => 15000,
        DealerTier.platinum => 35000,
        DealerTier.diamond => 75000,
      };

  IconData get icon => switch (this) {
        DealerTier.bronze => Icons.shield_outlined,
        DealerTier.silver => Icons.workspace_premium_outlined,
        DealerTier.gold => Icons.workspace_premium,
        DealerTier.platinum => Icons.diamond_outlined,
        DealerTier.diamond => Icons.diamond,
      };

  LinearGradient get gradient => switch (this) {
        DealerTier.bronze => const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFCD9B6A), Color(0xFF8C5A2E)],
          ),
        DealerTier.silver => const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFC7CDD8), Color(0xFF7C8696)],
          ),
        DealerTier.gold => AppColors.goldGradient,
        DealerTier.platinum => const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF8A99BE), Color(0xFF42506E)],
          ),
        DealerTier.diamond => const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF7DE2EF), Color(0xFF2BA8BC), Color(0xFF1E6E8C)],
          ),
      };

  Color get color => switch (this) {
        DealerTier.bronze => AppColors.bronze,
        DealerTier.silver => AppColors.silver,
        DealerTier.gold => AppColors.goldTier,
        DealerTier.platinum => AppColors.platinum,
        DealerTier.diamond => AppColors.diamond,
      };

  /// Benefits unlocked at this tier (cumulative — each tier also keeps the
  /// benefits of lower tiers).
  List<String> get benefits => switch (this) {
        DealerTier.bronze => const [
            'Earn margin-based points on every order',
            'Access the rewards marketplace',
            'Branded WhatsApp & festival creatives',
          ],
        DealerTier.silver => const [
            'Google Business profile setup',
            'Social media account setup',
            'Priority support response',
          ],
        DealerTier.gold => const [
            'Local advertising assistance',
            'Early access to new products',
            'Higher points multiplier on campaigns',
          ],
        DealerTier.platinum => const [
            'Influencer marketing campaigns',
            'Priority inventory allocation',
            'Luxury rewards unlocked',
            'Invitations to exclusive events',
          ],
        DealerTier.diamond => const [
            'Co-branded marketing partnership',
            'Dedicated growth manager',
            'VIP annual recognition & awards night',
            'First-in-line for limited inventory',
          ],
      };

  DealerTier? get next {
    final i = index;
    return i < DealerTier.values.length - 1 ? DealerTier.values[i + 1] : null;
  }

  static DealerTier fromName(String name) => DealerTier.values.firstWhere(
        (t) => t.name == name,
        orElse: () => DealerTier.bronze,
      );

  /// Resolves the tier a [quarterlyPoints] total currently sits in.
  static DealerTier forPoints(int quarterlyPoints) {
    var resolved = DealerTier.bronze;
    for (final tier in DealerTier.values) {
      if (quarterlyPoints >= tier.threshold) resolved = tier;
    }
    return resolved;
  }
}
