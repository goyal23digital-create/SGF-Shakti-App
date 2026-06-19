import 'package:flutter_test/flutter_test.dart';
import 'package:sgf_shakti/core/points_engine.dart';
import 'package:sgf_shakti/data/models/cart_item.dart';
import 'package:sgf_shakti/data/models/product.dart';
import 'package:sgf_shakti/data/models/tier.dart';

Product _product({
  required int pointsPerUnit,
  required int packSize,
  double price = 100,
}) =>
    Product(
      id: 'x',
      sku: 'SKU',
      name: 'Test',
      category: ProductCategory.chair,
      dealerPrice: price,
      packSize: packSize,
      pointsPerUnit: pointsPerUnit,
      stockStatus: StockStatus.inStock,
      colorTags: const [],
    );

void main() {
  group('Margin-aware points engine', () {
    test('base points = pointsPerUnit × units (packs × packSize)', () {
      final items = [
        CartItem(product: _product(pointsPerUnit: 22, packSize: 4), quantity: 10),
      ];
      // 22 × (10 packs × 4 units) = 880
      expect(PointsEngine.basePoints(items), 880);
    });

    test('a low-margin SKU cannot out-earn a high-margin SKU at equal spend', () {
      // Both lines cost the same (₹2000) but the high-margin SKU earns more,
      // proving points track margin, not sale value.
      final highMargin = [
        CartItem(product: _product(pointsPerUnit: 40, packSize: 1, price: 1000), quantity: 2),
      ];
      final lowMargin = [
        CartItem(product: _product(pointsPerUnit: 5, packSize: 1, price: 1000), quantity: 2),
      ];
      expect(PointsEngine.basePoints(highMargin),
          greaterThan(PointsEngine.basePoints(lowMargin)));
    });

    test('campaign multiplier scales the preview and the bonus is the delta', () {
      final items = [
        CartItem(product: _product(pointsPerUnit: 10, packSize: 1), quantity: 100),
      ];
      final base = PointsEngine.basePoints(items); // 1000
      final preview = PointsEngine.previewPoints(items);
      expect(preview, (base * PointsEngine.activeMultiplier).round());
      expect(PointsEngine.campaignBonus(items), preview - base);
    });
  });

  group('Tier resolution', () {
    test('resolves the correct tier for a points total', () {
      expect(DealerTierX.forPoints(0), DealerTier.bronze);
      expect(DealerTierX.forPoints(13100), DealerTier.gold);
      expect(DealerTierX.forPoints(999999), DealerTier.diamond);
    });

    test('next tier and points-to-next are consistent', () {
      expect(DealerTier.gold.next, DealerTier.platinum);
      expect(DealerTier.diamond.next, isNull);
    });
  });
}
