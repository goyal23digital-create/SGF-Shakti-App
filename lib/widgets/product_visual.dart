import 'package:flutter/material.dart';

import '../data/models/product.dart';

/// A deterministic gradient + category-icon placeholder used in place of real
/// product photography (the app ships with no bundled assets, so it renders
/// fully offline). Swap for `CachedNetworkImage` once Storage URLs exist.
class ProductVisual extends StatelessWidget {
  const ProductVisual({
    super.key,
    required this.product,
    this.height = 132,
    this.radius = 16,
    this.iconSize = 52,
  });

  final Product product;
  final double height;
  final double radius;
  final double iconSize;

  @override
  Widget build(BuildContext context) {
    final seed = product.sku.hashCode;
    final base = product.colorTags.isNotEmpty
        ? product.colorTags.first
        : Color(0xFF334155 + (seed & 0x3F3F3F));
    final hsl = HSLColor.fromColor(base);
    final c1 = hsl.withLightness((hsl.lightness + 0.18).clamp(0.0, 1.0)).toColor();
    final c2 = hsl.withLightness((hsl.lightness - 0.08).clamp(0.0, 1.0)).toColor();

    return Container(
      height: height,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [c1, c2],
        ),
        borderRadius: BorderRadius.circular(radius),
      ),
      child: Stack(
        children: [
          Positioned(
            right: -8,
            bottom: -8,
            child: Icon(
              product.category.icon,
              size: iconSize + 28,
              color: Colors.white.withOpacity(0.16),
            ),
          ),
          Center(
            child: Icon(product.category.icon, size: iconSize, color: Colors.white),
          ),
        ],
      ),
    );
  }
}
