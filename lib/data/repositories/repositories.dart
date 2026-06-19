/// Repository layer.
///
/// Every screen talks to these interfaces, never to a concrete data source.
/// Today they are backed by [MockData]; swapping in `Firebase*Repository`
/// implementations (Firestore/Auth/Functions) requires no UI changes.
/// See docs/ARCHITECTURE.md.
import '../mock/mock_data.dart';
import '../models/announcement.dart';
import '../models/cart_item.dart';
import '../models/dealer.dart';
import '../models/growth.dart';
import '../models/leaderboard.dart';
import '../models/order.dart';
import '../models/points_ledger_entry.dart';
import '../models/product.dart';
import '../models/reward.dart';

// Simulated network latency so loading states are exercised in the UI.
const _latency = Duration(milliseconds: 350);

abstract class AuthRepository {
  /// Requests an OTP for [phone]. Returns the verification id.
  Future<String> requestOtp(String phone);

  /// Verifies [code] and returns whether the dealer profile already exists.
  Future<bool> verifyOtp(String verificationId, String code);
}

class MockAuthRepository implements AuthRepository {
  @override
  Future<String> requestOtp(String phone) async {
    await Future.delayed(_latency);
    return 'verif_${phone.hashCode}';
  }

  @override
  Future<bool> verifyOtp(String verificationId, String code) async {
    await Future.delayed(_latency);
    // Demo: profile already exists so reviewers land straight on the dashboard.
    return true;
  }
}

abstract class DealerRepository {
  Future<Dealer> currentDealer();
  Future<List<PointsLedgerEntry>> ledger();
}

class MockDealerRepository implements DealerRepository {
  @override
  Future<Dealer> currentDealer() async {
    await Future.delayed(_latency);
    return MockData.dealer;
  }

  @override
  Future<List<PointsLedgerEntry>> ledger() async {
    await Future.delayed(_latency);
    return MockData.ledger;
  }
}

abstract class CatalogRepository {
  Future<List<Product>> products();
  Future<List<String>> favoriteIds();

  /// Synchronous snapshot of favorites, for fast UI checks in list builders.
  List<String> get favoriteIdsSync;
  Future<List<Product>> frequentlyOrdered();
  Future<void> toggleFavorite(String productId);
}

class MockCatalogRepository implements CatalogRepository {
  @override
  Future<List<Product>> products() async {
    await Future.delayed(_latency);
    return MockData.products;
  }

  @override
  Future<List<String>> favoriteIds() async => MockData.favoriteProductIds;

  @override
  List<String> get favoriteIdsSync => MockData.favoriteProductIds;

  @override
  Future<List<Product>> frequentlyOrdered() async {
    await Future.delayed(_latency);
    return MockData.frequentlyOrderedIds
        .map((id) => MockData.products.firstWhere((p) => p.id == id))
        .toList();
  }

  @override
  Future<void> toggleFavorite(String productId) async {
    if (MockData.favoriteProductIds.contains(productId)) {
      MockData.favoriteProductIds.remove(productId);
    } else {
      MockData.favoriteProductIds.add(productId);
    }
  }
}

abstract class OrderRepository {
  Future<List<Order>> orders();
  Future<Order> placeOrder(List<CartItem> items, int pointsToEarn);
}

class MockOrderRepository implements OrderRepository {
  @override
  Future<List<Order>> orders() async {
    await Future.delayed(_latency);
    return MockData.orders;
  }

  @override
  Future<Order> placeOrder(List<CartItem> items, int pointsToEarn) async {
    await Future.delayed(_latency);
    final order = Order(
      id: 'o${DateTime.now().millisecondsSinceEpoch}',
      orderNumber: 'SGF-${24818 + MockData.orders.length}',
      items: List.of(items),
      placedAt: DateTime.now(),
      status: OrderStatus.placed,
      pointsEarned: pointsToEarn,
      pointsCredited: false, // credited only on confirmation
      deliveryEta: DateTime.now().add(const Duration(days: 5)),
      history: [OrderStatusEvent(status: OrderStatus.placed, at: DateTime.now())],
    );
    MockData.orders.insert(0, order);
    return order;
  }
}

abstract class RewardsRepository {
  Future<List<Reward>> rewards();
  Future<List<Redemption>> redemptions();
  Future<Redemption> redeem(Reward reward);
}

class MockRewardsRepository implements RewardsRepository {
  @override
  Future<List<Reward>> rewards() async {
    await Future.delayed(_latency);
    return MockData.rewards;
  }

  @override
  Future<List<Redemption>> redemptions() async => MockData.redemptions;

  @override
  Future<Redemption> redeem(Reward reward) async {
    await Future.delayed(_latency);
    final r = Redemption(
      id: 'rd${DateTime.now().millisecondsSinceEpoch}',
      reward: reward,
      pointsSpent: reward.pointsRequired,
      requestedAt: DateTime.now(),
      status: RedemptionStatus.requested,
    );
    MockData.redemptions.insert(0, r);
    return r;
  }
}

abstract class GrowthRepository {
  Future<List<MarketingCreative>> creatives();
  Future<List<GrowthService>> services();
  Future<List<GrowthServiceRequest>> requests();
  Future<List<LearningModule>> learningModules();
  Future<GrowthServiceRequest> requestService(GrowthService service);
  Future<int> completeModule(LearningModule module);
}

class MockGrowthRepository implements GrowthRepository {
  @override
  Future<List<MarketingCreative>> creatives() async => MockData.creatives;

  @override
  Future<List<GrowthService>> services() async => MockData.growthServices;

  @override
  Future<List<GrowthServiceRequest>> requests() async => MockData.growthRequests;

  @override
  Future<List<LearningModule>> learningModules() async => MockData.learningModules;

  @override
  Future<GrowthServiceRequest> requestService(GrowthService service) async {
    await Future.delayed(_latency);
    final req = GrowthServiceRequest(
      id: 'gr${DateTime.now().millisecondsSinceEpoch}',
      service: service,
      status: GrowthRequestStatus.requested,
      requestedAt: DateTime.now(),
    );
    MockData.growthRequests.insert(0, req);
    return req;
  }

  /// Marks a module complete and returns the points awarded.
  @override
  Future<int> completeModule(LearningModule module) async {
    await Future.delayed(_latency);
    final i = MockData.learningModules.indexWhere((m) => m.id == module.id);
    if (i != -1 && !MockData.learningModules[i].completed) {
      MockData.learningModules[i] =
          MockData.learningModules[i].copyWith(completed: true);
      return module.pointsAwarded;
    }
    return 0;
  }
}

abstract class LeaderboardRepository {
  Future<List<RecognitionBand>> myBands();
  Future<List<RecognitionPeer>> peers();
  Future<List<Achievement>> achievements();
  Future<List<Announcement>> announcements();
}

class MockLeaderboardRepository implements LeaderboardRepository {
  @override
  Future<List<RecognitionBand>> myBands() async => MockData.myBands;

  @override
  Future<List<RecognitionPeer>> peers() async => MockData.peers;

  @override
  Future<List<Achievement>> achievements() async => MockData.achievements;

  @override
  Future<List<Announcement>> announcements() async => MockData.announcements;
}
