import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../data/models/growth.dart';
import '../../data/models/tier.dart';
import '../../data/repositories/repositories.dart';
import '../../state/session_controller.dart';
import '../../widgets/app_card.dart';
import '../../widgets/common.dart';

class GrowthHubScreen extends StatelessWidget {
  const GrowthHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Growth Hub'),
          bottom: const TabBar(
            isScrollable: true,
            tabAlignment: TabAlignment.start,
            labelColor: AppColors.primary,
            unselectedLabelColor: AppColors.textSecondary,
            indicatorColor: AppColors.primary,
            tabs: [
              Tab(text: 'Creatives'),
              Tab(text: 'Services'),
              Tab(text: 'Learn & Earn'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            _CreativesTab(),
            _ServicesTab(),
            _LearnTab(),
          ],
        ),
      ),
    );
  }
}

// --------------------------------------------------------------------------
class _CreativesTab extends StatelessWidget {
  const _CreativesTab();
  @override
  Widget build(BuildContext context) {
    final repo = context.read<GrowthRepository>();
    return FutureBuilder(
      future: repo.creatives(),
      builder: (context, snap) {
        if (!snap.hasData) return const LoadingView();
        final creatives = snap.data!;
        return GridView.builder(
          padding: const EdgeInsets.all(AppSpacing.lg),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: AppSpacing.md,
            crossAxisSpacing: AppSpacing.md,
            childAspectRatio: 0.92,
          ),
          itemCount: creatives.length,
          itemBuilder: (context, i) {
            final c = creatives[i];
            return AppCard(
              padding: EdgeInsets.zero,
              onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Downloading "${c.title}" (${c.format.label})')),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [c.accent, c.accent.withOpacity(0.65)],
                        ),
                        borderRadius:
                            const BorderRadius.vertical(top: Radius.circular(20)),
                      ),
                      child: Stack(
                        children: [
                          Positioned(
                            right: 10,
                            top: 10,
                            child: Icon(c.format.icon,
                                color: Colors.white.withOpacity(0.9), size: 22),
                          ),
                          Center(
                            child: Icon(Icons.image_outlined,
                                color: Colors.white.withOpacity(0.85), size: 48),
                          ),
                        ],
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(c.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: Theme.of(context).textTheme.titleMedium),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            Icon(c.format.icon, size: 13, color: AppColors.textSecondary),
                            const SizedBox(width: 4),
                            Text(c.format.label,
                                style: Theme.of(context).textTheme.bodySmall),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}

// --------------------------------------------------------------------------
class _ServicesTab extends StatelessWidget {
  const _ServicesTab();
  @override
  Widget build(BuildContext context) {
    final repo = context.read<GrowthRepository>();
    final dealer = context.watch<SessionController>().dealer;
    return FutureBuilder(
      future: Future.wait([repo.services(), repo.requests()]),
      builder: (context, snap) {
        if (!snap.hasData) return const LoadingView();
        final services = snap.data![0] as List<GrowthService>;
        final requests = snap.data![1] as List<GrowthServiceRequest>;
        return ListView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          children: [
            if (requests.isNotEmpty) ...[
              Text('Your requests', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: AppSpacing.md),
              ...requests.map((req) => Padding(
                    padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                    child: AppCard(
                      child: Row(
                        children: [
                          Icon(req.service.icon, color: AppColors.primary),
                          const SizedBox(width: 12),
                          Expanded(child: Text(req.service.title)),
                          StatPill(label: req.status.label, color: AppColors.primary),
                        ],
                      ),
                    ),
                  )),
              const SizedBox(height: AppSpacing.lg),
            ],
            Text('Request a service', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: AppSpacing.md),
            ...services.map((s) => Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.md),
                  child: _ServiceCard(
                    service: s,
                    unlocked: (dealer?.tier.index ?? 0) >= s.minTier.index,
                  ),
                )),
          ],
        );
      },
    );
  }
}

class _ServiceCard extends StatelessWidget {
  const _ServiceCard({required this.service, required this.unlocked});
  final GrowthService service;
  final bool unlocked;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: AppColors.primarySoft,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(service.icon, color: AppColors.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(service.title, style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 2),
                Text(service.description,
                    style: Theme.of(context).textTheme.bodyMedium),
                const SizedBox(height: 10),
                if (unlocked)
                  FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      minimumSize: const Size(0, 40),
                    ),
                    onPressed: () async {
                      await context.read<GrowthRepository>().requestService(service);
                      if (!context.mounted) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('${service.title} requested')),
                      );
                    },
                    child: const Text('Request'),
                  )
                else
                  StatPill(
                    label: 'Unlocks at ${service.minTier.label}',
                    icon: Icons.lock_outline,
                    color: AppColors.textSecondary,
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// --------------------------------------------------------------------------
class _LearnTab extends StatefulWidget {
  const _LearnTab();
  @override
  State<_LearnTab> createState() => _LearnTabState();
}

class _LearnTabState extends State<_LearnTab> {
  late Future<List<LearningModule>> _future;

  @override
  void initState() {
    super.initState();
    _future = context.read<GrowthRepository>().learningModules();
  }

  Future<void> _complete(LearningModule m) async {
    final awarded = await context.read<GrowthRepository>().completeModule(m);
    if (awarded > 0 && mounted) {
      context.read<SessionController>().awardPoints(awarded);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Quiz passed! +$awarded points earned 🎉')),
      );
    }
    setState(() => _future = context.read<GrowthRepository>().learningModules());
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<LearningModule>>(
      future: _future,
      builder: (context, snap) {
        if (!snap.hasData) return const LoadingView();
        final modules = snap.data!;
        return ListView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          children: [
            Container(
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                gradient: AppColors.heroGradient,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  const Icon(Icons.school_rounded, color: Colors.white, size: 30),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Learn how to sell more. Pass the quiz, earn points.',
                      style: TextStyle(
                          color: Colors.white.withOpacity(0.95),
                          fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            ...modules.map((m) => Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.md),
                  child: AppCard(
                    child: Row(
                      children: [
                        Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            color: m.accent.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Icon(m.icon, color: m.accent),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(m.title,
                                  style: Theme.of(context).textTheme.titleMedium),
                              Text('${m.durationMinutes} min · +${m.pointsAwarded} pts',
                                  style: Theme.of(context).textTheme.bodySmall),
                            ],
                          ),
                        ),
                        if (m.completed)
                          const Icon(Icons.check_circle, color: AppColors.success)
                        else
                          FilledButton(
                            style: FilledButton.styleFrom(
                              backgroundColor: AppColors.primarySoft,
                              foregroundColor: AppColors.primary,
                              minimumSize: const Size(0, 40),
                            ),
                            onPressed: () => _complete(m),
                            child: const Text('Start'),
                          ),
                      ],
                    ),
                  ),
                )),
          ],
        );
      },
    );
  }
}
