import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/router/app_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/order.dart';
import '../../data/repositories/repositories.dart';
import '../../widgets/app_card.dart';
import '../../widgets/common.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  late Future<List<Order>> _future;

  @override
  void initState() {
    super.initState();
    _future = context.read<OrderRepository>().orders();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Orders')),
      body: FutureBuilder<List<Order>>(
        future: _future,
        builder: (context, snap) {
          if (!snap.hasData) return const LoadingView();
          final orders = snap.data!;
          if (orders.isEmpty) {
            return const EmptyState(
              icon: Icons.receipt_long_outlined,
              title: 'No orders yet',
              message: 'Your placed orders will appear here.',
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(AppSpacing.lg),
            itemCount: orders.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
            itemBuilder: (context, i) => _OrderTile(order: orders[i]),
          );
        },
      ),
    );
  }
}

class _OrderTile extends StatelessWidget {
  const _OrderTile({required this.order});
  final Order order;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: () => context.push(Routes.orderDetail, extra: order),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(order.orderNumber,
                    style: Theme.of(context).textTheme.titleMedium),
              ),
              StatPill(
                label: order.status.label,
                icon: order.status.icon,
                color: order.status.color,
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text('${formatDate(order.placedAt)} · ${order.totalUnits} units',
              style: Theme.of(context).textTheme.bodySmall),
          const Divider(height: 22),
          Row(
            children: [
              Expanded(
                child: _meta(context, 'Total', formatInr(order.subtotal)),
              ),
              Expanded(
                child: _meta(context, 'Points',
                    '${order.pointsCredited ? '+' : '⏳ '}${formatPoints(order.pointsEarned)}',
                    color: order.pointsCredited ? AppColors.gold : AppColors.textSecondary),
              ),
              Expanded(
                child: _meta(
                    context,
                    order.status == OrderStatus.delivered ? 'Delivered' : 'ETA',
                    relativeDays(order.deliveryEta)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _meta(BuildContext context, String label, String value, {Color? color}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: Theme.of(context).textTheme.bodySmall),
        const SizedBox(height: 2),
        Text(value,
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w700, color: color)),
      ],
    );
  }
}
