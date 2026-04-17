import React, { useCallback, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, SafeAreaView, StatusBar, Pressable,
} from 'react-native';
import RouletteWheel, { RouletteRef } from '../components/RouletteWheel';
import SpinButton from '../components/SpinButton';
import ResultModal from '../components/ResultModal';
import CategoryPicker from '../components/CategoryPicker';
import AdBanner from '../components/AdBanner';
import { Category, Option } from '../types';

const { height } = Dimensions.get('window');

interface Props {
  categories: Category[];
  onEditLists: () => void;
}

export default function HomeScreen({ categories, onEditLists }: Props) {
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id ?? '');
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Option | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const wheelRef = useRef<RouletteRef>(null);

  const category = categories.find((c) => c.id === selectedCat) ?? categories[0];
  const options = category?.options ?? [];

  const handleSpin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setModalVisible(false);
    wheelRef.current?.spin();
  }, [spinning]);

  const handleResult = useCallback((option: Option) => {
    setResult(option);
    setSpinning(false);
    setTimeout(() => setModalVisible(true), 300);
  }, []);

  const handleSpinAgain = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => handleSpin(), 400);
  }, [handleSpin]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
      <View style={styles.header}>
        <Text style={styles.title}>Decider</Text>
        <Pressable onPress={onEditLists} style={styles.editBtn}>
          <Text style={styles.editBtnText}>Lists</Text>
        </Pressable>
      </View>

      <View style={styles.pickerWrap}>
        <CategoryPicker
          categories={categories}
          selected={selectedCat}
          onSelect={setSelectedCat}
        />
      </View>

      <View style={styles.wheelWrap}>
        <RouletteWheel ref={wheelRef} options={options} onResult={handleResult} />
      </View>

      <View style={styles.btnWrap}>
        <SpinButton onPress={handleSpin} disabled={spinning || options.length < 2} />
        <Text style={styles.hint}>
          {options.length < 2 ? 'Add at least 2 options' : `${options.length} options`}
        </Text>
      </View>

      <AdBanner />

      <ResultModal
        option={result}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSpin={handleSpinAgain}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  editBtn: {
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2a2a4a',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  editBtnText: {
    color: '#7C5CBF',
    fontWeight: '700',
    fontSize: 14,
  },
  pickerWrap: {
    marginBottom: 12,
  },
  wheelWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  btnWrap: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  hint: {
    color: '#555',
    fontSize: 13,
  },
});
