import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/router/app_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../data/repositories/repositories.dart';
import '../../state/session_controller.dart';

/// Phone + OTP login. The OTP step is simulated by [MockAuthRepository]; with
/// Firebase Auth phone sign-in this maps 1:1 (verificationId + SMS code).
class OtpLoginScreen extends StatefulWidget {
  const OtpLoginScreen({super.key});

  @override
  State<OtpLoginScreen> createState() => _OtpLoginScreenState();
}

class _OtpLoginScreenState extends State<OtpLoginScreen> {
  final _phone = TextEditingController();
  final _otp = TextEditingController();
  String? _verificationId;
  bool _busy = false;

  bool get _otpStage => _verificationId != null;

  @override
  void dispose() {
    _phone.dispose();
    _otp.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    if (_phone.text.trim().length < 10) {
      _toast('Enter a valid 10-digit mobile number');
      return;
    }
    setState(() => _busy = true);
    final id = await context.read<AuthRepository>().requestOtp(_phone.text.trim());
    if (!mounted) return;
    setState(() {
      _verificationId = id;
      _busy = false;
    });
    _toast('OTP sent. Use any 6 digits for the demo.');
  }

  Future<void> _verify() async {
    if (_otp.text.trim().length < 4) {
      _toast('Enter the 6-digit OTP');
      return;
    }
    setState(() => _busy = true);
    final exists =
        await context.read<AuthRepository>().verifyOtp(_verificationId!, _otp.text.trim());
    if (!mounted) return;
    if (exists) {
      await context.read<SessionController>().load();
      if (!mounted) return;
      context.go(Routes.dashboard);
    } else {
      context.go(Routes.onboarding);
    }
  }

  void _toast(String m) =>
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(m)));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.xl),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 12),
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  gradient: AppColors.heroGradient,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Icon(Icons.chair_rounded, color: Colors.white, size: 34),
              ),
              const SizedBox(height: AppSpacing.xl),
              Text(_otpStage ? 'Verify your number' : 'Welcome to SGF Shakti',
                  style: Theme.of(context).textTheme.displaySmall),
              const SizedBox(height: 8),
              Text(
                _otpStage
                    ? 'Enter the 6-digit code sent to ${_phone.text}'
                    : 'Grow your business. Earn points. Unlock rewards.',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: AppSpacing.xxl),
              if (!_otpStage) ...[
                TextField(
                  controller: _phone,
                  keyboardType: TextInputType.phone,
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(10),
                  ],
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.phone_outlined),
                    prefixText: '+91  ',
                    hintText: 'Mobile number',
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),
                _busy
                    ? const Center(child: CircularProgressIndicator())
                    : ElevatedButton(onPressed: _sendOtp, child: const Text('Send OTP')),
              ] else ...[
                TextField(
                  controller: _otp,
                  keyboardType: TextInputType.number,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                      fontSize: 26, fontWeight: FontWeight.w700, letterSpacing: 12),
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(6),
                  ],
                  decoration: const InputDecoration(hintText: '••••••'),
                ),
                const SizedBox(height: AppSpacing.xl),
                _busy
                    ? const Center(child: CircularProgressIndicator())
                    : ElevatedButton(onPressed: _verify, child: const Text('Verify & Continue')),
                const SizedBox(height: AppSpacing.md),
                Center(
                  child: TextButton(
                    onPressed: _busy ? null : () => setState(() => _verificationId = null),
                    child: const Text('Change number'),
                  ),
                ),
              ],
              const SizedBox(height: AppSpacing.xxl),
              Center(
                child: Text(
                  'By continuing you agree to the Dealer Program terms.',
                  style: Theme.of(context).textTheme.bodySmall,
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
