import {makeAutoObservable, runInAction} from 'mobx';
import {apiService} from '../services/api';
import {User} from '../types';

export class AuthStore {
    user: User | null = null;
    isLoading = false;
    error: string | null = null;
    isAuthenticated = false;

    constructor() {
        makeAutoObservable(this);
        this.checkAuthStatus();
    }

    private async checkAuthStatus() {
        this.isAuthenticated = apiService.isAuthenticated();
    }

    async login(identifier: string, password: string): Promise<boolean> {
        this.setLoading(true);
        this.setError(null);

        try {
            const response = await apiService.login(identifier, password);

            runInAction(() => {
                this.user = {
                    id: response.user.id,
                    username: response.user.username,
                    email: response.user.email,
                    jwt: response.jwt,
                };
                this.isAuthenticated = true;
            });

            return true;
        } catch (error) {
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Login failed');
            });
            return false;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async register(username: string, email: string, password: string): Promise<boolean> {
        this.setLoading(true);
        this.setError(null);

        try {
            const response = await apiService.register(username, email, password);

            runInAction(() => {
                this.user = {
                    id: response.user.id,
                    username: response.user.username,
                    email: response.user.email,
                    jwt: response.jwt,
                };
                this.isAuthenticated = true;
            });

            return true;
        } catch (error) {
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Registration failed');
            });
            return false;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async logout(): Promise<void> {
        try {
            await apiService.logout();
            runInAction(() => {
                this.user = null;
                this.isAuthenticated = false;
                this.error = null;
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    private setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    private setError(error: string | null) {
        this.error = error;
    }

    clearError() {
        this.error = null;
    }
}
