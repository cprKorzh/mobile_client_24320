// Типы вопросов и их конфигурация
export type QuestionType = 'text-one' | 'text-two' | 'photo' | 'picture' | 'sign' | 'video';
export type Language = 'Korean' | 'English';

// Конфигурация теста
export interface TestConfiguration {
  totalQuestions: 40;
  passingScore: 60;
  maxScore: 100;
  questionTypes: {
    'text-one': { count: 17; points: 2; multipleAnswers: false };
    'text-two': { count: 4; points: 3; multipleAnswers: true };
    'photo': { count: 6; points: 3; multipleAnswers: true };
    'picture': { count: 7; points: 3; multipleAnswers: true };
    'sign': { count: 5; points: 2; multipleAnswers: false };
    'video': { count: 1; points: 5; multipleAnswers: false };
  };
}

// Интерфейс для медиафайлов
export interface MediaFile {
  url: string;
  mime: string;
  name?: string;
  size?: number;
}

// Интерфейс для варианта ответа
export interface Choice {
  id: number;
  number: number;
  value: string;
  answer: boolean; // true если это правильный ответ
}

// Интерфейс для вопроса
export interface Question {
  id: number;
  documentId: string;
  layout: {
    number: number;
    question: string;
    type: QuestionType;
    Language: Language;
  };
  choise: Choice[];
  Additional?: Array<{
    mediafile?: {
      value: MediaFile;
    };
  }>;
  Description?: {
    value: Array<{
      type: string;
      children: Array<{
        text: string;
        type: string;
      }>;
    }>;
  };
}

// Интерфейс для теста
export interface Test {
  id: number;
  documentId: string;
  title: string;
  language: Language;
  duration: number; // в минутах
  maxScore: number;
  passingScore: number;
  questions: Question[];
  createdAt: string;
  configuration: TestConfiguration;
}

// Интерфейс для ответа студента (локальный)
export interface TestAnswer {
  questionId: number;
  questionNumber: number;
  questionType: QuestionType;
  selectedAnswers: number[]; // номера выбранных ответов
  timeSpent?: number; // время в секундах
  isAnswered: boolean;
}

// Интерфейс для ответа в Strapi (компонент test.test-answer)
export interface StrapiTestAnswer {
  questionId: number;
  questionNumber: number;
  questionType: QuestionType;
  selectedAnswers: number[];
  correctAnswers: number[];
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  timeSpent?: number;
}

// Интерфейс для отправки теста
export interface TestSubmission {
  testId: number;
  language: Language;
  answers: TestAnswer[];
  startedAt: string;
  completedAt: string;
  totalTimeSpent: number; // в секундах
}

// Интерфейс для результата теста в Strapi
export interface StrapiTestResult {
  student: number; // ID пользователя
  answers: StrapiTestAnswer[];
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  startedAt: string;
  completeAt: string; // Обратите внимание: completeAt, не completedAt
  duration: number; // в минутах
  language: Language;
  questionStats: QuestionTypeBreakdown;
}

// Интерфейс для результата теста (локальный)
export interface TestResult {
  id: number;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  startedAt: string;
  completedAt: string;
  duration: number; // в минутах
  language: Language;
  test: {
    id: number;
    title: string;
  };
  breakdown: QuestionTypeBreakdown;
}

// Разбивка по типам вопросов
export interface QuestionTypeBreakdown {
  'text-one': { correct: number; total: number; points: number; maxPoints: number };
  'text-two': { correct: number; total: number; points: number; maxPoints: number };
  'photo': { correct: number; total: number; points: number; maxPoints: number };
  'picture': { correct: number; total: number; points: number; maxPoints: number };
  'sign': { correct: number; total: number; points: number; maxPoints: number };
  'video': { correct: number; total: number; points: number; maxPoints: number };
}

// Детальный результат с ответами
export interface DetailedTestResult extends TestResult {
  answers: Array<{
    questionId: number;
    questionNumber: number;
    questionType: QuestionType;
    questionText: string;
    selectedAnswers: number[];
    correctAnswers: number[];
    selectedChoices: string[];
    correctChoices: string[];
    isCorrect: boolean;
    pointsEarned: number;
    maxPoints: number;
    timeSpent?: number;
  }>;
}

// Статистика студента
export interface StudentStats {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageScore: number;
  bestScore: number;
  averageTime: number; // в минутах
  strongestTypes: QuestionType[];
  weakestTypes: QuestionType[];
  recentResults: TestResult[];
}

// Интерфейс для прогресса теста
export interface TestProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: number;
  timeRemaining: number; // в секундах
  timeElapsed: number; // в секундах
  answers: TestAnswer[];
}
