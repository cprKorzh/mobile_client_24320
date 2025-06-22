import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {TextInput, Button, Title, Card, HelperText} from 'react-native-paper';
import {observer} from 'mobx-react-lite';
import {useStores} from '../stores/StoreContext';

export const LoginScreen: React.FC = observer(() => {
    const {authStore} = useStores();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!identifier.trim() || !password.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
            return;
        }

        const success = await authStore.login(identifier, password);
        if (!success && authStore.error) {
            Alert.alert('Ошибка входа', authStore.error);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>Вход в систему</Title>

                    <TextInput
                        label="Email или имя пользователя"
                        value={identifier}
                        onChangeText={setIdentifier}
                        mode="outlined"
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        label="Пароль"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        style={styles.input}
                        secureTextEntry={!showPassword}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? 'eye-off' : 'eye'}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                    />

                    {authStore.error && (
                        <HelperText type="error" visible={!!authStore.error}>
                            {authStore.error}
                        </HelperText>
                    )}

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        loading={authStore.isLoading}
                        disabled={authStore.isLoading}
                        style={styles.button}
                    >
                        Войти
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    card: {
        padding: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 20,
        paddingVertical: 8,
    },
});
