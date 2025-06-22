import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import SyncStatus from '../../components/SyncStatus';
import { useThemeColor, Colors } from '../../components/Themed';
import { useColorScheme } from '../../hooks/useColorScheme';
import { testService } from '../../services/testService';
import type { TestResult } from '../../types/test';

const TestResultScreen: React.FC = () => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const [results, setResults] = useState<TestResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [isOnline, setIsOnline] = useState(true);

    // Theme colors
    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({}, 'border');
    const primaryColor = Colors[colorScheme].primary;

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async (useServer = true) => {
        try {
            setIsLoading(true);
            const response = await testService.getStudentResults(1, 20, useServer);
            setResults(response.data);
            setIsOnline(useServer);
        } catch (error) {
            console.error('Error loading results:', error);
            // Попробуем загрузить локальные результаты
            if (useServer) {
                await loadResults(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadResults(true);
        setIsRefreshing(false);
    };

    const handleSync = async () => {
        await loadResults(true);
    };

    const toggleExpanded = (id: number) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedItems(newExpanded);
    };

    const getPercentageColor = (percentage: number) => {
        if (percentage >= 80) return '#4CAF50';
        if (percentage >= 60) return '#4CAF50';
        return '#F44336';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderResultItem = (result: TestResult) => {
        const isExpanded = expandedItems.has(result.id);

        return (
            <View key={result.id} style={[styles.resultCard, { backgroundColor: cardColor, borderColor }]}>
                <TouchableOpacity 
                    style={styles.resultHeader} 
                    onPress={() => toggleExpanded(result.id)}
                >
                    <View style={styles.resultInfo}>
                        <Text style={[styles.resultTitle, { color: textColor }]}>
                            Тест {result.language === 'Korean' ? '한국어' : 'English'}
                        </Text>
                        <Text style={[styles.resultDate, { color: textColor }]}>
                            {formatDate(result.completedAt)}
                        </Text>
                    </View>
                    <View style={styles.resultRight}>
                        <View style={[
                            styles.percentageBadge,
                            { backgroundColor: getPercentageColor(result.percentage) }
                        ]}>
                            <Text style={styles.percentageText}>{result.percentage}%</Text>
                        </View>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: result.isPassed ? '#4CAF50' : '#F44336' }
                        ]}>
                            <Text style={styles.statusText}>
                                {result.isPassed ? 'Сдан' : 'Не сдан'}
                            </Text>
                        </View>
                        <Ionicons 
                            name={isExpanded ? "chevron-up" : "chevron-down"} 
                            size={20} 
                            color={textColor} 
                        />
                    </View>
                </TouchableOpacity>

                {isExpanded && (
                    <View style={[styles.resultDetails, { borderTopColor: borderColor }]}>
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: textColor }]}>Баллы:</Text>
                            <Text style={[styles.detailValue, { color: textColor }]}>
                                {result.score}/{result.maxScore}
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: textColor }]}>Время:</Text>
                            <Text style={[styles.detailValue, { color: textColor }]}>
                                {result.duration} мин
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: textColor }]}>Язык:</Text>
                            <Text style={[styles.detailValue, { color: textColor }]}>
                                {result.language === 'Korean' ? '한국어' : 'English'}
                            </Text>
                        </View>

                        {/* Breakdown by question types */}
                        <View style={styles.breakdownSection}>
                            <Text style={[styles.breakdownTitle, { color: textColor }]}>
                                По типам вопросов:
                            </Text>
                            {Object.entries(result.breakdown).map(([type, stats]) => {
                                if (stats.total === 0) return null;
                                const percentage = Math.round((stats.correct / stats.total) * 100);
                                return (
                                    <View key={type} style={styles.breakdownRow}>
                                        <Text style={[styles.breakdownType, { color: textColor }]}>
                                            {type.toUpperCase()}:
                                        </Text>
                                        <Text style={[styles.breakdownStats, { color: textColor }]}>
                                            {stats.correct}/{stats.total} ({percentage}%)
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            style={[styles.detailButton, { backgroundColor: primaryColor }]}
                            onPress={() => navigation.navigate('TestResultDetail', { 
                                resultId: result.id,
                                result: result 
                            })}
                        >
                            <Text style={styles.detailButtonText}>Подробнее</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor }]}>
                <Header
                    title="Результаты тестов"
                    showBackButton={true}
                    backgroundColor={cardColor}
                    textColor={textColor}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={primaryColor} />
                    <Text style={[styles.loadingText, { color: textColor }]}>
                        Загрузка результатов...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <Header
                title="Результаты тестов"
                showBackButton={true}
                backgroundColor={cardColor}
                textColor={textColor}
            />

            <View style={[styles.content, { backgroundColor }]}>
                <SyncStatus 
                    isOnline={isOnline}
                    lastSync={results.length > 0 ? formatDate(results[0].completedAt) : undefined}
                    onSync={handleSync}
                />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={[primaryColor]}
                        />
                    }
                >
                    {results.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="document-text-outline" size={64} color={borderColor} />
                            <Text style={[styles.emptyText, { color: textColor }]}>
                                Нет результатов тестов
                            </Text>
                            <Text style={[styles.emptySubtext, { color: textColor }]}>
                                Пройдите первый тест, чтобы увидеть результаты
                            </Text>
                            <TouchableOpacity
                                style={[styles.startTestButton, { backgroundColor: primaryColor }]}
                                onPress={() => navigation.navigate('TestEntry')}
                            >
                                <Text style={styles.startTestButtonText}>Начать тест</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.resultsList}>
                            {results.map(renderResultItem)}
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    content: {
        flex: 1,
        padding: 16,
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
    scrollView: {
        flex: 1,
    },
    resultsList: {
        gap: 12,
    },
    resultCard: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 12,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    resultInfo: {
        flex: 1,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    resultDate: {
        fontSize: 12,
        opacity: 0.7,
    },
    resultRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    percentageBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    percentageText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    resultDetails: {
        padding: 16,
        paddingTop: 0,
        borderTopWidth: 1,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    detailLabel: {
        fontSize: 14,
        opacity: 0.7,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    breakdownSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    breakdownTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 2,
    },
    breakdownType: {
        fontSize: 12,
        opacity: 0.8,
    },
    breakdownStats: {
        fontSize: 12,
        fontWeight: '500',
    },
    detailButton: {
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    detailButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        opacity: 0.7,
        textAlign: 'center',
        marginBottom: 24,
    },
    startTestButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    startTestButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default TestResultScreen;
