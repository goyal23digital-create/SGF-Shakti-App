import 'package:flutter/material.dart';

enum ProductCategory { chair, table }

extension ProductCategoryX on ProductCategory {
  String get label => this == ProductCategory.chair ? 'Chairs' : 'Tables';
  IconData get icon =>
      this == ProductCategory.chair ? Icons.chair_outlined : Icons.table_bar_outlined;
}

enum StockStatus { inStock, lowStock, outOfStock }

extension StockStatusX on StockStatus {
  String get label => switch (this) {
        StockStatus.inStock => 'In stock',
        StockStatus.lowStock => 'Low stock',
        StockStatus.outOfStock => 'Out of stock',
      };
  bool get orderable => this != StockStatus.outOfStock;
}

/// A sellable SKU.
///
/// [pointsPerUnit] is set by the admin from the manufacturer's *margin* per
/// unit — not the dealer price — so dealers cannot inflate points by ordering
/// high-volume, low-margin SKUs. See docs/POINTS_ENGINE.md.
class Product {
  const Product({
    required this.id,
    required this.sku,
    required this.name,
    required this.category,
    required this.dealerPrice,
    required this.packSize,
    required this.pointsPerUnit,
    required this.stockStatus,
    required this.colorTags,
    this.description = '',
  });

  final String id;
  final String sku;
  final String name;
  final ProductCategory category;
  final double dealerPrice;
  final int packSize;
  final int pointsPerUnit;
  final StockStatus stockStatus;
  final List<Color> colorTags;
  final String description;

  factory Product.fromMap(String id, Map<String, dynamic> m) => Product(
        id: id,
        sku: m['sku'] as String? ?? '',
        name: m['name'] as String? ?? '',
        category: ProductCategory.values
            .firstWhere((c) => c.name == m['category'], orElse: () => ProductCategory.chair),
        dealerPrice: (m['dealerPrice'] as num?)?.toDouble() ?? 0,
        packSize: (m['packSize'] as num?)?.toInt() ?? 1,
        pointsPerUnit: (m['pointsPerUnit'] as num?)?.toInt() ?? 0,
        stockStatus: StockStatus.values
            .firstWhere((s) => s.name == m['stockStatus'], orElse: () => StockStatus.inStock),
        colorTags: const [],
        description: m['description'] as String? ?? '',
      );

  Map<String, dynamic> toMap() => {
        'sku': sku,
        'name': name,
        'category': category.name,
        'dealerPrice': dealerPrice,
        'packSize': packSize,
        'pointsPerUnit': pointsPerUnit,
        'stockStatus': stockStatus.name,
        'description': description,
      };
}
