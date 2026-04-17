import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { Category } from '../types';

interface Props {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function CategoryPicker({ categories, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((cat) => (
        <Pressable
          key={cat.id}
          style={[styles.chip, cat.id === selected && styles.chipActive]}
          onPress={() => onSelect(cat.id)}
        >
          <Text style={styles.icon}>{cat.icon}</Text>
          <Text style={[styles.label, cat.id === selected && styles.labelActive]}>
            {cat.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  chipActive: {
    backgroundColor: '#7C5CBF',
    borderColor: '#7C5CBF',
  },
  icon: { fontSize: 16 },
  label: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  labelActive: {
    color: '#fff',
  },
});
