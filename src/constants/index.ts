export const API_BASE_URL = 'http://localhost:3001';

export const AUTH_TOKEN_KEY = 'token';

export const JOB_STATUSES = ['Applied', 'Interviewed', 'Offered', 'Rejected'] as const;

export const VALIDATION = {
  MIN_USERNAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 6,
  MIN_COMPANY_LENGTH: 2,
  MIN_ROLE_LENGTH: 2,
  MAX_EXTRA_DETAILS_LENGTH: 500,
} as const;

export const MESSAGES = {
  REQUIRED_FIELDS: 'All required fields must be filled',
  INVALID_CREDENTIALS: 'Invalid username or password',
  USERNAME_EXISTS: 'Username already exists',
  REGISTRATION_SUCCESS: 'Registration successful! Redirecting to login…',
  LOGIN_SUCCESS: 'Welcome back!',
  JOB_ADDED: 'Job application added successfully!',
  JOB_UPDATED: 'Job application updated successfully!',
  JOB_DELETED: 'Job application deleted successfully!',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  CONFIRM_DELETE: 'Are you sure you want to delete this job application? This cannot be undone.',
} as const;