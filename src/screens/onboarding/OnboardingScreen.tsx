import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeScreen} from '../../components/common';
import {fonts} from '../../constants/fonts';

export function OnboardingScreen() {
  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text style={styles.title}>온보딩 화면</Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
  },
});
