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
import { bookingService } from '../../services/bookingService';
import { Exam, ExamType, BookingDay, TimeSlot } from '../../types/booking';

export const ExamScreen: React.FC = () => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    const cardBgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

    const [exams, setExams] = useState<Exam[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedExamType, setSelectedExamType] = useState<ExamType>('Тестирование');
    const [availableDays, setAvailableDays] = useState<BookingDay[]>([]);
    const [selectedDay, setSelectedDay] = useState<BookingDay | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            setIsLoading(true);
            const examsList = await bookingService.getMyExams();
            setExams(examsList);
        } catch (error) {
            console.error('Error loading exams:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить экзамены');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadExams();
        setIsRefreshing(false);
    };

    const openBookingModal = (examType: ExamType) => {
        setSelectedExamType(examType);
        setAvailableDays(bookingService.getAvailableDays());
        setShowBookingModal(true);
    };

    const handleBookExam = async () => {
        if (!selectedDay || !selectedSlot) {
            Alert.alert('Ошибка', 'Выберите дату и время');
            return;
        }

        try {
            setIsBooking(true);
            const examDateTime = new Date(`${selectedDay.date}T${selectedSlot.time}:00`);
            
            await bookingService.createExam({
                exam_type: selectedExamType,
                start: examDateTime.toISOString(),
            });

            Alert.alert('Успешно', 'Экзамен записан!');
            setShowBookingModal(false);
            setSelectedDay(null);
            setSelectedSlot(null);
            await loadExams();
        } catch (error) {
            console.error('Error booking exam:', error);
            Alert.alert('Ошибка', 'Не удалось записаться на экзамен');
        } finally {
            setIsBooking(false);
        }
    };

    const handleCancelExam = (exam: Exam) => {
        Alert.alert(
            'Отмена экзамена',
            'Вы уверены, что хотите отменить экзамен?',
            [
                { text: 'Нет', style: 'cancel' },
                {
                    text: 'Да',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await bookingService.cancelExam(exam.id);
                            Alert.alert('Успешно', 'Экзамен отменен');
                            await loadExams();
                        } catch (error) {
                            Alert.alert('Ошибка', 'Не удалось отменить экзамен');
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Сдан': return '#4CAF50';
            case 'Не сдан': return '#F44336';
            default: return '#FF9800';
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={textColor} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: textColor }]}>Экзамены</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#E74C3C" />
                    <Text style={[styles.loadingText, { color: textColor }]}>Загрузка...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: textColor }]}>Экзамены</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }
            >
                {/* Кнопки записи на экзамены */}
                <View style={styles.bookingSection}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Записаться на экзамен</Text>
                    
                    <TouchableOpacity
                        style={[styles.bookingCard, { backgroundColor: cardBgColor }]}
                        onPress={() => openBookingModal('Тестирование')}
                    >
                        <Ionicons name="document-text-outline" size={32} color="#E74C3C" />
                        <Text style={[styles.bookingTitle, { color: textColor }]}>Тестирование</Text>
                        <Text style={[styles.bookingDescription, { color: textColor }]}>
                            Теоретический экзамен
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bookingCard, { backgroundColor: cardBgColor }]}
                        onPress={() => openBookingModal('Автодром')}
                    >
                        <Ionicons name="car-outline" size={32} color="#FF9800" />
                        <Text style={[styles.bookingTitle, { color: textColor }]}>Автодром</Text>
                        <Text style={[styles.bookingDescription, { color: textColor }]}>
                            Практический экзамен на автодроме
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bookingCard, { backgroundColor: cardBgColor }]}
                        onPress={() => openBookingModal('Город')}
                    >
                        <Ionicons name="map-outline" size={32} color="#4CAF50" />
                        <Text style={[styles.bookingTitle, { color: textColor }]}>Город</Text>
                        <Text style={[styles.bookingDescription, { color: textColor }]}>
                            Практический экзамен в городе
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Мои экзамены */}
                <View style={styles.examsSection}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Мои экзамены</Text>
                    
                    {exams.length === 0 ? (
                        <View style={[styles.emptyCard, { backgroundColor: cardBgColor }]}>
                            <Ionicons name="calendar-outline" size={48} color="#CCCCCC" />
                            <Text style={[styles.emptyText, { color: textColor }]}>
                                Нет записей на экзамены
                            </Text>
                        </View>
                    ) : (
                        exams.map((exam) => (
                            <View key={exam.id} style={[styles.examCard, { backgroundColor: cardBgColor }]}>
                                <View style={styles.examHeader}>
                                    <Text style={[styles.examType, { color: textColor }]}>
                                        {exam.exam_type}
                                    </Text>
                                    <View style={[
                                        styles.statusBadge,
                                        { backgroundColor: getStatusColor(exam.exam_status) }
                                    ]}>
                                        <Text style={styles.statusText}>{exam.exam_status}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.examDate, { color: textColor }]}>
                                    {formatDate(exam.start)}
                                </Text>
                                {exam.exam_status === 'В процессе' && (
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => handleCancelExam(exam)}
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
                            Запись на {selectedExamType}
                        </Text>
                        <TouchableOpacity
                            onPress={handleBookExam}
                            disabled={!selectedDay || !selectedSlot || isBooking}
                        >
                            <Text style={[
                                styles.modalSave,
                                { color: selectedDay && selectedSlot ? '#E74C3C' : '#CCCCCC' }
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
                                                        ? '#E74C3C'
                                                        : cardBgColor,
                                                    borderColor: selectedSlot?.id === slot.id
                                                        ? '#E74C3C'
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
    container: { flex: 1, padding: 16 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: { fontSize: 20, fontWeight: 'bold' },
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
    examsSection: {
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
    examCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    examHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    examType: {
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
    examDate: {
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
