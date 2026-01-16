import { VALIDATION } from '../constants';
import type { Job } from '../types/Job';

/**
 * Validate username
 */
export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  if (!username.trim()) {
    return { valid: false, error: 'Username is required' };
  }
  if (username.length < VALIDATION.MIN_USERNAME_LENGTH) {
    return { valid: false, error: `Username must be at least ${VALIDATION.MIN_USERNAME_LENGTH} characters` };
  }
  return { valid: true };
};

/**
 * Validate password
 */
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password.trim()) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters` };
  }
  return { valid: true };
};

/**
 * Validate job data
 */
export const validateJob = (job: Partial<Job>): { valid: boolean; error?: string } => {
  if (!job.company?.trim()) {
    return { valid: false, error: 'Company name is required' };
  }
  if (job.company.length < VALIDATION.MIN_COMPANY_LENGTH) {
    return { valid: false, error: `Company name must be at least ${VALIDATION.MIN_COMPANY_LENGTH} characters` };
  }
  
  if (!job.role?.trim()) {
    return { valid: false, error: 'Job role is required' };
  }
  if (job.role.length < VALIDATION.MIN_ROLE_LENGTH) {
    return { valid: false, error: `Job role must be at least ${VALIDATION.MIN_ROLE_LENGTH} characters` };
  }
  
  if (!job.dateApplied) {
    return { valid: false, error: 'Date applied is required' };
  }
  
  if (job.extraDetails && job.extraDetails.length > VALIDATION.MAX_EXTRA_DETAILS_LENGTH) {
    return { valid: false, error: `Extra details must be less than ${VALIDATION.MAX_EXTRA_DETAILS_LENGTH} characters` };
  }
  
  return { valid: true };
};

/**
 * Sanitize input string
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script[^>]*>.*?<\/script>/gi, '');
};