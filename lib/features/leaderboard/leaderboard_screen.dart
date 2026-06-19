import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../data/models/leaderboard.dart';
import '../../data/repositories/repositories.dart';
import '../../widgets/app_card.dart';
import '../../widgets/common.dart';

/// Recognition-only leaderboard. By design it never reveals other dealers'
/// raw sales/points — only the band they belong to — preserving competitive
/// privacy while still delivering social proof and status signaling.
class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final repo = context.read<LeaderboardRepository>();
    return Scaffold(
      appBar: AppBar(title: const Text('Recognition')),
      body: FutureBuilder(
        future: Future.wait([repo.myBands(), repo.peers(), repo.achievements()]),
        builder: (context, snap) {
          if (!snap.hasData) return const LoadingView();
          final myBands = snap.data![0] as List<RecognitionBand>;
          final peers = snap.data![1] as List<RecognitionPeer>;
          final achievements = snap.data![2] as List<Achievement>;
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: [
              _MyStanding(bands: myBands),
              const SectionHeader(title: 'Your achievements'),
              _AchievementGrid(achievements: achievements),
              const SectionHeader(title: 'Hall of fame'),
              Text('Top dealers earn a spot here. Sales figures stay private.',
                  style: Theme.of(context).textTheme.bodyMedium),
              const SizedBox(height: AppSpacing.md),
              ...peers.map((p) => Padding(
                    padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                    child: AppCard(
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: p.band.accent.withOpacity(0.14),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(p.band.icon, color: p.band.accent),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(p.handle,
                                    style: Theme.of(context).textTheme.titleMedium),
                                Text('${p.region} region',
                                    style: Theme.of(context).textTheme.bodySmall),
                              ],
                            ),
                          ),
                          StatPill(label: p.band.label, color: p.band.accent),
                        ],
                      ),
                    ),
                  )),
              const SizedBox(height: AppSpacing.xxl),
            ],
          );
        },
      ),
    );
  }
}

class _MyStanding extends StatelessWidget {
  const _MyStanding({required this.bands});
  final List<RecognitionBand> bands;
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
          Text('YOUR STANDING',
              style: TextStyle(
                  color: Colors.white.withOpacity(0.75),
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: bands
                .map((b) => Container(
                      padding:
                          const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.16),
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(color: Colors.white.withOpacity(0.25)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(b.icon, color: Colors.white, size: 18),
                          const SizedBox(width: 8),
                          Text(b.label,
                              style: const TextStyle(
                                  color: Colors.white, fontWeight: FontWeight.w700)),
                        ],
                      ),
                    ))
                .toList(),
          ),
          const SizedBox(height: 14),
          Text('You\'re ahead of most dealers in your region. Keep climbing!',
              style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 13)),
        ],
      ),
    );
  }
}

class _AchievementGrid extends StatelessWidget {
  const _AchievementGrid({required this.achievements});
  final List<Achievement> achievements;
  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: EdgeInsets.zero,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        mainAxisSpacing: AppSpacing.md,
        crossAxisSpacing: AppSpacing.md,
        childAspectRatio: 0.85,
      ),
      itemCount: achievements.length,
      itemBuilder: (context, i) {
        final a = achievements[i];
        return Opacity(
          opacity: a.unlocked ? 1 : 0.4,
          child: AppCard(
            padding: const EdgeInsets.all(10),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: a.accent.withOpacity(0.14),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(a.unlocked ? a.icon : Icons.lock_outline, color: a.accent),
                ),
                const SizedBox(height: 8),
                Text(a.title,
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
              ],
            ),
          ),
        );
      },
    );
  }
}
