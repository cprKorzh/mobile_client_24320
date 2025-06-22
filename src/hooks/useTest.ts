import { useState, useEffect, useCallback } from 'react';
import { testService } from '../services/testService';
import type { Test, TestResult, StudentStats, Language } from '../types/test';

export const useTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTest = useCallback(async (language: Language = 'Korean'): Promise<Test | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const test = await testService.generateTest(language);
      return test;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate test';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStudentResults = useCallback(async (page = 1, pageSize = 10) => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await testService.getStudentResults(page, pageSize);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get results';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDetailedResult = useCallback(async (resultId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await testService.getDetailedResult(resultId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get detailed result';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    generateTest,
    getStudentResults,
    getDetailedResult,
    clearError,
  };
};

export const useStudentStats = () => {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Временно используем getStudentResults для получения статистики
      const results = await testService.getStudentResults(1, 100);
      // Здесь можно добавить логику для вычисления статистики из результатов
      const studentStats: StudentStats = {
        totalTests: results.data.length,
        passedTests: results.data.filter(r => r.isPassed).length,
        failedTests: results.data.filter(r => !r.isPassed).length,
        averageScore: results.data.length > 0 
          ? results.data.reduce((sum, r) => sum + r.percentage, 0) / results.data.length 
          : 0,
        bestScore: results.data.length > 0 
          ? Math.max(...results.data.map(r => r.percentage)) 
          : 0,
        averageTime: results.data.length > 0 
          ? results.data.reduce((sum, r) => sum + r.duration, 0) / results.data.length 
          : 0,
        strongestTypes: [],
        weakestTypes: [],
        recentResults: results.data.slice(0, 5),
      };
      setStats(studentStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load stats';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    isLoading,
    error,
    refreshStats: loadStats,
  };
};
