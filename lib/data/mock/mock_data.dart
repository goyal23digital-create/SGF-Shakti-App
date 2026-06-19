import 'package:flutter/material.dart';

import '../models/announcement.dart';
import '../models/cart_item.dart';
import '../models/dealer.dart';
import '../models/growth.dart';
import '../models/leaderboard.dart';
import '../models/order.dart';
import '../models/points_ledger_entry.dart';
import '../models/product.dart';
import '../models/reward.dart';
import '../models/tier.dart';

/// Seed data so the app is a fully explorable, premium experience offline.
/// In production these are replaced by Firestore reads (see ARCHITECTURE.md).
class MockData {
  MockData._();

  static const String campaignName = 'Monsoon Bonanza';
  static const double campaignMultiplier = 1.5; // active campaign multiplier

  static Dealer dealer = Dealer(
    id: 'DLR-1042',
    businessName: 'Shakti Home Furnishings',
    ownerName: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    gst: '27ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    address: '14, MG Road, Pune, Maharashtra 411001',
    region: 'West',
    pointsBalance: 12450,
    quarterlyPoints: 13100, // mid-Gold, close to Platinum (goal-gradient)
    lifetimePoints: 86200,
    memberSince: DateTime(2022, 4, 12),
    assignedSalesManagerId: 'SM-07',
    avatarSeed: 'shakti',
  );

  // ---- Catalog ----------------------------------------------------------
  static final List<Product> products = [
    const Product(
      id: 'p1',
      sku: 'CHR-PRM-001',
      name: 'Aristocrat Premium Chair',
      category: ProductCategory.chair,
      dealerPrice: 540,
      packSize: 4,
      pointsPerUnit: 22,
      stockStatus: StockStatus.inStock,
      colorTags: [Color(0xFF1F2937), Color(0xFF8B5CF6), Color(0xFFB91C1C)],
      description:
          'High-back armchair with reinforced legs and UV-stabilised polymer. '
          'Our flagship margin SKU — earns the most points per unit.',
    ),
    const Product(
      id: 'p2',
      sku: 'CHR-STD-014',
      name: 'Comfort Standard Chair',
      category: ProductCategory.chair,
      dealerPrice: 320,
      packSize: 6,
      pointsPerUnit: 9,
      stockStatus: StockStatus.inStock,
      colorTags: [Color(0xFF2563EB), Color(0xFF059669)],
      description: 'Everyday stackable chair. High volume, modest margin.',
    ),
    const Product(
      id: 'p3',
      sku: 'CHR-KID-003',
      name: 'Junior Kids Chair',
      category: ProductCategory.chair,
      dealerPrice: 210,
      packSize: 8,
      pointsPerUnit: 6,
      stockStatus: StockStatus.lowStock,
      colorTags: [Color(0xFFF59E0B), Color(0xFFEC4899)],
      description: 'Lightweight, rounded-edge chair for children.',
    ),
    const Product(
      id: 'p4',
      sku: 'TBL-PRM-021',
      name: 'Banquet Pro Table',
      category: ProductCategory.table,
      dealerPrice: 1450,
      packSize: 1,
      pointsPerUnit: 65,
      stockStatus: StockStatus.inStock,
      colorTags: [Color(0xFF374151), Color(0xFF6B7280)],
      description:
          'Heavy-duty folding banquet table. Premium margin — a points magnet.',
    ),
    const Product(
      id: 'p5',
      sku: 'TBL-RND-009',
      name: 'Round Garden Table',
      category: ProductCategory.table,
      dealerPrice: 980,
      packSize: 1,
      pointsPerUnit: 40,
      stockStatus: StockStatus.inStock,
      colorTags: [Color(0xFF15803D), Color(0xFFA16207)],
      description: 'Weatherproof round table with parasol slot.',
    ),
    const Product(
      id: 'p6',
      sku: 'TBL-CTR-017',
      name: 'Centre Coffee Table',
      category: ProductCategory.table,
      dealerPrice: 760,
      packSize: 1,
      pointsPerUnit: 28,
      stockStatus: StockStatus.outOfStock,
      colorTags: [Color(0xFF7C3AED)],
      description: 'Compact living-room centre table.',
    ),
  ];

