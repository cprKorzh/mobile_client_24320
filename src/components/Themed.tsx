import {Text as DefaultText, View as DefaultView, TextProps, ViewProps} from 'react-native';
import {useColorScheme} from '../hooks/useColorScheme';

// Colors for the app
export const Colors = {
    light: {
        text: '#000000',
        background: '#F5F7FA',
        tint: '#FC094C',
        tabIconDefault: '#CCCCCC',
        tabIconSelected: '#FC094C',
        card: '#FFFFFF',
        border: '#E0E0E0',
        notification: '#FF3B30',
        primary: '#FC094C',
        secondary: '#34C759',
        success: '#34C759',
        warning: '#FFCC00',
        danger: '#FF3B30',
        info: '#00A3FF',
        muted: '#8E8E93',
    },
    dark: {
        text: '#FFFFFF',
        background: '#121212',
        tint: '#FC094C',
        tabIconDefault: '#666666',
        tabIconSelected: '#FC094C',
        card: '#2A2A2A',
        border: '#3A3A3A',
        notification: '#FF453A',
        primary: '#FC094C',
        secondary: '#30D158',
        success: '#30D158',
        warning: '#FFD60A',
        danger: '#FF453A',
        info: '#00A3FF',
        muted: '#8E8E93',
    },
};

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const theme = useColorScheme();
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type TextThemeProps = ThemeProps & DefaultText['props'];
export type ViewThemeProps = ThemeProps & DefaultView['props'];

export function Text(props: TextThemeProps) {
    const {style, lightColor, darkColor, ...otherProps} = props;
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');

    return <DefaultText style={[{color}, style]} {...otherProps} />;
}

export function View(props: ViewThemeProps) {
    const {style, lightColor, darkColor, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background');

    return <DefaultView style={[{backgroundColor}, style]} {...otherProps} />;
}
