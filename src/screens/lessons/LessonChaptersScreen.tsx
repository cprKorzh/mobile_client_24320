import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Text} from '../../components/Themed';
import {useColorScheme} from '../../hooks/useColorScheme';

interface ChapterCardProps {
    id: string;
    title: string;
    videosCount: number;
    duration: string;
    completed: boolean;
}

function ChapterCard({id, title, videosCount, duration, completed}: ChapterCardProps) {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

    return (
        <TouchableOpacity
            style={[styles.chapterCard, {backgroundColor: bgColor}]}
            onPress={() => navigation.navigate('ChapterVideos' as never, {chapterId: id, chapterTitle: title} as never)}
        >
            <View style={styles.chapterHeader}>
                <View style={[styles.chapterIcon, {backgroundColor: completed ? '#4CAF50' : '#FF9800'}]}>
                    <Ionicons
                        name={completed ? "checkmark-circle" : "play-circle"}
                        size={24}
                        color="white"
                    />
                </View>
                <View style={styles.chapterInfo}>
                    <Text style={styles.chapterTitle}>{title}</Text>
                    <Text style={styles.chapterMeta}>{videosCount} видео • {duration}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999"/>
            </View>
        </TouchableOpacity>
    );
}

export const LessonChaptersScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {lessonTitle} = route.params as { lessonTitle: string };
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    const chapters = [
        {
            id: '1',
            title: 'Глава 1: Введение в ПДД',
            videosCount: 5,
            duration: '25 мин',
            completed: true,
        },
        {
            id: '2',
            title: 'Глава 2: Участники движения',
            videosCount: 8,
            duration: '40 мин',
            completed: true,
        },
        {
            id: '3',
            title: 'Глава 3: Дорожные знаки',
            videosCount: 12,
            duration: '60 мин',
            completed: false,
        },
        {
            id: '4',
            title: 'Глава 4: Сигналы светофора',
            videosCount: 6,
            duration: '30 мин',
            completed: false,
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
                <Text style={[styles.title, {color: textColor}]} numberOfLines={1}>
                    {lessonTitle}
                </Text>
                <View style={styles.placeholder}/>
            </View>

            <ScrollView style={[styles.container, {backgroundColor: bgColor}]}>
                <Text style={[styles.subtitle, {color: textColor, opacity: 0.7}]}>
                    Выберите главу для изучения
                </Text>

                <View style={styles.chaptersContainer}>
                    {chapters.map((chapter) => (
                        <ChapterCard key={chapter.id} {...chapter} />
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
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    placeholder: {
        width: 40,
    },
    subtitle: {
        fontSize: 16,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    chaptersContainer: {
        paddingHorizontal: 16,
    },
    chapterCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    chapterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chapterIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    chapterInfo: {
        flex: 1,
    },
    chapterTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    chapterMeta: {
        fontSize: 14,
        opacity: 0.6,
    },
});
