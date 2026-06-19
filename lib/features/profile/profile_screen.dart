import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/router/app_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/points_ledger_entry.dart';
import '../../data/repositories/repositories.dart';
import '../../state/session_controller.dart';
import '../../widgets/app_card.dart';
import '../../widgets/common.dart';
import '../../widgets/tier_badge.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final dealer = context.watch<SessionController>().dealer;
    if (dealer == null) return const Scaffold(body: LoadingView());
    final tier = dealer.tier;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            tooltip: 'Sign out',
            icon: const Icon(Icons.logout),
            onPressed: () {
              context.read<SessionController>().signOut();
              context.go(Routes.login);
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          // Identity card
          AppCard(
            child: Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    gradient: tier.gradient,
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: Center(
                    child: Text(
                      dealer.businessName.characters.first,
                      style: const TextStyle(
                          color: Colors.white, fontSize: 26, fontWeight: FontWeight.w800),
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(dealer.businessName,
                          style: Theme.of(context).textTheme.titleLarge),
                      Text(dealer.ownerName, style: Theme.of(context).textTheme.bodyMedium),
                      const SizedBox(height: 8),
                      TierBadge(tier: tier, compact: true),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Lifetime stats
          Row(
            children: [
              Expanded(
                  child: _StatCard(
                      label: 'Lifetime points',
                      value: formatPoints(dealer.lifetimePoints),
                      icon: Icons.stars_rounded,
                      color: AppColors.gold)),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                  child: _StatCard(
                      label: 'Member since',
                      value: '${dealer.memberSince.year}',
                      icon: Icons.calendar_today_outlined,
                      color: AppColors.primary)),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          // Tier benefits
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(tier.icon, color: tier.color),
                    const SizedBox(width: 8),
                    Text('${tier.label} benefits',
                        style: Theme.of(context).textTheme.titleMedium),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),
                ...tier.benefits.map((b) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.check_circle,
                              size: 18, color: AppColors.success),
                          const SizedBox(width: 8),
                          Expanded(
                              child: Text(b,
                                  style: Theme.of(context).textTheme.bodyLarge)),
                        ],
                      ),
                    )),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Business / KYC details
          AppCard(
            child: Column(
              children: [
                _detailRow(context, Icons.phone_outlined, 'Phone', dealer.phone),
                const Divider(height: 20),
                _detailRow(context, Icons.receipt_long_outlined, 'GST', dealer.gst),
                const Divider(height: 20),
                _detailRow(context, Icons.badge_outlined, 'PAN', dealer.pan),
                const Divider(height: 20),
                _detailRow(context, Icons.location_on_outlined, 'Address', dealer.address),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Links
          AppCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                _linkRow(context, Icons.receipt_long_outlined, 'My orders',
                    () => context.push(Routes.orders)),
                const Divider(height: 1),
                _linkRow(context, Icons.emoji_events_outlined, 'Recognition',
                    () => context.push(Routes.leaderboard)),
                const Divider(height: 1),
                _linkRow(context, Icons.history, 'Points ledger',
                    () => _showLedger(context)),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xxl),
        ],
      ),
    );
  }

  void _showLedger(BuildContext context) async {
    final ledger = await context.read<DealerRepository>().ledger();
    if (!context.mounted) return;
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      isScrollControlled: true,
      builder: (_) => DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.7,
        builder: (context, controller) => ListView(
          controller: controller,
          padding: const EdgeInsets.all(AppSpacing.lg),
          children: [
            Text('Points ledger', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 4),
            Text('An auditable record of every credit and debit.',
                style: Theme.of(context).textTheme.bodySmall),
            const SizedBox(height: AppSpacing.md),
            ...ledger.map((e) => _LedgerTile(entry: e)),
          ],
        ),
      ),
    );
  }

  Widget _detailRow(BuildContext context, IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: AppColors.textSecondary),
        const SizedBox(width: 12),
        SizedBox(
          width: 70,
          child: Text(label, style: Theme.of(context).textTheme.bodySmall),
        ),
        Expanded(
          child: Text(value,
              style: Theme.of(context)
                  .textTheme
                  .bodyLarge
                  ?.copyWith(fontWeight: FontWeight.w600)),
        ),
      ],
    );
  }

  Widget _linkRow(BuildContext context, IconData icon, String label, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primary),
      title: Text(label),
      trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted),
      onTap: onTap,
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard(
      {required this.label, required this.value, required this.icon, required this.color});
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color),
          const SizedBox(height: 8),
          Text(value,
              style: Theme.of(context)
                  .textTheme
                  .titleLarge
                  ?.copyWith(fontWeight: FontWeight.w800)),
          Text(label, style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }
}

class _LedgerTile extends StatelessWidget {
  const _LedgerTile({required this.entry});
  final PointsLedgerEntry entry;
  @override
  Widget build(BuildContext context) {
    final credit = entry.points >= 0;
    final color = credit ? AppColors.success : AppColors.danger;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              credit ? Icons.add : Icons.remove,
              color: color,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(entry.description,
                    style: Theme.of(context).textTheme.titleMedium),
                Text('${entry.type.label} · ${formatDate(entry.createdAt)}',
                    style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('${credit ? '+' : ''}${formatPoints(entry.points)}',
                  style: TextStyle(fontWeight: FontWeight.w800, color: color)),
              Text('bal ${formatPoints(entry.balanceAfter)}',
                  style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ],
      ),
    );
  }
}
