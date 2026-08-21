import React, {useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuthStore} from '../store/authStore';
import {colors} from '../constants/colors';
import {Routes} from '../constants/routes';
import type {RootStackParamList} from './types';
import {StartScreen} from '../screens/auth/StartScreen';
import {LoginScreen} from '../screens/auth/LoginScreen';
import {PlaygroundScreen} from '../screens/playground/PlaygroundScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const {isAuthenticated, isHydrated, hydrate} = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          <Stack.Screen name={Routes.Playground} component={PlaygroundScreen} />
        ) : (
          <>
            <Stack.Screen name={Routes.Start} component={StartScreen} />
            <Stack.Screen name={Routes.Login} component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
