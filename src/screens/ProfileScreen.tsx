import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {observer} from 'mobx-react-lite';
import {useNavigation} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import {Text} from '../components/Themed';
import {useColorScheme} from '../hooks/useColorScheme';
import {useStores} from '../stores/StoreContext';
import {CommonStyles, SPACING, FONT_SIZES} from '../constants/styles';
import {QuickThemeToggle} from '../components/QuickThemeToggle';

interface ProfileMenuItemProps {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
    iconColor?: string;
}

function ProfileMenuItem({
                             icon,
                             title,
                             subtitle,
                             onPress,
                             showArrow = true,
                             iconColor = '#FC094C'
                         }: ProfileMenuItemProps) {
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    return (
        <TouchableOpacity
            style={[styles.menuItem, {backgroundColor: bgColor}]}
            onPress={onPress}
        >
            <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, {backgroundColor: `${iconColor}20`}]}>
                    <Ionicons name={icon as any} size={24} color={iconColor}/>
                </View>
                <View style={styles.menuItemText}>
                    <Text style={[styles.menuItemTitle, {color: textColor}]}>{title}</Text>
                    {subtitle && (
                        <Text style={[styles.menuItemSubtitle, {color: textColor, opacity: 0.6}]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            {showArrow && (
                <Ionicons name="chevron-forward" size={20} color={textColor} style={{opacity: 0.3}}/>
            )}
        </TouchableOpacity>
    );
}

interface StatCardProps {
    value: string;
    label: string;
    color: string;
}

function StatCard({value, label, color}: StatCardProps) {
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    return (
        <View style={[styles.statCard, {backgroundColor: bgColor}]}>
            <Text style={[styles.statValue, {color}]}>{value}</Text>
            <Text style={[styles.statLabel, {color: textColor, opacity: 0.7}]}>{label}</Text>
        </View>
    );
}

export const ProfileScreen: React.FC = observer(() => {
    const {authStore} = useStores();
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    const handleLogout = () => {
        authStore.logout();
    };

    return (
        <SafeAreaView 
            style={{flex: 1, backgroundColor: bgColor}}
            edges={['top']} // Только верхний отступ, убираем нижний
        >
            <ScrollView 
                style={[styles.container, {backgroundColor: bgColor}]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, {color: textColor}]}>Профиль</Text>
                </View>

                {/* User Info Card */}
                <View style={styles.userSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={40} color="#FC094C"/>
                        </View>
                    </View>
                    <Text style={[styles.userName, {color: textColor}]}>
                        {authStore.user?.username || 'Иван Иванов'}
                    </Text>
                    <Text style={[styles.userEmail, {color: textColor, opacity: 0.7}]}>
                        {authStore.user?.email || 'example@gmail.com'}
                    </Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <StatCard value="85%" label="Прогресс" color="#4CAF50"/>
                    <StatCard value="12" label="Тестов" color="#FF9800"/>
                    <StatCard value="457" label="Вопросов" color="#2196F3"/>
                </View>

                {/* Quick Theme Toggle */}
                <QuickThemeToggle />

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    <ProfileMenuItem
                        icon="create-outline"
                        title="Редактировать профиль"
                        subtitle="Изменить личную информацию"
                        onPress={() => navigation.navigate('ProfileSettings' as never)}
                        iconColor="#4CAF50"
                    />

                    <ProfileMenuItem
                        icon="school-outline"
                        title="Мои курсы"
                        subtitle="Просмотр прогресса обучения"
                        onPress={() => console.log('Мои курсы')}
                        iconColor="#2196F3"
                    />

                    <ProfileMenuItem
                        icon="trophy-outline"
                        title="Достижения"
                        subtitle="Ваши награды и сертификаты"
                        onPress={() => console.log('Достижения')}
                        iconColor="#FF9800"
                    />

                    <ProfileMenuItem
                        icon="bar-chart-outline"
                        title="Статистика"
                        subtitle="Детальная статистика обучения"
                        onPress={() => navigation.navigate('Results' as never)}
                        iconColor="#9C27B0"
                    />

                    <ProfileMenuItem
                        icon="bookmark-outline"
                        title="Избранное"
                        subtitle="Сохраненные материалы"
                        onPress={() => console.log('Избранное')}
                        iconColor="#FF5722"
                    />

                    <ProfileMenuItem
                        icon="color-palette-outline"
                        title="Тема оформления"
                        subtitle="Светлая, темная или системная"
                        onPress={() => navigation.navigate('ThemeSettings' as never)}
                        iconColor="#9C27B0"
                    />

                    <ProfileMenuItem
                        icon="help-circle-outline"
                        title="Помощь"
                        subtitle="FAQ и поддержка"
                        onPress={() => console.log('Помощь')}
                        iconColor="#795548"
                    />

                    <ProfileMenuItem
                        icon="information-circle-outline"
                        title="О приложении"
                        subtitle="Версия и информация"
                        onPress={() => navigation.navigate('About' as never)}
                        iconColor="#3F51B5"
                    />
                </View>

                {/* Logout Button */}
                <View style={styles.logoutContainer}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#FF3B30"/>
                        <Text style={[styles.logoutText, {color: '#FF3B30'}]}>Выйти</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            {/* Градиентный переход на верхнем крае */}
            {/*<LinearGradient*/}
            {/*    colors={[*/}
            {/*        bgColor, // Цвет фона*/}
            {/*        'transparent'*/}
            {/*    ]}*/}
            {/*    style={styles.topBlur}*/}
            {/*    pointerEvents="none"*/}
            {/*/>*/}
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 0, // Убираем нижний отступ
    },
    header: {
        paddingHorizontal: SPACING.xxl,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    title: {
        ...CommonStyles.headerTitleLarge,
    },
    userSection: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FC094C20',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FC094C',
    },
    userName: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginBottom: 32,
        gap: 12,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    menuContainer: {
        paddingHorizontal: 24,
    },
    menuItem: {
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
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuItemText: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    menuItemSubtitle: {
        fontSize: 14,
    },
    logoutContainer: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 8, // Уменьшаем с 32 до 8
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF3B30',
        backgroundColor: 'transparent',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    // topBlur: {
    //     position: 'absolute',
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     height: 80,
    //     zIndex: 1,
    // },
});
