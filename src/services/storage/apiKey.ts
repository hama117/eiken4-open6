const API_KEY_STORAGE_KEY = 'openai_api_key';

export const apiKeyStorage = {
  get: (): string | null => {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  },

  set: (apiKey: string): void => {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  },

  remove: (): void => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  },

  exists: (): boolean => {
    const key = localStorage.getItem(API_KEY_STORAGE_KEY);
    return !!key && key.startsWith('sk-');
  }
};