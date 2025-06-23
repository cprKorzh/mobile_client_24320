import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';
import {
  Exam,
  CreateExamRequest,
  Driving,
  CreateDrivingRequest,
  TimeSlot,
  BookingDay,
} from '../types/booking';

class BookingService {
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

  // Экзамены
  async createExam(examData: CreateExamRequest): Promise<Exam> {
    try {
      // Получаем ID текущего пользователя
      const userResponse = await this.request<{ id: number }>('/users/me');
      const userId = userResponse.id;

      // Добавляем пользователя к данным экзамена
      const examDataWithUser = {
        ...examData,
        users_permissions_user: userId,
      };

      console.log('Sending exam data:', examDataWithUser);

      const response = await this.request<{ data: Exam }>('/exams', {
        method: 'POST',
        body: JSON.stringify({ data: examDataWithUser }),
      });

      console.log('Created exam response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  }

  async getMyExams(): Promise<Exam[]> {
    try {
      const userResponse = await this.request<{ id: number }>('/users/me');
      const userId = userResponse.id;
      
      const response = await this.request<{ data: Exam[] }>(
        `/exams?filters[users_permissions_user][id][$eq]=${userId}&sort=start:asc`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching exams:', error);
      return [];
    }
  }

  async cancelExam(examId: number): Promise<void> {
    await this.request(`/exams/${examId}`, {
      method: 'DELETE',
    });
  }

  // Вождение
  async createDriving(drivingData: CreateDrivingRequest): Promise<Driving> {
    try {
      // Получаем ID текущего пользователя
      const userResponse = await this.request<{ id: number }>('/users/me');
      const userId = userResponse.id;

      // Добавляем пользователя к данным вождения
      // ВАЖНО: В схеме driving поле называется "user", а не "users_permissions_user"
      const drivingDataWithUser = {
        ...drivingData,
        user: userId,
      };

      console.log('Sending driving data:', drivingDataWithUser);

      const response = await this.request<{ data: Driving }>('/drivings', {
        method: 'POST',
        body: JSON.stringify({ data: drivingDataWithUser }),
      });

      console.log('Created driving response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating driving:', error);
      throw error;
    }
  }

  async getMyDrivings(): Promise<Driving[]> {
    try {
      const userResponse = await this.request<{ id: number }>('/users/me');
      const userId = userResponse.id;
      
      // ВАЖНО: В схеме driving поле называется "user", а не "users_permissions_user"
      const response = await this.request<{ data: Driving[] }>(
        `/drivings?filters[user][id][$eq]=${userId}&sort=start:asc`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching drivings:', error);
      return [];
    }
  }

  async cancelDriving(drivingId: number): Promise<void> {
    await this.request(`/drivings/${drivingId}`, {
      method: 'DELETE',
    });
  }

  // Генерация доступных временных слотов (заглушка)
  generateTimeSlots(date: string): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          id: `${date}-${timeString}`,
          time: timeString,
          available: Math.random() > 0.3, // 70% вероятность что слот доступен
        });
      }
    }
    
    return slots;
  }

  // Получение доступных дней для бронирования
  getAvailableDays(daysCount: number = 14): BookingDay[] {
    const days: BookingDay[] = [];
    const today = new Date();
    
    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Пропускаем воскресенья
      if (date.getDay() === 0) continue;
      
      const dateString = date.toISOString().split('T')[0];
      days.push({
        date: dateString,
        slots: this.generateTimeSlots(dateString),
      });
    }
    
    return days;
  }
}

export const bookingService = new BookingService();
