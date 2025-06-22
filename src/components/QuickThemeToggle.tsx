import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Themed';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import { useColorScheme } from '../hooks/useColorScheme';

export const QuickThemeToggle: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme();
  const colorScheme = useColorScheme();
  
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const cardBgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';
  const selectedColor = '#FC094C';

  const getNextTheme = (): ThemeMode => {
    switch (themeMode) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      case 'system':
        return 'light';
      default:
        return 'light';
    }
  };

  const getThemeInfo = () => {
    switch (themeMode) {
      case 'light':
        return {
          icon: 'sunny' as keyof typeof Ionicons.glyphMap,
          title: 'Светлая тема',
          subtitle: 'Нажмите для переключения на темную'
        };
      case 'dark':
        return {
          icon: 'moon' as keyof typeof Ionicons.glyphMap,
          title: 'Темная тема',
          subtitle: 'Нажмите для переключения на системную'
        };
      case 'system':
        return {
          icon: 'phone-portrait' as keyof typeof Ionicons.glyphMap,
          title: 'Системная тема',
          subtitle: 'Нажмите для переключения на светлую'
        };
      default:
        return {
          icon: 'sunny' as keyof typeof Ionicons.glyphMap,
          title: 'Светлая тема',
          subtitle: 'Нажмите для переключения'
        };
    }
  };

  const themeInfo = getThemeInfo();

  const handleToggle = () => {
    const nextTheme = getNextTheme();
    setThemeMode(nextTheme);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: cardBgColor }]}
      onPress={handleToggle}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${selectedColor}20` }]}>
            <Ionicons name={themeInfo.icon} size={24} color={selectedColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: textColor }]}>
              {themeInfo.title}
            </Text>
            <Text style={[styles.subtitle, { color: textColor, opacity: 0.6 }]}>
              {themeInfo.subtitle}
            </Text>
          </View>
        </View>
        <Ionicons name="refresh" size={20} color={textColor} style={{ opacity: 0.5 }} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
  },
});
