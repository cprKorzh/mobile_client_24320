import {Platform} from 'react-native';
import {
    API_HOST,
    API_PORT,
    API_PROTOCOL,
    API_HOST_IOS,
    API_HOST_WEB
} from '@env';

// Функция для получения правильного хоста в зависимости от платформы
const getApiHost = (): string => {
    if (__DEV__) {
        switch (Platform.OS) {
            case 'android':
                return API_HOST; // Android эмулятор
            case 'ios':
                return API_HOST_IOS; // iOS симулятор
            case 'web':
                return API_HOST_WEB; // Web
            default:
                return API_HOST;
        }
    } else {
        // В production используем основной хост
        return API_HOST;
    }
};

export const API_CONFIG = {
    PROTOCOL: API_PROTOCOL,
    HOST: getApiHost(),
    PORT: API_PORT,
    get BASE_URL() {
        return `${this.PROTOCOL}://${this.HOST}:${this.PORT}/api`;
    },
    TIMEOUT: 10000,
};

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    USER_DATA: 'userData',
};

export const COLORS = {
    primary: '#FC094C',
    secondary: '#03dac6',
    error: '#b00020',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
};
