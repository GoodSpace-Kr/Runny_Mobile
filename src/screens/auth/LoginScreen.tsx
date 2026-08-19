import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeScreen, Button, TextInput} from '../../components/common';

export function LoginScreen() {
  return (
    <SafeScreen style={styles.container}>
      <TextInput label="이메일" placeholder="이메일을 입력하세요" keyboardType="email-address" />
      <TextInput label="비밀번호" placeholder="비밀번호를 입력하세요" secureTextEntry />
      <Button label="로그인" onPress={() => {}} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
});
