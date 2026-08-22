import React, { type ReactNode } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  type TextStyle,
  type ViewStyle,
  StyleProp,
} from 'react-native';

import { Button } from './Button';
import { fonts } from '../../constants/fonts';

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;

  title?: string;

  // 설명 문구
  description?: string;
  subDescription?: string;

  // 추가 UI 콘텐츠
  extraContent?: ReactNode;

  // 상단 이미지
  image?: ReactNode;

  // Primary 버튼
  primaryLabel: string;
  onPrimaryPress: () => void;

  // Secondary 버튼
  secondaryLabel?: string;
  onSecondaryPress?: () => void;

  // 모달 외부 영역 터치하여 닫기
  dismissOnBackdropPress?: boolean;

  // 예외적인 경우 스타일 덮어쓰기
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

export function ConfirmModal({
  visible,
  onClose,
  title,
  description,
  subDescription,
  extraContent,
  image,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
  dismissOnBackdropPress = false,
  containerStyle,
  titleStyle,
}: ConfirmModalProps) {
  const hasSecondaryButton = !!secondaryLabel && !!onSecondaryPress;

  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
        />

        <View
          style={[
            styles.modal,
            !!image && styles.modalWithImage,
            containerStyle,
          ]}
        >
          {/* 상단 이미지 */}
          {image && <View style={styles.imageContainer}>{image}</View>}

          {/* 제목 (온보딩용) */}
          <Text style={[styles.title, titleStyle]}>{title}</Text>

          {/* 설명 문구 영역 */}
          {(description || subDescription) && (
            <View style={styles.descriptionContainer}>
              {description && (
                <Text style={styles.description}>{description}</Text>
              )}

              {subDescription && (
                <Text style={styles.subDescription}>{subDescription}</Text>
              )}
            </View>
          )}

          {extraContent && (
            <View style={styles.extraContent}>{extraContent}</View>
          )}

          {/* 버튼 영역 */}
          <View
            style={[
              styles.buttonContainer,
              hasSecondaryButton && styles.doubleButtonContainer,
            ]}
          >
            {hasSecondaryButton && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onSecondaryPress}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonLabel}>
                  {secondaryLabel}
                </Text>
              </TouchableOpacity>
            )}

            <Button
              label={primaryLabel}
              onPress={onPrimaryPress}
              variant="primary"
              radius={20}
              style={[hasSecondaryButton && styles.primaryButton]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  modal: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingBottom: 24,
  },

  modalWithImage: {
    paddingTop: 40,
  },

  imageContainer: {
    position: 'absolute',
    top: -120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  title: {
    fontFamily: fonts.jalnan,
    fontSize: 18,
    lineHeight: 30,
    color: '#1E1E1E',
    textAlign: 'center',
  },

  descriptionContainer: {
    width: '100%',
    marginTop: 14,
  },

  description: {
    fontFamily: fonts.pretendardSemiBold,
    fontSize: 16,
    lineHeight: 24,
    color: '#1E1E1E',
    textAlign: 'center',
  },

  subDescription: {
    marginTop: 8,
    fontFamily: fonts.pretendardSemiBold,
    fontSize: 13,
    lineHeight: 20,
    color: '#1E1E1E',
    textAlign: 'center',
  },

  extraContent: {
    width: '100%',
  },

  buttonContainer: {
    width: '100%',
    marginTop: 28,
  },

  doubleButtonContainer: {
    flexDirection: 'row',
    gap: 16,
  },

  primaryButton: {
    flex: 1,
  },

  secondaryButton: {
    flex: 1,
    height: 55,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 2,
        blurRadius: 4,
        color: 'rgba(0,0,0,0.12)',
      },
    ],
  },

  secondaryButtonLabel: {
    fontFamily: fonts.jalnan,
    fontSize: 16,
    color: '#1E1E1E',
  },
});
