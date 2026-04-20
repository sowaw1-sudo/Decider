import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/option.dart';

class StorageService {
  static const _prefix = 'decider_';

  static Future<List<Option>?> loadOptions(String categoryId) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('$_prefix$categoryId');
    if (raw == null) return null;
    try {
      final list = jsonDecode(raw) as List<dynamic>;
      return list
          .map((e) => Option.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (_) {
      return null;
    }
  }

  static Future<void> saveOptions(
      String categoryId, List<Option> options) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      '$_prefix$categoryId',
      jsonEncode(options.map((o) => o.toJson()).toList()),
    );
  }

  static Future<void> clearOptions(String categoryId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('$_prefix$categoryId');
  }
}
