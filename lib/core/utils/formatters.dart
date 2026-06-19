import 'package:intl/intl.dart';

final _inr = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
final _compact = NumberFormat.decimalPattern('en_IN');

String formatInr(num value) => _inr.format(value);

String formatPoints(num value) => _compact.format(value);

String formatDate(DateTime d) => DateFormat('d MMM yyyy').format(d);

String formatDateTime(DateTime d) => DateFormat('d MMM, h:mm a').format(d);

/// "in 2 days", "today", "3 days ago" — friendly relative ETA copy.
String relativeDays(DateTime target) {
  final now = DateTime.now();
  final diff = DateTime(target.year, target.month, target.day)
      .difference(DateTime(now.year, now.month, now.day))
      .inDays;
  if (diff == 0) return 'today';
  if (diff == 1) return 'tomorrow';
  if (diff > 1) return 'in $diff days';
  if (diff == -1) return 'yesterday';
  return '${-diff} days ago';
}
