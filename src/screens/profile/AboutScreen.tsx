import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View, Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {Text} from '../../components/Themed';
import {useColorScheme} from '../../hooks/useColorScheme';

interface InfoItemProps {
    label: string;
    value: string;
}

function InfoItem({label, value}: InfoItemProps) {
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    return (
        <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, {color: textColor, opacity: 0.7}]}>{label}</Text>
            <Text style={[styles.infoValue, {color: textColor}]}>{value}</Text>
        </View>
    );
}

interface LinkItemProps {
    icon: string;
    title: string;
    url: string;
}

function LinkItem({icon, title, url}: LinkItemProps) {
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    const handlePress = () => {
        Linking.openURL(url);
    };

    return (
        <TouchableOpacity
            style={[styles.linkItem, {backgroundColor: bgColor}]}
            onPress={handlePress}
        >
            <View style={styles.linkItemLeft}>
                <Ionicons name={icon as any} size={24} color="#FC094C"/>
                <Text style={[styles.linkTitle, {color: textColor}]}>{title}</Text>
            </View>
            <Ionicons name="open-outline" size={20} color={textColor} style={{opacity: 0.5}}/>
        </TouchableOpacity>
    );
}

export const AboutScreen: React.FC = () => {
    const navigation = useNavigation();
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
                <Text style={[styles.title, {color: textColor}]}>О приложении</Text>
                <View style={styles.placeholder}/>
            </View>

            <ScrollView style={[styles.container, {backgroundColor: bgColor}]}>
                {/* App Logo and Name */}
                <View style={styles.appInfoContainer}>
                    <View style={styles.appIcon}>
                        <Ionicons name="car" size={40} color="#FC094C"/>
                    </View>
                    <Text style={[styles.appName, {color: textColor}]}>Gear Up</Text>
                    <Text style={[styles.appTagline, {color: textColor, opacity: 0.7}]}>
                        Изучение ПДД стало проще
                    </Text>
                </View>

                {/* App Information */}
                <View style={[styles.infoCard, {backgroundColor: cardBgColor}]}>
                    <InfoItem label="Версия" value="1.0.0"/>
                    <InfoItem label="Сборка" value="2024.06.21"/>
                    <InfoItem label="Платформа" value="React Native"/>
                    <InfoItem label="Размер" value="45.2 MB"/>
                </View>

                {/* Description */}
                <View style={[styles.descriptionCard, {backgroundColor: cardBgColor}]}>
                    <Text style={[styles.descriptionTitle, {color: textColor}]}>Описание</Text>
                    <Text style={[styles.descriptionText, {color: textColor, opacity: 0.8}]}>
                        Gear Up - это современное приложение для изучения правил дорожного движения.
                        Приложение предоставляет интерактивные уроки, тесты и практические задания
                        для подготовки к экзамену в ГИБДД.
                        {'\n\n'}
                        Особенности:
                        {'\n'}• Интерактивные видео-уроки
                        {'\n'}• Тестирование знаний
                        {'\n'}• Отслеживание прогресса
                        {'\n'}• Поддержка темной темы
                        {'\n'}• Многоязычный интерфейс
                    </Text>
                </View>

                {/* Links */}
                <View style={styles.linksContainer}>
                    <LinkItem
                        icon="globe-outline"
                        title="Официальный сайт"
                        url="https://example.com"
                    />
                    <LinkItem
                        icon="logo-github"
                        title="Исходный код"
                        url="https://github.com/example/gear-up"
                    />
                    <LinkItem
                        icon="document-text-outline"
                        title="Политика конфиденциальности"
                        url="https://example.com/privacy"
                    />
                    <LinkItem
                        icon="shield-checkmark-outline"
                        title="Условия использования"
                        url="https://example.com/terms"
                    />
                </View>

                {/* Copyright */}
                <View style={styles.copyrightContainer}>
                    <Text style={[styles.copyrightText, {color: textColor, opacity: 0.5}]}>
                        © 2024 Gear Up. Все права защищены.
                    </Text>
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
    placeholder: {
        width: 40,
    },
    appInfoContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    appIcon: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#FC094C20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    appTagline: {
        fontSize: 16,
        textAlign: 'center',
    },
    infoCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 16,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    descriptionCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
    },
    linksContainer: {
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    linkItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    linkTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 16,
    },
    copyrightContainer: {
        alignItems: 'center',
        paddingBottom: 32,
    },
    copyrightText: {
        fontSize: 14,
        textAlign: 'center',
    },
});
