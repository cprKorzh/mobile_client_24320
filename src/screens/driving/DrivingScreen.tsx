import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {Text} from '../../components/Themed';
import {useColorScheme} from '../../hooks/useColorScheme';
import Header from '../../components/Header';

export const DrivingScreen: React.FC = () => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    const cardBgColor = colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF';

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
            <Header title="Вождение" />

            <ScrollView style={[styles.container, {backgroundColor: bgColor}]}>
                <View style={[styles.card, {backgroundColor: cardBgColor}]}>
                    <Ionicons name="car-outline" size={48} color="#F5A623"/>
                    <Text style={[styles.cardTitle, {color: textColor}]}>
                        Практические занятия по вождению
                    </Text>
                    <Text style={[styles.cardDescription, {color: textColor, opacity: 0.7}]}>
                        Здесь будут отображаться ваши уроки вождения, расписание инструктора и прогресс обучения.
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('DrivingLessons' as never)}
                    >
                        <Text style={styles.buttonText}>Мои уроки</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 12,
        textAlign: 'center',
    },
    cardDescription: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#F5A623',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
