import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Logo } from './Logo';
import { useColorScheme } from '../hooks/useColorScheme';

interface LogoContainerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'transparent';
  style?: ViewStyle;
}

export const LogoContainer: React.FC<LogoContainerProps> = ({
  size = 'medium',
  variant = 'default',
  style,
}) => {
  const colorScheme = useColorScheme();
  
  // Размеры контейнера и логотипа
  const sizes = {
    small: { container: 64, logo: 32 },
    medium: { container: 96, logo: 86 },
    large: { container: 128, logo: 112 },
  };

  // Цвета
  const primaryColor = '#FC094C';
  
  // Стили в зависимости от варианта
  const getVariantStyles = () => {
    const containerSize = sizes[size].container;
    const baseStyle = {
      width: containerSize,
      height: containerSize,
      borderRadius: containerSize / 2,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: primaryColor,
        };
      case 'transparent':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'default':
      default:
        return {
          ...baseStyle,
          backgroundColor: `${primaryColor}20`,
        };
    }
  };

  const containerStyle = getVariantStyles();
  const logoSize = sizes[size].logo;

  return (
    <View style={[containerStyle, style]}>
      <Logo 
        width={logoSize} 
        height={logoSize}
      />
    </View>
  );
};
