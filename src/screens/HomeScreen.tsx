import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {observer} from 'mobx-react-lite';
import {useNavigation} from '@react-navigation/native';
import {Text} from '../components/Themed';
import {useColorScheme} from '../hooks/useColorScheme';
import {useStores} from '../stores/StoreContext';
import {CommonStyles, SPACING, FONT_SIZES} from '../constants/styles';

interface ProgressCardProps {
    percentage: number;
    title: string;
    color: string;
}

function ProgressCard({percentage, title, color}: ProgressCardProps) {
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

    return (
        <View style={[styles.progressCard, {backgroundColor: bgColor}]}>
            <Text style={[styles.progressPercentage, {color}]}>
                {percentage}%
            </Text>
            <Text style={styles.progressTitle}>{title}</Text>
        </View>
    );
}

interface StatCardProps {
    current: number;
    total: number;
    title: string;
    color: string;
}

function StatCard({current, total, title, color}: StatCardProps) {
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

    return (
        <View style={[styles.progressCard, {backgroundColor: bgColor}]}>
            <Text style={[styles.statNumbers, {color}]}>
                {current} <Text style={styles.statSeparator}>/</Text> {total}
            </Text>
            <Text style={styles.progressTitle}>{title}</Text>
        </View>
    );
}

interface MenuItemProps {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
}

function MenuItem({icon, title, onPress}: MenuItemProps) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuIconContainer}>{icon}</View>
            <Text style={styles.menuTitle}>{title}</Text>
        </TouchableOpacity>
    );
}

interface ScheduleItemProps {
    time: string;
    title: string;
    color: string;
}

function ScheduleItem({time, title, color}: ScheduleItemProps) {
    return (
        <View style={[styles.scheduleItem, {backgroundColor: color}]}>
            <Text style={styles.scheduleTitle}>{title}</Text>
        </View>
    );
}

