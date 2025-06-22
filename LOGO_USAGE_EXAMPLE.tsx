import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Logo } from '../components/Logo';
import { useColorScheme } from '../hooks/useColorScheme';

// Пример использования логотипа
const ExampleComponent = () => {
  const colorScheme = useColorScheme();
  const logoColor = colorScheme === 'dark' ? '#FF3366' : '#FC094C';

  return (
    <View style={styles.logoContainer}>
      <View style={styles.iconBackground}>
        {/* Логотип */}
        <Logo 
          width={48} 
          height={50} 
          color={logoColor} 
        />
      </View>
    </View>
  );
};

// Или для большего логотипа
const LargeLogoExample = () => {
  return (
    <View style={styles.logoContainer}>
      <View style={[styles.iconBackground, styles.largeIconBackground]}>
        <Logo 
          width={96} 
          height={100} 
          color="#FC094C" 
        />
      </View>
    </View>
  );
};

// Для LoginScreen
const LoginScreenLogo = () => {
  const colorScheme = useColorScheme();
  const colors = {
    primary: '#FC094C',
    background: colorScheme === 'dark' ? '#121212' : '#F5F7FA',
  };

  return (
    <View style={styles.headerSection}>
      <View style={[styles.logoContainer, { backgroundColor: `${colors.primary}20` }]}>
        <Logo 
          width={48} 
          height={50} 
          color={colors.primary} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FC094C20',
    shadowColor: '#FC094C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBackground: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeIconBackground: {
    width: 120,
    height: 120,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
});

export { ExampleComponent, LargeLogoExample, LoginScreenLogo };
