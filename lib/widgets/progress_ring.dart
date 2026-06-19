import 'dart:math' as math;

import 'package:flutter/material.dart';

/// An animated circular progress ring with a gradient sweep and a centred
/// label. Used on the dashboard to visualise progress to the next tier
/// (goal-gradient effect — the ring fills as the dealer nears the milestone).
class ProgressRing extends StatelessWidget {
  const ProgressRing({
    super.key,
    required this.progress,
    required this.gradient,
    this.size = 180,
    this.strokeWidth = 14,
    this.trackColor = const Color(0x1AFFFFFF),
    this.center,
  });

  /// 0..1
  final double progress;
  final Gradient gradient;
  final double size;
  final double strokeWidth;
  final Color trackColor;
  final Widget? center;

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: progress.clamp(0.0, 1.0)),
      duration: const Duration(milliseconds: 1100),
      curve: Curves.easeOutCubic,
      builder: (context, value, _) {
        return SizedBox(
          width: size,
          height: size,
          child: CustomPaint(
            painter: _RingPainter(
              progress: value,
              gradient: gradient,
              strokeWidth: strokeWidth,
              trackColor: trackColor,
            ),
            child: Center(child: center),
          ),
        );
      },
    );
  }
}

class _RingPainter extends CustomPainter {
  _RingPainter({
    required this.progress,
    required this.gradient,
    required this.strokeWidth,
    required this.trackColor,
  });

  final double progress;
  final Gradient gradient;
  final double strokeWidth;
  final Color trackColor;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;
    final rect = Rect.fromCircle(center: center, radius: radius);

    final track = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..color = trackColor;
    canvas.drawCircle(center, radius, track);

    final sweep = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..shader = gradient.createShader(rect);

    const start = -math.pi / 2; // 12 o'clock
    canvas.drawArc(rect, start, 2 * math.pi * progress, false, sweep);
  }

  @override
  bool shouldRepaint(_RingPainter old) =>
      old.progress != progress || old.trackColor != trackColor;
}
