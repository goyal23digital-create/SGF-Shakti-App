import 'product.dart';

/// A line item in the cart / on an order. [quantity] counts packs.
class CartItem {
  const CartItem({required this.product, required this.quantity});

  final Product product;
  final int quantity;

  int get units => quantity * product.packSize;
  double get lineTotal => product.dealerPrice * quantity;

  /// Points this line will earn once the order is CONFIRMED, before any
  /// active campaign multiplier (applied at checkout/credit time).
  int get basePoints => product.pointsPerUnit * units;

  CartItem copyWith({int? quantity}) =>
      CartItem(product: product, quantity: quantity ?? this.quantity);
}
