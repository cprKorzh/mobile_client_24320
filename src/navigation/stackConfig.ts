// Lessons screens
import {LessonsScreen} from '../screens/lessons/LessonsScreen';
import {LessonChaptersScreen} from '../screens/lessons/LessonChaptersScreen';
import {ChapterVideosScreen} from '../screens/lessons/ChapterVideosScreen';
import {VideoDetailScreen} from '../screens/lessons/VideoDetailScreen';

// Test screens
import TestEntryScreen from '../screens/test/TestEntryScreen';
import TestQuestionScreen from '../screens/test/TestQuestionScreen';
import TestResultDetailScreen from '../screens/test/TestResultDetailScreen';

// Other section screens
import {DrivingScreen} from '../screens/driving/DrivingScreen';
import {TestsScreen} from '../screens/tests/TestsScreen';
import {ExamScreen} from '../screens/exam/ExamScreen';
import {QuestionsScreen} from '../screens/questions/QuestionsScreen';
import {PlanScreen} from '../screens/plan/PlanScreen';
import {ResultsScreen} from '../screens/results/ResultsScreen';
import {RulesScreen} from '../screens/rules/RulesScreen';
import TestResultScreen from "../screens/test/TestResultScreen"

// Profile screens
import {LanguageSettingsScreen} from '../screens/profile/LanguageSettingsScreen';
import {ProfileSettingsScreen} from '../screens/profile/ProfileSettingsScreen';
import {ThemeSettingsScreen} from '../screens/profile/ThemeSettingsScreen';
import {AboutScreen} from '../screens/profile/AboutScreen';
;

export interface StackScreenConfig {
    name: string;
    component: React.ComponentType<any>;
    group: 'lessons' | 'sections' | 'profile' | 'tests';
}

export const stackScreens: StackScreenConfig[] = [
    // Lessons Stack
    {name: 'Lessons', component: LessonsScreen, group: 'lessons'},
    {name: 'LessonChapters', component: LessonChaptersScreen, group: 'lessons'},
    {name: 'ChapterVideos', component: ChapterVideosScreen, group: 'lessons'},
    {name: 'VideoDetail', component: VideoDetailScreen, group: 'lessons'},
    // Driving Stack
    {name: 'Driving', component: DrivingScreen, group: 'sections'},
    // Test Stack
    {name: 'Tests', component: TestEntryScreen, group: 'sections'},
    // {name: 'TestEntry', component: TestEntryScreen, group: 'tests'},
    {name: 'TestQuestion', component: TestQuestionScreen, group: 'tests'},
    {name: 'TestResult', component: TestResultScreen, group: 'tests'},
    {name: 'TestResultDetail', component: TestResultDetailScreen, group: 'tests'},
    // Exam Stack
    {name: 'Exam', component: ExamScreen, group: 'sections'},
    {name: 'Questions', component: QuestionsScreen, group: 'sections'},
    {name: 'Plan', component: PlanScreen, group: 'sections'},
    {name: 'Results', component: ResultsScreen, group: 'sections'},
    {name: 'Rules', component: RulesScreen, group: 'sections'},

    // Profile Screens
    {name: 'LanguageSettings', component: LanguageSettingsScreen, group: 'profile'},
    {name: 'ProfileSettings', component: ProfileSettingsScreen, group: 'profile'},
    {name: 'ThemeSettings', component: ThemeSettingsScreen, group: 'profile'},
    {name: 'About', component: AboutScreen, group: 'profile'},
];
