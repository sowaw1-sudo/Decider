import 'package:flutter/material.dart';
import '../models/option.dart';
import '../models/category.dart';

const _palette = [
  Color(0xFFFF6B6B), Color(0xFFFFD93D), Color(0xFF6BCB77),
  Color(0xFF4D96FF), Color(0xFFFF922B), Color(0xFFCC5DE8),
  Color(0xFF20C997), Color(0xFFF06595), Color(0xFF74C0FC),
  Color(0xFFA9E34B), Color(0xFFFF8787), Color(0xFF63E6BE),
];

List<Option> _opts(String prefix, List<String> labels) => [
      for (var i = 0; i < labels.length; i++)
        Option(
          id: '$prefix$i',
          label: labels[i],
          color: _palette[i % _palette.length],
        ),
    ];

final curatedCategories = <Category>[
  Category(
    id: 'restaurants',
    name: 'Restaurants',
    emoji: '🍽️',
    defaultOptions: _opts('r', [
      'Italian', 'Sushi', 'Tacos', 'Ramen', 'Burgers',
      'Pizza', 'Thai', 'Indian', 'Greek', 'BBQ',
    ]),
  ),
  Category(
    id: 'movies',
    name: 'Movies',
    emoji: '🎬',
    defaultOptions: _opts('m', [
      'Action', 'Comedy', 'Horror', 'Drama', 'Sci-Fi',
      'Romance', 'Thriller', 'Animation', 'Documentary', 'Fantasy',
    ]),
  ),
  Category(
    id: 'outfits',
    name: 'Outfits',
    emoji: '👗',
    defaultOptions: _opts('o', [
      'Casual', 'Formal', 'Smart Casual', 'Athletic', 'Bohemian',
      'Minimalist', 'Vintage', 'Streetwear', 'Beach', 'Business',
    ]),
  ),
  Category(
    id: 'activities',
    name: 'Activities',
    emoji: '🎯',
    defaultOptions: _opts('a', [
      'Hiking', 'Movie Night', 'Board Games', 'Cooking', 'Museum',
      'Cycling', 'Reading', 'Yoga', 'Picnic', 'Concert',
    ]),
  ),
];
