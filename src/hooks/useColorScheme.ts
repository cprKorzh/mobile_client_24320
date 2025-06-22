import { useTheme } from '../contexts/ThemeContext';

// Хук, который всегда возвращает строку 'light' или 'dark'
export function useColorScheme(): 'light' | 'dark' {
    const { colorScheme } = useTheme();
    return colorScheme;
}
