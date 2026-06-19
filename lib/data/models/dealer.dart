import 'tier.dart';

/// A dealer account and their loyalty standing.
///
/// [quarterlyPoints] drives the tier; [pointsBalance] is the redeemable wallet
/// (lifetime earned minus redeemed/expired). The two differ because tiers reset
/// quarterly while the redeemable balance carries forward until expiry.
class Dealer {
  const Dealer({
    required this.id,
    required this.businessName,
    required this.ownerName,
    required this.phone,
    required this.gst,
    required this.pan,
    required this.address,
    required this.region,
    required this.pointsBalance,
    required this.quarterlyPoints,
    required this.lifetimePoints,
    required this.memberSince,
    required this.assignedSalesManagerId,
    this.avatarSeed,
  });

  final String id;
  final String businessName;
  final String ownerName;
  final String phone;
  final String gst;
  final String pan;
  final String address;
  final String region;

  /// Redeemable points wallet.
  final int pointsBalance;

  /// Points accumulated in the current quarter (drives tier).
  final int quarterlyPoints;
  final int lifetimePoints;
  final DateTime memberSince;
  final String assignedSalesManagerId;
  final String? avatarSeed;

  DealerTier get tier => DealerTierX.forPoints(quarterlyPoints);

  /// Points still needed to reach the next tier (0 if already Diamond).
  int get pointsToNextTier {
    final next = tier.next;
    if (next == null) return 0;
    return (next.threshold - quarterlyPoints).clamp(0, next.threshold);
  }

  /// Progress [0,1] from the current tier's floor to the next tier's floor.
  double get tierProgress {
    final next = tier.next;
    if (next == null) return 1;
    final span = next.threshold - tier.threshold;
    if (span <= 0) return 1;
    return ((quarterlyPoints - tier.threshold) / span).clamp(0.0, 1.0);
  }

  Dealer copyWith({
    int? pointsBalance,
    int? quarterlyPoints,
    int? lifetimePoints,
    String? businessName,
    String? gst,
    String? pan,
    String? address,
  }) {
    return Dealer(
      id: id,
      businessName: businessName ?? this.businessName,
      ownerName: ownerName,
      phone: phone,
      gst: gst ?? this.gst,
      pan: pan ?? this.pan,
      address: address ?? this.address,
      region: region,
      pointsBalance: pointsBalance ?? this.pointsBalance,
      quarterlyPoints: quarterlyPoints ?? this.quarterlyPoints,
      lifetimePoints: lifetimePoints ?? this.lifetimePoints,
      memberSince: memberSince,
      assignedSalesManagerId: assignedSalesManagerId,
      avatarSeed: avatarSeed,
    );
  }

  factory Dealer.fromMap(String id, Map<String, dynamic> m) => Dealer(
        id: id,
        businessName: m['businessName'] as String? ?? '',
        ownerName: m['ownerName'] as String? ?? '',
        phone: m['phone'] as String? ?? '',
        gst: m['gst'] as String? ?? '',
        pan: m['pan'] as String? ?? '',
        address: m['address'] as String? ?? '',
        region: m['region'] as String? ?? '',
        pointsBalance: (m['pointsBalance'] as num?)?.toInt() ?? 0,
        quarterlyPoints: (m['quarterlyPoints'] as num?)?.toInt() ?? 0,
        lifetimePoints: (m['lifetimePoints'] as num?)?.toInt() ?? 0,
        memberSince:
            DateTime.tryParse(m['memberSince'] as String? ?? '') ?? DateTime.now(),
        assignedSalesManagerId: m['assignedSalesManagerId'] as String? ?? '',
        avatarSeed: m['avatarSeed'] as String?,
      );

  Map<String, dynamic> toMap() => {
        'businessName': businessName,
        'ownerName': ownerName,
        'phone': phone,
        'gst': gst,
        'pan': pan,
        'address': address,
        'region': region,
        'pointsBalance': pointsBalance,
        'quarterlyPoints': quarterlyPoints,
        'lifetimePoints': lifetimePoints,
        'memberSince': memberSince.toIso8601String(),
        'assignedSalesManagerId': assignedSalesManagerId,
        'avatarSeed': avatarSeed,
      };
}
