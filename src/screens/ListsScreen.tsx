import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar, Pressable,
  ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Category, Option } from '../types';

const PALETTE = [
  '#FF6B6B', '#FF8E53', '#FFC300', '#2ECC71',
  '#1ABC9C', '#3498DB', '#9B59B6', '#E91E63',
  '#FF5722', '#00BCD4', '#8BC34A', '#FF9800',
];

interface Props {
  categories: Category[];
  onSave: (cats: Category[]) => void;
  onBack: () => void;
}

let idCounter = 10000;
const uid = () => String(++idCounter);

export default function ListsScreen({ categories, onSave, onBack }: Props) {
  const [cats, setCats] = useState<Category[]>(categories);
  const [selectedCat, setSelectedCat] = useState(cats[0]?.id ?? '');
  const [newOption, setNewOption] = useState('');
  const [newCat, setNewCat] = useState('');

  const category = cats.find((c) => c.id === selectedCat);

  const addOption = useCallback(() => {
    const label = newOption.trim();
    if (!label) return;
    setCats((prev) =>
      prev.map((c) =>
        c.id === selectedCat
          ? {
              ...c,
              options: [
                ...c.options,
                { id: uid(), label, color: PALETTE[c.options.length % PALETTE.length] },
              ],
            }
          : c
      )
    );
    setNewOption('');
  }, [newOption, selectedCat]);

  const removeOption = useCallback((optId: string) => {
    setCats((prev) =>
      prev.map((c) =>
        c.id === selectedCat
          ? { ...c, options: c.options.filter((o) => o.id !== optId) }
          : c
      )
    );
  }, [selectedCat]);

  const addCategory = useCallback(() => {
    const name = newCat.trim();
    if (!name) return;
    const id = uid();
    setCats((prev) => [...prev, { id, name, icon: '🎲', options: [] }]);
    setSelectedCat(id);
    setNewCat('');
  }, [newCat]);

  const removeCategory = useCallback((id: string) => {
    Alert.alert('Delete list?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => {
          setCats((prev) => prev.filter((c) => c.id !== id));
          setSelectedCat(cats[0]?.id ?? '');
        },
      },
    ]);
  }, [cats]);

  const handleSave = useCallback(() => {
    onSave(cats);
    onBack();
  }, [cats, onSave, onBack]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={onBack}>
            <Text style={styles.back}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>My Lists</Text>
          <Pressable onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>
        </View>

        {/* Category tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsWrap} contentContainerStyle={styles.tabs}>
          {cats.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.tab, c.id === selectedCat && styles.tabActive]}
              onPress={() => setSelectedCat(c.id)}
              onLongPress={() => removeCategory(c.id)}
            >
              <Text style={styles.tabIcon}>{c.icon}</Text>
              <Text style={[styles.tabLabel, c.id === selectedCat && styles.tabLabelActive]}>
                {c.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* New category input */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="New list name..."
            placeholderTextColor="#555"
            value={newCat}
            onChangeText={setNewCat}
            onSubmitEditing={addCategory}
            returnKeyType="done"
          />
          <Pressable style={styles.addBtn} onPress={addCategory}>
            <Text style={styles.addBtnText}>+ List</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* Options for selected category */}
        <ScrollView style={styles.optionsList} contentContainerStyle={styles.optionsContent}>
          {category?.options.map((opt) => (
            <View key={opt.id} style={styles.optionRow}>
              <View style={[styles.dot, { backgroundColor: opt.color }]} />
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Pressable onPress={() => removeOption(opt.id)} style={styles.removeBtn}>
                <Text style={styles.removeBtnText}>✕</Text>
              </Pressable>
            </View>
          ))}
          {(!category || category.options.length === 0) && (
            <Text style={styles.emptyText}>No options yet. Add some below.</Text>
          )}
        </ScrollView>

        {/* New option input */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Add an option..."
            placeholderTextColor="#555"
            value={newOption}
            onChangeText={setNewOption}
            onSubmitEditing={addOption}
            returnKeyType="done"
          />
          <Pressable style={[styles.addBtn, { backgroundColor: '#7C5CBF' }]} onPress={addOption}>
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D0D1A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  back: { color: '#7C5CBF', fontSize: 16, fontWeight: '600' },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  saveBtn: {
    backgroundColor: '#7C5CBF',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  tabsWrap: { maxHeight: 56 },
  tabs: { paddingHorizontal: 16, gap: 8, paddingVertical: 8 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  tabActive: { backgroundColor: '#7C5CBF', borderColor: '#7C5CBF' },
  tabIcon: { fontSize: 14 },
  tabLabel: { color: '#888', fontSize: 13, fontWeight: '600' },
  tabLabelActive: { color: '#fff' },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2a2a4a',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 14,
    height: 44,
  },
  addBtn: {
    backgroundColor: '#2a2a4a',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#1a1a2e', marginHorizontal: 16 },
  optionsList: { flex: 1 },
  optionsContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20, gap: 4 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13131F',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#1e1e30',
  },
  dot: { width: 12, height: 12, borderRadius: 6 },
  optionLabel: { flex: 1, color: '#ddd', fontSize: 15 },
  removeBtn: { padding: 4 },
  removeBtnText: { color: '#555', fontSize: 16 },
  emptyText: { color: '#444', textAlign: 'center', paddingTop: 40, fontSize: 14 },
});
