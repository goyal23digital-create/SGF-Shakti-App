import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/router/app_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/product.dart';
import '../../state/cart_controller.dart';
import '../../widgets/cart_badge.dart';
import '../../widgets/product_visual.dart';

class ProductDetailScreen extends StatefulWidget {
  const ProductDetailScreen({super.key, required this.product});
  final Product product;

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int _packs = 1;

  Product get p => widget.product;

  @override
  Widget build(BuildContext context) {
    final pointsPerPack = p.pointsPerUnit * p.packSize;
    return Scaffold(
      appBar: AppBar(
        title: Text(p.category.label),
        actions: const [CartBadge(), SizedBox(width: 8)],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          ProductVisual(product: p, height: 220, iconSize: 90),
          const SizedBox(height: AppSpacing.lg),
          Row(
            children: [
              Expanded(
                child: Text(p.name, style: Theme.of(context).textTheme.headlineSmall),
              ),
              _PointsBadge(points: pointsPerPack),
            ],
          ),
          const SizedBox(height: 4),
          Text(p.sku, style: Theme.of(context).textTheme.bodyMedium),
          const SizedBox(height: AppSpacing.lg),
          Row(
            children: [
              _Spec(label: 'Dealer price', value: formatInr(p.dealerPrice)),
              _Spec(label: 'Pack size', value: '${p.packSize} units'),
              _Spec(label: 'Stock', value: p.stockStatus.label),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          if (p.colorTags.isNotEmpty) ...[
            Text('Available colours', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Row(
              children: p.colorTags
                  .map((c) => Container(
                        margin: const EdgeInsets.only(right: 10),
                        width: 30,
                        height: 30,
                        decoration: BoxDecoration(
                          color: c,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.border),
                        ),
                      ))
                  .toList(),
            ),
            const SizedBox(height: AppSpacing.lg),
          ],
          Text('About this product', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 6),
          Text(p.description, style: Theme.of(context).textTheme.bodyLarge),
          const SizedBox(height: AppSpacing.xl),
          Container(
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              color: AppColors.goldSoft,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const Icon(Icons.stars_rounded, color: AppColors.gold),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'You\'ll earn ${formatPoints(pointsPerPack * _packs)} points '
                    'on this order (margin-based).',
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Row(
            children: [
              _QtyStepper(
                value: _packs,
                onChanged: (v) => setState(() => _packs = v),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: p.stockStatus.orderable
                      ? () {
                          context.read<CartController>().add(p, _packs);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Added $_packs pack(s) to cart'),
                              action: SnackBarAction(
                                label: 'View cart',
                                textColor: AppColors.gold,
                                onPressed: () => context.push(Routes.cart),
                              ),
                            ),
                          );
                        }
                      : null,
                  icon: const Icon(Icons.add_shopping_cart),
                  label: Text(p.stockStatus.orderable ? 'Add to cart' : 'Out of stock'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Spec extends StatelessWidget {
  const _Spec({required this.label, required this.value});
  final String label;
  final String value;
  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
        decoration: BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: Theme.of(context).textTheme.bodySmall),
            const SizedBox(height: 4),
            Text(value,
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.w700)),
          ],
        ),
      ),
    );
  }
}

class _PointsBadge extends StatelessWidget {
  const _PointsBadge({required this.points});
  final int points;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        gradient: AppColors.goldGradient,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.stars_rounded, size: 16, color: Colors.white),
          const SizedBox(width: 4),
          Text('+${formatPoints(points)}/pack',
              style: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.w800, fontSize: 13)),
        ],
      ),
    );
  }
}

class _QtyStepper extends StatelessWidget {
  const _QtyStepper({required this.value, required this.onChanged});
  final int value;
  final ValueChanged<int> onChanged;
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: value > 1 ? () => onChanged(value - 1) : null,
            icon: const Icon(Icons.remove),
          ),
          Text('$value',
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(fontWeight: FontWeight.w700)),
          IconButton(
            onPressed: () => onChanged(value + 1),
            icon: const Icon(Icons.add),
          ),
        ],
      ),
    );
  }
}
