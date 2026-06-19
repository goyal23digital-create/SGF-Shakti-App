import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/reward.dart';
import '../../data/models/tier.dart';
import '../../data/repositories/repositories.dart';
import '../../state/session_controller.dart';
import '../../widgets/progress_ring.dart';

class RewardDetailScreen extends StatefulWidget {
  const RewardDetailScreen({super.key, required this.reward});
  final Reward reward;

  @override
  State<RewardDetailScreen> createState() => _RewardDetailScreenState();
}

class _RewardDetailScreenState extends State<RewardDetailScreen> {
  bool _busy = false;

  Reward get r => widget.reward;

  Future<void> _redeem() async {
    setState(() => _busy = true);
    await context.read<RewardsRepository>().redeem(r);
    context.read<SessionController>().spendPoints(r.pointsRequired);
    if (!mounted) return;
    setState(() => _busy = false);
    await showDialog<void>(
      context: context,
      builder: (_) => _RedeemedDialog(reward: r),
    );
    if (!mounted) return;
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final dealer = context.watch<SessionController>().dealer;
    final balance = dealer?.pointsBalance ?? 0;
    final progress = (balance / r.pointsRequired).clamp(0.0, 1.0);
    final affordable = balance >= r.pointsRequired;
    final tierLocked = (dealer?.tier.index ?? 0) < r.minTier.index;
    final canRedeem = affordable && !tierLocked && r.inStock;

    return Scaffold(
      appBar: AppBar(title: Text(r.category.label)),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          Center(
            child: ProgressRing(
              progress: progress,
              gradient: LinearGradient(colors: [r.accent, r.accent.withOpacity(0.6)]),
              size: 196,
              strokeWidth: 16,
              trackColor: AppColors.border,
              center: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(r.icon, size: 52, color: r.accent),
                  const SizedBox(height: 6),
                  Text('${(progress * 100).round()}%',
                      style: Theme.of(context)
                          .textTheme
                          .titleLarge
                          ?.copyWith(color: r.accent)),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text(r.name, style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 4),
          Text(r.tagline, style: Theme.of(context).textTheme.bodyLarge),
          const SizedBox(height: AppSpacing.lg),
          Container(
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                _row(context, 'Points required', '${formatPoints(r.pointsRequired)} pts'),
                const SizedBox(height: 8),
                _row(context, 'Your balance', '${formatPoints(balance)} pts'),
                const SizedBox(height: 8),
                _row(
                  context,
                  affordable ? 'Surplus' : 'Still needed',
                  '${formatPoints((balance - r.pointsRequired).abs())} pts',
                  highlight: affordable ? AppColors.success : AppColors.warning,
                ),
              ],
            ),
          ),
          if (tierLocked) ...[
            const SizedBox(height: AppSpacing.md),
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.warningSoft,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                children: [
                  const Icon(Icons.lock_outline, color: AppColors.warning),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Unlocks at ${r.minTier.label} tier. Keep ordering to level up!',
                      style: const TextStyle(
                          color: AppColors.warning, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: _busy
              ? const Center(child: CircularProgressIndicator())
              : ElevatedButton(
                  onPressed: canRedeem ? _redeem : null,
                  child: Text(
                    tierLocked
                        ? 'Locked — ${r.minTier.label} required'
                        : affordable
                            ? 'Redeem now'
                            : 'Not enough points',
                  ),
                ),
        ),
      ),
    );
  }

  Widget _row(BuildContext context, String label, String value, {Color? highlight}) {
    return Row(
      children: [
        Expanded(child: Text(label, style: Theme.of(context).textTheme.bodyLarge)),
        Text(value,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w800, color: highlight ?? AppColors.textPrimary)),
      ],
    );
  }
}

class _RedeemedDialog extends StatelessWidget {
  const _RedeemedDialog({required this.reward});
  final Reward reward;
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
              decoration: BoxDecoration(
                  color: reward.accent.withOpacity(0.15), shape: BoxShape.circle),
              child: Icon(reward.icon, color: reward.accent, size: 42),
            ),
            const SizedBox(height: AppSpacing.lg),
            Text('Redemption requested!',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text(
              '${reward.name} is on its way. Our team will confirm fulfilment '
              'shortly — track it under My Redemptions.',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: AppSpacing.xl),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Done'),
            ),
          ],
        ),
      ),
    );
  }
}
