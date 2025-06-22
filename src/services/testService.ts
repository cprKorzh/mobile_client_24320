import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';
import {
  Test,
  Question,
  TestSubmission,
  TestResult,
  DetailedTestResult,
  StudentStats,
  TestConfiguration,
  QuestionType,
  Language,
  QuestionTypeBreakdown,
  TestAnswer,
  StrapiTestAnswer,
  StrapiTestResult
} from '../types/test';

// Конфигурация теста
const TEST_CONFIG: TestConfiguration = {
  totalQuestions: 40,
  passingScore: 60,
  maxScore: 100,
  questionTypes: {
    'text-one': { count: 17, points: 2, multipleAnswers: false },
    'text-two': { count: 4, points: 3, multipleAnswers: true },
    'photo': { count: 6, points: 3, multipleAnswers: true },
    'picture': { count: 7, points: 3, multipleAnswers: true },
    'sign': { count: 5, points: 2, multipleAnswers: false },
    'video': { count: 1, points: 5, multipleAnswers: false },
  },
};

class TestService {
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
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Получить все доступные вопросы по языку
   */
  private async getAllQuestions(language: Language): Promise<Question[]> {
    const response = await this.request<{
      data: Question[];
      meta: { pagination: { total: number } };
    }>(`/questions?populate=*&pagination[pageSize]=1000&filters[layout][Language][$eq]=${language}`);

    return response.data;
  }

