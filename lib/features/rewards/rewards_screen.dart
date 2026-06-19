import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/router/app_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/reward.dart';
import '../../data/models/tier.dart';
import '../../data/repositories/repositories.dart';
import '../../state/session_controller.dart';
import '../../widgets/app_card.dart';
import '../../widgets/common.dart';

class RewardsScreen extends StatefulWidget {
  const RewardsScreen({super.key});

  @override
  State<RewardsScreen> createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen> {
  late Future<List<Reward>> _future;

  @override
  void initState() {
    super.initState();
    _future = context.read<RewardsRepository>().rewards();
  }

  @override
  Widget build(BuildContext context) {
    final dealer = context.watch<SessionController>().dealer;
    final balance = dealer?.pointsBalance ?? 0;

    return Scaffold(
      appBar: AppBar(title: const Text('Rewards')),
      body: FutureBuilder<List<Reward>>(
        future: _future,
        builder: (context, snap) {
          if (!snap.hasData) return const LoadingView();
          final rewards = snap.data!;
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: [
              _BalanceHeader(balance: balance),
              SectionHeader(
                title: 'Marketplace',
                actionLabel: 'My redemptions',
                onAction: () => _showRedemptions(context),
              ),
              ...rewards.map((r) => Padding(
                    padding: const EdgeInsets.only(bottom: AppSpacing.md),
                    child: _RewardTile(
                      reward: r,
                      balance: balance,
                      dealerTier: dealer?.tier ?? DealerTier.bronze,
                      onTap: () => context.push(Routes.rewardDetail, extra: r),
                    ),
                  )),
              const SizedBox(height: AppSpacing.xxl),
            ],
          );
        },
      ),
    );
  }

  void _showRedemptions(BuildContext context) async {
    final redemptions = await context.read<RewardsRepository>().redemptions();
    if (!context.mounted) return;
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (_) => ListView(
        shrinkWrap: true,
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          Text('Redemption history',
              style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: AppSpacing.md),
          if (redemptions.isEmpty)
            const Padding(
              padding: EdgeInsets.all(AppSpacing.lg),
              child: Text('No redemptions yet.'),
            ),
          ...redemptions.map((rd) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(
                  backgroundColor: rd.reward.accent.withOpacity(0.15),
                  child: Icon(rd.reward.icon, color: rd.reward.accent),
                ),
                title: Text(rd.reward.name),
                subtitle: Text(
                    '${formatPoints(rd.pointsSpent)} pts · ${formatDate(rd.requestedAt)}'),
                trailing: StatPill(
                  label: rd.status.label,
                  color: rd.status == RedemptionStatus.fulfilled
                      ? AppColors.success
                      : AppColors.primary,
                ),
              )),
        ],
      ),
    );
  }
}

class _BalanceHeader extends StatelessWidget {
  const _BalanceHeader({required this.balance});
  final int balance;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.xl),
      decoration: BoxDecoration(
        gradient: AppColors.heroGradient,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('AVAILABLE TO REDEEM',
              style: TextStyle(
                  color: Colors.white.withOpacity(0.75),
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1)),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.stars_rounded, color: AppColors.gold, size: 30),
              const SizedBox(width: 8),
              Text(formatPoints(balance),
                  style: const TextStyle(
                      color: Colors.white, fontSize: 34, fontWeight: FontWeight.w800)),
              const SizedBox(width: 6),
              const Padding(
                padding: EdgeInsets.only(bottom: 6),
                child: Text('points',
                    style: TextStyle(color: Colors.white70, fontSize: 14)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _RewardTile extends StatelessWidget {
  const _RewardTile({
    required this.reward,
    required this.balance,
    required this.dealerTier,
    required this.onTap,
  });

  final Reward reward;
  final int balance;
  final DealerTier dealerTier;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final progress = (balance / reward.pointsRequired).clamp(0.0, 1.0);
    final affordable = balance >= reward.pointsRequired;
    final tierLocked = dealerTier.index < reward.minTier.index;

    return AppCard(
      onTap: onTap,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 58,
            height: 58,
            decoration: BoxDecoration(
              color: reward.accent.withOpacity(0.12),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(reward.icon, color: reward.accent, size: 28),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(reward.name,
                          style: Theme.of(context).textTheme.titleMedium),
                    ),
                    if (tierLocked)
                      StatPill(
                        label: '${reward.minTier.label}+',
                        icon: Icons.lock_outline,
                        color: AppColors.textSecondary,
                      ),
                  ],
                ),
                Text(reward.tagline, style: Theme.of(context).textTheme.bodySmall),
                const SizedBox(height: 10),
                ClipRRect(
                  borderRadius: BorderRadius.circular(999),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 7,
                    backgroundColor: AppColors.border,
                    valueColor: AlwaysStoppedAnimation(
                        affordable ? AppColors.success : reward.accent),
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Text('${formatPoints(reward.pointsRequired)} pts',
                        style: const TextStyle(fontWeight: FontWeight.w700)),
                    const Spacer(),
                    Text(
                      affordable
                          ? 'Ready to redeem'
                          : '${formatPoints(reward.pointsRequired - balance)} to go',
                      style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: affordable ? AppColors.success : AppColors.textSecondary),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
