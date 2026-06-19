import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/router/app_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../state/session_controller.dart';

/// Business onboarding. Captures the KYC fields (business name, GST, PAN,
/// address) and showcases *endowed progress* — the dealer is gifted starter
/// points the moment they join, so they never start from zero.
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _business = TextEditingController();
  final _gst = TextEditingController();
  final _pan = TextEditingController();
  final _address = TextEditingController();
  bool _busy = false;

  static const int starterPoints = 1000;

  @override
  void dispose() {
    _business.dispose();
    _gst.dispose();
    _pan.dispose();
    _address.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _busy = true);
    await context.read<SessionController>().load();
    if (!mounted) return;
    await showDialog<void>(
      context: context,
      builder: (_) => const _StarterPointsDialog(points: starterPoints),
    );
    if (!mounted) return;
    context.go(Routes.dashboard);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Set up your business')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.xl),
          children: [
            _StarterBanner(points: starterPoints),
            const SizedBox(height: AppSpacing.xl),
            _field(_business, 'Business name', Icons.storefront_outlined,
                validator: (v) => (v == null || v.isEmpty) ? 'Required' : null),
            _field(_gst, 'GST number', Icons.receipt_long_outlined,
                validator: (v) =>
                    (v == null || v.length < 15) ? 'Enter a 15-char GSTIN' : null),
            _field(_pan, 'PAN', Icons.badge_outlined,
                validator: (v) => (v == null || v.length < 10) ? 'Enter a valid PAN' : null),
            _field(_address, 'Business address', Icons.location_on_outlined,
                maxLines: 3,
                validator: (v) => (v == null || v.isEmpty) ? 'Required' : null),
            const SizedBox(height: AppSpacing.xl),
            _busy
                ? const Center(child: CircularProgressIndicator())
                : ElevatedButton(
                    onPressed: _submit, child: const Text('Create my dealer account')),
          ],
        ),
      ),
    );
  }

  Widget _field(TextEditingController c, String label, IconData icon,
      {int maxLines = 1, String? Function(String?)? validator}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.lg),
      child: TextFormField(
        controller: c,
        maxLines: maxLines,
        textCapitalization: TextCapitalization.characters,
        validator: validator,
        decoration: InputDecoration(labelText: label, prefixIcon: Icon(icon)),
      ),
    );
  }
}

class _StarterBanner extends StatelessWidget {
  const _StarterBanner({required this.points});
  final int points;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        gradient: AppColors.goldGradient,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          const Icon(Icons.card_giftcard, color: Colors.white, size: 34),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('$points welcome points await',
                    style: const TextStyle(
                        color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800)),
                const SizedBox(height: 2),
                Text('You\'re already on your way to Silver.',
                    style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 13)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StarterPointsDialog extends StatelessWidget {
  const _StarterPointsDialog({required this.points});
  final int points;
  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                  gradient: AppColors.goldGradient, shape: BoxShape.circle),
              child: const Icon(Icons.stars_rounded, color: Colors.white, size: 42),
            ),
            const SizedBox(height: AppSpacing.lg),
            Text('Welcome aboard!',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text('We\'ve credited $points starter points to your account.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: AppSpacing.xl),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Let\'s grow'),
            ),
          ],
        ),
      ),
    );
  }
}
