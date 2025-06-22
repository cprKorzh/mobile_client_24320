import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../../components/Themed';
import { useColorScheme } from '../../hooks/useColorScheme';

export const TestsScreen: React.FC = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const cardBgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

  const handleStartTest = () => {
    navigation.navigate('TestEntry');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Тесты</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.container}>
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: cardBgColor }]}
          onPress={handleStartTest}
        >
          <Ionicons name="checkbox-outline" size={48} color="#4CAF50" />
          <Text style={[styles.cardTitle, { color: textColor }]}>Тестирование знаний ПДД</Text>
          <Text style={[styles.cardDescription, { color: textColor, opacity: 0.7 }]}>
            Проверьте свои знания с помощью тестов по различным темам ПДД
          </Text>
          <View style={styles.startButton}>
            <Text style={styles.startButtonText}>Начать тестирование</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <View style={[styles.infoCard, { backgroundColor: cardBgColor }]}>
          <Text style={[styles.infoTitle, { color: textColor }]}>О тестировании</Text>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={[styles.infoText, { color: textColor, opacity: 0.7 }]}>
              Время: 40 минут
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="document-text-outline" size={20} color="#666" />
            <Text style={[styles.infoText, { color: textColor, opacity: 0.7 }]}>
              Вопросов: 40
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#666" />
            <Text style={[styles.infoText, { color: textColor, opacity: 0.7 }]}>
              Проходной балл: 60 из 100
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="language-outline" size={20} color="#666" />
            <Text style={[styles.infoText, { color: textColor, opacity: 0.7 }]}>
              Языки: Корейский, Английский
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  card: { 
    padding: 24, 
    borderRadius: 12, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 2,
    marginBottom: 16
  },
  cardTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginTop: 16, 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  cardDescription: { 
    fontSize: 16, 
    textAlign: 'center', 
    lineHeight: 24,
    marginBottom: 20
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12
  },
  infoText: {
    fontSize: 14,
    flex: 1
  }
});
