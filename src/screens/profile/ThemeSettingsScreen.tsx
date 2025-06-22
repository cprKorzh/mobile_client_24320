import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/Themed';
import { useColorScheme } from '../../hooks/useColorScheme';
import { ThemeSelector } from '../../components/ThemeSelector';
import Header from '../../components/Header';

export const ThemeSettingsScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <Header title="Настройки темы" />
      
      <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Выберите тему оформления
          </Text>
          <Text style={[styles.sectionDescription, { color: textColor, opacity: 0.7 }]}>
            Настройте внешний вид приложения под свои предпочтения
          </Text>
        </View>

        <ThemeSelector />

        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: textColor }]}>
            О настройках темы
          </Text>
          <Text style={[styles.infoText, { color: textColor, opacity: 0.7 }]}>
            • Светлая тема - классический светлый интерфейс{'\n'}
            • Темная тема - темный интерфейс, экономит заряд батареи{'\n'}
            • Системная тема - автоматически следует настройкам вашего устройства
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  infoSection: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 166, 35, 0.1)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
