/**
 * Centralized error handling utilities
 */

import { MESSAGES } from '../constants';

export class AppError extends Error {
  constructor(message, code = 'GENERIC_ERROR', statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  GENERIC_ERROR: 'GENERIC_ERROR'
};

export const errorHandler = {
  /**
   * Handle and format errors for user display
   */
  handleError(error) {
    console.error('Error occurred:', error);
    
    if (error instanceof AppError) {
      return {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode
      };
    }
    
    // Handle different error types
    if (error.name === 'ValidationError') {
      return {
        message: MESSAGES.VALIDATION_ERROR || 'Dữ liệu không hợp lệ',
        code: ErrorCodes.VALIDATION_ERROR,
        statusCode: 400
      };
    }
    
    if (error.name === 'NetworkError') {
      return {
        message: MESSAGES.NETWORK_ERROR || 'Lỗi kết nối mạng',
        code: ErrorCodes.NETWORK_ERROR,
        statusCode: 500
      };
    }
    
    // Default error
    return {
      message: MESSAGES.GENERIC_ERROR || 'Đã xảy ra lỗi không xác định',
      code: ErrorCodes.GENERIC_ERROR,
      statusCode: 500
    };
  },

  /**
   * Create validation error
   */
  createValidationError(message) {
    return new AppError(message, ErrorCodes.VALIDATION_ERROR, 400);
  },

  /**
   * Create authentication error
   */
  createAuthError(message) {
    return new AppError(message, ErrorCodes.AUTH_ERROR, 401);
  },

  /**
   * Create network error
   */
  createNetworkError(message) {
    return new AppError(message, ErrorCodes.NETWORK_ERROR, 500);
  }
};