// Типы для экзаменов
export type ExamType = 'Тестирование' | 'Автодром' | 'Город';
export type ExamStatus = 'В процессе' | 'Сдан' | 'Не сдан';

export interface Exam {
  id: number;
  documentId?: string;
  exam_type: ExamType;
  start: string; // ISO datetime string
  exam_status: ExamStatus;
  users_permissions_user?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExamRequest {
  exam_type: ExamType;
  start: string;
  exam_status?: ExamStatus;
}

// Типы для вождения
export type DrivingType = 'Симулятор' | 'Автодром' | 'Город';
export type DrivingStatus = 'В процессе' | 'Пройдено' | 'Не пройдено';

export interface Driving {
  id: number;
  documentId?: string;
  driving_type: DrivingType;
  start: string; // ISO datetime string
  end?: string; // ISO datetime string
  driving_status: DrivingStatus;
  user?: number; // В схеме driving поле называется "user"
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDrivingRequest {
  driving_type: DrivingType;
  start: string;
  end?: string;
  driving_status?: DrivingStatus;
}

// Общие типы для календаря
export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface BookingDay {
  date: string;
  slots: TimeSlot[];
}
