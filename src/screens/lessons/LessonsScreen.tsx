import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {Text} from '../../components/Themed';
import {useColorScheme} from '../../hooks/useColorScheme';

interface LessonCardProps {
    id: string;
    title: string;
    description: string;
    chaptersCount: number;
    progress: number;
    color: string;
}

function LessonCard({id, title, description, chaptersCount, progress, color}: LessonCardProps) {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

    return (
        <TouchableOpacity
            style={[styles.lessonCard, {backgroundColor: bgColor}]}
            onPress={() => navigation.navigate('LessonChapters' as never, {lessonId: id, lessonTitle: title} as never)}
        >
            <View style={styles.lessonHeader}>
                <View style={[styles.lessonIcon, {backgroundColor: color}]}>
                    <Ionicons name="book-outline" size={24} color="white"/>
                </View>
                <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{title}</Text>
                    <Text style={styles.lessonDescription}>{description}</Text>
                    <Text style={styles.chaptersCount}>{chaptersCount} глав</Text>
                </View>
                <Text style={[styles.progressText, {color}]}>{progress}%</Text>
            </View>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, {width: `${progress}%`, backgroundColor: color}]}/>
            </View>
        </TouchableOpacity>
    );
}

export const LessonsScreen: React.FC = () => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    const lessons = [
        {
            id: '1',
            title: 'Основы ПДД',
            description: 'Базовые правила дорожного движения',
            chaptersCount: 8,
            progress: 75,
            color: '#4CAF50',
        },
        {
            id: '2',
            title: 'Дорожные знаки',
            description: 'Изучение всех типов знаков',
            chaptersCount: 12,
            progress: 45,
            color: '#FF9800',
        },
        {
            id: '3',
            title: 'Разметка дороги',
            description: 'Понимание дорожной разметки',
            chaptersCount: 6,
            progress: 30,
            color: '#2196F3',
        },
        {
            id: '4',
            title: 'Безопасность движения',
            description: 'Правила безопасного вождения',
            chaptersCount: 10,
            progress: 60,
            color: '#F44336',
        },
    ];

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={textColor}/>
                </TouchableOpacity>
                <Text style={[styles.title, {color: textColor}]}>Занятия</Text>
                <View style={styles.placeholder}/>
            </View>

            <ScrollView style={[styles.container, {backgroundColor: bgColor}]}>
                <Text style={[styles.subtitle, {color: textColor, opacity: 0.7}]}>
                    Выберите урок для изучения
                </Text>

                <View style={styles.lessonsContainer}>
                    {lessons.map((lesson) => (
                        <LessonCard key={lesson.id} {...lesson} />
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 40,
    },
    subtitle: {
        fontSize: 16,
        paddingHorizontal: 16,
        marginBottom: 20,
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
        marginBottom: 2,
    },
    chaptersCount: {
        fontSize: 12,
        opacity: 0.5,
    },
    progressText: {
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
