import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import 'cart_item.dart';

/// Lifecycle of an order. The dealer earns points only once an order reaches
/// [confirmed]; points reverse if it is later [cancelled] or returned.
enum OrderStatus {
  placed,
  confirmed,
  manufacturing,
  dispatched,
  inTransit,
  delivered,
  cancelled,
}

extension OrderStatusX on OrderStatus {
  String get label => switch (this) {
        OrderStatus.placed => 'Placed',
        OrderStatus.confirmed => 'Confirmed',
        OrderStatus.manufacturing => 'Manufacturing',
        OrderStatus.dispatched => 'Dispatched',
        OrderStatus.inTransit => 'In Transit',
        OrderStatus.delivered => 'Delivered',
        OrderStatus.cancelled => 'Cancelled',
      };

  IconData get icon => switch (this) {
        OrderStatus.placed => Icons.receipt_long_outlined,
        OrderStatus.confirmed => Icons.verified_outlined,
        OrderStatus.manufacturing => Icons.precision_manufacturing_outlined,
        OrderStatus.dispatched => Icons.inventory_2_outlined,
        OrderStatus.inTransit => Icons.local_shipping_outlined,
        OrderStatus.delivered => Icons.check_circle_outline,
        OrderStatus.cancelled => Icons.cancel_outlined,
      };

  Color get color => switch (this) {
        OrderStatus.delivered => AppColors.success,
        OrderStatus.cancelled => AppColors.danger,
        OrderStatus.inTransit || OrderStatus.dispatched => AppColors.info,
        _ => AppColors.primary,
      };

  /// The happy-path, ordered timeline (excludes the terminal [cancelled]).
  static const List<OrderStatus> timeline = [
    OrderStatus.placed,
    OrderStatus.confirmed,
    OrderStatus.manufacturing,
    OrderStatus.dispatched,
    OrderStatus.inTransit,
    OrderStatus.delivered,
  ];
}

class OrderStatusEvent {
  const OrderStatusEvent({required this.status, required this.at, this.note});
  final OrderStatus status;
  final DateTime at;
  final String? note;
}

class Order {
  const Order({
    required this.id,
    required this.orderNumber,
    required this.items,
    required this.placedAt,
    required this.status,
    required this.history,
    required this.pointsEarned,
    required this.pointsCredited,
    required this.deliveryEta,
    this.invoiceUrl,
  });

  final String id;
  final String orderNumber;
  final List<CartItem> items;
  final DateTime placedAt;
  final OrderStatus status;
  final List<OrderStatusEvent> history;

  /// Points the order will / did earn (already multiplier-adjusted).
  final int pointsEarned;

  /// Whether those points have actually been credited to the ledger.
  final bool pointsCredited;
  final DateTime deliveryEta;
  final String? invoiceUrl;

  double get subtotal =>
      items.fold(0, (sum, item) => sum + item.lineTotal);
  int get totalUnits => items.fold(0, (sum, item) => sum + item.units);

  Order copyWith({OrderStatus? status, bool? pointsCredited, List<OrderStatusEvent>? history}) {
    return Order(
      id: id,
      orderNumber: orderNumber,
      items: items,
      placedAt: placedAt,
      status: status ?? this.status,
      history: history ?? this.history,
      pointsEarned: pointsEarned,
      pointsCredited: pointsCredited ?? this.pointsCredited,
      deliveryEta: deliveryEta,
      invoiceUrl: invoiceUrl,
    );
  }
}
