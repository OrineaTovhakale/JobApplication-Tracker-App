import { AUTH_TOKEN_KEY } from '../constants';

export const getCurrentUser = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setCurrentUser = (username: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, username);
};

export const removeCurrentUser = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};