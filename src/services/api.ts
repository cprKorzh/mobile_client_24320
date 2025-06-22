import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthResponse} from '../types';
import {API_CONFIG} from '../utils/constants';

class ApiService {
    private baseURL: string;
    private token: string | null = null;

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.loadToken();

        // Логируем URL для отладки
        console.log('API Base URL:', this.baseURL);
    }

    private async loadToken() {
        try {
            const token = await AsyncStorage.getItem('authToken');
            this.token = token;
        } catch (error) {
            console.error('Error loading token:', error);
        }
    }

    private async saveToken(token: string) {
        try {
            await AsyncStorage.setItem('authToken', token);
            this.token = token;
        } catch (error) {
            console.error('Error saving token:', error);
        }
    }

    private async removeToken() {
        try {
            await AsyncStorage.removeItem('authToken');
            this.token = null;
        } catch (error) {
            console.error('Error removing token:', error);
        }
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const config: RequestInit = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Auth methods
    async login(identifier: string, password: string): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/local', {
            method: 'POST',
            body: JSON.stringify({identifier, password}),
        });

        await this.saveToken(response.jwt);
        return response;
    }

    async register(username: string, email: string, password: string): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/local/register', {
            method: 'POST',
            body: JSON.stringify({username, email, password}),
        });

        await this.saveToken(response.jwt);
        return response;
    }

    async logout(): Promise<void> {
        await this.removeToken();
    }

    // Generic CRUD methods
    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint);
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        });
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }
}

export const apiService = new ApiService();
