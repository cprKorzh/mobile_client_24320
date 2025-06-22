import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Text} from '../../components/Themed';
import {useColorScheme} from '../../hooks/useColorScheme';

interface VideoCardProps {
    id: string;
    title: string;
    duration: string;
    watched: boolean;
    thumbnail?: string;
}

function VideoCard({id, title, duration, watched}: VideoCardProps) {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

    return (
        <TouchableOpacity
            style={[styles.videoCard, {backgroundColor: bgColor}]}
            onPress={() => navigation.navigate('VideoDetail' as never, {videoId: id, videoTitle: title} as never)}
        >
            <View style={styles.videoThumbnail}>
                <Ionicons name="play-circle" size={40} color="#FC094C"/>
                {watched && (
                    <View style={styles.watchedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50"/>
                    </View>
                )}
            </View>
            <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>{title}</Text>
                <Text style={styles.videoDuration}>{duration}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999"/>
        </TouchableOpacity>
    );
}

export const ChapterVideosScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {chapterTitle} = route.params as { chapterTitle: string };
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    const videos = [
        {
            id: '1',
            title: 'Введение в правила дорожного движения',
            duration: '5:30',
            watched: true,
        },
        {
            id: '2',
            title: 'Основные понятия и термины ПДД',
            duration: '8:15',
            watched: true,
        },
        {
            id: '3',
            title: 'Обязанности участников дорожного движения',
            duration: '6:45',
            watched: false,
        },
        {
            id: '4',
            title: 'Применение правил в различных ситуациях',
            duration: '10:20',
            watched: false,
        },
        {
            id: '5',
            title: 'Практические примеры и разбор ошибок',
            duration: '12:10',
            watched: false,
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
                    {chapterTitle}
                </Text>
                <View style={styles.placeholder}/>
            </View>

            <ScrollView style={[styles.container, {backgroundColor: bgColor}]}>
                <View style={styles.progressContainer}>
                    <Text style={[styles.progressText, {color: textColor}]}>
                        Прогресс: 2 из {videos.length} видео
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, {width: `${(2 / videos.length) * 100}%`}]}/>
                    </View>
                </View>

                <Text style={[styles.subtitle, {color: textColor, opacity: 0.7}]}>
                    Видео с разбором вопросов
                </Text>

                <View style={styles.videosContainer}>
                    {videos.map((video) => (
                        <VideoCard key={video.id} {...video} />
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
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    placeholder: {
        width: 40,
    },
    progressContainer: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    progressText: {
        fontSize: 14,
        marginBottom: 8,
        opacity: 0.8,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 2,
    },
    subtitle: {
        fontSize: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    videosContainer: {
        paddingHorizontal: 16,
    },
    videoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    videoThumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        position: 'relative',
    },
    watchedBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    videoInfo: {
        flex: 1,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    videoDuration: {
        fontSize: 14,
        opacity: 0.6,
    },
});
