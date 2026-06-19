import '../data/mock/mock_data.dart';
import '../data/models/cart_item.dart';

/// Config-driven, margin-aware points engine (client-side preview).
///
/// In production the authoritative calculation runs in a Cloud Function when an
/// order is CONFIRMED, then writes an immutable points_ledger entry. This class
/// mirrors that logic so the app can show an accurate "points to be earned"
/// preview at checkout. See docs/POINTS_ENGINE.md.
class PointsEngine {
  PointsEngine._();

  /// Base points = Σ (pointsPerUnit[sku] × units). `pointsPerUnit` is derived
  /// by the admin from per-unit *margin*, never from sale price.
  static int basePoints(List<CartItem> items) =>
      items.fold(0, (sum, item) => sum + item.basePoints);

  /// The campaign multiplier currently in effect (1.0 if no active campaign).
  static double get activeMultiplier => MockData.campaignMultiplier;

  /// Final preview = round(basePoints × activeMultiplier).
  static int previewPoints(List<CartItem> items) =>
      (basePoints(items) * activeMultiplier).round();

  /// The bonus attributable solely to the active campaign multiplier.
  static int campaignBonus(List<CartItem> items) =>
      previewPoints(items) - basePoints(items);
}
