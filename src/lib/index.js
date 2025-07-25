/**
 * Main library exports
 */

// Core systems
export { default as storage } from './storage';
export { default as apiClient } from './apiClient';
export { default as validationSystem } from './validation';
export { default as errorHandler } from './errorHandler';

// Constants
export * from './constants';

// Individual exports for convenience
export {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validateName,
  validateRequired,
  validateForm
} from './validation';

export {
  AppError,
  ValidationError,
  AuthError,
  NetworkError,
  FileError,
  StorageError
} from './errorHandler';

export {
  setUser,
  getUser,
  removeUser,
  setUsers,
  getUsers,
  setTheme,
  getTheme,
  setSettings,
  getSettings
} from './storage';