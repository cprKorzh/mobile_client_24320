// Lessons screens
import {LessonsScreen} from '../screens/lessons/LessonsScreen';
import {LessonChaptersScreen} from '../screens/lessons/LessonChaptersScreen';
import {ChapterVideosScreen} from '../screens/lessons/ChapterVideosScreen';
import {VideoDetailScreen} from '../screens/lessons/VideoDetailScreen';

// Other section screens
import {DrivingScreen} from '../screens/driving/DrivingScreen';
import {TestsScreen} from '../screens/tests/TestsScreen';
import {ExamScreen} from '../screens/exam/ExamScreen';
import {QuestionsScreen} from '../screens/questions/QuestionsScreen';
import {PlanScreen} from '../screens/plan/PlanScreen';
import {ResultsScreen} from '../screens/results/ResultsScreen';
import {RulesScreen} from '../screens/rules/RulesScreen';

// Profile screens
import {LanguageSettingsScreen} from '../screens/profile/LanguageSettingsScreen';
import {ProfileSettingsScreen} from '../screens/profile/ProfileSettingsScreen';
import {AboutScreen} from '../screens/profile/AboutScreen';

export interface StackScreenConfig {
    name: string;
    component: React.ComponentType<any>;
    group: 'lessons' | 'sections' | 'profile';
}

export const stackScreens: StackScreenConfig[] = [
    // Lessons Stack
    {name: 'Lessons', component: LessonsScreen, group: 'lessons'},
    {name: 'LessonChapters', component: LessonChaptersScreen, group: 'lessons'},
    {name: 'ChapterVideos', component: ChapterVideosScreen, group: 'lessons'},
    {name: 'VideoDetail', component: VideoDetailScreen, group: 'lessons'},

    // Other Sections
    {name: 'Driving', component: DrivingScreen, group: 'sections'},
    {name: 'Tests', component: TestsScreen, group: 'sections'},
    {name: 'Exam', component: ExamScreen, group: 'sections'},
    {name: 'Questions', component: QuestionsScreen, group: 'sections'},
    {name: 'Plan', component: PlanScreen, group: 'sections'},
    {name: 'Results', component: ResultsScreen, group: 'sections'},
    {name: 'Rules', component: RulesScreen, group: 'sections'},

    // Profile Screens
    {name: 'LanguageSettings', component: LanguageSettingsScreen, group: 'profile'},
    {name: 'ProfileSettings', component: ProfileSettingsScreen, group: 'profile'},
    {name: 'About', component: AboutScreen, group: 'profile'},
];
