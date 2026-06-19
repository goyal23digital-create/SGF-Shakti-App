import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'data/repositories/repositories.dart';
import 'state/cart_controller.dart';
import 'state/session_controller.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));

  // Wire repository implementations. Swap these for Firebase* variants to go
  // live — nothing else in the app needs to change (see docs/ARCHITECTURE.md).
  final session = SessionController(MockDealerRepository());
  final router = buildRouter(session);

  runApp(SgfShaktiApp(session: session, router: router));
}

class SgfShaktiApp extends StatelessWidget {
  const SgfShaktiApp({super.key, required this.session, required this.router});

  final SessionController session;
  final GoRouter router;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: session),
        ChangeNotifierProvider(create: (_) => CartController()),
        Provider<AuthRepository>(create: (_) => MockAuthRepository()),
        Provider<DealerRepository>(create: (_) => MockDealerRepository()),
        Provider<CatalogRepository>(create: (_) => MockCatalogRepository()),
        Provider<OrderRepository>(create: (_) => MockOrderRepository()),
        Provider<RewardsRepository>(create: (_) => MockRewardsRepository()),
        Provider<GrowthRepository>(create: (_) => MockGrowthRepository()),
        Provider<LeaderboardRepository>(create: (_) => MockLeaderboardRepository()),
      ],
      child: MaterialApp.router(
        title: 'SGF Shakti',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light(),
        routerConfig: router,
      ),
    );
  }
}
