import 'option.dart';

class Category {
  final String id;
  final String name;
  final String emoji;
  final List<Option> defaultOptions;

  const Category({
    required this.id,
    required this.name,
    required this.emoji,
    required this.defaultOptions,
  });
}
