import 'package:flutter/material.dart';

import '../data/models/tier.dart';

/// A metallic, gradient tier badge. Used on the dashboard, profile, and cards.
class TierBadge extends StatelessWidget {
  const TierBadge({
    super.key,
    required this.tier,
    this.compact = false,
    this.onLight = false,
  });

  final DealerTier tier;
  final bool compact;

  /// When the badge sits on a dark hero, render with translucent white chrome.
  final bool onLight;

  @override
  Widget build(BuildContext context) {
    final fg = onLight ? Colors.white : Colors.white;
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: compact ? 10 : 14,
        vertical: compact ? 6 : 8,
      ),
      decoration: BoxDecoration(
        gradient: tier.gradient,
        borderRadius: BorderRadius.circular(999),
        boxShadow: [
          BoxShadow(
            color: tier.color.withOpacity(0.45),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(tier.icon, size: compact ? 14 : 18, color: fg),
          SizedBox(width: compact ? 5 : 7),
          Text(
            compact ? tier.label : '${tier.label} Dealer',
            style: TextStyle(
              color: fg,
              fontSize: compact ? 12 : 14,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
