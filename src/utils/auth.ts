import { AUTH_TOKEN_KEY } from '../constants';

/**
 * Get current authenticated username
 */
export const getCurrentUser = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Set authenticated user
 */
export const setCurrentUser = (username: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, username);
};

/**
 * Remove authenticated user
 */
export const removeCurrentUser = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};