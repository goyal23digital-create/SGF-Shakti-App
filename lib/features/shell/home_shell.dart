import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';

/// Persistent bottom-navigation scaffold wrapping the five primary tabs.
class HomeShell extends StatelessWidget {
  const HomeShell({super.key, required this.shell});

  final StatefulNavigationShell shell;

  static const _destinations = [
    (icon: Icons.home_outlined, active: Icons.home_rounded, label: 'Home'),
    (icon: Icons.grid_view_outlined, active: Icons.grid_view_rounded, label: 'Catalog'),
    (icon: Icons.card_giftcard_outlined, active: Icons.card_giftcard, label: 'Rewards'),
    (icon: Icons.rocket_launch_outlined, active: Icons.rocket_launch, label: 'Growth'),
    (icon: Icons.person_outline, active: Icons.person, label: 'Profile'),
  ];

  void _onTap(int index) {
    shell.goBranch(index, initialLocation: index == shell.currentIndex);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: shell,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          boxShadow: [
            BoxShadow(color: Color(0x14000000), blurRadius: 20, offset: Offset(0, -4)),
          ],
        ),
        child: SafeArea(
          top: false,
          child: NavigationBarTheme(
            data: NavigationBarThemeData(
              backgroundColor: AppColors.surface,
              indicatorColor: AppColors.primarySoft,
              labelTextStyle: MaterialStateProperty.resolveWith(
                (states) => TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w600,
                  color: states.contains(MaterialState.selected)
                      ? AppColors.primary
                      : AppColors.textSecondary,
                ),
              ),
            ),
            child: NavigationBar(
              height: 64,
              selectedIndex: shell.currentIndex,
              onDestinationSelected: _onTap,
              labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
              destinations: [
                for (final d in _destinations)
                  NavigationDestination(
                    icon: Icon(d.icon, color: AppColors.textSecondary),
                    selectedIcon: Icon(d.active, color: AppColors.primary),
                    label: d.label,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
