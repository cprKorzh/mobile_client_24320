import { StyleSheet } from 'react-native';

export const CommonStyles = StyleSheet.create({
  // Общие стили для header
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 0,
  },
  
  // Стили для экранов с навигацией назад
  screenHeaderWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  
  // Стили для главных экранов без кнопки назад
  mainScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  
  // Стили для заголовков
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  headerTitleLarge: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  
  // Общие отступы для контента
  screenContainer: {
    flex: 1,
    padding: 16,
  },
  
  // Стили для кнопок назад
  backButton: {
    padding: 8,
  },
  
  // Placeholder для выравнивания
  headerPlaceholder: {
    width: 40,
  },
});

// Константы для отступов
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

// Константы для размеров шрифтов
export const FONT_SIZES = {
  small: 14,
  medium: 16,
  large: 18,
  xlarge: 20,
  xxlarge: 24,
  xxxlarge: 28,
} as const;
