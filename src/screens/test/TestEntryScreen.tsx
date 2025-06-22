import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import type {RootStackParamList} from '../../types/navigation';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useColorScheme} from "../../hooks/useColorScheme";
import Header from '../../components/Header';
import {useThemeColor, Colors} from '../../components/Themed';
import { testService } from '../../services/testService';
import type { Language } from '../../types/test';

type NavigationProp = StackNavigationProp<RootStackParamList, 'TestEntry'>;

const TestEntryScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const colorScheme = useColorScheme();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>('Korean');

    // Theme colors
    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const primaryColor = Colors[colorScheme].primary;

    const handleStartTest = async () => {
        try {
            setIsLoading(true);
            
            // Генерируем новый тест
            const test = await testService.generateTest(selectedLanguage);
            
            // Сохраняем тест для использования в TestQuestionScreen
            await testService.saveTest(test);
            
            // Переходим к экрану с вопросами, передавая ID теста
            navigation.navigate('TestQuestion', { testId: test.id });
            
        } catch (error) {
            console.error('Error starting test:', error);
            Alert.alert(
                'Ошибка',
                'Не удалось создать тест. Проверьте подключение к интернету и попробуйте снова.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewResults = () => {
        navigation.navigate('TestResult');
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor}]}>
            <Header
                title="Тестирование"
                showBackButton={true}
                textColor={textColor}
            />

            {/* Content */}
            <View style={[styles.content, {backgroundColor}]}>
                {/* Icon */}
                <View style={styles.iconContainer}>
                    <View style={[styles.iconBackground, {backgroundColor: `${primaryColor}20`}]}>
                        <View style={[styles.iconCircle, {backgroundColor: primaryColor}]}>
                            <Ionicons name="checkmark" size={32} color="#FFFFFF"/>
                        </View>
                    </View>
                </View>

                {/* Title */}
                <Text style={[styles.title, {color: textColor}]}>Пробный тест</Text>

                {/* Description */}
                <Text style={[styles.description, {color: textColor}]}>
                    Сейчас будет запущен пробный{'\n'}
                    тестовый экзамен состоящий{'\n'}
                    из 40-ка вопросов.
                </Text>

                {/* Language Selection */}
                <View style={styles.languageContainer}>
                    <Text style={[styles.languageLabel, {color: textColor}]}>Выберите язык:</Text>
                    <View style={styles.languageButtons}>
                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                {borderColor: primaryColor},
                                selectedLanguage === 'Korean' && {backgroundColor: primaryColor}
                            ]}
                            onPress={() => setSelectedLanguage('Korean')}
                        >
                            <Text style={[
                                styles.languageButtonText,
                                {color: selectedLanguage === 'Korean' ? '#FFFFFF' : primaryColor}
                            ]}>
                                한국어
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                {borderColor: primaryColor},
                                selectedLanguage === 'English' && {backgroundColor: primaryColor}
                            ]}
                            onPress={() => setSelectedLanguage('English')}
                        >
                            <Text style={[
                                styles.languageButtonText,
                                {color: selectedLanguage === 'English' ? '#FFFFFF' : primaryColor}
                            ]}>
                                English
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.startButton, 
                        {backgroundColor: primaryColor},
                        isLoading && styles.disabledButton
                    ]}
                    onPress={handleStartTest}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color="#FFFFFF" size="small" />
                            <Text style={[styles.startButtonText, {marginLeft: 8}]}>
                                Создание теста...
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.startButtonText}>Начать тест</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.resultsButton, {borderColor: primaryColor}]}
                    onPress={handleViewResults}
                >
                    <Text style={[styles.resultsButtonText, {color: primaryColor}]}>Посмотреть результаты</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        //backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        marginBottom: 40,
    },
    iconBackground: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 34,
        gap: 12,
    },
    startButton: {
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    resultsButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    resultsButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    languageContainer: {
        marginTop: 32,
        alignItems: 'center',
    },
    languageLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    languageButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    languageButton: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        minWidth: 80,
        alignItems: 'center',
    },
    languageButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.7,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default TestEntryScreen;