export const HomeScreen: React.FC = observer(() => {
    const {authStore} = useStores();
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    const subtitleColor = colorScheme === 'dark' ? '#AAAAAA' : '#666666';
    const scheduleHeaderColor = colorScheme === 'dark' ? '#FC094C' : '#FC094C';
    const scheduleLessTypeCommon = colorScheme === 'dark' ? '#FC094C' : '#FC094C';

    const handleLogout = () => {
        authStore.logout();
    };

    const renderMenuIcon = (color: string, name: string) => {
        return <Ionicons name={name as any} size={24} color="white"/>;
    };

    const navigateToScreen = (screenName: string) => {
        navigation.navigate(screenName as never);
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
            <ScrollView style={[styles.container, {backgroundColor: bgColor}]}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, {color: textColor}]}>
                            Привет, {authStore.user?.username || 'Пользователь'}
                        </Text>
                        <Text style={[styles.subtitle, {color: subtitleColor}]}>
                            Здесь показана Ваша активность
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color={textColor}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.progressRow}>
                    <ProgressCard percentage={19} title="Тестирование" color="#FF5252"/>
                    <ProgressCard percentage={100} title="Вождение" color="#4CAF50"/>
                </View>

                <View style={styles.progressRow}>
                    <StatCard current={17} total={42} title="Пройдено занятий" color="#FFC107"/>
                    <StatCard current={457} total={950} title="Изучено вопросов" color="#FF9800"/>
                </View>

                <View style={styles.menuGrid}>
                    <View style={styles.menuRow}>
                        <MenuItem
                            icon={
                                <View style={[styles.iconBg, {backgroundColor: '#2E4DA7'}]}>
                                    {renderMenuIcon('#FFFFFF', 'school')}
                                </View>
                            }
                            title="Занятия"
                            onPress={() => navigateToScreen('Lessons')}
                        />
                        <MenuItem
                            icon={
                                <View style={[styles.iconBg, {backgroundColor: '#F5A623'}]}>
                                    {renderMenuIcon('#FFFFFF', 'car')}
                                </View>
                            }
                            title="Вождение"
                            onPress={() => navigateToScreen('Driving')}
                        />
                        <MenuItem
                            icon={
                                <View style={[styles.iconBg, {backgroundColor: '#4CAF50'}]}>
                                    {renderMenuIcon('#FFFFFF', 'checkbox-outline')}
                                </View>
                            }
                            title="Тесты"
                            onPress={() => navigateToScreen('Tests')}
                        />
                        <MenuItem
                            icon={
                                <View style={[styles.iconBg, {backgroundColor: '#E74C3C'}]}>
                                    {renderMenuIcon('#FFFFFF', 'document-text')}
                                </View>
                            }
                            title="Экзамен"
                            onPress={() => navigateToScreen('Exam')}
                        />
                    </View>

                    <View style={styles.menuRow}>
                        <MenuItem
                            icon={
                                <View style={[styles.iconBg, {backgroundColor: '#3498DB'}]}>
                                    {renderMenuIcon('#FFFFFF', 'help-circle')}
                                </View>
                            }
                            title="Вопросы"
                            onPress={() => navigateToScreen('Questions')}
                        />
                        <MenuItem
                            icon={
                                <View style={[styles.iconBg, {backgroundColor: '#8E44AD'}]}>
                                    {renderMenuIcon('#FFFFFF', 'map')}
                                </View>
                            }
                            title="План"
                            onPress={() => navigateToScreen('Plan')}
                        />
                        <MenuItem
                            icon={
                                <View style={[styles.iconBg, {backgroundColor: '#1ABC9C'}]}>
                                    {renderMenuIcon('#FFFFFF', 'pie-chart')}
                                </View>
                            }
                            title="Результат"
                            onPress={() => navigateToScreen('Results')}
                        />
                        <MenuItem
                            icon={
                                <View style={[styles.iconBg, {backgroundColor: '#95A5A6'}]}>
                                    {renderMenuIcon('#FFFFFF', 'book')}
                                </View>
                            }
                            title="Правила"
                            onPress={() => navigateToScreen('Rules')}
                        />
                    </View>
                </View>

                <Text style={[styles.scheduleHeader, {color: scheduleHeaderColor}]}>
                    График текущих занятий
                </Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.scheduleContainer}
                    nestedScrollEnabled={true}
                    scrollEventThrottle={16}
                >
                    <View style={styles.scheduleColumn}>
                        <Text style={styles.scheduleTime}>7</Text>
                        <View style={styles.scheduleTimelineContainer}>
                            <View style={styles.scheduleTimeline}/>
                        </View>
                    </View>

                    <View style={styles.scheduleColumn}>
                        <Text style={styles.scheduleTime}>8</Text>
                        <View style={styles.scheduleTimelineContainer}>
                            <View style={styles.scheduleTimeline}/>
                            <ScheduleItem time="8:00" title="Общее занятие" color="#BBEEBB"/>
                        </View>
                    </View>

                    <View style={styles.scheduleColumn}>
                        <Text style={styles.scheduleTime}>9</Text>
                        <View style={styles.scheduleTimelineContainer}>
                            <View style={styles.scheduleTimeline}/>
                            <ScheduleItem time="9:00" title="Глава 4" color="#E0CFFF"/>
                        </View>
                    </View>

                    <View style={styles.scheduleColumn}>
                        <Text style={styles.scheduleTime}>10</Text>
                        <View style={styles.scheduleTimelineContainer}>
                            <View style={styles.scheduleTimeline}/>
                        </View>
                    </View>

                    <View style={styles.scheduleColumn}>
                        <Text style={styles.scheduleTime}>11</Text>
                        <View style={styles.scheduleTimelineContainer}>
                            <View style={styles.scheduleTimeline}/>
                            <ScheduleItem time="11:00" title="Глава 1" color="#E0CFFF"/>
                        </View>
                    </View>

                    <View style={styles.scheduleColumn}>
                        <Text style={styles.scheduleTime}>11</Text>
                        <View style={styles.scheduleTimelineContainer}>
                            <View style={styles.scheduleTimeline}/>
                            <ScheduleItem time="11:00" title="Глава 1" color="#E0CFFF"/>
                        </View>
                    </View>

                    <View style={styles.scheduleColumn}>
                        <Text style={styles.scheduleTime}>11</Text>
                        <View style={styles.scheduleTimelineContainer}>
                            <View style={styles.scheduleTimeline}/>
                            <ScheduleItem time="11:00" title="Глава 1" color="#E0CFFF"/>
                        </View>
                    </View>


                    <View style={styles.scheduleColumn}>
                        <Text style={styles.scheduleTime}>11</Text>
                        <View style={styles.scheduleTimelineContainer}>
                            <View style={styles.scheduleTimeline}/>
                            <ScheduleItem time="11:00" title="Глава 1" color="#E0CFFF"/>
                        </View>
                    </View>


                    <View style={styles.scheduleColumn}>
                        <Text style={styles.scheduleTime}>11</Text>
                        <View style={styles.scheduleTimelineContainer}>
                            <View style={styles.scheduleTimeline}/>
                            <ScheduleItem time="11:00" title="Глава 1" color="#E0CFFF"/>
                        </View>
                    </View>
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
        paddingBottom: 0, // Убираем отступ от таб-бара
    },
    header: {
        ...CommonStyles.mainScreenHeader,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.lg,
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    notificationButton: {
        padding: 8,
    },
    progressRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 16,
    },
    progressCard: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    progressPercentage: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    progressTitle: {
        fontSize: 14,
        marginTop: 4,
        opacity: 0.7,
    },
    statNumbers: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statSeparator: {
        opacity: 0.5,
    },
    menuGrid: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    menuRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    menuItem: {
        alignItems: 'center',
        width: '22%',
    },
    menuIconContainer: {
        marginBottom: 8,
    },
    iconBg: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTitle: {
        fontSize: 12,
        textAlign: 'center',
    },
    scheduleHeader: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    scheduleContainer: {
        height: 150,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    scheduleColumn: {
        width: 80,
        alignItems: 'center',
    },
    scheduleTime: {
        fontSize: 14,
        marginBottom: 8,
        opacity: 0.7,
    },
    scheduleTimelineContainer: {
        height: '80%',
        alignItems: 'center',
        position: 'relative',
    },
    scheduleTimeline: {
        width: 1,
        height: '100%',
        backgroundColor: '#CCCCCC',
        position: 'absolute',
    },
    scheduleItem: {
        position: 'absolute',
        width: 70,
        padding: 8,
        borderRadius: 8,
        top: 10,
        zIndex: 1,
    },
    scheduleTitle: {
        fontSize: 12,
        textAlign: 'center',
    },
});
