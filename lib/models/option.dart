import 'package:flutter/material.dart';

class Option {
  final String id;
  final String label;
  final Color color;

  const Option({required this.id, required this.label, required this.color});

  Map<String, dynamic> toJson() => {
        'id': id,
        'label': label,
        'color': color.value,
      };

  factory Option.fromJson(Map<String, dynamic> j) => Option(
        id: j['id'] as String,
        label: j['label'] as String,
        color: Color(j['color'] as int),
      );
}
