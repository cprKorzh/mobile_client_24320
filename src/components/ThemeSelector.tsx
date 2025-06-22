import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Themed';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import { useColorScheme } from '../hooks/useColorScheme';

interface ThemeOptionProps {
  mode: ThemeMode;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
  mode,
  title,
  icon,
  description,
  isSelected,
  onSelect,
}) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const cardBgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';
  const selectedColor = '#FC094C';

  return (
    <TouchableOpacity
      style={[
        styles.themeOption,
        { backgroundColor: cardBgColor },
        isSelected && { borderColor: selectedColor, borderWidth: 2 }
      ]}
      onPress={onSelect}
    >
      <View style={styles.themeOptionContent}>
        <View style={styles.themeOptionLeft}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: isSelected ? selectedColor : `${selectedColor}20` }
          ]}>
            <Ionicons 
              name={icon} 
              size={24} 
              color={isSelected ? 'white' : selectedColor} 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.themeTitle, { color: textColor }]}>
              {title}
            </Text>
            <Text style={[styles.themeDescription, { color: textColor, opacity: 0.7 }]}>
              {description}
            </Text>
          </View>
        </View>
        <View style={[
          styles.radioButton,
          { borderColor: selectedColor },
          isSelected && { backgroundColor: selectedColor }
        ]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ThemeSelector: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme();

  const themeOptions: Array<{
    mode: ThemeMode;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    description: string;
  }> = [
    {
      mode: 'light',
      title: 'Светлая тема',
      icon: 'sunny',
      description: 'Всегда использовать светлую тему'
    },
    {
      mode: 'dark',
      title: 'Темная тема',
      icon: 'moon',
      description: 'Всегда использовать темную тему'
    },
    {
      mode: 'system',
      title: 'Системная тема',
      icon: 'phone-portrait',
      description: 'Следовать настройкам системы'
    }
  ];

  return (
    <View style={styles.container}>
      {themeOptions.map((option) => (
        <ThemeOption
          key={option.mode}
          mode={option.mode}
          title={option.title}
          icon={option.icon}
          description={option.description}
          isSelected={themeMode === option.mode}
          onSelect={() => setThemeMode(option.mode)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  themeOption: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
