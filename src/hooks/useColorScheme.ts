import {useColorScheme as _useColorScheme} from 'react-native';

// Хук, который всегда возвращает строку 'light' или 'dark'
export function useColorScheme(): 'light' | 'dark' {
    const colorScheme = _useColorScheme();
    return colorScheme === 'dark' ? 'dark' : 'light';
}
