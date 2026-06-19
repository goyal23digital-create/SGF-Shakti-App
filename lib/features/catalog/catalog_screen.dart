import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/router/app_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../data/models/product.dart';
import '../../data/repositories/repositories.dart';
import '../../state/cart_controller.dart';
import '../../widgets/cart_badge.dart';
import '../../widgets/common.dart';
import '../../widgets/product_card.dart';

enum _Filter { all, chairs, tables, favorites }

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  late Future<List<Product>> _future;
  String _query = '';
  _Filter _filter = _Filter.all;

  @override
  void initState() {
    super.initState();
    _future = context.read<CatalogRepository>().products();
  }

  List<Product> _apply(List<Product> all) {
    final favs = context.read<CatalogRepository>();
    return all.where((p) {
      final matchesQuery = _query.isEmpty ||
          p.name.toLowerCase().contains(_query.toLowerCase()) ||
          p.sku.toLowerCase().contains(_query.toLowerCase());
      final matchesFilter = switch (_filter) {
        _Filter.all => true,
        _Filter.chairs => p.category == ProductCategory.chair,
        _Filter.tables => p.category == ProductCategory.table,
        _Filter.favorites => favs.favoriteIdsSync.contains(p.id),
      };
      return matchesQuery && matchesFilter;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Catalog'),
        actions: const [CartBadge(), SizedBox(width: 8)],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.lg, 0, AppSpacing.lg, AppSpacing.sm),
            child: TextField(
              onChanged: (v) => setState(() => _query = v),
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.search),
                hintText: 'Search products or SKU',
              ),
            ),
          ),
          SizedBox(
            height: 44,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              children: [
                _chip('All', _Filter.all),
                _chip('Chairs', _Filter.chairs),
                _chip('Tables', _Filter.tables),
                _chip('Favorites', _Filter.favorites, icon: Icons.favorite),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Expanded(
            child: FutureBuilder<List<Product>>(
              future: _future,
              builder: (context, snap) {
                if (!snap.hasData) return const LoadingView();
                final products = _apply(snap.data!);
                if (products.isEmpty) {
                  return const EmptyState(
                    icon: Icons.search_off,
                    title: 'No products found',
                    message: 'Try a different search or filter.',
                  );
                }
                return GridView.builder(
                  padding: const EdgeInsets.fromLTRB(
                      AppSpacing.lg, AppSpacing.sm, AppSpacing.lg, AppSpacing.xxl),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: AppSpacing.md,
                    crossAxisSpacing: AppSpacing.md,
                    childAspectRatio: 0.62,
                  ),
                  itemCount: products.length,
                  itemBuilder: (context, i) {
                    final p = products[i];
                    final repo = context.read<CatalogRepository>();
                    return ProductCard(
                      product: p,
                      isFavorite: repo.favoriteIdsSync.contains(p.id),
                      onToggleFavorite: () async {
                        await repo.toggleFavorite(p.id);
                        setState(() {});
                      },
                      onTap: () => context.push(Routes.productDetail, extra: p),
                      onAdd: () {
                        context.read<CartController>().add(p);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('${p.name} added to cart')),
                        );
                      },
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _chip(String label, _Filter value, {IconData? icon}) {
    final selected = _filter == value;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ChoiceChip(
        selected: selected,
        showCheckmark: false,
        avatar: icon != null
            ? Icon(icon, size: 15, color: selected ? Colors.white : AppColors.primary)
            : null,
        label: Text(label),
        labelStyle: TextStyle(
          color: selected ? Colors.white : AppColors.primary,
          fontWeight: FontWeight.w600,
          fontSize: 13,
        ),
        selectedColor: AppColors.primary,
        backgroundColor: AppColors.primarySoft,
        side: BorderSide.none,
        onSelected: (_) => setState(() => _filter = value),
      ),
    );
  }
}
