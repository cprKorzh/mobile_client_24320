import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {Text} from '../components/Themed';
import {useColorScheme} from '../hooks/useColorScheme';

interface LessonCardProps {
    title: string;
    description: string;
    progress: number;
    color: string;
    icon: string;
    onPress: () => void;
}

function LessonCard({title, description, progress, color, icon, onPress}: LessonCardProps) {
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

    return (
        <TouchableOpacity style={[styles.lessonCard, {backgroundColor: bgColor}]} onPress={onPress}>
            <View style={styles.lessonHeader}>
                <View style={[styles.lessonIcon, {backgroundColor: color}]}>
                    <Ionicons name={icon as any} size={24} color="white"/>
                </View>
                <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{title}</Text>
                    <Text style={styles.lessonDescription}>{description}</Text>
                </View>
                <Text style={[styles.lessonProgress, {color}]}>{progress}%</Text>
            </View>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, {width: `${progress}%`, backgroundColor: color}]}/>
            </View>
        </TouchableOpacity>
    );
}

export const ExploreScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    const lessons = [
        {
            title: 'Основы ПДД',
            description: 'Изучение базовых правил дорожного движения',
            progress: 85,
            color: '#4CAF50',
            icon: 'book-outline',
        },
        {
            title: 'Дорожные знаки',
            description: 'Изучение всех типов дорожных знаков',
            progress: 60,
            color: '#FF9800',
            icon: 'warning-outline',
        },
        {
            title: 'Разметка дороги',
            description: 'Понимание дорожной разметки',
            progress: 40,
            color: '#2196F3',
            icon: 'git-branch-outline',
        },
        {
            title: 'Безопасность движения',
            description: 'Правила безопасного вождения',
            progress: 25,
            color: '#F44336',
            icon: 'shield-checkmark-outline',
        },
        {
            title: 'Экстренные ситуации',
            description: 'Действия в критических ситуациях',
            progress: 10,
            color: '#9C27B0',
            icon: 'alert-circle-outline',
        },
    ];

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
            <ScrollView style={[styles.container, {backgroundColor: bgColor}]}>
                <View style={styles.header}>
                    <Text style={[styles.title, {color: textColor}]}>Обучение</Text>
                    <Text style={[styles.subtitle, {color: textColor, opacity: 0.7}]}>
                        Изучайте теорию по разделам
                    </Text>
                </View>

                <View style={styles.lessonsContainer}>
                    {lessons.map((lesson, index) => (
                        <LessonCard
                            key={index}
                            title={lesson.title}
                            description={lesson.description}
                            progress={lesson.progress}
                            color={lesson.color}
                            icon={lesson.icon}
                            onPress={() => console.log(`Pressed ${lesson.title}`)}
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
        paddingBottom: 0, // Убираем отступ от таб-бара
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
    lessonsContainer: {
        paddingHorizontal: 16,
    },
    lessonCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    lessonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    lessonIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    lessonInfo: {
        flex: 1,
    },
    lessonTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    lessonDescription: {
        fontSize: 14,
        opacity: 0.7,
    },
    lessonProgress: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressBar: {
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
});
