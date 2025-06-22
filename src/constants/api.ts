// API Configuration
export const API_BASE_URL = 'http://192.168.0.38:25546/api';
export const MEDIA_BASE_URL = 'http://localhost:25546';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/local',
    REGISTER: '/auth/local/register',
    ME: '/users/me',
  },
  
  // Tests
  TESTS: {
    ACTIVE: '/tests/active',
    GENERATE: '/tests/generate',
  },
  
  // Test Results
  TEST_RESULTS: {
    SUBMIT: '/test-results/submit',
    MY_RESULTS: '/test-results/my-results',
    ALL: '/test-results/all',
  },
  
  // Questions
  QUESTIONS: '/questions',
  
  // Media Files
  MEDIA_FILES: '/mediafiles',
};
