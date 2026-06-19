import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../data/models/order.dart';
import '../../data/models/product.dart';
import '../../data/models/reward.dart';
import '../../features/auth/onboarding_screen.dart';
import '../../features/auth/otp_login_screen.dart';
import '../../features/auth/splash_screen.dart';
import '../../features/cart/cart_screen.dart';
import '../../features/cart/checkout_screen.dart';
import '../../features/catalog/catalog_screen.dart';
import '../../features/catalog/product_detail_screen.dart';
import '../../features/dashboard/dashboard_screen.dart';
import '../../features/growth/growth_hub_screen.dart';
import '../../features/leaderboard/leaderboard_screen.dart';
import '../../features/orders/order_detail_screen.dart';
import '../../features/orders/orders_screen.dart';
import '../../features/profile/profile_screen.dart';
import '../../features/rewards/reward_detail_screen.dart';
import '../../features/rewards/rewards_screen.dart';
import '../../features/shell/home_shell.dart';
import '../../state/session_controller.dart';

/// Named route paths.
class Routes {
  Routes._();
  static const splash = '/';
  static const login = '/login';
  static const onboarding = '/onboarding';
  static const dashboard = '/dashboard';
  static const catalog = '/catalog';
  static const rewards = '/rewards';
  static const growth = '/growth';
  static const profile = '/profile';
  static const cart = '/cart';
  static const checkout = '/checkout';
  static const orders = '/orders';
  static const orderDetail = '/orders/detail';
  static const productDetail = '/product';
  static const rewardDetail = '/reward';
  static const leaderboard = '/leaderboard';
}

GoRouter buildRouter(SessionController session) {
  final navKey = GlobalKey<NavigatorState>();
  return GoRouter(
    navigatorKey: navKey,
    initialLocation: Routes.splash,
    refreshListenable: session,
    routes: [
      GoRoute(path: Routes.splash, builder: (_, __) => const SplashScreen()),
      GoRoute(path: Routes.login, builder: (_, __) => const OtpLoginScreen()),
      GoRoute(path: Routes.onboarding, builder: (_, __) => const OnboardingScreen()),

      // Persistent bottom-nav shell.
      StatefulShellRoute.indexedStack(
        builder: (context, state, shell) => HomeShell(shell: shell),
        branches: [
          StatefulShellBranch(routes: [
            GoRoute(path: Routes.dashboard, builder: (_, __) => const DashboardScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: Routes.catalog, builder: (_, __) => const CatalogScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: Routes.rewards, builder: (_, __) => const RewardsScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: Routes.growth, builder: (_, __) => const GrowthHubScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: Routes.profile, builder: (_, __) => const ProfileScreen()),
          ]),
        ],
      ),

      // Full-screen routes pushed on top of the shell.
      GoRoute(
        path: Routes.cart,
        parentNavigatorKey: navKey,
        builder: (_, __) => const CartScreen(),
      ),
      GoRoute(
        path: Routes.checkout,
        parentNavigatorKey: navKey,
        builder: (_, __) => const CheckoutScreen(),
      ),
      GoRoute(
        path: Routes.orders,
        parentNavigatorKey: navKey,
        builder: (_, __) => const OrdersScreen(),
      ),
      GoRoute(
        path: Routes.orderDetail,
        parentNavigatorKey: navKey,
        builder: (_, state) => OrderDetailScreen(order: state.extra as Order),
      ),
      GoRoute(
        path: Routes.productDetail,
        parentNavigatorKey: navKey,
        builder: (_, state) => ProductDetailScreen(product: state.extra as Product),
      ),
      GoRoute(
        path: Routes.rewardDetail,
        parentNavigatorKey: navKey,
        builder: (_, state) => RewardDetailScreen(reward: state.extra as Reward),
      ),
      GoRoute(
        path: Routes.leaderboard,
        parentNavigatorKey: navKey,
        builder: (_, __) => const LeaderboardScreen(),
      ),
    ],
    redirect: (context, state) {
      final loggedIn = session.isAuthenticated;
      final loc = state.matchedLocation;
      final onboardingFlow =
          loc == Routes.splash || loc == Routes.login || loc == Routes.onboarding;
      // Gate the app behind auth; let the splash route itself decide where to go.
      if (!loggedIn && !onboardingFlow) return Routes.login;
      return null;
    },
  );
}
