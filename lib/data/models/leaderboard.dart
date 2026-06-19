import 'package:flutter/material.dart';

/// Recognition bands shown on the leaderboard. By design the app NEVER exposes
/// other dealers' raw sales/points — only the band a dealer belongs to. This
/// preserves competitive privacy while still delivering social proof + status.
enum RecognitionBand { top10, top25, fastestGrowing, regionalChampion }

extension RecognitionBandX on RecognitionBand {
  String get label => switch (this) {
        RecognitionBand.top10 => 'Top 10%',
        RecognitionBand.top25 => 'Top 25%',
        RecognitionBand.fastestGrowing => 'Fastest Growing',
        RecognitionBand.regionalChampion => 'Regional Champion',
      };

  String get blurb => switch (this) {
        RecognitionBand.top10 => 'Elite performers nationwide',
        RecognitionBand.top25 => 'Consistently strong dealers',
        RecognitionBand.fastestGrowing => 'Biggest quarter-on-quarter jump',
        RecognitionBand.regionalChampion => 'Number one in their region',
      };

  IconData get icon => switch (this) {
        RecognitionBand.top10 => Icons.emoji_events,
        RecognitionBand.top25 => Icons.military_tech,
        RecognitionBand.fastestGrowing => Icons.trending_up,
        RecognitionBand.regionalChampion => Icons.flag,
      };

  Color get accent => switch (this) {
        RecognitionBand.top10 => const Color(0xFFD4A017),
        RecognitionBand.top25 => const Color(0xFF8E97A6),
        RecognitionBand.fastestGrowing => const Color(0xFF059669),
        RecognitionBand.regionalChampion => const Color(0xFF4338CA),
      };
}

/// An anonymised peer entry — handle + region only, no numbers.
class RecognitionPeer {
  const RecognitionPeer({
    required this.handle,
    required this.region,
    required this.band,
  });
  final String handle;
  final String region;
  final RecognitionBand band;
}

/// An achievement/badge the dealer has earned (status signaling).
class Achievement {
  const Achievement({
    required this.id,
    required this.title,
    required this.icon,
    required this.accent,
    required this.unlocked,
  });

  final String id;
  final String title;
  final IconData icon;
  final Color accent;
  final bool unlocked;
}
