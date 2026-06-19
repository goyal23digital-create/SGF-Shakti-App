import 'package:flutter/foundation.dart';

import '../data/models/dealer.dart';
import '../data/repositories/repositories.dart';

/// Holds the authenticated dealer and their live points/tier standing.
///
/// Mutations here (crediting points, spending on redemptions) are optimistic
/// UI updates that mirror what Cloud Functions do server-side.
class SessionController extends ChangeNotifier {
  SessionController(this._dealerRepo);

  final DealerRepository _dealerRepo;

  Dealer? _dealer;
  bool _loading = false;

  Dealer? get dealer => _dealer;
  bool get loading => _loading;
  bool get isAuthenticated => _dealer != null;

  Future<void> load() async {
    _loading = true;
    notifyListeners();
    _dealer = await _dealerRepo.currentDealer();
    _loading = false;
    notifyListeners();
  }

  void signOut() {
    _dealer = null;
    notifyListeners();
  }

  /// Spend redeemable points (e.g. reward redemption).
  void spendPoints(int points) {
    final d = _dealer;
    if (d == null) return;
    _dealer = d.copyWith(pointsBalance: (d.pointsBalance - points).clamp(0, 1 << 31));
    notifyListeners();
  }

  /// Award points — both to the redeemable wallet and the quarterly tier total
  /// (e.g. completing a learning module, or an order being confirmed).
  void awardPoints(int points, {bool countTowardTier = true}) {
    final d = _dealer;
    if (d == null) return;
    _dealer = d.copyWith(
      pointsBalance: d.pointsBalance + points,
      quarterlyPoints: countTowardTier ? d.quarterlyPoints + points : d.quarterlyPoints,
      lifetimePoints: d.lifetimePoints + points,
    );
    notifyListeners();
  }
}
