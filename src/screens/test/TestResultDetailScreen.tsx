import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { useThemeColor, Colors } from '../../components/Themed';
import { useColorScheme } from '../../hooks/useColorScheme';

interface RouteParams {
  result: any;
  summary: any;
}

const TestResultDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const colorScheme = useColorScheme();
  const { result, summary } = route.params as RouteParams;

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = Colors[colorScheme].primary;

  const getStatusColor = (isPassed: boolean) => {
    return isPassed ? '#4CAF50' : '#F44336';
  };

  const getStatusText = (isPassed: boolean) => {
    return isPassed ? 'Сдан' : 'Не сдан';
  };

  const renderBreakdown = () => {
    const breakdown = summary.breakdown;
    const types = [
      { key: 'text-one', name: 'Текст (1 ответ)', points: 2 },
      { key: 'text-two', name: 'Текст (2 ответа)', points: 3 },
      { key: 'photo', name: 'Фото', points: 3 },
      { key: 'picture', name: 'Картинка', points: 3 },
      { key: 'sign', name: 'Знак', points: 2 },
      { key: 'video', name: 'Видео', points: 5 },
    ];

    return (
      <View style={[styles.breakdownContainer, { backgroundColor: cardColor, borderColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Результаты по типам</Text>
        {types.map(type => {
          const stats = breakdown[type.key];
          if (!stats || stats.total === 0) return null;

          const percentage = (stats.correct / stats.total) * 100;
          const earnedPoints = stats.correct * type.points;
          const maxPoints = stats.total * type.points;

          return (
            <View key={type.key} style={styles.breakdownItem}>
              <View style={styles.breakdownHeader}>
                <Text style={[styles.breakdownType, { color: textColor }]}>{type.name}</Text>
                <Text style={[styles.breakdownScore, { color: primaryColor }]}>
                  {earnedPoints}/{maxPoints} баллов
                </Text>
              </View>
              <View style={styles.breakdownStats}>
                <Text style={[styles.breakdownText, { color: textColor }]}>
                  Правильно: {stats.correct}/{stats.total} ({percentage.toFixed(0)}%)
                </Text>
                <View style={[styles.progressBar, { backgroundColor: borderColor }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${percentage}%` },
                      { backgroundColor: percentage >= 60 ? '#4CAF50' : '#F44336' },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Header
        title="Результат теста"
        showBackButton={true}
        backgroundColor={cardColor}
        textColor={textColor}
      />

      <ScrollView style={[styles.content, { backgroundColor }]} showsVerticalScrollIndicator={false}>
        {/* Main Result */}
        <View style={[styles.resultCard, { backgroundColor: cardColor, borderColor }]}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconBackground, { backgroundColor: `${getStatusColor(result.isPassed)}20` }]}>
              <View style={[styles.iconCircle, { backgroundColor: getStatusColor(result.isPassed) }]}>
                <Ionicons 
                  name={result.isPassed ? "checkmark" : "close"} 
                  size={32} 
                  color="#FFFFFF"
                />
              </View>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(result.isPassed) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(result.isPassed)}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={[styles.mainScore, { color: textColor }]}>
              {result.score}
            </Text>
            <Text style={[styles.scoreLabel, { color: textColor }]}>/{result.maxScore}</Text>
          </View>

          <Text style={[styles.percentage, { color: primaryColor }]}>{result.percentage}%</Text>

          <View style={styles.resultMeta}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: textColor }]}>Время</Text>
              <Text style={[styles.metaValue, { color: textColor }]}>{result.duration} мин</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: textColor }]}>Язык</Text>
              <Text style={[styles.metaValue, { color: textColor }]}>
                {result.language === 'Korean' ? '한국어' : 'English'}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: textColor }]}>Проходной</Text>
              <Text style={[styles.metaValue, { color: textColor }]}>60 баллов</Text>
            </View>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={[styles.summaryCard, { backgroundColor: cardColor, borderColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Сводка</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: textColor }]}>{summary.totalQuestions}</Text>
              <Text style={[styles.summaryLabel, { color: textColor }]}>Всего</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: '#4CAF50' }]}>
                {summary.correctAnswers}
              </Text>
              <Text style={[styles.summaryLabel, { color: textColor }]}>Верно</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: '#F44336' }]}>
                {summary.totalQuestions - summary.correctAnswers}
              </Text>
              <Text style={[styles.summaryLabel, { color: textColor }]}>Неверно</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: textColor }]}>{result.duration}</Text>
              <Text style={[styles.summaryLabel, { color: textColor }]}>Минут</Text>
            </View>
          </View>
        </View>

        {/* Breakdown by Question Type */}
        {renderBreakdown()}

        {/* Recommendations */}
        <View style={[styles.recommendationCard, { backgroundColor: cardColor, borderColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            {result.isPassed ? 'Поздравляем!' : 'Попробуйте еще раз!'}
          </Text>
          <Text style={[styles.recommendationText, { color: textColor }]}>
            {result.isPassed
              ? `Вы набрали ${result.percentage}% и успешно сдали тест. Удачи на настоящем экзамене!`
              : `Вы набрали ${result.percentage}%, что недостаточно для сдачи. Изучите слабые места и попробуйте снова.`}
          </Text>
          
          {!result.isPassed && (
            <View style={[styles.improvementTips, { backgroundColor: colorScheme === 'dark' ? '#2A1A00' : '#fff3cd' }]}>
              <Text style={[styles.tipsTitle, { color: colorScheme === 'dark' ? '#FFD700' : '#856404' }]}>
                Области для улучшения:
              </Text>
              {Object.entries(summary.breakdown).map(([type, stats]: [string, any]) => {
                if (stats.total === 0) return null;
                const percentage = (stats.correct / stats.total) * 100;
                if (percentage < 60) {
                  const typeNames: Record<string, string> = {
                    'text-one': 'Текст (1 ответ)',
                    'text-two': 'Текст (2 ответа)',
                    'photo': 'Фото',
                    'picture': 'Картинка',
                    'sign': 'Знак',
                    'video': 'Видео',
                  };
                  return (
                    <Text key={type} style={[styles.tipText, { color: colorScheme === 'dark' ? '#FFD700' : '#856404' }]}>
                      • {typeNames[type]}: {percentage.toFixed(0)}% правильных ответов
                    </Text>
                  );
                }
                return null;
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionButtons, { backgroundColor }]}>
        <TouchableOpacity
          style={[styles.retakeButton, { backgroundColor: primaryColor }]}
          onPress={() => {
            navigation.navigate('Tests');
          }}
        >
          <Text style={styles.retakeButtonText}>Пройти еще раз</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.homeButton, { borderColor: primaryColor }]}
            onPress={() => {
              navigation.navigate('MainTabs', { screen: 'Home' });
            }}
        >
          <Text style={[styles.homeButtonText, { color: primaryColor }]}>На главную</Text>
        </TouchableOpacity>
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
  resultCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  iconContainer: {
    marginBottom: 20,
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
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  mainScore: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 24,
    marginLeft: 4,
  },
  percentage: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  breakdownContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  breakdownItem: {
    marginBottom: 16,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownType: {
    fontSize: 14,
    fontWeight: '600',
  },
  breakdownScore: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  breakdownStats: {
    gap: 8,
  },
  breakdownText: {
    fontSize: 12,
    opacity: 0.8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  recommendationCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.8,
  },
  improvementTips: {
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TestResultDetailScreen;
