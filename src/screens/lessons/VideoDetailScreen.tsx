import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Text} from '../../components/Themed';
import {useColorScheme} from '../../hooks/useColorScheme';

export const VideoDetailScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {videoTitle} = route.params as { videoTitle: string };
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    const cardBgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

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
                    Видео
                </Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color={textColor}/>
                </TouchableOpacity>
            </View>

            <ScrollView style={[styles.container, {backgroundColor: bgColor}]}>
                {/* Video Player Placeholder */}
                <View style={[styles.videoPlayer, {backgroundColor: cardBgColor}]}>
                    <Ionicons name="play-circle" size={80} color="#FC094C"/>
                    <Text style={[styles.playText, {color: textColor}]}>
                        Нажмите для воспроизведения
                    </Text>
                </View>

                {/* Video Info */}
                <View style={[styles.videoInfo, {backgroundColor: cardBgColor}]}>
                    <Text style={[styles.videoTitle, {color: textColor}]}>
                        {videoTitle}
                    </Text>
                    <Text style={[styles.videoMeta, {color: textColor, opacity: 0.6}]}>
                        Длительность: 8:15 • Просмотров: 1,234
                    </Text>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="thumbs-up-outline" size={20} color="#4CAF50"/>
                            <Text style={[styles.actionText, {color: '#4CAF50'}]}>Нравится</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="bookmark-outline" size={20} color="#FF9800"/>
                            <Text style={[styles.actionText, {color: '#FF9800'}]}>Сохранить</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="share-outline" size={20} color="#2196F3"/>
                            <Text style={[styles.actionText, {color: '#2196F3'}]}>Поделиться</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Description */}
                <View style={[styles.descriptionCard, {backgroundColor: cardBgColor}]}>
                    <Text style={[styles.sectionTitle, {color: textColor}]}>Описание</Text>
                    <Text style={[styles.description, {color: textColor, opacity: 0.8}]}>
                        В этом видео мы разберем основные понятия и термины, используемые в правилах дорожного движения.
                        Вы узнаете о различных участниках движения, их правах и обязанностях.
                        {'\n\n'}
                        Рассматриваемые темы:
                        {'\n'}• Участники дорожного движения
                        {'\n'}• Транспортные средства
                        {'\n'}• Дорожная инфраструктура
                        {'\n'}• Основные термины ПДД
                    </Text>
                </View>

                {/* Related Videos */}
                <View style={[styles.relatedCard, {backgroundColor: cardBgColor}]}>
                    <Text style={[styles.sectionTitle, {color: textColor}]}>Похожие видео</Text>

                    <TouchableOpacity style={styles.relatedVideo}>
                        <View style={styles.relatedThumbnail}>
                            <Ionicons name="play-circle" size={24} color="#FC094C"/>
                        </View>
                        <View style={styles.relatedInfo}>
                            <Text style={[styles.relatedTitle, {color: textColor}]}>
                                Обязанности участников движения
                            </Text>
                            <Text style={[styles.relatedMeta, {color: textColor, opacity: 0.6}]}>
                                6:45
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.relatedVideo}>
                        <View style={styles.relatedThumbnail}>
                            <Ionicons name="play-circle" size={24} color="#FC094C"/>
                        </View>
                        <View style={styles.relatedInfo}>
                            <Text style={[styles.relatedTitle, {color: textColor}]}>
                                Практические примеры применения ПДД
                            </Text>
                            <Text style={[styles.relatedMeta, {color: textColor, opacity: 0.6}]}>
                                10:20
                            </Text>
                        </View>
                    </TouchableOpacity>
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
    },
    moreButton: {
        padding: 8,
    },
    videoPlayer: {
        height: 200,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    playText: {
        marginTop: 8,
        fontSize: 16,
        opacity: 0.7,
    },
    videoInfo: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    videoTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    videoMeta: {
        fontSize: 14,
        marginBottom: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        alignItems: 'center',
        padding: 8,
    },
    actionText: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    descriptionCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    relatedCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
    },
    relatedVideo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    relatedThumbnail: {
        width: 60,
        height: 40,
        borderRadius: 6,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    relatedInfo: {
        flex: 1,
    },
    relatedTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    relatedMeta: {
        fontSize: 12,
    },
});
