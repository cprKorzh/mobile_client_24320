import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../../components/Themed';
import { useColorScheme } from '../../hooks/useColorScheme';

interface LanguageOptionProps {
  language: string;
  nativeName: string;
  isSelected: boolean;
  onSelect: () => void;
}

function LanguageOption({ language, nativeName, isSelected, onSelect }: LanguageOptionProps) {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const cardBgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

  return (
    <TouchableOpacity 
      style={[styles.languageCard, { backgroundColor: cardBgColor }]}
      onPress={onSelect}
    >
      <View style={styles.languageInfo}>
        <Text style={[styles.languageName, { color: textColor }]}>{language}</Text>
        <Text style={[styles.nativeName, { color: textColor, opacity: 0.7 }]}>{nativeName}</Text>
      </View>
      <View style={[
        styles.radioButton,
        isSelected && styles.radioButtonSelected
      ]}>
        {isSelected && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
}

export const LanguageSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  const [selectedLanguage, setSelectedLanguage] = useState('Korean');

  const languages = [
    { code: 'Korean', name: 'Корейский', nativeName: '한국어' },
    { code: 'English', name: 'Английский', nativeName: 'English' },
    { code: 'Russian', name: 'Русский', nativeName: 'Русский' },
    { code: 'Chinese', name: 'Китайский', nativeName: '中文' },
    { code: 'Japanese', name: 'Японский', nativeName: '日本語' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Язык</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
        <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>
          Выберите язык приложения
        </Text>

        <View style={styles.languagesContainer}>
          {languages.map((lang) => (
            <LanguageOption
              key={lang.code}
              language={lang.name}
              nativeName={lang.nativeName}
              isSelected={selectedLanguage === lang.code}
              onSelect={() => setSelectedLanguage(lang.code)}
            />
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  subtitle: {
    fontSize: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  languagesContainer: {
    paddingHorizontal: 24,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  nativeName: {
    fontSize: 14,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FC094C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#FC094C',
  },
});
