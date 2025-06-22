import {HomeScreen} from '../screens/HomeScreen';
import {ExploreScreen} from '../screens/ExploreScreen';
import {CalendarScreen} from '../screens/CalendarScreen';
import {ProfileScreen} from '../screens/ProfileScreen';

export interface TabScreenConfig {
    name: string;
    component: React.ComponentType<any>;
    title: string;
    iconFocused: string;
    iconOutline: string;
}

export const tabScreens: TabScreenConfig[] = [
    {
        name: 'Home',
        component: HomeScreen,
        title: 'Главная',
        iconFocused: 'home',
        iconOutline: 'home-outline',
    },
    {
        name: 'Calendar',
        component: CalendarScreen,
        title: 'Календарь',
        iconFocused: 'calendar',
        iconOutline: 'calendar-outline',
    },
    // {
    //     name: 'Explore',
    //     component: ExploreScreen,
    //     title: 'Обучение',
    //     iconFocused: 'book',
    //     iconOutline: 'book-outline',
    // },
    {
        name: 'Profile',
        component: ProfileScreen,
        title: 'Профиль',
        iconFocused: 'person',
        iconOutline: 'person-outline',
    },
];
