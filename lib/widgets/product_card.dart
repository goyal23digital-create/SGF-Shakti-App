import 'package:flutter/material.dart';

import '../core/theme/app_colors.dart';
import '../core/utils/formatters.dart';
import '../data/models/product.dart';
import 'app_card.dart';
import 'product_visual.dart';

/// Catalog grid card.
class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.product,
    required this.onTap,
    required this.onAdd,
    required this.isFavorite,
    required this.onToggleFavorite,
  });

  final Product product;
  final VoidCallback onTap;
  final VoidCallback onAdd;
  final bool isFavorite;
  final VoidCallback onToggleFavorite;

  @override
  Widget build(BuildContext context) {
    final stock = product.stockStatus;
    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ProductVisual(product: product, height: 110),
              Positioned(
                top: 6,
                left: 6,
                child: _PointsTag(points: product.pointsPerUnit * product.packSize),
              ),
              Positioned(
                top: 2,
                right: 2,
                child: IconButton(
                  visualDensity: VisualDensity.compact,
                  onPressed: onToggleFavorite,
                  icon: Icon(
                    isFavorite ? Icons.favorite : Icons.favorite_border,
                    color: isFavorite ? AppColors.danger : Colors.white,
                    size: 20,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            product.name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 2),
          Text(
            '${product.sku} · Pack of ${product.packSize}',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: 6),
          _StockChip(stock: stock),
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(formatInr(product.dealerPrice),
                        style: Theme.of(context)
                            .textTheme
                            .titleMedium
                            ?.copyWith(fontWeight: FontWeight.w800)),
                    Text('per pack',
                        style: Theme.of(context).textTheme.bodySmall),
                  ],
                ),
              ),
              _AddButton(enabled: stock.orderable, onAdd: onAdd),
            ],
          ),
        ],
      ),
    );
  }
}

class _PointsTag extends StatelessWidget {
  const _PointsTag({required this.points});
  final int points;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        gradient: AppColors.goldGradient,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.stars_rounded, size: 12, color: Colors.white),
          const SizedBox(width: 3),
          Text('+${formatPoints(points)}',
              style: const TextStyle(
                  color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800)),
        ],
      ),
    );
  }
}

class _StockChip extends StatelessWidget {
  const _StockChip({required this.stock});
  final StockStatus stock;
  @override
  Widget build(BuildContext context) {
    final (Color c, Color bg) = switch (stock) {
      StockStatus.inStock => (AppColors.success, AppColors.successSoft),
      StockStatus.lowStock => (AppColors.warning, AppColors.warningSoft),
      StockStatus.outOfStock => (AppColors.danger, AppColors.dangerSoft),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(999)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(width: 6, height: 6, decoration: BoxDecoration(color: c, shape: BoxShape.circle)),
          const SizedBox(width: 5),
          Text(stock.label,
              style: TextStyle(color: c, fontSize: 11, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}

class _AddButton extends StatelessWidget {
  const _AddButton({required this.enabled, required this.onAdd});
  final bool enabled;
  final VoidCallback onAdd;
  @override
  Widget build(BuildContext context) {
    return Material(
      color: enabled ? AppColors.primary : AppColors.border,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: enabled ? onAdd : null,
        child: const Padding(
          padding: EdgeInsets.all(8),
          child: Icon(Icons.add, color: Colors.white, size: 22),
        ),
      ),
    );
  }
}
