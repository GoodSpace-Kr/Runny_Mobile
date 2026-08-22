import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SafeScreen, Button, ConfirmModal } from '../../components/common';

import type { RootStackParamList } from '../../navigation/types';
import { Routes } from '../../constants/routes';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'Start'>;

type ModalType =
  | 'single'
  | 'doubleDescription'
  | 'doubleButton'
  | 'image'
  | 'extraContent'
  | null;

export function StartScreen({ navigation }: Props) {
  const [modalType, setModalType] = useState<ModalType>(null);

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.logo}>Runny</Text>

      <View style={styles.buttonGroup}>
        <Button
          style={styles.button}
          label="로그인"
          onPress={() => navigation.navigate(Routes.Login)}
        />

        {/* 모달 ui 확인용 (인증 + 온보딩 작업 완료 시 삭제 예정) */}
        <Button
          style={styles.button}
          label="기본 모달"
          radius={20}
          onPress={() => setModalType('single')}
        />

        <Button
          style={styles.button}
          label="문구 2개 + 버튼 2개"
          radius={20}
          onPress={() => setModalType('doubleButton')}
        />

        <Button
          style={styles.button}
          label="이미지 모달"
          radius={20}
          onPress={() => setModalType('image')}
        />

        <Button
          style={styles.button}
          label="추가 콘텐츠"
          radius={20}
          onPress={() => setModalType('extraContent')}
        />
      </View>

      {/* 기본 */}
      <ConfirmModal
        visible={modalType === 'single'}
        onClose={closeModal}
        description="이메일이 확인되었습니다."
        primaryLabel="확인"
        onPrimaryPress={closeModal}
        dismissOnBackdropPress // 모달 바깥 클릭으로 닫히게 하려면 이거 꼭 추가하시길
      />

      {/* 설명 문구 2개 + 버튼 2개  */}
      <ConfirmModal
        visible={modalType === 'doubleButton'}
        onClose={closeModal}
        description="요청을 거절하시겠어요?"
        subDescription="상대방이 다시 요청을 보낼 수 있습니다."
        primaryLabel="네"
        onPrimaryPress={closeModal}
        secondaryLabel="아니요"
        onSecondaryPress={closeModal}
      />

      {/* 상단 이미지 + display 제목 */}
      <ConfirmModal
        visible={modalType === 'image'}
        onClose={closeModal}
        title={'러니에\n오신 걸 환영해요!'}
        extraContent={
          <Text style={styles.welcomText}>
            함께하기 전에 몇 가지만 알려주시면 바로 시작할 수 있어요.
          </Text>
        }
        primaryLabel="알려줄게요"
        onPrimaryPress={closeModal}
        image={
          <Image
            source={require('../../assets/welcome-dog.png')}
            style={styles.modalImage}
          />
        }
      />

      {/* 설명 + extraContent */}
      <ConfirmModal
        visible={modalType === 'extraContent'}
        onClose={closeModal}
        description="회원 탈퇴가 완료되었습니다."
        subDescription="루니가 다시 기다리고 있을게요."
        primaryLabel="확인"
        onPrimaryPress={closeModal}
        extraContent={
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              탈퇴 고객의 개인정보는 관련 법령에 따라 일정 기간 안전하게
              보관되며, 그 이후 자동 파기됩니다.
            </Text>

            <Text style={styles.noticeText}>
              또한 탈퇴 후 재가입 시, 이용 내역은 복구되지 않습니다.
            </Text>
          </View>
        }
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },

  logo: {
    fontFamily: fonts.jalnan,
    fontSize: 40,
    color: colors.primary,
    marginBottom: 32,
  },

  buttonGroup: {
    width: '100%',
    gap: 12,
  },

  button: {
    width: '100%',
  },

  modalImage: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },

  welcomText: {
    marginTop: 10,
    fontFamily: fonts.pretendardMedium,
    fontSize: 14,
    lineHeight: 22,
    color: '#7C8391',
    textAlign: 'center',
  },

  noticeBox: {
    gap: 6,
    backgroundColor: '#F5F5F7',
    marginTop: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  noticeText: {
    fontFamily: fonts.pretendardRegular,
    fontSize: 12,
    lineHeight: 22,
    color: '#7C8391',
  },
});
