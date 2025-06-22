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
        <View style={[styles.card, { backgroundColor: cardBgColor }]}>
          <Ionicons name="checkbox-outline" size={48} color="#4CAF50" />
          <Text style={[styles.cardTitle, { color: textColor }]}>Тестирование знаний ПДД</Text>
          <Text style={[styles.cardDescription, { color: textColor, opacity: 0.7 }]}>
            Проверьте свои знания с помощью тестов по различным темам ПДД
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 20, fontWeight: 'bold' },
  card: { padding: 24, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 20, fontWeight: '600', marginTop: 16, marginBottom: 12, textAlign: 'center' },
  cardDescription: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
});
