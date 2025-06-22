import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {Text} from '../../components/Themed';
import {useColorScheme} from '../../hooks/useColorScheme';

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

function InputField({label, value, onChangeText, placeholder, keyboardType = 'default'}: InputFieldProps) {
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    const inputBgColor = colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5';

    return (
        <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, {color: textColor}]}>{label}</Text>
            <TextInput
                style={[styles.textInput, {backgroundColor: inputBgColor, color: textColor}]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
                keyboardType={keyboardType}
            />
        </View>
    );
}

interface GenderSelectorProps {
    selectedGender: 'male' | 'female' | null;
    onSelect: (gender: 'male' | 'female') => void;
}

function GenderSelector({selectedGender, onSelect}: GenderSelectorProps) {
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    return (
        <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, {color: textColor}]}>Пол</Text>
            <View style={styles.genderContainer}>
                <TouchableOpacity
                    style={styles.genderOption}
                    onPress={() => onSelect('male')}
                >
                    <View style={[
                        styles.radioButton,
                        selectedGender === 'male' && styles.radioButtonSelected
                    ]}>
                        {selectedGender === 'male' && (
                            <Ionicons name="checkmark" size={16} color="white"/>
                        )}
                    </View>
                    <Text style={[styles.genderText, {color: textColor}]}>Муж.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.genderOption}
                    onPress={() => onSelect('female')}
                >
                    <View style={[
                        styles.radioButton,
                        selectedGender === 'female' && styles.radioButtonSelected
                    ]}>
                        {selectedGender === 'female' && (
                            <Ionicons name="checkmark" size={16} color="white"/>
                        )}
                    </View>
                    <Text style={[styles.genderText, {color: textColor}]}>Жен.</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export const ProfileSettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'dark' ? '#121212' : '#F5F7FA';
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    // Form state
    const [name, setName] = useState('Иван Иванов');
    const [email, setEmail] = useState('example@gmail.com');
    const [birthDate, setBirthDate] = useState('11/08/1995');
    const [phone, setPhone] = useState('+82 - 10 ___  ___');
    const [studentId, setStudentId] = useState('#87654');
    const [gender, setGender] = useState<'male' | 'female' | null>('male');
    const [address, setAddress] = useState('');

    const handleSave = () => {
        Alert.alert('Успешно', 'Профиль сохранен');
    };

    const handleLanguageSettings = () => {
        navigation.navigate('LanguageSettings' as never);
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={textColor}/>
                </TouchableOpacity>
                <Text style={[styles.title, {color: textColor}]}>Редактировать профиль</Text>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={handleLanguageSettings}
                >
                    <Ionicons name="language" size={24} color={textColor}/>
                </TouchableOpacity>
            </View>

            <ScrollView style={[styles.container, {backgroundColor: bgColor}]}>
                {/* Profile Avatar */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={40} color="#FC094C"/>
                        </View>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Ionicons name="camera" size={16} color="white"/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    <InputField
                        label="Имя"
                        value={name}
                        onChangeText={setName}
                        placeholder="Введите ваше имя"
                    />

                    <InputField
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="example@gmail.com"
                        keyboardType="email-address"
                    />

                    <InputField
                        label="Дата рождения"
                        value={birthDate}
                        onChangeText={setBirthDate}
                        placeholder="ДД/ММ/ГГГГ"
                    />

                    <InputField
                        label="Номер телефона"
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+82 - 10 ___  ___"
                        keyboardType="phone-pad"
                    />

                    <InputField
                        label="Идентификатор студента"
                        value={studentId}
                        onChangeText={setStudentId}
                        placeholder="#87654"
                    />

                    <GenderSelector
                        selectedGender={gender}
                        onSelect={setGender}
                    />

                    <InputField
                        label="Адрес"
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Место для адреса"
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Сохранить</Text>
                </TouchableOpacity>
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
    settingsButton: {
        padding: 8,
    },
    avatarContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    avatarWrapper: {
        position: 'relative',
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
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FC094C',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    formContainer: {
        paddingHorizontal: 24,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    textInput: {
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 32,
    },
    genderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FC094C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        backgroundColor: '#FC094C',
    },
    genderText: {
        fontSize: 16,
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#FC094C',
        marginHorizontal: 24,
        marginVertical: 32,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#FC094C',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
