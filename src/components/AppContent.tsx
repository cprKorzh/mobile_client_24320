import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {NavigationContainer, DarkTheme, DefaultTheme} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {observer} from 'mobx-react-lite';
import {useStores} from '../stores/StoreContext';
import {useColorScheme} from '../hooks/useColorScheme';
import {RootNavigator} from '../navigation/RootNavigator';
import {LoginScreen} from '../screens/LoginScreen';

export const AppContent: React.FC = observer(() => {
    const {authStore} = useStores();
    const colorScheme = useColorScheme();

    return (
        <SafeAreaProvider>
            <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
                {/* Временно показываем RootNavigator для всех пользователей */}
                <RootNavigator />
                {/* {authStore.isAuthenticated ? <RootNavigator /> : <LoginScreen />} */}
            </NavigationContainer>
        </SafeAreaProvider>
    );
});
