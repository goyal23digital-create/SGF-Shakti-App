import 'package:flutter/material.dart';

import '../core/theme/app_colors.dart';
import '../core/utils/formatters.dart';
import '../data/models/order.dart';

/// Vertical stepper showing an order's progress through the fulfilment stages.
class OrderStatusTimeline extends StatelessWidget {
  const OrderStatusTimeline({super.key, required this.order});

  final Order order;

  @override
  Widget build(BuildContext context) {
    if (order.status == OrderStatus.cancelled) {
      return Row(
        children: [
          const Icon(Icons.cancel, color: AppColors.danger),
          const SizedBox(width: 12),
          Text('Order cancelled',
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(color: AppColors.danger)),
        ],
      );
    }

    final stages = OrderStatusX.timeline;
    final currentIndex = stages.indexOf(order.status);
    final eventByStatus = {for (final e in order.history) e.status: e};

    return Column(
      children: [
        for (int i = 0; i < stages.length; i++)
          _Step(
            status: stages[i],
            event: eventByStatus[stages[i]],
            done: i <= currentIndex,
            active: i == currentIndex,
            isLast: i == stages.length - 1,
          ),
      ],
    );
  }
}

class _Step extends StatelessWidget {
  const _Step({
    required this.status,
    required this.event,
    required this.done,
    required this.active,
    required this.isLast,
  });

  final OrderStatus status;
  final OrderStatusEvent? event;
  final bool done;
  final bool active;
  final bool isLast;

  @override
  Widget build(BuildContext context) {
    final color = done ? AppColors.primary : AppColors.border;
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  color: done ? AppColors.primary : AppColors.surface,
                  shape: BoxShape.circle,
                  border: Border.all(color: color, width: 2),
                  boxShadow: active
                      ? [BoxShadow(color: AppColors.primary.withOpacity(0.35), blurRadius: 12)]
                      : null,
                ),
                child: Icon(
                  done ? status.icon : status.icon,
                  size: 17,
                  color: done ? Colors.white : AppColors.textMuted,
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: done ? AppColors.primary : AppColors.border,
                  ),
                ),
            ],
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0 : 22, top: 5),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    status.label,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: done ? AppColors.textPrimary : AppColors.textMuted,
                          fontWeight: active ? FontWeight.w800 : FontWeight.w600,
                        ),
                  ),
                  if (event != null)
                    Text(formatDateTime(event!.at),
                        style: Theme.of(context).textTheme.bodySmall),
                  if (event?.note != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(event!.note!,
                          style: Theme.of(context)
                              .textTheme
                              .bodySmall
                              ?.copyWith(color: AppColors.success)),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
