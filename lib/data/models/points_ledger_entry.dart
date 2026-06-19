/// Append-only ledger entry types. The ledger is the single source of truth
/// for a dealer's redeemable balance and is fully auditable.
enum LedgerEntryType { earn, redeem, reverse, bonus, expiry }

extension LedgerEntryTypeX on LedgerEntryType {
  String get label => switch (this) {
        LedgerEntryType.earn => 'Earned',
        LedgerEntryType.redeem => 'Redeemed',
        LedgerEntryType.reverse => 'Reversed',
        LedgerEntryType.bonus => 'Bonus',
        LedgerEntryType.expiry => 'Expired',
      };

  /// Whether this entry adds (true) or removes (false) points.
  bool get isCredit =>
      this == LedgerEntryType.earn || this == LedgerEntryType.bonus;
}

class PointsLedgerEntry {
  const PointsLedgerEntry({
    required this.id,
    required this.type,
    required this.points,
    required this.balanceAfter,
    required this.description,
    required this.createdAt,
    this.sourceOrderId,
    this.sourceRewardId,
    this.expiresAt,
  });

  final String id;
  final LedgerEntryType type;

  /// Signed delta (positive for credits, negative for debits).
  final int points;
  final int balanceAfter;
  final String description;
  final DateTime createdAt;
  final String? sourceOrderId;
  final String? sourceRewardId;
  final DateTime? expiresAt;
}
