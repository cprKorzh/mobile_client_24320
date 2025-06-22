import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Themed';
import { useColorScheme } from '../hooks/useColorScheme';

interface ThemedInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    secureTextEntry?: boolean;
    showPasswordToggle?: boolean;
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    multiline?: boolean;
    numberOfLines?: number;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    secureTextEntry = false,
    showPasswordToggle = false,
    error,
    icon,
    multiline = false,
    numberOfLines = 1,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const colorScheme = useColorScheme();

    // Цвета для разных состояний
    const colors = {
        background: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF',
        border: {
            default: colorScheme === 'dark' ? '#404040' : '#E0E0E0',
            focused: '#FC094C',
            error: '#FF3B30',
        },
        text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        placeholder: colorScheme === 'dark' ? '#888888' : '#999999',
        label: colorScheme === 'dark' ? '#FFFFFF' : '#333333',
        icon: colorScheme === 'dark' ? '#888888' : '#666666',
        error: '#FF3B30',
    };

    const getBorderColor = () => {
        if (error) return colors.border.error;
        if (isFocused) return colors.border.focused;
        return colors.border.default;
    };

    const isSecure = secureTextEntry && !isPasswordVisible;

    return (
        <View style={styles.container}>
            {/* Label */}
            <Text style={[styles.label, { color: colors.label }]}>
                {label}
            </Text>

            {/* Input Container */}
            <View style={[
                styles.inputContainer,
                {
                    backgroundColor: colors.background,
                    borderColor: getBorderColor(),
                },
                isFocused && styles.inputContainerFocused,
                error && styles.inputContainerError,
            ]}>
                {/* Left Icon */}
                {icon && (
                    <View style={styles.leftIconContainer}>
                        <Ionicons 
                            name={icon} 
                            size={20} 
                            color={isFocused ? colors.border.focused : colors.icon} 
                        />
                    </View>
                )}

                {/* Text Input */}
                <TextInput
                    style={[
                        styles.textInput,
                        { 
                            color: colors.text,
                            flex: 1,
                        },
                        multiline && { height: numberOfLines * 20 + 20 }
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={isSecure}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    textAlignVertical={multiline ? 'top' : 'center'}
                />

                {/* Password Toggle */}
                {showPasswordToggle && (
                    <TouchableOpacity
                        style={styles.rightIconContainer}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color={colors.icon}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Error Message */}
            {error && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputContainerFocused: {
        shadowColor: '#FC094C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputContainerError: {
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    leftIconContainer: {
        marginRight: 12,
    },
    textInput: {
        fontSize: 16,
        paddingVertical: 4,
        minHeight: 24,
    },
    rightIconContainer: {
        marginLeft: 12,
        padding: 4,
    },
    errorText: {
        fontSize: 14,
        marginTop: 6,
        marginLeft: 4,
    },
});
