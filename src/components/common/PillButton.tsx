import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

type Variant = 'primary' | 'gray';

interface PillButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
}

const GRADIENT_COLORS: Record<Variant, [string, string]> = {
  primary: [colors.primaryGradientTop, colors.primary],
  gray: [colors.grayGradientTop, colors.grayGradientBottom],
};

export function PillButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: PillButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.base, disabled && styles.disabled, style]}
    >
      <LinearGradient colors={GRADIENT_COLORS[variant]} style={styles.fill} />
      <Text style={styles.label}>{label}</Text>
      <View pointerEvents="none" style={styles.innerShadow} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: 59,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    boxShadow: [
      { offsetX: 0, offsetY: 3, blurRadius: 1.5, color: 'rgba(212,83,0,0.15)' },
    ],
  },
  fill: {
    ...StyleSheet.absoluteFill,
    borderRadius: 14,
  },
  innerShadow: {
    ...StyleSheet.absoluteFill,
    borderRadius: 14,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 2,
        blurRadius: 3,
        color: 'rgba(255,255,255,0.45)',
        inset: true,
      },
      {
        offsetX: 0,
        offsetY: -2,
        blurRadius: 4,
        color: 'rgba(0,0,0,0.2)',
        inset: true,
      },
    ],
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontFamily: fonts.gmarketBold,
    fontSize: 10,
    color: colors.white,
  },
});
