import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/order.dart';
import '../../widgets/app_card.dart';
import '../../widgets/order_status_timeline.dart';
import '../../widgets/product_visual.dart';

class OrderDetailScreen extends StatelessWidget {
  const OrderDetailScreen({super.key, required this.order});
  final Order order;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(order.orderNumber),
        actions: [
          if (order.invoiceUrl != null)
            IconButton(
              tooltip: 'Download invoice',
              icon: const Icon(Icons.download_outlined),
              onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Downloading invoice ${order.orderNumber}…')),
              ),
            ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          // Points banner
          Container(
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              gradient: order.pointsCredited
                  ? AppColors.goldGradient
                  : const LinearGradient(colors: [Color(0xFF64748B), Color(0xFF475569)]),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Icon(order.pointsCredited ? Icons.stars_rounded : Icons.hourglass_top,
                    color: Colors.white, size: 30),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${formatPoints(order.pointsEarned)} points',
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.w800)),
                      Text(
                        order.pointsCredited
                            ? 'Credited to your account'
                            : 'Pending — credits once confirmed',
                        style: TextStyle(color: Colors.white.withOpacity(0.92), fontSize: 12.5),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          Text('Tracking', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: AppSpacing.md),
          AppCard(child: OrderStatusTimeline(order: order)),
          const SizedBox(height: AppSpacing.lg),

          Text('Items (${order.items.length})',
              style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: AppSpacing.md),
          AppCard(
            child: Column(
              children: [
                for (int i = 0; i < order.items.length; i++) ...[
                  if (i > 0) const Divider(height: 20),
                  Row(
                    children: [
                      SizedBox(
                        width: 48,
                        child: ProductVisual(
                            product: order.items[i].product,
                            height: 48,
                            iconSize: 22,
                            radius: 10),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(order.items[i].product.name,
                                style: Theme.of(context).textTheme.titleMedium),
                            Text(
                                '${order.items[i].quantity} packs · ${order.items[i].units} units',
                                style: Theme.of(context).textTheme.bodySmall),
                          ],
                        ),
                      ),
                      Text(formatInr(order.items[i].lineTotal),
                          style: const TextStyle(fontWeight: FontWeight.w700)),
                    ],
                  ),
                ],
                const Divider(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: Text('Order total',
                          style: Theme.of(context).textTheme.titleMedium),
                    ),
                    Text(formatInr(order.subtotal),
                        style: Theme.of(context)
                            .textTheme
                            .titleLarge
                            ?.copyWith(fontWeight: FontWeight.w800)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          Text('Placed on ${formatDateTime(order.placedAt)}',
              style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }
}
