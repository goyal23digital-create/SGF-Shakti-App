import 'package:flutter/foundation.dart';

import '../core/points_engine.dart';
import '../data/models/cart_item.dart';
import '../data/models/product.dart';

/// In-memory cart. Quantities are measured in packs.
class CartController extends ChangeNotifier {
  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);
  bool get isEmpty => _items.isEmpty;
  int get distinctCount => _items.length;

  int quantityOf(String productId) {
    final i = _items.indexWhere((e) => e.product.id == productId);
    return i == -1 ? 0 : _items[i].quantity;
  }

  double get subtotal => _items.fold(0, (s, e) => s + e.lineTotal);
  int get totalUnits => _items.fold(0, (s, e) => s + e.units);

  /// Margin-aware preview of points to be earned once confirmed.
  int get pointsPreview => PointsEngine.previewPoints(_items);
  int get campaignBonus => PointsEngine.campaignBonus(_items);

  void add(Product product, [int qty = 1]) {
    final i = _items.indexWhere((e) => e.product.id == product.id);
    if (i == -1) {
      _items.add(CartItem(product: product, quantity: qty));
    } else {
      _items[i] = _items[i].copyWith(quantity: _items[i].quantity + qty);
    }
    notifyListeners();
  }

  void setQuantity(Product product, int qty) {
    final i = _items.indexWhere((e) => e.product.id == product.id);
    if (qty <= 0) {
      if (i != -1) _items.removeAt(i);
    } else if (i == -1) {
      _items.add(CartItem(product: product, quantity: qty));
    } else {
      _items[i] = _items[i].copyWith(quantity: qty);
    }
    notifyListeners();
  }

  void remove(String productId) {
    _items.removeWhere((e) => e.product.id == productId);
    notifyListeners();
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }
}
