import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import * as SplashScreen from 'expo-splash-screen';
import { useStores } from '../stores/StoreContext';
import { useColorScheme } from '../hooks/useColorScheme';
import { RootNavigator } from '../navigation/RootNavigator';
import { LoginScreen } from '../screens/LoginScreen';
import { CustomSplashScreen } from './SplashScreen';

// Предотвращаем автоматическое скрытие splash screen
SplashScreen.preventAutoHideAsync();

export const AppContent: React.FC = observer(() => {
  const { authStore } = useStores();
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Здесь можно добавить инициализацию данных
        // await authStore.initialize();
        // await loadFonts();
        // await loadAssets();
        
        // Имитация загрузки
        await new Promise(resolve => setTimeout(resolve, 300000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (!appIsReady && isLoading) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        {/* Временно показываем RootNavigator для всех пользователей */}
        <RootNavigator />
        {/* {authStore.isAuthenticated ? <RootNavigator /> : <LoginScreen />} */}
      </NavigationContainer>
    </SafeAreaProvider>
  );
});
