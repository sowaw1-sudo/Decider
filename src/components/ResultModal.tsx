import React, { useEffect } from 'react';
import {
  Modal, View, Text, Pressable, StyleSheet, Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming,
} from 'react-native-reanimated';
import { Option } from '../types';

const { width } = Dimensions.get('window');

interface Props {
  option: Option | null;
  visible: boolean;
  onClose: () => void;
  onSpin: () => void;
}

export default function ResultModal({ option, visible, onClose, onSpin }: Props) {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withSpring(1.1, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 14, stiffness: 300 })
      );
    } else {
      scale.value = 0.4;
      opacity.value = 0;
    }
  }, [visible]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!option) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View style={[styles.card, cardStyle]} onStartShouldSetResponder={() => true}>
          <View style={[styles.colorBand, { backgroundColor: option.color }]} />
          <Text style={styles.fate}>The Decider says...</Text>
          <Text style={styles.result}>{option.label}</Text>
          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.btnOutline]} onPress={onClose}>
              <Text style={[styles.btnText, { color: '#aaa' }]}>Dismiss</Text>
            </Pressable>
            <Pressable style={[styles.btn, { backgroundColor: '#7C5CBF' }]} onPress={onSpin}>
              <Text style={styles.btnText}>Spin Again</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width - 48,
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  colorBand: {
    height: 8,
    width: '100%',
  },
  fate: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 28,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  result: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#333',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
