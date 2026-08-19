import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeScreen} from '../../components/common';
import {usePlaygroundStore} from '../../store/playgroundStore';
import {playgroundApi} from '../../api/playground';
import {fonts} from '../../constants/fonts';

export function PlaygroundScreen() {
  const {data, setData} = usePlaygroundStore();

  useEffect(() => {
    playgroundApi.getPlayground().then(setData).catch(() => {});
  }, [setData]);

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text style={styles.placeholder}>놀이터 화면 - 3D 렌더링 영역</Text>
        {data && <Text style={styles.body}>코인: {data.coin}</Text>}
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
  placeholder: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: '#666',
  },
  body: {
    fontFamily: fonts.light,
  },
});
