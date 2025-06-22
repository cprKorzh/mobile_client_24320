import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {observer} from 'mobx-react-lite';
import {Text} from '../components/Themed';
import {ThemedInput} from '../components/ThemedInput';
import {LogoContainer} from '../components/LogoContainer';
import {useColorScheme} from '../hooks/useColorScheme';
import {useStores} from '../stores/StoreContext';

export const LoginScreen: React.FC = observer(() => {
    const {authStore} = useStores();
    const colorScheme = useColorScheme();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

    // Цвета темы
    const colors = {
        background: colorScheme === 'dark' ? '#121212' : '#F5F7FA',
        cardBackground: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
        text: colorScheme === 'dark' ? '#FFFFFF' : '#383838',
        textSecondary: colorScheme === 'dark' ? '#AAAAAA' : '#666666',
        primary: '#FC094C',
        primaryLight: '#FF3366',
        success: '#4CAF50',
    };

    const validateForm = () => {
        const newErrors: { identifier?: string; password?: string } = {};

        if (!identifier.trim()) {
            newErrors.identifier = 'Введите email или имя пользователя';
        } else if (identifier.includes('@') && !/\S+@\S+\.\S+/.test(identifier)) {
            newErrors.identifier = 'Введите корректный email';
        }

        if (!password.trim()) {
            newErrors.password = 'Введите пароль';
        } else if (password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        const success = await authStore.login(identifier, password);
        if (!success && authStore.error) {
            Alert.alert('Ошибка входа', authStore.error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoid}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <LogoContainer
                            size="medium"
                            variant="default"
                        />
                        <Text style={[styles.title, {color: colors.text}]}>
                            Добро пожаловать!
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View style={[styles.formContainer, {backgroundColor: colors.cardBackground}]}>
                        <ThemedInput
                            value={identifier}
                            onChangeText={(text) => {
                                setIdentifier(text);
                                if (errors.identifier) {
                                    setErrors(prev => ({...prev, identifier: undefined}));
                                }
                            }}
                            placeholder="Логин или email"
                            keyboardType="email-address"
                            icon="person-outline"
                            error={errors.identifier}
                        />

                        <ThemedInput
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) {
                                    setErrors(prev => ({...prev, password: undefined}));
                                }
                            }}
                            placeholder="Пароль"
                            secureTextEntry={true}
                            showPasswordToggle={true}
                            icon="lock-closed-outline"
                            error={errors.password}
                        />

                        {/* Global Error */}
                        {authStore.error && (
                            <View style={styles.globalErrorContainer}>
                                <Ionicons name="alert-circle" size={20} color="#FF3B30"/>
                                <Text style={[styles.globalErrorText, {color: '#FF3B30'}]}>
                                    {authStore.error}
                                </Text>
                            </View>
                        )}

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[
                                styles.loginButton,
                                authStore.isLoading && styles.loginButtonDisabled
                            ]}
                            onPress={handleLogin}
                            disabled={authStore.isLoading}
                        >
                            <LinearGradient
                                colors={[colors.primary, colors.primaryLight]}
                                style={styles.loginButtonGradient}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 0}}
                            >
                                {authStore.isLoading ? (
                                    <View style={styles.loadingContainer}>
                                        <Ionicons name="refresh" size={20} color="white"/>
                                        <Text style={styles.loginButtonText}>Вход...</Text>
                                    </View>
                                ) : (
                                    <View style={styles.buttonContent}>
                                        <Text style={styles.loginButtonText}>Войти</Text>
                                        <Ionicons name="arrow-forward" size={20} color="white"/>
                                    </View>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Forgot Password */}
                        <TouchableOpacity style={styles.forgotPasswordContainer}>
                            <Text style={[styles.forgotPasswordText, {color: colors.primary}]}>
                                Забыли пароль?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, {color: colors.textSecondary}]}>
                            Все права защищены{' '}
                            <Text style={[styles.footerLink, {color: colors.primary}]}>
                                Rus - Korea Driving Center
                            </Text>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 24,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    formContainer: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    globalErrorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF3B3010',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    globalErrorText: {
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    loginButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
        shadowColor: '#FC094C',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonGradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 8,
    },
    forgotPasswordContainer: {
        alignItems: 'center',
        marginTop: 20,
        padding: 8,
    },
    forgotPasswordText: {
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: 20,
    },
    footerText: {
        fontSize: 16,
        textAlign: 'center',
    },
    footerLink: {
        fontWeight: '600',
    },
});
