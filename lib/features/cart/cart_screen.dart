import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/router/app_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/cart_item.dart';
import '../../state/cart_controller.dart';
import '../../widgets/app_card.dart';
import '../../widgets/common.dart';
import '../../widgets/product_visual.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartController>();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cart'),
        actions: [
          if (!cart.isEmpty)
            TextButton(
              onPressed: () => context.read<CartController>().clear(),
              child: const Text('Clear'),
            ),
        ],
      ),
      body: cart.isEmpty
          ? EmptyState(
              icon: Icons.shopping_cart_outlined,
              title: 'Your cart is empty',
              message: 'Browse the catalog and start earning points.',
              actionLabel: 'Go to catalog',
              onAction: () {
                context.pop();
                context.go(Routes.catalog);
              },
            )
          : ListView(
              padding: const EdgeInsets.all(AppSpacing.lg),
              children: [
                ...cart.items.map((item) => Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.md),
                      child: _CartRow(item: item),
                    )),
              ],
            ),
      bottomNavigationBar: cart.isEmpty ? null : _CheckoutBar(cart: cart),
    );
  }
}

class _CartRow extends StatelessWidget {
  const _CartRow({required this.item});
  final CartItem item;

  @override
  Widget build(BuildContext context) {
    final cart = context.read<CartController>();
    return AppCard(
      padding: const EdgeInsets.all(10),
      child: Row(
        children: [
          SizedBox(
            width: 64,
            child: ProductVisual(product: item.product, height: 64, iconSize: 28, radius: 12),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.product.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.titleMedium),
                Text('${formatInr(item.product.dealerPrice)} · +${item.basePoints} pts',
                    style: Theme.of(context).textTheme.bodySmall),
                const SizedBox(height: 6),
                Text(formatInr(item.lineTotal),
                    style: Theme.of(context)
                        .textTheme
                        .titleMedium
                        ?.copyWith(fontWeight: FontWeight.w800)),
              ],
            ),
          ),
          Column(
            children: [
              _MiniStepper(
                value: item.quantity,
                onChanged: (v) => cart.setQuantity(item.product, v),
              ),
              const SizedBox(height: 2),
              Text('${item.units} units',
                  style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ],
      ),
    );
  }
}

class _MiniStepper extends StatelessWidget {
  const _MiniStepper({required this.value, required this.onChanged});
  final int value;
  final ValueChanged<int> onChanged;
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.primarySoft,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _btn(Icons.remove, () => onChanged(value - 1)),
          SizedBox(
            width: 26,
            child: Text('$value',
                textAlign: TextAlign.center,
                style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.primary)),
          ),
          _btn(Icons.add, () => onChanged(value + 1)),
        ],
      ),
    );
  }

  Widget _btn(IconData icon, VoidCallback onTap) => InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(6),
          child: Icon(icon, size: 18, color: AppColors.primary),
        ),
      );
}

class _CheckoutBar extends StatelessWidget {
  const _CheckoutBar({required this.cart});
  final CartController cart;
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.lg),
        decoration: const BoxDecoration(
          color: AppColors.surface,
          boxShadow: [BoxShadow(color: Color(0x14000000), blurRadius: 16, offset: Offset(0, -4))],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Subtotal', style: Theme.of(context).textTheme.bodySmall),
                      Text(formatInr(cart.subtotal),
                          style: Theme.of(context)
                              .textTheme
                              .headlineSmall
                              ?.copyWith(fontWeight: FontWeight.w800)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.goldSoft,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.stars_rounded, color: AppColors.gold, size: 18),
                      const SizedBox(width: 6),
                      Text('+${formatPoints(cart.pointsPreview)} pts',
                          style: const TextStyle(
                              fontWeight: FontWeight.w800, color: AppColors.gold)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.md),
            ElevatedButton(
              onPressed: () => context.push(Routes.checkout),
              child: const Text('Proceed to checkout'),
            ),
          ],
        ),
      ),
    );
  }
}