  static List<String> favoriteProductIds = ['p1', 'p4'];
  static List<String> frequentlyOrderedIds = ['p2', 'p1', 'p5'];

  // ---- Orders -----------------------------------------------------------
  static List<Order> orders = [
    Order(
      id: 'o1',
      orderNumber: 'SGF-24817',
      placedAt: DateTime.now().subtract(const Duration(days: 2)),
      status: OrderStatus.inTransit,
      pointsEarned: 1980,
      pointsCredited: true,
      deliveryEta: DateTime.now().add(const Duration(days: 1)),
      items: [
        CartItem(product: products[0], quantity: 10),
        CartItem(product: products[3], quantity: 4),
      ],
      history: [
        OrderStatusEvent(
            status: OrderStatus.placed,
            at: DateTime.now().subtract(const Duration(days: 2))),
        OrderStatusEvent(
            status: OrderStatus.confirmed,
            at: DateTime.now().subtract(const Duration(days: 2, hours: -3)),
            note: 'Points credited'),
        OrderStatusEvent(
            status: OrderStatus.manufacturing,
            at: DateTime.now().subtract(const Duration(days: 1, hours: 6))),
        OrderStatusEvent(
            status: OrderStatus.dispatched,
            at: DateTime.now().subtract(const Duration(hours: 18))),
        OrderStatusEvent(
            status: OrderStatus.inTransit,
            at: DateTime.now().subtract(const Duration(hours: 5))),
      ],
      invoiceUrl: 'invoice://SGF-24817',
    ),
    Order(
      id: 'o2',
      orderNumber: 'SGF-24655',
      placedAt: DateTime.now().subtract(const Duration(days: 19)),
      status: OrderStatus.delivered,
      pointsEarned: 720,
      pointsCredited: true,
      deliveryEta: DateTime.now().subtract(const Duration(days: 14)),
      items: [CartItem(product: products[1], quantity: 12)],
      history: [
        OrderStatusEvent(
            status: OrderStatus.placed,
            at: DateTime.now().subtract(const Duration(days: 19))),
        OrderStatusEvent(
            status: OrderStatus.delivered,
            at: DateTime.now().subtract(const Duration(days: 14))),
      ],
      invoiceUrl: 'invoice://SGF-24655',
    ),
    Order(
      id: 'o3',
      orderNumber: 'SGF-24590',
      placedAt: DateTime.now().subtract(const Duration(hours: 6)),
      status: OrderStatus.placed,
      pointsEarned: 600,
      pointsCredited: false, // pending confirmation
      deliveryEta: DateTime.now().add(const Duration(days: 5)),
      items: [CartItem(product: products[4], quantity: 10)],
      history: [
        OrderStatusEvent(
            status: OrderStatus.placed,
            at: DateTime.now().subtract(const Duration(hours: 6))),
      ],
    ),
  ];

