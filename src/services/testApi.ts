import { API_BASE_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Question {
  id: number;
  documentId: string;
  layout: {
    number: number;
    question: string;
    type: 'text-one' | 'text-two' | 'photo' | 'picture' | 'sign' | 'video';
    Language: 'Korean' | 'English';
  };
  choise: Array<{
    id: number;
    number: number;
    value: string;
    answer: boolean;
  }>;
  Additional?: Array<{
    mediafile?: {
      value: {
        url: string;
        mime: string;
      };
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

export interface Test {
  id: number;
  documentId: string;
  title: string;
  language: 'Korean' | 'English';
  duration: number;
  maxScore: number;
  passingScore: number;
  questions: Question[];
}

export interface TestAnswer {
  questionId: number;
  selectedAnswers: number[];
  timeSpent?: number;
}

export interface TestResult {
  id: number;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  startedAt: string;
  completedAt: string;
  duration: number;
  language: string;
  test: {
    title: string;
  };
}

export interface TestSubmission {
  testId: number;
  answers: TestAnswer[];
  startedAt: string;
  completedAt: string;
}

class TestApiService {
  private baseUrl = API_BASE_URL;

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Получить активный тест (временно создаем из существующих вопросов)
  async getActiveTest(language: 'Korean' | 'English' = 'Korean'): Promise<Test> {
    try {
      // Получаем все вопросы
      const response = await this.request<{
        data: Question[];
        meta: { pagination: { total: number } };
      }>(`/questions?populate=*&pagination[pageSize]=100&filters[layout][Language][$eq]=${language}`);

      const allQuestions = response.data;
      
      // Группируем вопросы по типам
      const questionsByType = {
        'text-one': allQuestions.filter(q => q.layout.type === 'text-one'),
        'text-two': allQuestions.filter(q => q.layout.type === 'text-two'),
        'photo': allQuestions.filter(q => q.layout.type === 'photo'),
        'picture': allQuestions.filter(q => q.layout.type === 'picture'),
        'sign': allQuestions.filter(q => q.layout.type === 'sign'),
        'video': allQuestions.filter(q => q.layout.type === 'video'),
      };

      // Требуемое количество вопросов каждого типа
      const requirements = [
        { type: 'text-one', count: 17 },
        { type: 'text-two', count: 4 },
        { type: 'photo', count: 6 },
        { type: 'picture', count: 7 },
        { type: 'sign', count: 5 },
        { type: 'video', count: 1 },
      ];

      const selectedQuestions: Question[] = [];

      // Выбираем случайные вопросы каждого типа
      for (const req of requirements) {
        const availableQuestions = questionsByType[req.type as keyof typeof questionsByType];
        const availableCount = availableQuestions.length;
        
        if (availableCount === 0) {
          console.warn(`No questions of type ${req.type} found`);
          continue;
        }

        // Берем доступное количество или требуемое (что меньше)
        const takeCount = Math.min(req.count, availableCount);
        
        // Перемешиваем и берем нужное количество
        const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
        selectedQuestions.push(...shuffled.slice(0, takeCount));
      }

      // Перемешиваем все выбранные вопросы
      const finalQuestions = selectedQuestions.sort(() => Math.random() - 0.5);

      // Создаем объект теста
      const test: Test = {
        id: Date.now(), // Временный ID
        documentId: `temp-test-${Date.now()}`,
        title: `${language} Driving Test`,
        language,
        duration: 40,
        maxScore: 100,
        passingScore: 60,
        questions: finalQuestions,
      };

      return test;
    } catch (error) {
      console.error('Error creating test from questions:', error);
      throw new Error('Failed to create test');
    }
  }

  // Отправить результаты теста (временно сохраняем локально)
  async submitTest(submission: TestSubmission): Promise<{
    result: TestResult;
    summary: {
      totalQuestions: number;
      correctAnswers: number;
      score: number;
      maxScore: number;
      percentage: number;
      isPassed: boolean;
      duration: number;
      breakdown: Record<string, { correct: number; total: number }>;
    };
  }> {
    try {
      // Вычисляем результаты локально
      let totalScore = 0;
      let correctAnswers = 0;
      const breakdown: Record<string, { correct: number; total: number }> = {
        'text-one': { correct: 0, total: 0 },
        'text-two': { correct: 0, total: 0 },
        'photo': { correct: 0, total: 0 },
        'picture': { correct: 0, total: 0 },
        'sign': { correct: 0, total: 0 },
        'video': { correct: 0, total: 0 },
      };

      // Получаем вопросы для проверки ответов
      const questionsResponse = await this.request<{
        data: Question[];
      }>(`/questions?populate=*&pagination[pageSize]=100`);
      
      const allQuestions = questionsResponse.data;

      for (const answer of submission.answers) {
        const question = allQuestions.find(q => q.id === answer.questionId);
        if (!question) continue;

        const questionType = question.layout.type;
        const correctChoices = question.choise.filter(choice => choice.answer).map(choice => choice.number);
        const selectedAnswers = Array.isArray(answer.selectedAnswers) ? answer.selectedAnswers : [answer.selectedAnswers];

        // Определяем баллы за вопрос
        let maxPoints = 2; // text-one, sign
        if (['text-two', 'photo', 'picture'].includes(questionType)) {
          maxPoints = 3;
        } else if (questionType === 'video') {
          maxPoints = 5;
        }

        // Проверяем правильность ответа
        let isCorrect = false;
        if (['text-one', 'sign', 'video'].includes(questionType)) {
          // Один правильный ответ
          isCorrect = selectedAnswers.length === 1 && correctChoices.includes(selectedAnswers[0]);
        } else {
          // Два правильных ответа (все или ничего)
          isCorrect = correctChoices.length === selectedAnswers.length && 
                     correctChoices.every(correct => selectedAnswers.includes(correct)) &&
                     selectedAnswers.every(selected => correctChoices.includes(selected));
        }

        if (isCorrect) {
          totalScore += maxPoints;
          correctAnswers++;
          breakdown[questionType].correct++;
        }
        breakdown[questionType].total++;
      }

      const percentage = (totalScore / 100) * 100;
      const isPassed = percentage >= 60;
      const duration = Math.floor((new Date(submission.completedAt).getTime() - new Date(submission.startedAt).getTime()) / 1000 / 60);

      // Создаем результат
      const result: TestResult = {
        id: Date.now(),
        score: totalScore,
        maxScore: 100,
        percentage: parseFloat(percentage.toFixed(2)),
        isPassed,
        startedAt: submission.startedAt,
        completedAt: submission.completedAt,
        duration,
        language: 'Korean',
        test: {
          title: 'Korean Driving Test',
        },
      };

      // Сохраняем результат локально
      const savedResults = await AsyncStorage.getItem('testResults');
      const results = savedResults ? JSON.parse(savedResults) : [];
      results.push(result);
      await AsyncStorage.setItem('testResults', JSON.stringify(results));

      return {
        result,
        summary: {
          totalQuestions: submission.answers.length,
          correctAnswers,
          score: totalScore,
          maxScore: 100,
          percentage: parseFloat(percentage.toFixed(2)),
          isPassed,
          duration,
          breakdown,
        },
      };
    } catch (error) {
      console.error('Error submitting test:', error);
      throw new Error('Failed to submit test');
    }
  }

  // Получить результаты студента (временно из локального хранилища)
  async getStudentResults(page = 1, pageSize = 10): Promise<{
    data: TestResult[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }> {
    try {
      const savedResults = await AsyncStorage.getItem('testResults');
      const allResults: TestResult[] = savedResults ? JSON.parse(savedResults) : [];
      
      // Сортируем по дате (новые сначала)
      allResults.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
      
      const total = allResults.length;
      const pageCount = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const data = allResults.slice(startIndex, endIndex);

      return {
        data,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount,
            total,
          },
        },
      };
    } catch (error) {
      console.error('Error getting student results:', error);
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 0,
            total: 0,
          },
        },
      };
    }
  }

  // Получить детальный результат теста
  async getTestResultDetail(resultId: number): Promise<TestResult & {
    answers: Array<{
      questionId: number;
      questionNumber: number;
      questionType: string;
      selectedAnswers: number[];
      correctAnswers: number[];
      isCorrect: boolean;
      pointsEarned: number;
      maxPoints: number;
    }>;
  }> {
    return this.request(`/test-results/${resultId}?populate=*`);
  }
}

export const testApi = new TestApiService();
