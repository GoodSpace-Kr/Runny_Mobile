import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeScreen } from '../../components/common';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { useAuthStore } from '../../store/authStore';
import { playgroundApi } from '../../api/playground';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';

export function PlaygroundScreen() {
  const { data, setData } = usePlaygroundStore();
  const logout = useAuthStore(s => s.logout);

  useEffect(() => {
    playgroundApi
      .getPlayground()
      .then(setData)
      .catch(() => {});
  }, [setData]);

  return (
    <SafeScreen>
      <View style={styles.topBar}>
        {/* 인증 & 온보딩 확인을 위한 임시 로그아웃 버튼 구현 (완료 시 삭제 예정) */}
        <TouchableOpacity onPress={() => logout()} hitSlop={12}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.placeholder}>놀이터 화면 - 3D 렌더링 영역</Text>
        {data && <Text style={styles.body}>코인: {data.coin}</Text>}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  logoutText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: '#666',
  },
  body: {
    fontFamily: fonts.light,
  },
});