  // ---- Announcements ----------------------------------------------------
  static final List<Announcement> announcements = [
    Announcement(
      id: 'a1',
      title: '🌧 Monsoon Bonanza — 1.5× points!',
      body: 'Earn 1.5× points on every premium SKU until month end.',
      kind: AnnouncementKind.campaign,
      icon: Icons.bolt,
      accent: const Color(0xFFD97706),
      publishedAt: DateTime.now().subtract(const Duration(hours: 8)),
    ),
    Announcement(
      id: 'a2',
      title: 'Only 3 Diamond spots remain this quarter',
      body: 'Diamond tier is almost full. Secure your place with one big order.',
      kind: AnnouncementKind.nudge,
      icon: Icons.diamond_outlined,
      accent: const Color(0xFF3BC4D6),
      publishedAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
    Announcement(
      id: 'a3',
      title: 'New: Banquet Pro Table now in stock',
      body: 'Your highest-margin table is back — reorder before it sells out.',
      kind: AnnouncementKind.product,
      icon: Icons.new_releases_outlined,
      accent: const Color(0xFF4338CA),
      publishedAt: DateTime.now().subtract(const Duration(days: 2)),
    ),
  ];

  // ---- Rewards ----------------------------------------------------------
  static final List<Reward> rewards = [
    const Reward(
      id: 'r1',
      name: 'Marketing Credits ₹5,000',
      category: RewardCategory.business,
      pointsRequired: 5000,
      icon: Icons.campaign_outlined,
      accent: Color(0xFF059669),
      tagline: 'Reinvest in your storefront',
    ),
    const Reward(
      id: 'r2',
      name: 'Premium Smartwatch',
      category: RewardCategory.electronics,
      pointsRequired: 9000,
      icon: Icons.watch_outlined,
      accent: Color(0xFF2563EB),
      tagline: 'Track your hustle',
    ),
    const Reward(
      id: 'r3',
      name: '43" 4K Smart TV',
      category: RewardCategory.electronics,
      pointsRequired: 18000,
      icon: Icons.tv_outlined,
      accent: Color(0xFF7C3AED),
      tagline: 'Upgrade your showroom',
    ),
    const Reward(
      id: 'r4',
      name: 'Ultrabook Laptop',
      category: RewardCategory.electronics,
      pointsRequired: 42000,
      icon: Icons.laptop_mac_outlined,
      accent: Color(0xFF0EA5E9),
      minTier: DealerTier.gold,
      tagline: 'Run your business anywhere',
    ),
    const Reward(
      id: 'r5',
      name: 'iPhone (latest)',
      category: RewardCategory.electronics,
      pointsRequired: 60000,
      icon: Icons.phone_iphone_outlined,
      accent: Color(0xFF111827),
      minTier: DealerTier.platinum,
      tagline: 'The ultimate status symbol',
    ),
    const Reward(
      id: 'r6',
      name: 'Electric Scooter',
      category: RewardCategory.lifestyle,
      pointsRequired: 85000,
      icon: Icons.electric_scooter_outlined,
      accent: Color(0xFFD97706),
      minTier: DealerTier.platinum,
      tagline: 'Beat the traffic in style',
    ),
    const Reward(
      id: 'r7',
      name: 'Family Trip to Goa',
      category: RewardCategory.travel,
      pointsRequired: 120000,
      icon: Icons.beach_access_outlined,
      accent: Color(0xFF14B8A6),
      minTier: DealerTier.diamond,
      tagline: '3 nights, all-inclusive',
    ),
  ];

  static final List<Redemption> redemptions = [
    Redemption(
      id: 'rd1',
      reward: rewards[0],
      pointsSpent: 5000,
      requestedAt: DateTime.now().subtract(const Duration(days: 30)),
      status: RedemptionStatus.fulfilled,
    ),
    Redemption(
      id: 'rd2',
      reward: rewards[1],
      pointsSpent: 9000,
      requestedAt: DateTime.now().subtract(const Duration(days: 5)),
      status: RedemptionStatus.approved,
    ),
  ];

  // ---- Points ledger ----------------------------------------------------
  static final List<PointsLedgerEntry> ledger = [
    PointsLedgerEntry(
      id: 'l1',
      type: LedgerEntryType.earn,
      points: 1980,
      balanceAfter: 12450,
      description: 'Order SGF-24817 confirmed',
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
      sourceOrderId: 'o1',
      expiresAt: DateTime.now().add(const Duration(days: 365)),
    ),
    PointsLedgerEntry(
      id: 'l2',
      type: LedgerEntryType.redeem,
      points: -9000,
      balanceAfter: 10470,
      description: 'Redeemed: Premium Smartwatch',
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
      sourceRewardId: 'r2',
    ),
    PointsLedgerEntry(
      id: 'l3',
      type: LedgerEntryType.bonus,
      points: 1000,
      balanceAfter: 19470,
      description: 'Welcome bonus — endowed progress',
      createdAt: DateTime.now().subtract(const Duration(days: 40)),
    ),
    PointsLedgerEntry(
      id: 'l4',
      type: LedgerEntryType.earn,
      points: 720,
      balanceAfter: 18470,
      description: 'Order SGF-24655 confirmed',
      createdAt: DateTime.now().subtract(const Duration(days: 19)),
      sourceOrderId: 'o2',
    ),
  ];

  // ---- Growth hub -------------------------------------------------------
  static final List<MarketingCreative> creatives = [
    const MarketingCreative(
        id: 'c1', title: 'Diwali Mega Sale', format: CreativeFormat.festival, accent: Color(0xFFD97706)),
    const MarketingCreative(
        id: 'c2', title: 'New Arrivals Story', format: CreativeFormat.instagram, accent: Color(0xFFEC4899)),
    const MarketingCreative(
        id: 'c3', title: 'Price Drop Broadcast', format: CreativeFormat.whatsapp, accent: Color(0xFF059669)),
    const MarketingCreative(
        id: 'c4', title: 'Showroom Poster A2', format: CreativeFormat.poster, accent: Color(0xFF4338CA)),
  ];

  static final List<GrowthService> growthServices = [
    const GrowthService(
      id: 'g1',
      title: 'Google Business Setup',
      description: 'Get found on Google Maps & Search with a verified profile.',
      icon: Icons.business_outlined,
      minTier: DealerTier.silver,
    ),
    const GrowthService(
      id: 'g2',
      title: 'Social Media Setup',
      description: 'Professional Instagram & Facebook pages, branded & ready.',
      icon: Icons.alternate_email,
      minTier: DealerTier.silver,
    ),
    const GrowthService(
      id: 'g3',
      title: 'Local Advertising',
      description: 'Hyperlocal ad campaigns to drive footfall to your store.',
      icon: Icons.ads_click_outlined,
      minTier: DealerTier.gold,
    ),
    const GrowthService(
      id: 'g4',
      title: 'Influencer Campaign',
      description: 'Partner with regional creators to amplify your brand.',
      icon: Icons.record_voice_over_outlined,
      minTier: DealerTier.platinum,
    ),
  ];

  static List<GrowthServiceRequest> growthRequests = [
    GrowthServiceRequest(
      id: 'gr1',
      service: growthServices[0],
      status: GrowthRequestStatus.scheduled,
      requestedAt: DateTime.now().subtract(const Duration(days: 3)),
    ),
  ];

  static List<LearningModule> learningModules = [
    const LearningModule(
      id: 'lm1',
      title: 'Selling Premium: Margin over Volume',
      durationMinutes: 6,
      pointsAwarded: 150,
      accent: Color(0xFF4338CA),
      icon: Icons.school_outlined,
    ),
    const LearningModule(
      id: 'lm2',
      title: 'WhatsApp Marketing in 10 Minutes',
      durationMinutes: 10,
      pointsAwarded: 200,
      accent: Color(0xFF059669),
      icon: Icons.play_circle_outline,
    ),
    LearningModule(
      id: 'lm3',
      title: 'Showroom Display Mastery',
      durationMinutes: 8,
      pointsAwarded: 180,
      accent: const Color(0xFFD97706),
      icon: Icons.storefront_outlined,
      completed: true,
    ),
  ];

  // ---- Leaderboard / recognition ---------------------------------------
  static const List<RecognitionBand> myBands = [
    RecognitionBand.top25,
    RecognitionBand.regionalChampion,
  ];

  static const List<RecognitionPeer> peers = [
    RecognitionPeer(handle: 'Furniture House', region: 'West', band: RecognitionBand.top10),
    RecognitionPeer(handle: 'Sai Traders', region: 'South', band: RecognitionBand.fastestGrowing),
    RecognitionPeer(handle: 'Modern Living', region: 'North', band: RecognitionBand.top10),
    RecognitionPeer(handle: 'Comfort Zone', region: 'East', band: RecognitionBand.regionalChampion),
    RecognitionPeer(handle: 'Galaxy Furnishings', region: 'West', band: RecognitionBand.top25),
  ];

  static const List<Achievement> achievements = [
    Achievement(id: 'ac1', title: 'First Order', icon: Icons.flag_outlined, accent: Color(0xFF059669), unlocked: true),
    Achievement(id: 'ac2', title: '50K Lifetime', icon: Icons.military_tech, accent: Color(0xFFD4A017), unlocked: true),
    Achievement(id: 'ac3', title: 'Gold Tier', icon: Icons.workspace_premium, accent: Color(0xFFD4A017), unlocked: true),
    Achievement(id: 'ac4', title: 'Quiz Whiz', icon: Icons.psychology_outlined, accent: Color(0xFF4338CA), unlocked: true),
    Achievement(id: 'ac5', title: 'Platinum Tier', icon: Icons.diamond_outlined, accent: Color(0xFF5B6B8C), unlocked: false),
    Achievement(id: 'ac6', title: '10 Reorders', icon: Icons.replay_circle_filled_outlined, accent: Color(0xFF2563EB), unlocked: false),
  ];
}
