import { Category } from '../types';

const PALETTE = [
  '#FF6B6B', '#FF8E53', '#FFC300', '#2ECC71',
  '#1ABC9C', '#3498DB', '#9B59B6', '#E91E63',
  '#FF5722', '#00BCD4', '#8BC34A', '#FF9800',
];

function coloredOptions(labels: string[]) {
  return labels.map((label, i) => ({
    id: `${i}`,
    label,
    color: PALETTE[i % PALETTE.length],
  }));
}

export const CURATED: Category[] = [
  {
    id: 'restaurants',
    name: 'Restaurants',
    icon: '🍽️',
    options: coloredOptions([
      'Italian', 'Sushi', 'Mexican', 'Thai', 'Burgers',
      'Indian', 'Chinese', 'Pizza', 'Greek', 'Korean',
    ]),
  },
  {
    id: 'movies',
    name: 'Movies',
    icon: '🎬',
    options: coloredOptions([
      'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
      'Romance', 'Documentary', 'Animation', 'Thriller', 'Fantasy',
    ]),
  },
  {
    id: 'outfits',
    name: 'Outfits',
    icon: '👗',
    options: coloredOptions([
      'Casual', 'Business', 'Sporty', 'Formal', 'Streetwear',
      'Boho', 'Minimalist', 'Preppy', 'Vintage', 'Smart Casual',
    ]),
  },
  {
    id: 'activities',
    name: 'Activities',
    icon: '🎯',
    options: coloredOptions([
      'Walk in the park', 'Game night', 'Cook together',
      'Watch a show', 'Go shopping', 'Hit the gym',
      'Call a friend', 'Read a book', 'Meditate', 'Try something new',
    ]),
  },
];
