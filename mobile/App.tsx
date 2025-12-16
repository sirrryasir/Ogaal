import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Linking } from 'react-native';
import AppNavigator from './src/navigations/AppNavigator';
import { LanguageProvider } from './src/contexts/LanguageContext';

// @ts-ignore
const linking = {
  prefixes: ['exp://192.168.175.130:8081'],
  config: {
    screens: {
      Auth: {
        screens: {
          ResetPassword: '--/reset-password/:token',
        },
      },
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        {/* @ts-ignore */}
        <NavigationContainer linking={linking}>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
