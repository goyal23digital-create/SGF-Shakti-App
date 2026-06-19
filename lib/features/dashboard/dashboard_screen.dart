import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/router/app_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/announcement.dart';
import '../../data/models/dealer.dart';
import '../../data/models/order.dart';
import '../../data/models/product.dart';
import '../../data/models/tier.dart';
import '../../data/repositories/repositories.dart';
import '../../state/cart_controller.dart';
import '../../state/session_controller.dart';
import '../../widgets/app_card.dart';
import '../../widgets/common.dart';
import '../../widgets/product_visual.dart';
import '../../widgets/progress_ring.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late Future<_DashboardData> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_DashboardData> _load() async {
    final orders = context.read<OrderRepository>();
    final catalog = context.read<CatalogRepository>();
    final board = context.read<LeaderboardRepository>();
    return _DashboardData(
      pending: (await orders.orders())
          .where((o) => o.status != OrderStatus.delivered && o.status != OrderStatus.cancelled)
          .toList(),
      frequently: await catalog.frequentlyOrdered(),
      announcements: await board.announcements(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final dealer = context.watch<SessionController>().dealer;
    if (dealer == null) return const Scaffold(body: LoadingView());

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () async => setState(() => _future = _load()),
        child: FutureBuilder<_DashboardData>(
          future: _future,
          builder: (context, snap) {
            return CustomScrollView(
              slivers: [
                SliverToBoxAdapter(child: _Hero(dealer: dealer)),
                SliverPadding(
                  padding: AppSpacing.page,
                  sliver: SliverList.list(children: [
                    const SizedBox(height: AppSpacing.lg),
                    const _QuickActions(),
                    if (snap.hasData) ...[
                      _PendingOrders(orders: snap.data!.pending),
                      _Announcements(items: snap.data!.announcements),
                      _QuickReorder(products: snap.data!.frequently),
                    ] else
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: AppSpacing.xxxl),
                        child: LoadingView(),
                      ),
                    const SizedBox(height: AppSpacing.xxl),
                  ]),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _DashboardData {
  _DashboardData({required this.pending, required this.frequently, required this.announcements});
  final List<Order> pending;
  final List<Product> frequently;
  final List<Announcement> announcements;
}

// --------------------------------------------------------------------------
// Hero header with the animated tier progress ring (goal-gradient effect).
// --------------------------------------------------------------------------
class _Hero extends StatelessWidget {
  const _Hero({required this.dealer});
  final Dealer dealer;

  @override
  Widget build(BuildContext context) {
    final tier = dealer.tier;
    final next = tier.next;
    return Container(
      decoration: const BoxDecoration(
        gradient: AppColors.heroGradient,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 26),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Welcome back,',
                            style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 14)),
                        const SizedBox(height: 2),
                        Text(dealer.businessName,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 22,
                                fontWeight: FontWeight.w800)),
                      ],
                    ),
                  ),
                  _IconBtn(
                    icon: Icons.notifications_none_rounded,
                    onTap: () => _snack(context, 'Notifications'),
                  ),
                ],
              ),
              const SizedBox(height: 22),
              Row(
                children: [
                  ProgressRing(
                    progress: dealer.tierProgress,
                    gradient: AppColors.goldGradient,
                    size: 132,
                    strokeWidth: 11,
                    center: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(tier.icon, color: Colors.white, size: 22),
                        const SizedBox(height: 2),
                        Text(tier.label,
                            style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                                fontSize: 15)),
                        Text('${(dealer.tierProgress * 100).round()}%',
                            style: TextStyle(
                                color: Colors.white.withOpacity(0.8), fontSize: 12)),
                      ],
                    ),
                  ),
                  const SizedBox(width: 18),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('POINTS BALANCE',
                            style: TextStyle(
                                color: Colors.white.withOpacity(0.7),
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 1)),
                        const SizedBox(height: 4),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const Icon(Icons.stars_rounded, color: AppColors.gold, size: 26),
                            const SizedBox(width: 6),
                            Text(formatPoints(dealer.pointsBalance),
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 30,
                                    fontWeight: FontWeight.w800)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        if (next != null)
                          _NudgePill(
                            text: '${formatPoints(dealer.pointsToNextTier)} pts to ${next.label}',
                          )
                        else
                          const _NudgePill(text: 'Diamond — top tier unlocked'),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  static void _snack(BuildContext context, String m) =>
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(m)));
}

class _NudgePill extends StatelessWidget {
  const _NudgePill({required this.text});
  final String text;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.16),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: Colors.white.withOpacity(0.25)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.trending_up_rounded, color: Colors.white, size: 15),
          const SizedBox(width: 6),
          Flexible(
            child: Text(text,
                style: const TextStyle(
                    color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }
}

class _IconBtn extends StatelessWidget {
  const _IconBtn({required this.icon, required this.onTap});
  final IconData icon;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white.withOpacity(0.16),
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(10),
          child: Icon(icon, color: Colors.white, size: 22),
        ),
      ),
    );
  }
}

