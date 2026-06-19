import 'package:flutter/material.dart';

import '../core/theme/app_colors.dart';
import '../core/theme/app_spacing.dart';

/// The base white card used across the app — rounded, softly shadowed, tappable.
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(AppSpacing.lg),
    this.onTap,
    this.color = AppColors.surface,
    this.border,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;
  final Color color;
  final BoxBorder? border;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: color,
      borderRadius: AppRadius.card,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.card,
        child: Ink(
          decoration: BoxDecoration(
            color: color,
            borderRadius: AppRadius.card,
            boxShadow: AppShadows.soft,
            border: border,
          ),
          padding: padding,
          child: child,
        ),
      ),
    );
  }
}

/// A small pill/chip with an icon + label, used for stats and statuses.
class StatPill extends StatelessWidget {
  const StatPill({
    super.key,
    required this.label,
    this.icon,
    this.color = AppColors.primary,
    this.background,
  });

  final String label;
  final IconData? icon;
  final Color color;
  final Color? background;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: background ?? color.withOpacity(0.12),
        borderRadius: AppRadius.chip,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 14, color: color),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}
