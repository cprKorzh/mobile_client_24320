import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from './Themed';
import type { QuestionTypeBreakdown } from '../types/test';

interface TestStatsCardProps {
  breakdown: QuestionTypeBreakdown;
  title?: string;
}

const questionTypeLabels = {
  'text-one': 'Текст (1 ответ)',
  'text-two': 'Текст (2 ответа)',
  'photo': 'Фото',
  'picture': 'Картинка',
  'sign': 'Знак',
  'video': 'Видео',
};

const TestStatsCard: React.FC<TestStatsCardProps> = ({ breakdown, title = 'Статистика по типам' }) => {
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const getPercentage = (correct: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return '#4CAF50'; // Зеленый
    if (percentage >= 60) return '#FF9800'; // Оранжевый
    return '#F44336'; // Красный
  };

  return (
    <View style={[styles.container, { backgroundColor: cardColor, borderColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      
      {Object.entries(breakdown).map(([type, stats]) => {
        if (stats.total === 0) return null;
        
        const percentage = getPercentage(stats.correct, stats.total);
        const statusColor = getStatusColor(percentage);
        
        return (
          <View key={type} style={styles.statRow}>
            <View style={styles.statInfo}>
              <Text style={[styles.statLabel, { color: textColor }]}>
                {questionTypeLabels[type as keyof typeof questionTypeLabels]}
              </Text>
              <Text style={[styles.statNumbers, { color: textColor }]}>
                {stats.correct}/{stats.total} ({percentage}%)
              </Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: borderColor }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: statusColor,
                      width: `${percentage}%`
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.pointsText, { color: textColor }]}>
                {stats.points}/{stats.maxPoints} баллов
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  statRow: {
    marginBottom: 12,
  },
  statInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statNumbers: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  pointsText: {
    fontSize: 12,
    minWidth: 80,
    textAlign: 'right',
  },
});

export default TestStatsCard;
