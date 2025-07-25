/**
 * Type definitions and interfaces for the application
 */

// User related types
export const UserTypes = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

// Form validation types
export const ValidationTypes = {
  REQUIRED: 'required',
  EMAIL: 'email',
  PASSWORD: 'password',
  PHONE: 'phone',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength'
};

// API response types
export const ApiResponseTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading'
};

// Theme types
export const ThemeTypes = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Page types
export const PageTypes = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  PROFILE: 'profile',
  DASHBOARD: 'dashboard',
  SETTINGS: 'settings'
};