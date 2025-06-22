import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor, Colors } from './Themed';
import { useColorScheme } from '../hooks/useColorScheme';
import { CommonStyles, SPACING, FONT_SIZES } from '../constants/styles';

interface HeaderProps {
    title: string;
    showBackButton?: boolean;
    rightComponent?: React.ReactNode;
    onBackPress?: () => void;
    backgroundColor?: string;
    textColor?: string;
    transparent?: boolean; // Новый параметр для прозрачности
}

const Header: React.FC<HeaderProps> = ({
    title,
    showBackButton = true,
    rightComponent,
    onBackPress,
    backgroundColor,
    textColor,
    transparent = true, // По умолчанию прозрачный
}) => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    
    const defaultBackgroundColor = useThemeColor({}, 'card');
    const defaultTextColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({}, 'border');

    // Определяем финальный цвет фона
    const finalBackgroundColor = backgroundColor || (transparent ? 'transparent' : defaultBackgroundColor);

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <>
            <StatusBar 
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
                backgroundColor="transparent"
                translucent={true}
            />
            <View style={[
                styles.header, 
                { 
                    backgroundColor: finalBackgroundColor,
                    borderBottomColor: transparent ? 'transparent' : borderColor,
                }
            ]}>
                {showBackButton ? (
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <Ionicons 
                            name="arrow-back" 
                            size={24} 
                            color={textColor || defaultTextColor} 
                        />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.backButton} />
                )}
                
                <Text style={[
                    styles.headerTitle, 
                    { color: textColor || defaultTextColor }
                ]}>
                    {title}
                </Text>
                
                <View style={styles.rightContainer}>
                    {rightComponent || <View style={styles.headerSpacer} />}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        ...CommonStyles.screenHeaderWithBack,
        borderBottomWidth: 0, // Убираем нижнюю границу
        backgroundColor: 'transparent', // Прозрачный фон по умолчанию
    },
    backButton: {
        ...CommonStyles.backButton,
        width: 40,
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: FONT_SIZES.large,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    rightContainer: {
        width: 40,
        alignItems: 'flex-end',
    },
    headerSpacer: {
        width: 40,
    },
});

export default Header;
