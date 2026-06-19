import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/router/app_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../data/mock/mock_data.dart';
import '../../data/models/order.dart';
import '../../data/repositories/repositories.dart';
import '../../state/cart_controller.dart';
import '../../state/session_controller.dart';
import '../../widgets/app_card.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  bool _placing = false;

  Future<void> _placeOrder() async {
    setState(() => _placing = true);
    final cart = context.read<CartController>();
    final order = await context
        .read<OrderRepository>()
        .placeOrder(cart.items, cart.pointsPreview);
    if (!mounted) return;
    cart.clear();
    await showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (_) => _OrderPlacedDialog(order: order),
    );
    if (!mounted) return;
    // Leave checkout + cart, then open the new order.
    context.pop(); // checkout
    context.pop(); // cart
    context.push(Routes.orderDetail, extra: order);
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartController>();
    final dealer = context.watch<SessionController>().dealer;
    final eta = DateTime.now().add(const Duration(days: 5));

    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          // Delivery
          AppCard(
            child: Row(
              children: [
                const Icon(Icons.local_shipping_outlined, color: AppColors.primary),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Delivery to', style: Theme.of(context).textTheme.bodySmall),
                      Text(dealer?.businessName ?? '',
                          style: Theme.of(context).textTheme.titleMedium),
                      Text(dealer?.address ?? '',
                          style: Theme.of(context).textTheme.bodyMedium),
                      const SizedBox(height: 6),
                      Text('Estimated delivery ${relativeDays(eta)} · ${formatDate(eta)}',
                          style: const TextStyle(
                              color: AppColors.success, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Items
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Order summary', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: AppSpacing.sm),
                ...cart.items.map((item) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text('${item.product.name}  ×${item.quantity}',
                                style: Theme.of(context).textTheme.bodyLarge),
                          ),
                          Text(formatInr(item.lineTotal),
                              style: const TextStyle(fontWeight: FontWeight.w600)),
                        ],
                      ),
                    )),
                const Divider(height: 24),
                _row(context, 'Subtotal', formatInr(cart.subtotal)),
                _row(context, 'Total units', '${cart.totalUnits}'),
                const Divider(height: 24),
                _row(context, 'Total', formatInr(cart.subtotal), bold: true),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Points preview (margin-aware)
          Container(
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              gradient: AppColors.goldGradient,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.stars_rounded, color: Colors.white, size: 28),
                    const SizedBox(width: 10),
                    Text('You\'ll earn ${formatPoints(cart.pointsPreview)} points',
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w800)),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Includes a +${formatPoints(cart.campaignBonus)} bonus from '
                  '${MockData.campaignName} (${MockData.campaignMultiplier}×). '
                  'Points credit once your order is confirmed.',
                  style: TextStyle(color: Colors.white.withOpacity(0.92), fontSize: 12.5),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: _placing
              ? const Center(child: CircularProgressIndicator())
              : ElevatedButton.icon(
                  onPressed: cart.isEmpty ? null : _placeOrder,
                  icon: const Icon(Icons.check_circle_outline),
                  label: Text('Place order · ${formatInr(cart.subtotal)}'),
                ),
        ),
      ),
    );
  }

  Widget _row(BuildContext context, String label, String value, {bool bold = false}) {
    final style = bold
        ? Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)
        : Theme.of(context).textTheme.bodyLarge;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          Expanded(child: Text(label, style: style)),
          Text(value, style: style),
        ],
      ),
    );
  }
}

class _OrderPlacedDialog extends StatelessWidget {
  const _OrderPlacedDialog({required this.order});
  final Order order;
  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                  color: AppColors.successSoft, shape: BoxShape.circle),
              child: const Icon(Icons.check_rounded, color: AppColors.success, size: 44),
            ),
            const SizedBox(height: AppSpacing.lg),
            Text('Order placed!', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text(
              'Order ${order.orderNumber} is confirmed for processing. '
              '${formatPoints(order.pointsEarned)} points will be credited once confirmed.',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: AppSpacing.xl),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Track my order'),
            ),
          ],
        ),
      ),
    );
  }
}
