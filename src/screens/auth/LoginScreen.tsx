import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeScreen, Button, TextInput } from '../../components/common';
import type { RootStackParamList } from '../../navigation/types';
import { authApi } from '../../api/auth';
import { ApiError } from '../../utils/apiClient';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const setAuth = useAuthStore(s => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.length > 0 && password.length > 0 && !loading;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const result = await authApi.login(email, password);
      await setAuth(result);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>Runny</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>다시 만나서 반가워요!</Text>
        <TextInput
          label="이메일"
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          label="비밀번호"
          placeholder="password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error && <Text style={styles.error}>{error}</Text>}

        <Button
          label="로그인"
          onPress={handleLogin}
          disabled={!canSubmit}
          loading={loading}
          style={styles.loginButton}
        />

        <Text style={styles.forgotPassword}>비밀번호를 잊어버렸어요.</Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  header: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  back: {
    fontSize: 50,
    color: colors.text,
  },
  logo: {
    fontFamily: fonts.jalnan,
    fontSize: 24,
    color: colors.primary,
  },
  title: {
    marginTop: 40,
    fontFamily: fonts.jalnan,
    fontSize: 20,
    color: colors.text,
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 32,
    gap: 20,
  },
  error: {
    marginTop: 16,
    fontFamily: fonts.pretendardMedium,
    fontSize: 13,
    color: colors.error,
  },
  loginButton: {
    marginTop: 48,
  },
  forgotPassword: {
    marginTop: 16,
    alignSelf: 'center',
    fontFamily: fonts.gmarketMedium,
    fontSize: 13,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