// --------------------------------------------------------------------------
class _QuickActions extends StatelessWidget {
  const _QuickActions();
  @override
  Widget build(BuildContext context) {
    final actions = [
      (Icons.add_shopping_cart_outlined, 'Order', () => context.go(Routes.catalog)),
      (Icons.receipt_long_outlined, 'My Orders', () => context.push(Routes.orders)),
      (Icons.emoji_events_outlined, 'Ranking', () => context.push(Routes.leaderboard)),
      (Icons.rocket_launch_outlined, 'Growth', () => context.go(Routes.growth)),
    ];
    return Row(
      children: [
        for (final a in actions)
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: _ActionTile(icon: a.$1, label: a.$2, onTap: a.$3),
            ),
          ),
      ],
    );
  }
}

class _ActionTile extends StatelessWidget {
  const _ActionTile({required this.icon, required this.label, required this.onTap});
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      child: Column(
        children: [
          Container(
            height: 54,
            width: 54,
            decoration: BoxDecoration(
              color: AppColors.primarySoft,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: AppColors.primary, size: 24),
          ),
          const SizedBox(height: 6),
          Text(label,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

// --------------------------------------------------------------------------
class _PendingOrders extends StatelessWidget {
  const _PendingOrders({required this.orders});
  final List<Order> orders;
  @override
  Widget build(BuildContext context) {
    if (orders.isEmpty) return const SizedBox.shrink();
    return Column(
      children: [
        SectionHeader(
          title: 'Active orders',
          actionLabel: 'See all',
          onAction: () => context.push(Routes.orders),
        ),
        ...orders.take(2).map((o) => Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: AppCard(
                onTap: () => context.push(Routes.orderDetail, extra: o),
                child: Row(
                  children: [
                    Container(
                      height: 46,
                      width: 46,
                      decoration: BoxDecoration(
                        color: o.status.color.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(o.status.icon, color: o.status.color),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(o.orderNumber,
                              style: Theme.of(context).textTheme.titleMedium),
                          Text('${o.totalUnits} units · ETA ${relativeDays(o.deliveryEta)}',
                              style: Theme.of(context).textTheme.bodySmall),
                        ],
                      ),
                    ),
                    StatPill(label: o.status.label, color: o.status.color),
                  ],
                ),
              ),
            )),
      ],
    );
  }
}

// --------------------------------------------------------------------------
class _Announcements extends StatelessWidget {
  const _Announcements({required this.items});
  final List<Announcement> items;
  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionHeader(title: 'For you'),
        SizedBox(
          height: 128,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.zero,
            itemCount: items.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (context, i) {
              final a = items[i];
              return Container(
                width: 280,
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: AppShadows.soft,
                  border: Border(left: BorderSide(color: a.accent, width: 4)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(a.icon, color: a.accent, size: 20),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(a.title,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: Theme.of(context).textTheme.titleMedium),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Expanded(
                      child: Text(a.body,
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.bodyMedium),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

// --------------------------------------------------------------------------
class _QuickReorder extends StatelessWidget {
  const _QuickReorder({required this.products});
  final List<Product> products;
  @override
  Widget build(BuildContext context) {
    if (products.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHeader(
          title: 'Quick reorder',
          actionLabel: 'Catalog',
          onAction: () => context.go(Routes.catalog),
        ),
        ...products.map((p) => Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: AppCard(
                onTap: () => context.push(Routes.productDetail, extra: p),
                padding: const EdgeInsets.all(10),
                child: Row(
                  children: [
                    SizedBox(
                      width: 56,
                      child: ProductVisual(product: p, height: 56, iconSize: 26, radius: 12),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(p.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: Theme.of(context).textTheme.titleMedium),
                          Text('${formatInr(p.dealerPrice)} · +${p.pointsPerUnit * p.packSize} pts/pack',
                              style: Theme.of(context).textTheme.bodySmall),
                        ],
                      ),
                    ),
                    Builder(builder: (context) {
                      return FilledButton(
                        style: FilledButton.styleFrom(
                          backgroundColor: AppColors.primarySoft,
                          foregroundColor: AppColors.primary,
                          minimumSize: const Size(0, 40),
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                        ),
                        onPressed: p.stockStatus.orderable
                            ? () {
                                context.read<CartController>().add(p);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('${p.name} added to cart')),
                                );
                              }
                            : null,
                        child: const Text('Reorder'),
                      );
                    }),
                  ],
                ),
              ),
            )),
      ],
    );
  }
}
