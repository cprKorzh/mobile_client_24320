import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Themed';
import { useColorScheme } from '../hooks/useColorScheme';

interface ThemedButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: 'left' | 'right';
    style?: ViewStyle;
    fullWidth?: boolean;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    style,
    fullWidth = false,
}) => {
    const colorScheme = useColorScheme();

    // Цвета для разных вариантов
    const getColors = () => {
        const isDark = colorScheme === 'dark';
        
        switch (variant) {
            case 'primary':
                return {
                    background: ['#FC094C', '#FF3366'],
                    text: '#FFFFFF',
                    border: 'transparent',
                };
            case 'secondary':
                return {
                    background: [isDark ? '#2A2A2A' : '#F5F5F5', isDark ? '#3A3A3A' : '#E5E5E5'],
                    text: isDark ? '#FFFFFF' : '#000000',
                    border: 'transparent',
                };
            case 'outline':
                return {
                    background: ['transparent', 'transparent'],
                    text: '#FC094C',
                    border: '#FC094C',
                };
            case 'danger':
                return {
                    background: ['#FF3B30', '#FF5252'],
                    text: '#FFFFFF',
                    border: 'transparent',
                };
            default:
                return {
                    background: ['#FC094C', '#FF3366'],
                    text: '#FFFFFF',
                    border: 'transparent',
                };
        }
    };

    // Размеры для разных размеров кнопки
    const getSizes = () => {
        switch (size) {
            case 'small':
                return {
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    fontSize: 14,
                    iconSize: 16,
                };
            case 'medium':
                return {
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    fontSize: 16,
                    iconSize: 20,
                };
            case 'large':
                return {
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    fontSize: 18,
                    iconSize: 24,
                };
            default:
                return {
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    fontSize: 16,
                    iconSize: 20,
                };
        }
    };

    const colors = getColors();
    const sizes = getSizes();
    const isDisabled = disabled || loading;

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.contentContainer}>
                    <Ionicons name="refresh" size={sizes.iconSize} color={colors.text} />
                    <Text style={[styles.buttonText, { color: colors.text, fontSize: sizes.fontSize }]}>
                        Загрузка...
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.contentContainer}>
                {icon && iconPosition === 'left' && (
                    <Ionicons 
                        name={icon} 
                        size={sizes.iconSize} 
                        color={colors.text} 
                        style={styles.iconLeft}
                    />
                )}
                <Text style={[styles.buttonText, { color: colors.text, fontSize: sizes.fontSize }]}>
                    {title}
                </Text>
                {icon && iconPosition === 'right' && (
                    <Ionicons 
                        name={icon} 
                        size={sizes.iconSize} 
                        color={colors.text} 
                        style={styles.iconRight}
                    />
                )}
            </View>
        );
    };

    const buttonStyle = [
        styles.button,
        {
            paddingVertical: sizes.paddingVertical,
            paddingHorizontal: sizes.paddingHorizontal,
            borderColor: colors.border,
            borderWidth: variant === 'outline' ? 2 : 0,
        },
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
    ];

    if (variant === 'outline') {
        return (
            <TouchableOpacity
                style={[buttonStyle, { backgroundColor: 'transparent' }]}
                onPress={onPress}
                disabled={isDisabled}
            >
                {renderContent()}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={[styles.button, fullWidth && styles.fullWidth, isDisabled && styles.disabled, style]}
            onPress={onPress}
            disabled={isDisabled}
        >
            <LinearGradient
                colors={colors.background}
                style={[
                    styles.gradient,
                    {
                        paddingVertical: sizes.paddingVertical,
                        paddingHorizontal: sizes.paddingHorizontal,
                    }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                {renderContent()}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.6,
    },
    gradient: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontWeight: '600',
        textAlign: 'center',
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});
