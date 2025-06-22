export type RootStackParamList = {
  MainTabs: undefined;
  
  // Занятия
  Lessons: undefined;
  LessonChapters: { lessonId: string; lessonTitle: string };
  ChapterVideos: { chapterId: string; chapterTitle: string };
  VideoDetail: { videoId: string; videoTitle: string };
  
  // Вождение
  Driving: undefined;
  DrivingLessons: undefined;
  DrivingLesson: { lessonId: string; lessonTitle: string };
  
  // Тесты
  Tests: undefined;
  TestCategories: undefined;
  TestQuestions: { categoryId: string; categoryTitle: string };
  TestResult: { testId: string; score: number };
  
  // Экзамен
  Exam: undefined;
  ExamPreparation: undefined;
  ExamSession: { examId: string };
  ExamResult: { examId: string; score: number };
  
  // Вопросы
  Questions: undefined;
  QuestionCategories: undefined;
  QuestionList: { categoryId: string; categoryTitle: string };
  QuestionDetail: { questionId: string };
  
  // План
  Plan: undefined;
  PlanDetails: { planId: string };
  
  // Результаты
  Results: undefined;
  ResultDetails: { resultId: string };
  
  // Правила
  Rules: undefined;
  RuleCategories: undefined;
  RuleDetail: { ruleId: string; ruleTitle: string };
  
  // Профиль
  LanguageSettings: undefined;
  ProfileSettings: undefined;
  About: undefined;
};

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Calendar: undefined;
  Profile: undefined;
};
