import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {HapticTab} from '../components/HapticTab';
import TabBarBackground from '../components/TabBarBackground';
import {useColorScheme} from '../hooks/useColorScheme';
import {tabScreens} from './tabConfig';
import {NAVIGATION_CONSTANTS} from '../constants/navigation';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
    const colorScheme = useColorScheme();
    const {TAB_BAR, COLORS} = NAVIGATION_CONSTANTS;

    const tabBarBgColor = colorScheme === 'dark'
        ? COLORS.DARK.TAB_BAR_BG
        : COLORS.LIGHT.TAB_BAR_BG;

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: TAB_BAR.ACTIVE_COLOR,
                headerShown: false,
                tabBarButton: HapticTab,
                ...(Platform.OS === 'ios' && {
                    tabBarBackground: TabBarBackground,
                }),
                tabBarStyle: {
                    backgroundColor: tabBarBgColor,
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    height: TAB_BAR.HEIGHT,
                    paddingBottom: TAB_BAR.PADDING_VERTICAL,
                    paddingTop: TAB_BAR.PADDING_VERTICAL,
                    paddingHorizontal: TAB_BAR.PADDING_HORIZONTAL,
                },
                tabBarLabelStyle: {
                    fontSize: TAB_BAR.LABEL_FONT_SIZE,
                },
            }}
        >
            {tabScreens.map((screen) => (
                <Tab.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    options={{
                        title: screen.title,
                        tabBarIcon: ({color, focused}) => (
                            <Ionicons
                                name={focused ? screen.iconFocused : screen.iconOutline}
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
            ))}
        </Tab.Navigator>
    );
};
