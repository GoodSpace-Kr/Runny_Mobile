import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuthStore} from '../store/authStore';

// TODO: react-navigation 설치 후 타입 정의 및 스택/탭 구성 완성

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const {isAuthenticated, onboardingStatus} = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          // Auth 스택
          <Stack.Screen name="Login" component={require('../screens/auth/LoginScreen').LoginScreen} />
        ) : onboardingStatus !== 'COMPLETED' ? (
          // 온보딩 스택
          <Stack.Screen name="Onboarding" component={require('../screens/onboarding/OnboardingScreen').OnboardingScreen} />
        ) : (
          // 메인 스택
          <Stack.Screen name="Main" component={require('../screens/playground/PlaygroundScreen').PlaygroundScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