  /**
   * Создать тест из доступных вопросов согласно конфигурации
   */
  async generateTest(language: Language = 'Korean'): Promise<Test> {
    try {
      console.log(`Generating test for language: ${language}`);
      
      const allQuestions = await this.getAllQuestions(language);
      console.log(`Found ${allQuestions.length} questions total`);

      // Группируем вопросы по типам
      const questionsByType: Record<QuestionType, Question[]> = {
        'text-one': [],
        'text-two': [],
        'photo': [],
        'picture': [],
        'sign': [],
        'video': [],
      };

      allQuestions.forEach(question => {
        const type = question.layout.type;
        if (questionsByType[type]) {
          questionsByType[type].push(question);
        }
      });

      const selectedQuestions: Question[] = [];

      // Выбираем случайные вопросы каждого типа согласно конфигурации
      Object.entries(TEST_CONFIG.questionTypes).forEach(([type, config]) => {
        const availableQuestions = questionsByType[type as QuestionType];
        const requiredCount = config.count;
        const availableCount = availableQuestions.length;

        if (availableCount === 0) {
          console.warn(`⚠️ No questions of type ${type} found!`);
          return;
        }

        const takeCount = Math.min(requiredCount, availableCount);
        const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, takeCount);
        
        selectedQuestions.push(...selected);
        console.log(`Selected ${selected.length} questions of type ${type}`);
      });

      // Перемешиваем все выбранные вопросы для случайного порядка
      const finalQuestions = selectedQuestions.sort(() => Math.random() - 0.5);

      const test: Test = {
        id: Date.now(),
        documentId: `test-${Date.now()}`,
        title: `${language} Driving Safety Test`,
        language,
        duration: 40,
        maxScore: TEST_CONFIG.maxScore,
        passingScore: TEST_CONFIG.passingScore,
        questions: finalQuestions,
        createdAt: new Date().toISOString(),
        configuration: TEST_CONFIG,
      };

      return test;
    } catch (error) {
      console.error('Error generating test:', error);
      throw new Error('Failed to generate test. Please try again.');
    }
  }

  /**
   * Проверить ответы и вычислить результат
   */
  private calculateTestResult(
    test: Test,
    submission: TestSubmission
  ): { result: TestResult; detailed: DetailedTestResult } {
    let totalScore = 0;
    let correctAnswers = 0;
    
    const breakdown: QuestionTypeBreakdown = {
      'text-one': { correct: 0, total: 0, points: 0, maxPoints: 0 },
      'text-two': { correct: 0, total: 0, points: 0, maxPoints: 0 },
      'photo': { correct: 0, total: 0, points: 0, maxPoints: 0 },
      'picture': { correct: 0, total: 0, points: 0, maxPoints: 0 },
      'sign': { correct: 0, total: 0, points: 0, maxPoints: 0 },
      'video': { correct: 0, total: 0, points: 0, maxPoints: 0 },
    };

    const detailedAnswers: DetailedTestResult['answers'] = [];

    submission.answers.forEach(answer => {
      const question = test.questions.find(q => q.id === answer.questionId);
      if (!question) return;

      const questionType = question.layout.type;
      const config = TEST_CONFIG.questionTypes[questionType];
      const correctChoices = question.choise
        .filter(choice => choice.answer)
        .map(choice => choice.number);

      let isCorrect = false;
      let pointsEarned = 0;

      if (config.multipleAnswers) {
        // Для вопросов с множественными ответами - все или ничего
        isCorrect = correctChoices.length === answer.selectedAnswers.length && 
                   correctChoices.every(correct => answer.selectedAnswers.includes(correct)) &&
                   answer.selectedAnswers.every(selected => correctChoices.includes(selected));
      } else {
        // Для вопросов с одним ответом
        isCorrect = answer.selectedAnswers.length === 1 && 
                   correctChoices.includes(answer.selectedAnswers[0]);
      }

      if (isCorrect) {
        pointsEarned = config.points;
        totalScore += pointsEarned;
        correctAnswers++;
        breakdown[questionType].correct++;
        breakdown[questionType].points += pointsEarned;
      }

      breakdown[questionType].total++;
      breakdown[questionType].maxPoints += config.points;

      detailedAnswers.push({
        questionId: question.id,
        questionNumber: question.layout.number,
        questionType: questionType,
        questionText: question.layout.question,
        selectedAnswers: answer.selectedAnswers,
        correctAnswers: correctChoices,
        selectedChoices: answer.selectedAnswers.map(num => 
          question.choise.find(c => c.number === num)?.value || ''
        ),
        correctChoices: correctChoices.map(num => 
          question.choise.find(c => c.number === num)?.value || ''
        ),
        isCorrect,
        pointsEarned,
        maxPoints: config.points,
        timeSpent: answer.timeSpent,
      });
    });

    const percentage = (totalScore / TEST_CONFIG.maxScore) * 100;
    const isPassed = percentage >= TEST_CONFIG.passingScore;
    const duration = Math.floor(submission.totalTimeSpent / 60);

    const result: TestResult = {
      id: Date.now(),
      score: totalScore,
      maxScore: TEST_CONFIG.maxScore,
      percentage: parseFloat(percentage.toFixed(2)),
      isPassed,
      startedAt: submission.startedAt,
      completedAt: submission.completedAt,
      duration,
      language: submission.language,
      test: {
        id: test.id,
        title: test.title,
      },
      breakdown,
    };

    const detailed: DetailedTestResult = {
      ...result,
      answers: detailedAnswers,
    };

    return { result, detailed };
  }

  /**
   * Отправить результаты теста на Strapi сервер
   */
  private async submitToStrapi(
    test: Test,
    submission: TestSubmission,
    result: TestResult,
    detailedAnswers: DetailedTestResult['answers']
  ): Promise<void> {
    try {
      // Получаем ID текущего пользователя
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.warn('No auth token found, skipping Strapi submission');
        return;
      }

      // Получаем информацию о пользователе
      const userResponse = await this.request<{ id: number }>('/users/me');
      const userId = userResponse.id;

      // Подготавливаем ответы для Strapi
      const strapiAnswers: StrapiTestAnswer[] = detailedAnswers.map(answer => ({
        questionId: answer.questionId,
        questionNumber: answer.questionNumber,
        questionType: answer.questionType,
        selectedAnswers: answer.selectedAnswers,
        correctAnswers: answer.correctAnswers,
        isCorrect: answer.isCorrect,
        pointsEarned: answer.pointsEarned,
        maxPoints: answer.maxPoints,
        timeSpent: answer.timeSpent,
      }));

      // Подготавливаем данные для отправки
      const strapiResult: StrapiTestResult = {
        student: userId,
        answers: strapiAnswers,
        score: result.score,
        maxScore: result.maxScore,
        percentage: Math.round(result.percentage), // Strapi ожидает biginteger
        isPassed: result.isPassed,
        startedAt: submission.startedAt,
        completeAt: submission.completedAt, // Обратите внимание на название поля
        duration: result.duration,
        language: submission.language,
        questionStats: result.breakdown,
      };

      // Отправляем на сервер
      const response = await this.request<{ data: any }>('/test-results', {
        method: 'POST',
        body: JSON.stringify({ data: strapiResult }),
      });

      console.log('Test result successfully submitted to Strapi:', response.data.id);
    } catch (error) {
      console.error('Error submitting to Strapi:', error);
      // Не прерываем выполнение, если отправка на сервер не удалась
      // Результат уже сохранен локально
    }
  }

  /**
   * Получить результаты тестов с сервера
   */
  async getServerResults(page = 1, pageSize = 10): Promise<{
    data: TestResult[];
    meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number; } };
  }> {
    try {
      const response = await this.request<{
        data: any[];
        meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number; } };
      }>(`/test-results?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=completeAt:desc`);

      // Преобразуем данные Strapi в локальный формат
      const transformedData: TestResult[] = response.data.map(item => ({
        id: item.id,
        score: parseInt(item.score),
        maxScore: parseInt(item.maxScore),
        percentage: parseInt(item.percentage),
        isPassed: item.isPassed,
        startedAt: item.startedAt,
        completedAt: item.completeAt,
        duration: parseInt(item.duration),
        language: item.language,
        test: {
          id: 0, // Временно, так как тест не связан напрямую
          title: `${item.language} Driving Safety Test`,
        },
        breakdown: item.questionStats || {
          'text-one': { correct: 0, total: 0, points: 0, maxPoints: 0 },
          'text-two': { correct: 0, total: 0, points: 0, maxPoints: 0 },
          'photo': { correct: 0, total: 0, points: 0, maxPoints: 0 },
          'picture': { correct: 0, total: 0, points: 0, maxPoints: 0 },
          'sign': { correct: 0, total: 0, points: 0, maxPoints: 0 },
          'video': { correct: 0, total: 0, points: 0, maxPoints: 0 },
        },
      }));

      return {
        data: transformedData,
        meta: response.meta,
      };
    } catch (error) {
      console.error('Error getting server results:', error);
      // Возвращаем локальные результаты в случае ошибки
      return this.getStudentResults(page, pageSize);
    }
  }
  async submitTest(submission: TestSubmission): Promise<{
    result: TestResult;
    detailed: DetailedTestResult;
    summary: {
      totalQuestions: number;
      correctAnswers: number;
      score: number;
      maxScore: number;
      percentage: number;
      isPassed: boolean;
      duration: number;
      breakdown: QuestionTypeBreakdown;
    };
  }> {
    try {
      const savedTest = await AsyncStorage.getItem(`test_${submission.testId}`);
      if (!savedTest) {
        throw new Error('Test not found');
      }

      const test: Test = JSON.parse(savedTest);
      const { result, detailed } = this.calculateTestResult(test, submission);

      await this.saveTestResult(result);
      await this.saveDetailedResult(detailed);

      // Отправляем результаты на Strapi сервер
      await this.submitToStrapi(test, submission, result, detailed.answers);

      await AsyncStorage.removeItem(`test_${submission.testId}`);

      const summary = {
        totalQuestions: submission.answers.length,
        correctAnswers: detailed.answers.filter(a => a.isCorrect).length,
        score: result.score,
        maxScore: result.maxScore,
        percentage: result.percentage,
        isPassed: result.isPassed,
        duration: result.duration,
        breakdown: result.breakdown,
      };

      return { result, detailed, summary };
    } catch (error) {
      console.error('Error submitting test:', error);
      throw new Error('Failed to submit test results');
    }
  }

  async saveTest(test: Test): Promise<void> {
    await AsyncStorage.setItem(`test_${test.id}`, JSON.stringify(test));
  }

  private async saveTestResult(result: TestResult): Promise<void> {
    const savedResults = await AsyncStorage.getItem('testResults');
    const results: TestResult[] = savedResults ? JSON.parse(savedResults) : [];
    results.push(result);
    await AsyncStorage.setItem('testResults', JSON.stringify(results));
  }

  private async saveDetailedResult(detailed: DetailedTestResult): Promise<void> {
    await AsyncStorage.setItem(`detailed_result_${detailed.id}`, JSON.stringify(detailed));
  }

  /**
   * Получить результаты студента (сначала с сервера, потом локальные)
   */
  async getStudentResults(page = 1, pageSize = 10, useServer = true): Promise<{
    data: TestResult[];
    meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number; } };
  }> {
    // Сначала пытаемся получить с сервера
    if (useServer) {
      try {
        const serverResults = await this.getServerResults(page, pageSize);
        if (serverResults.data.length > 0) {
          return serverResults;
        }
      } catch (error) {
        console.log('Server results not available, using local results');
      }
    }

    // Если сервер недоступен или нет результатов, используем локальные
    try {
      const savedResults = await AsyncStorage.getItem('testResults');
      const allResults: TestResult[] = savedResults ? JSON.parse(savedResults) : [];
      
      allResults.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
      
      const total = allResults.length;
      const pageCount = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const data = allResults.slice(startIndex, endIndex);

      return { data, meta: { pagination: { page, pageSize, pageCount, total } } };
    } catch (error) {
      console.error('Error getting student results:', error);
      return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
    }
  }

  async getDetailedResult(resultId: number): Promise<DetailedTestResult | null> {
    try {
      const saved = await AsyncStorage.getItem(`detailed_result_${resultId}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error getting detailed result:', error);
      return null;
    }
  }
}

export const testService = new TestService();
