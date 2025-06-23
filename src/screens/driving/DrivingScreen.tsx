import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Modal,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../../components/Themed';
import { useColorScheme } from '../../hooks/useColorScheme';
import Header from '../../components/Header';
import { bookingService } from '../../services/bookingService';
import { Driving, DrivingType, BookingDay, TimeSlot } from '../../types/booking';

export const DrivingScreen: React.FC = () => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    const cardBgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

    const [drivings, setDrivings] = useState<Driving[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDrivingType, setSelectedDrivingType] = useState<DrivingType>('Симулятор');
    const [availableDays, setAvailableDays] = useState<BookingDay[]>([]);
    const [selectedDay, setSelectedDay] = useState<BookingDay | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        loadDrivings();
    }, []);

    const loadDrivings = async () => {
        try {
            setIsLoading(true);
            const drivingsList = await bookingService.getMyDrivings();
            setDrivings(drivingsList);
        } catch (error) {
            console.error('Error loading drivings:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить занятия по вождению');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadDrivings();
        setIsRefreshing(false);
    };

    const openBookingModal = (drivingType: DrivingType) => {
        setSelectedDrivingType(drivingType);
        setAvailableDays(bookingService.getAvailableDays());
        setShowBookingModal(true);
    };

    const handleBookDriving = async () => {
        if (!selectedDay || !selectedSlot) {
            Alert.alert('Ошибка', 'Выберите дату и время');
            return;
        }

        try {
            setIsBooking(true);
            const startDateTime = new Date(`${selectedDay.date}T${selectedSlot.time}:00`);
            const endDateTime = new Date(startDateTime);
            endDateTime.setHours(endDateTime.getHours() + 1); // Занятие длится 1 час
            
            await bookingService.createDriving({
                driving_type: selectedDrivingType,
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString(),
            });

            Alert.alert('Успешно', 'Занятие записано!');
            setShowBookingModal(false);
            setSelectedDay(null);
            setSelectedSlot(null);
            await loadDrivings();
        } catch (error) {
            console.error('Error booking driving:', error);
            Alert.alert('Ошибка', 'Не удалось записаться на занятие');
        } finally {
            setIsBooking(false);
        }
    };

    const handleCancelDriving = (driving: Driving) => {
        Alert.alert(
            'Отмена занятия',
            'Вы уверены, что хотите отменить занятие?',
            [
                { text: 'Нет', style: 'cancel' },
                {
                    text: 'Да',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await bookingService.cancelDriving(driving.id);
                            Alert.alert('Успешно', 'Занятие отменено');
                            await loadDrivings();
                        } catch (error) {
                            Alert.alert('Ошибка', 'Не удалось отменить занятие');
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDuration = (start: string, end?: string) => {
        if (!end) return '';
        const startDate = new Date(start);
        const endDate = new Date(end);
        const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
        return `${duration} мин`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Пройдено': return '#4CAF50';
            case 'Не пройдено': return '#F44336';
            default: return '#FF9800';
        }
    };

    const getDrivingTypeIcon = (type: DrivingType) => {
        switch (type) {
            case 'Симулятор': return 'desktop-outline';
            case 'Автодром': return 'car-outline';
            case 'Город': return 'map-outline';
            default: return 'car-outline';
        }
    };

    const getDrivingTypeColor = (type: DrivingType) => {
        switch (type) {
            case 'Симулятор': return '#2196F3';
            case 'Автодром': return '#FF9800';
            case 'Город': return '#4CAF50';
            default: return '#FF9800';
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
                <Header title="Вождение" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#F5A623" />
                    <Text style={[styles.loadingText, { color: textColor }]}>Загрузка...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
            <Header title="Вождение" />

            <ScrollView
                style={[styles.container, { backgroundColor: bgColor }]}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }
            >
                {/* Кнопки записи на вождение */}
                <View style={styles.bookingSection}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Записаться на занятие</Text>
                    
                    <TouchableOpacity
                        style={[styles.bookingCard, { backgroundColor: cardBgColor }]}
                        onPress={() => openBookingModal('Симулятор')}
                    >
                        <Ionicons name="desktop-outline" size={32} color="#2196F3" />
                        <Text style={[styles.bookingTitle, { color: textColor }]}>Симулятор</Text>
                        <Text style={[styles.bookingDescription, { color: textColor }]}>
                            Занятие на симуляторе вождения
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bookingCard, { backgroundColor: cardBgColor }]}
                        onPress={() => openBookingModal('Автодром')}
                    >
                        <Ionicons name="car-outline" size={32} color="#FF9800" />
                        <Text style={[styles.bookingTitle, { color: textColor }]}>Автодром</Text>
                        <Text style={[styles.bookingDescription, { color: textColor }]}>
                            Практическое вождение на автодроме
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bookingCard, { backgroundColor: cardBgColor }]}
                        onPress={() => openBookingModal('Город')}
                    >
                        <Ionicons name="map-outline" size={32} color="#4CAF50" />
                        <Text style={[styles.bookingTitle, { color: textColor }]}>Город</Text>
                        <Text style={[styles.bookingDescription, { color: textColor }]}>
                            Вождение в городских условиях
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Мои занятия */}
                <View style={styles.drivingsSection}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Мои занятия</Text>
                    
                    {drivings.length === 0 ? (
                        <View style={[styles.emptyCard, { backgroundColor: cardBgColor }]}>
                            <Ionicons name="calendar-outline" size={48} color="#CCCCCC" />
                            <Text style={[styles.emptyText, { color: textColor }]}>
                                Нет записей на занятия
                            </Text>
                        </View>
                    ) : (
                        drivings.map((driving) => (
                            <View key={driving.id} style={[styles.drivingCard, { backgroundColor: cardBgColor }]}>
                                <View style={styles.drivingHeader}>
                                    <View style={styles.drivingTypeContainer}>
                                        <Ionicons 
                                            name={getDrivingTypeIcon(driving.driving_type)} 
                                            size={24} 
                                            color={getDrivingTypeColor(driving.driving_type)} 
                                        />
                                        <Text style={[styles.drivingType, { color: textColor }]}>
                                            {driving.driving_type}
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.statusBadge,
                                        { backgroundColor: getStatusColor(driving.driving_status) }
                                    ]}>
                                        <Text style={styles.statusText}>{driving.driving_status}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.drivingDate, { color: textColor }]}>
                                    {formatDate(driving.start)}
                                </Text>
                                {driving.end && (
                                    <Text style={[styles.drivingDuration, { color: textColor }]}>
                                        Длительность: {formatDuration(driving.start, driving.end)}
                                    </Text>
                                )}
                                {driving.driving_status === 'В процессе' && (
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => handleCancelDriving(driving)}
                                    >
                                        <Text style={styles.cancelButtonText}>Отменить</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Модальное окно бронирования */}
            <Modal
                visible={showBookingModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                            <Text style={[styles.modalCancel, { color: textColor }]}>Отмена</Text>
                        </TouchableOpacity>
                        <Text style={[styles.modalTitle, { color: textColor }]}>
                            Запись на {selectedDrivingType}
                        </Text>
                        <TouchableOpacity
                            onPress={handleBookDriving}
                            disabled={!selectedDay || !selectedSlot || isBooking}
                        >
                            <Text style={[
                                styles.modalSave,
                                { color: selectedDay && selectedSlot ? '#F5A623' : '#CCCCCC' }
                            ]}>
                                {isBooking ? 'Запись...' : 'Записаться'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {availableDays.map((day) => (
                            <View key={day.date} style={styles.daySection}>
                                <Text style={[styles.dayTitle, { color: textColor }]}>
                                    {new Date(day.date).toLocaleDateString('ru-RU', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Text>
                                <View style={styles.slotsContainer}>
                                    {day.slots.filter(slot => slot.available).map((slot) => (
                                        <TouchableOpacity
                                            key={slot.id}
                                            style={[
                                                styles.slotButton,
                                                {
                                                    backgroundColor: selectedSlot?.id === slot.id
                                                        ? '#F5A623'
                                                        : cardBgColor,
                                                    borderColor: selectedSlot?.id === slot.id
                                                        ? '#F5A623'
                                                        : '#CCCCCC',
                                                },
                                            ]}
                                            onPress={() => {
                                                setSelectedDay(day);
                                                setSelectedSlot(slot);
                                            }}
                                        >
                                            <Text style={[
                                                styles.slotText,
                                                {
                                                    color: selectedSlot?.id === slot.id
                                                        ? '#FFFFFF'
                                                        : textColor,
                                                },
                                            ]}>
                                                {slot.time}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },
    bookingSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    bookingCard: {
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    bookingTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
        marginBottom: 4,
    },
    bookingDescription: {
        fontSize: 14,
        opacity: 0.7,
        textAlign: 'center',
    },
    drivingsSection: {
        marginBottom: 32,
    },
    emptyCard: {
        padding: 32,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 16,
        opacity: 0.7,
    },
    drivingCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    drivingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    drivingTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    drivingType: {
        fontSize: 16,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    drivingDate: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 4,
    },
    drivingDuration: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 12,
    },
    cancelButton: {
        backgroundColor: '#F44336',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalCancel: {
        fontSize: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    modalSave: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalContent: {
        flex: 1,
        padding: 16,
    },
    daySection: {
        marginBottom: 24,
    },
    dayTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'capitalize',
    },
    slotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    slotButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        minWidth: 80,
        alignItems: 'center',
    },
    slotText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
