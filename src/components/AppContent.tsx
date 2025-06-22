import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreContext';
import { useColorScheme } from '../hooks/useColorScheme';
import { RootNavigator } from '../navigation/RootNavigator';
import { LoginScreen } from '../screens/LoginScreen';
import { CustomSplashScreen } from './SplashScreen';

export const AppContent: React.FC = observer(() => {
  const { authStore } = useStores();
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await authStore.initialize();
        // Минимальное время показа splash screen
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Error during app preparation:', e);
      } finally {
        setIsLoading(false);
      }
    }

    prepare();
  }, [authStore]);

  const handleSplashFinish = () => {
    setAppIsReady(true);
  };

  // Показываем splash screen пока приложение загружается или splash screen активен
  if (isLoading || !appIsReady) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        {authStore.isAuthenticated ? <RootNavigator /> : <LoginScreen />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
});
