import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
    StatusBar,
    Animated,
    Dimensions,
    ActivityIndicator,
    Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import Header from '../../components/Header';
import { useThemeColor, Colors } from '../../components/Themed';
import { useColorScheme } from '../../hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { testService } from '../../services/testService';
import type { Test, Question, TestAnswer, TestSubmission } from '../../types/test';
import type { RootStackParamList } from '../../types/navigation';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

const {height: screenHeight} = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList, 'TestQuestion'>;
type TestQuestionRouteProp = RouteProp<RootStackParamList, 'TestQuestion'>;

const TestQuestionScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<TestQuestionRouteProp>();
    const colorScheme = useColorScheme();

    const [test, setTest] = useState<Test | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number[]>>({});
    const [showMap, setShowMap] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [startTime] = useState(new Date().toISOString());
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());

    // Анимация для карты
    const slideAnim = useRef(new Animated.Value(-screenHeight)).current;

    // Theme colors
    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({}, 'border');
    const primaryColor = Colors[colorScheme].primary;

    useEffect(() => {
        loadTest();
    }, []);

    useEffect(() => {
        // Сбрасываем время начала вопроса при переходе к новому вопросу
        setQuestionStartTime(Date.now());
    }, [currentQuestionIndex]);

    const loadTest = async () => {
        try {
            const testId = route.params?.testId;
            if (!testId) {
                Alert.alert('Ошибка', 'Тест не найден');
                navigation.goBack();
                return;
            }

            const savedTest = await AsyncStorage.getItem(`test_${testId}`);
            if (!savedTest) {
                Alert.alert('Ошибка', 'Тест не найден');
                navigation.goBack();
                return;
            }

            const testData: Test = JSON.parse(savedTest);
            setTest(testData);
        } catch (error) {
            console.error('Error loading test:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить тест');
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentQuestion = (): Question | null => {
        if (!test || currentQuestionIndex >= test.questions.length) {
            return null;
        }
        return test.questions[currentQuestionIndex];
    };

    // Анимация открытия карты
    const openMap = () => {
        setShowMap(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // Анимация закрытия карты
    const closeMap = () => {
        Animated.timing(slideAnim, {
            toValue: -screenHeight,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowMap(false);
        });
    };

    const handleAnswerSelect = (choiceNumber: number) => {
        const currentQuestion = getCurrentQuestion();
        if (!currentQuestion) return;

        const questionId = currentQuestion.id;
        const questionType = currentQuestion.layout.type;
        
        // Определяем, поддерживает ли вопрос множественные ответы и максимальное количество
        const supportsMultiple = ['text-two', 'photo', 'picture'].includes(questionType);
        const maxAnswers = supportsMultiple ? 2 : 1;
        
        setAnswers(prev => {
            const currentAnswers = prev[questionId] || [];
            
            if (supportsMultiple) {
                // Для вопросов с множественными ответами (максимум 2)
                if (currentAnswers.includes(choiceNumber)) {
                    // Убираем ответ, если он уже выбран
                    return {
                        ...prev,
                        [questionId]: currentAnswers.filter(num => num !== choiceNumber)
                    };
                } else {
                    // Добавляем ответ, но не более maxAnswers
                    if (currentAnswers.length < maxAnswers) {
                        return {
                            ...prev,
                            [questionId]: [...currentAnswers, choiceNumber]
                        };
                    } else {
                        // Если уже выбрано максимальное количество, заменяем последний
                        const newAnswers = [...currentAnswers];
                        newAnswers[maxAnswers - 1] = choiceNumber;
                        return {
                            ...prev,
                            [questionId]: newAnswers
                        };
                    }
                }
            } else {
                // Для вопросов с одним ответом
                return {
                    ...prev,
                    [questionId]: [choiceNumber]
                };
            }
        });
    };

    const handleNextQuestion = () => {
        if (!test || currentQuestionIndex >= test.questions.length - 1) {
            handleFinishTest();
            return;
        }
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleQuestionJump = (index: number) => {
        setCurrentQuestionIndex(index);
        closeMap();
    };

    const handleFinishTest = () => {
        Alert.alert(
            'Завершить тест?',
            'Вы уверены, что хотите завершить тест? После завершения вы не сможете изменить ответы.',
            [
                { text: 'Отмена', style: 'cancel' },
                { text: 'Завершить', onPress: submitTest }
            ]
        );
    };

    const submitTest = async () => {
        if (!test) return;

        try {
            setIsLoading(true);

            // Подготавливаем ответы для отправки
            const testAnswers: TestAnswer[] = Object.entries(answers).map(([questionId, selectedAnswers]) => {
                const question = test.questions.find(q => q.id === parseInt(questionId));
                return {
                    questionId: parseInt(questionId),
                    questionNumber: question?.layout.number || 0,
                    questionType: question?.layout.type || 'text-one',
                    selectedAnswers,
                    timeSpent: 0, // Можно добавить отслеживание времени
                    isAnswered: selectedAnswers.length > 0,
                };
            });

            const submission: TestSubmission = {
                testId: test.id,
                language: test.language,
                answers: testAnswers,
                startedAt: startTime,
                completedAt: new Date().toISOString(),
                totalTimeSpent: Math.floor((Date.now() - new Date(startTime).getTime()) / 1000),
            };

            const result = await testService.submitTest(submission);

            // Переходим к экрану результатов
            navigation.replace('TestResultDetail', {
                result: result.result,
                summary: result.summary,
            });

        } catch (error) {
            console.error('Error submitting test:', error);
            Alert.alert('Ошибка', 'Не удалось отправить результаты теста');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        Alert.alert(
            'Выйти из теста?',
            'Если вы выйдете сейчас, весь прогресс будет потерян.',
            [
                { text: 'Отмена', style: 'cancel' },
                { text: 'Выйти', style: 'destructive', onPress: () => navigation.goBack() }
            ]
        );
    };

    const getAnsweredCount = () => {
        return Object.keys(answers).length;
    };

    const isAnswered = (questionIndex: number) => {
        if (!test || questionIndex >= test.questions.length) return false;
        const question = test.questions[questionIndex];
        const questionAnswers = answers[question.id];
        return questionAnswers && questionAnswers.length > 0;
    };

    const renderChoice = (choice: any) => {
        const currentQuestion = getCurrentQuestion();
        if (!currentQuestion) return null;

        const questionId = currentQuestion.id;
        const currentAnswer = answers[questionId] || [];
        const isSelected = currentAnswer.includes(choice.number);

        return (
            <TouchableOpacity
                key={choice.id}
                style={[
                    styles.choiceButton,
                    { backgroundColor: cardColor, borderColor: borderColor },
                    isSelected && { borderColor: primaryColor, backgroundColor: colorScheme === 'dark' ? '#2A1A1A' : '#FFF5F8' }
                ]}
                onPress={() => handleAnswerSelect(choice.number)}
            >
                <View style={styles.choiceContent}>
                    <View style={[styles.choiceNumber, { backgroundColor: primaryColor }]}>
                        <Text style={styles.choiceNumberText}>
                            {choice.number}
                        </Text>
                    </View>
                    <Text style={[styles.choiceText, { color: textColor }]}>
                        {choice.value}
                    </Text>
                    {isSelected && (
                        <View style={styles.checkmarkContainer}>
                            <Ionicons name="checkmark" size={20} color={primaryColor}/>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderMediaContent = () => {
        const currentQuestion = getCurrentQuestion();
        if (!currentQuestion?.Additional?.[0]?.mediafile?.value) return null;

        const mediaFile = currentQuestion.Additional[0].mediafile.value;
        const isImage = mediaFile.mime?.startsWith('image/');
        const isVideo = mediaFile.mime?.startsWith('video/');
        
        // Формируем полный URL для медиафайла
        const getMediaUrl = (url: string) => {
            if (url.startsWith('http')) {
                return url; // Уже полный URL
            }
            // Добавляем базовый URL сервера
            return `http://192.168.0.38:25546${url}`;
        };

        if (isImage) {
            return (
                <View style={styles.mediaContainer}>
                    <Image 
                        source={{ uri: getMediaUrl(mediaFile.url) }} 
                        style={styles.mediaImage}
                        resizeMode="contain"
                        onError={(error) => {
                            console.log('Image load error:', error.nativeEvent.error);
                        }}
                        onLoad={() => {
                            console.log('Image loaded successfully');
                        }}
                    />
                </View>
            );
        }

        if (isVideo) {
            return (
                <View style={styles.mediaContainer}>
                    <View style={[styles.videoContainer, { backgroundColor: cardColor, borderColor }]}>
                        <Ionicons name="play-circle" size={48} color={primaryColor} />
                        <Text style={[styles.videoPlaceholder, { color: textColor }]}>
                            Видео: {mediaFile.name || 'Видеофайл'}
                        </Text>
                        <Text style={[styles.videoUrl, { color: textColor }]}>
                            URL: {getMediaUrl(mediaFile.url)}
                        </Text>
                    </View>
                </View>
            );
        }

        return null;
    };

    const renderQuestionMap = () => {
        if (!showMap || !test) return null;

        return (
            <View style={styles.mapOverlay}>
                <Animated.View
                    style={[
                        styles.mapContainer,
                        {
                            transform: [{translateY: slideAnim}]
                        }
                    ]}
                >
                    {/* Header */}
                    <View style={[styles.mapHeader, { backgroundColor: cardColor, borderBottomColor: borderColor }]}>
                        <TouchableOpacity style={styles.mapBackButton} onPress={closeMap}>
                            <Ionicons name="arrow-back" size={24} color={textColor}/>
                        </TouchableOpacity>
                        <Text style={[styles.mapTitle, { color: textColor }]}>Карта теста</Text>
                        <View style={styles.mapHeaderSpacer}/>
                    </View>

                    {/* Progress Info */}
                    <View style={styles.mapProgressSection}>
                        <View style={[styles.mapProgressDot, {backgroundColor: '#575757'}]}/>
                        <Text style={styles.mapProgressText}>Не просмотренные</Text>
                        <View style={[styles.mapProgressDot, {backgroundColor: '#FFA4BD'}]}/>
                        <Text style={styles.mapProgressText}>Просмотренные</Text>
                        <View style={[styles.mapProgressDot, {backgroundColor: '#FC094C'}]}/>
                        <Text style={styles.mapProgressText}>С ответом</Text>
                    </View>

                    {/* Questions Grid */}
                    <ScrollView style={styles.mapContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.mapGrid}>
                            {test.questions.map((_, index) => {
                                const isCurrent = index === currentQuestionIndex;
                                const isAnsweredQuestion = isAnswered(index);
                                const isViewed = index <= currentQuestionIndex;

                                let backgroundColor = '#575757'; // Не просмотренные
                                let textColor = '#FFFFFF';

                                if (isAnsweredQuestion) {
                                    backgroundColor = '#FC094C'; // С ответом
                                } else if (isViewed) {
                                    backgroundColor = '#FFA4BD'; // Просмотренные
                                }

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.mapItem,
                                            {backgroundColor}
                                        ]}
                                        onPress={() => handleQuestionJump(index)}
                                    >
                                        <Text
                                            style={[
                                                styles.mapItemText,
                                                {color: textColor}
                                            ]}
                                        >
                                            {index + 1}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>

                    {/* Bottom Button */}
                    <View style={styles.mapBottomSection}>
                        <TouchableOpacity style={styles.mapCloseButton} onPress={closeMap}>
                            <Text style={styles.mapCloseButtonText}>Закрыть</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: cardColor }]}>
                <Header
                    title="Тестирование"
                    showBackButton={true}
                    backgroundColor={cardColor}
                    textColor={textColor}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={primaryColor} />
                    <Text style={[styles.loadingText, { color: textColor }]}>
                        Загрузка теста...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!test) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: cardColor }]}>
                <Header
                    title="Тестирование"
                    showBackButton={true}
                    backgroundColor={cardColor}
                    textColor={textColor}
                />
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: textColor }]}>
                        Тест не найден
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: cardColor }]}>
                <Header
                    title="Тестирование"
                    showBackButton={true}
                    backgroundColor={cardColor}
                    textColor={textColor}
                />
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: textColor }]}>
                        Вопрос не найден
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: cardColor }]}>
            <Header
                title="Тестирование"
                showBackButton={true}
                backgroundColor={cardColor}
                textColor={textColor}
                onBackPress={handleGoBack}
            />

            {/* Question Progress and Map Button */}
            <View style={[styles.progressSection, { backgroundColor: cardColor, borderBottomColor: borderColor }]}>
                <View style={styles.chipsContainer}>
                    <View style={[styles.questionButton, { backgroundColor: primaryColor }]}>
                        <Text style={styles.questionButtonText}>
                            Вопрос {currentQuestionIndex + 1}/{test.questions.length}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.mapButton, { backgroundColor: colorScheme === 'dark' ? '#3A3A3A' : '#F5F5F5' }]}
                        onPress={openMap}
                    >
                        <Text style={[styles.mapButtonText, { color: textColor }]}>Карта теста</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Question Content */}
            <ScrollView style={[styles.content, { backgroundColor: cardColor }]} showsVerticalScrollIndicator={false}>
                <View style={styles.questionContainer}>
                    {/* Question Type Badge and Answer Counter */}
                    <View style={styles.questionHeader}>
                        <View style={[styles.questionTypeBadge, { backgroundColor: `${primaryColor}20` }]}>
                            <Text style={[styles.questionTypeText, { color: primaryColor }]}>
                                {currentQuestion.layout.type.toUpperCase()}
                            </Text>
                        </View>
                        
                        {/* Answer Counter for multiple choice questions */}
                        {['text-two', 'photo', 'picture'].includes(currentQuestion.layout.type) && (
                            <View style={[styles.answerCounter, { backgroundColor: `${primaryColor}10`, borderColor: primaryColor }]}>
                                <Text style={[styles.answerCounterText, { color: primaryColor }]}>
                                    {(answers[currentQuestion.id] || []).length}/2 выбрано
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text style={[styles.questionText, { color: textColor }]}>
                        {currentQuestion.layout.question}
                    </Text>

                    {/* Media Content */}
                    {renderMediaContent()}

                    <View style={styles.choicesContainer}>
                        {currentQuestion.choise.map(renderChoice)}
                    </View>
                </View>
            </ScrollView>

            {/* Navigation and Finish Button */}
            <View style={[styles.navigationDots, { backgroundColor: cardColor }]}>
                <TouchableOpacity
                    style={[
                        styles.navDot,
                        { backgroundColor: primaryColor },
                        currentQuestionIndex === 0 && styles.navDotDisabled
                    ]}
                    onPress={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    <Ionicons
                        name="chevron-back"
                        size={28}
                        color={currentQuestionIndex === 0 ? "#CCCCCC" : "#FFFFFF"}
                    />
                </TouchableOpacity>

                {/* Finish Button or Next Button */}
                {currentQuestionIndex === test.questions.length - 1 ? (
                    <TouchableOpacity
                        style={[styles.finishButton, { backgroundColor: primaryColor }]}
                        onPress={handleFinishTest}
                    >
                        <Text style={styles.finishButtonText}>Завершить тест</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.navDot, { backgroundColor: primaryColor }]}
                        onPress={handleNextQuestion}
                    >
                        <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                )}
            </View>

            {renderQuestionMap()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    progressSection: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    chipsContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    questionButton: {
        backgroundColor: '#E91E63',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    questionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    mapButton: {
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    mapButtonText: {
        color: '#666666',
        fontSize: 14,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    questionContainer: {
        padding: 20,
    },
    questionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#000000',
        marginBottom: 24,
        fontWeight: '400',
    },
    choicesContainer: {
        gap: 12,
    },
    choiceButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    choiceButtonSelected: {
        borderColor: '#E91E63',
        backgroundColor: '#FFF5F8',
    },
    choiceContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    choiceNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E91E63',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    choiceNumberSelected: {
        backgroundColor: '#E91E63',
    },
    choiceNumberText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    choiceNumberTextSelected: {
        color: '#FFFFFF',
    },
    choiceText: {
        flex: 1,
        fontSize: 14,
        color: '#000000',
        lineHeight: 20,
    },
    choiceTextSelected: {
        color: '#000000',
    },
    checkmarkContainer: {
        marginLeft: 8,
    },
    navigationDots: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24, // Увеличен отступ
        backgroundColor: '#FFFFFF',
    },
    navDot: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E91E63',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navDotDisabled: {
        backgroundColor: '#F5F5F5',
    },
    // Map styles
    mapOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    mapContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: 0,
    },
    mapHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingTop: 50, // Отступ для статус бара
    },
    mapBackButton: {
        padding: 8,
    },
    mapTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
    },
    mapHeaderSpacer: {
        width: 40,
    },
    mapProgressSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16, // Уменьшенные отступы
        paddingHorizontal: 16, // Уменьшенные отступы
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    mapProgressItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        justifyContent: 'center',
    },
    mapProgressDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    mapProgressText: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '500',
        textAlign: 'center',
    },
    mapContent: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16, // Уменьшенные отступы
        paddingTop: 16, // Уменьшенный отступ сверху
    },
    mapGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingBottom: 20,
        justifyContent: 'space-between',
    },
    mapItem: {
        width: '22%', // 4 столбика с учетом отступов
        aspectRatio: 1, // Квадратные кнопки
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 48, // Уменьшенный размер для помещения без скролла
    },
    mapItemText: {
        fontSize: 16, // Уменьшенный шрифт
        fontWeight: 'bold',
    },
    mapBottomSection: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    mapCloseButton: {
        backgroundColor: '#E91E63',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    mapCloseButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    questionTypeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    questionTypeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    answerCounter: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    answerCounterText: {
        fontSize: 12,
        fontWeight: '600',
    },
    mediaContainer: {
        marginVertical: 16,
        alignItems: 'center',
    },
    mediaImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    videoContainer: {
        alignItems: 'center',
        padding: 20,
        borderRadius: 8,
        borderWidth: 1,
        width: '100%',
    },
    videoPlaceholder: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '600',
    },
    videoUrl: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
        opacity: 0.7,
    },
    finishButton: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 28,
        minWidth: 140,
        alignItems: 'center',
    },
    finishButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default TestQuestionScreen;
