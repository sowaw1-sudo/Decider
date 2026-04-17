import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Text as SvgText, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Option } from '../types';

const { width } = Dimensions.get('window');
const SIZE = Math.min(width - 32, 360);
const R = SIZE / 2;
const CX = R;
const CY = R;

export interface RouletteRef {
  spin: () => void;
}

interface Props {
  options: Option[];
  onResult: (option: Option) => void;
}

function polarXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarXY(cx, cy, r, startDeg);
  const e = polarXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M${cx},${cy} L${s.x},${s.y} A${r},${r},0,${large},1,${e.x},${e.y} Z`;
}

const WheelSVG = React.memo(({ options }: { options: Option[] }) => {
  const count = options.length;
  const deg = 360 / count;

  return (
    <Svg width={SIZE} height={SIZE}>
      {options.map((opt, i) => {
        const start = i * deg;
        const end = start + deg;
        const mid = start + deg / 2;
        const { x: tx, y: ty } = polarXY(CX, CY, R * 0.65, mid);
        const path = slicePath(CX, CY, R - 3, start, end);
        const textAngle = mid - 90;

        return (
          <G key={opt.id}>
            <Path d={path} fill={opt.color} />
            <Path d={path} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth={1} />
            <SvgText
              x={tx}
              y={ty}
              fill="#fff"
              fontSize={count > 8 ? 11 : 13}
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(${textAngle}, ${tx}, ${ty})`}
            >
              {opt.label.length > 10 ? opt.label.slice(0, 9) + '…' : opt.label}
            </SvgText>
          </G>
        );
      })}
      {/* Decorative rings */}
      <Circle cx={CX} cy={CY} r={R - 3} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
      {/* Hub */}
      <Circle cx={CX} cy={CY} r={28} fill="#1A1A2E" />
      <Circle cx={CX} cy={CY} r={22} fill="#16213E" />
      <Circle cx={CX} cy={CY} r={14} fill="#7C5CBF" />
      <Circle cx={CX} cy={CY} r={6} fill="#fff" />
    </Svg>
  );
});

const AnimatedView = Animated.View;

const RouletteWheel = forwardRef<RouletteRef, Props>(({ options, onResult }, ref) => {
  const rotation = useSharedValue(0);
  const spinning = useSharedValue(false);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const getResult = useCallback(
    (rot: number) => {
      const count = options.length;
      const sliceDeg = 360 / count;
      const normalized = ((rot % 360) + 360) % 360;
      const selected = (360 - normalized + 360) % 360;
      const index = Math.floor(selected / sliceDeg) % count;
      return options[index];
    },
    [options]
  );

  const onSpinEnd = useCallback(
    (rot: number) => {
      spinning.value = false;
      const result = getResult(rot);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onResult(result);
    },
    [getResult, onResult]
  );

  const spin = useCallback(() => {
    if (spinning.value) return;
    spinning.value = true;
    const extraSpins = 5 + Math.random() * 5;
    const extraDeg = Math.random() * 360;
    const totalDeg = rotation.value + extraSpins * 360 + extraDeg;

    rotation.value = withTiming(
      totalDeg,
      { duration: 4000 + Math.random() * 1500, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(onSpinEnd)(totalDeg % 360);
      }
    );
  }, [rotation, spinning, onSpinEnd]);

  useImperativeHandle(ref, () => ({ spin }));

  const lastTick = useSharedValue(0);
  useAnimatedReaction(
    () => Math.floor(rotation.value / 30),
    (curr, prev) => {
      if (curr !== prev && spinning.value) {
        runOnJS(triggerHaptic)();
      }
    }
  );

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (!options.length) return null;

  return (
    <View style={styles.container}>
      {/* Outer decorative ring */}
      <View style={styles.outerRing} />
      {/* Pointer */}
      <View style={styles.pointerShadow} />
      <View style={styles.pointer} />

      <AnimatedView style={[styles.wheel, animStyle]}>
        <WheelSVG options={options} />
      </AnimatedView>
    </View>
  );
});

export default RouletteWheel;

const styles = StyleSheet.create({
  container: {
    width: SIZE + 16,
    height: SIZE + 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheel: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: 'hidden',
    shadowColor: '#7C5CBF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 24,
  },
  outerRing: {
    position: 'absolute',
    width: SIZE + 12,
    height: SIZE + 12,
    borderRadius: (SIZE + 12) / 2,
    borderWidth: 3,
    borderColor: 'rgba(124,92,191,0.4)',
  },
  pointer: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF6B6B',
  },
  pointerShadow: {
    position: 'absolute',
    top: -1,
    zIndex: 9,
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(0,0,0,0.4)',
  },
});
