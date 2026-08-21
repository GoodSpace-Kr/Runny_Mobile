import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeScreen, Button } from '../../components/common';
import type { RootStackParamList } from '../../navigation/types';
import { Routes } from '../../constants/routes';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'Start'>;

export function StartScreen({ navigation }: Props) {
  return (
    <SafeScreen style={styles.container}>
      <View>
        <Text style={styles.logo}>Runny</Text>
      </View>
      <Button
        style={styles.button}
        label="로그인"
        onPress={() => navigation.navigate(Routes.Login)}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  logo: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.primary,
  },
  button: {
    width: 200,
  },
});
