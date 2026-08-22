import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  StyleProp,
} from 'react-native';

import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

type Variant = 'primary' | 'secondary';
type Radius = 12 | 20 | 30;

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  radius?: Radius;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  radius = 30,
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        { borderRadius: radius }, // radius만 동적으로 적용
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? colors.gray : colors.white}
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel,
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primary: {
    backgroundColor: colors.primary,
    boxShadow: [
      {
        offsetX: 2,
        offsetY: 2,
        blurRadius: 2,
        color: 'rgba(255,102,0,0.3)',
      },
      {
        offsetX: -2,
        offsetY: 4,
        blurRadius: 4,
        color: 'rgba(255,255,255,0.35)',
        inset: true,
      },
    ],
  },

  secondary: {
    backgroundColor: colors.grayBackground,
  },

  disabled: {
    opacity: 0.4,
  },

  label: {
    fontFamily: fonts.jalnan,
  },

  primaryLabel: {
    fontSize: 15,
    color: colors.white,
  },

  secondaryLabel: {
    fontSize: 16,
    color: colors.gray,
  },
});
