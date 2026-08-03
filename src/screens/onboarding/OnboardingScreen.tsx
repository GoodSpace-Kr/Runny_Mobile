import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeScreen} from '../../components/common';

export function OnboardingScreen() {
  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text>온보딩 화면</Text>
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
});
