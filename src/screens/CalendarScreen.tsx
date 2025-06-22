import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Themed';
import { useColorScheme } from '../hooks/useColorScheme';

export const CalendarScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const cardBgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Календарь</Text>
          <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>
            Расписание занятий и экзаменов
          </Text>
        </View>

        <View style={[styles.comingSoonCard, { backgroundColor: cardBgColor }]}>
          <Text style={[styles.comingSoonTitle, { color: textColor }]}>
            Скоро будет доступно
          </Text>
          <Text style={[styles.comingSoonText, { color: textColor, opacity: 0.7 }]}>
            Здесь будет отображаться ваше расписание занятий, экзаменов и важных событий.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  comingSoonCard: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
