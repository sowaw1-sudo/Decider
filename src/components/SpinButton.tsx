import React, { useCallback } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  onPress: () => void;
  disabled?: boolean;
}

const AnimPressable = Animated.createAnimatedComponent(Pressable);

export default function SpinButton({ onPress, disabled }: Props) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.94, { damping: 10, stiffness: 300 });
  }, []);
  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  }, []);

  return (
    <AnimPressable
      style={[styles.btn, animStyle, disabled && styles.disabled]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <Text style={styles.label}>SPIN</Text>
    </AnimPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#7C5CBF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C5CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
  },
});
