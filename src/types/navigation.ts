import { Test, TestResult } from '../services/testApi';

export type RootStackParamList = {
  Home: undefined;
  MainTabs: undefined;
  
  // Test screens
  TestEntry: undefined;
  TestQuestion: { testId: number };
  TestResults: undefined;
  TestResult: undefined;
  TestResultDetail: {
    resultId?: number;
    result?: TestResult;
    summary?: any;
  };
  
  // Other screens
  Tests: undefined;
  Lessons: undefined;
  LessonChapters: { lessonId: string };
  ChapterVideos: { chapterId: string };
  VideoDetail: { videoId: string };
  
  // Profile screens
  LanguageSettings: undefined;
  ProfileSettings: undefined;
  About: undefined;
  
  // Other sections
  Driving: undefined;
  Exam: undefined;
  Questions: undefined;
  Plan: undefined;
  Results: undefined;
  Rules: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
