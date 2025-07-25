/**
 * Enhanced error handling system
 */

import { ERROR_CODES, MESSAGES } from './constants';

export class AppError extends Error {
  constructor(message, code = ERROR_CODES.GENERIC_ERROR, statusCode = 500, details = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.stack = Error.captureStackTrace ? Error.captureStackTrace(this, AppError) : (new Error()).stack;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null, value = null) {
    super(message, ERROR_CODES.VALIDATION_ERROR, 400, { field, value });
  }
}

export class AuthError extends AppError {
  constructor(message, action = null) {
    super(message, ERROR_CODES.AUTH_ERROR, 401, { action });
  }
}

export class NetworkError extends AppError {
  constructor(message, url = null, method = null) {
    super(message, ERROR_CODES.NETWORK_ERROR, 500, { url, method });
  }
}

export class FileError extends AppError {
  constructor(message, fileName = null, fileSize = null) {
    super(message, ERROR_CODES.FILE_ERROR, 400, { fileName, fileSize });
  }
}

export class StorageError extends AppError {
  constructor(message, key = null) {
    super(message, ERROR_CODES.STORAGE_ERROR, 500, { key });
  }
}

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.setupGlobalErrorHandlers();
  }

  setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(new AppError(
        `Unhandled Promise Rejection: ${event.reason}`,
        ERROR_CODES.GENERIC_ERROR,
        500
      ));
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.logError(new AppError(
        `Global Error: ${event.message}`,
        ERROR_CODES.GENERIC_ERROR,
        500,
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      ));
    });
  }

  handleError(error, context = {}) {
    let processedError;

    if (error instanceof AppError) {
      processedError = error;
    } else if (error instanceof Error) {
      processedError = new AppError(
        error.message,
        this.getErrorCode(error),
        500,
        { originalError: error.name, context }
      );
    } else {
      processedError = new AppError(
        String(error),
        ERROR_CODES.GENERIC_ERROR,
        500,
        { context }
      );
    }

    this.logError(processedError);
    return this.formatErrorForUser(processedError);
  }

  getErrorCode(error) {
    if (error.name === 'ValidationError') return ERROR_CODES.VALIDATION_ERROR;
    if (error.name === 'NetworkError') return ERROR_CODES.NETWORK_ERROR;
    if (error.name === 'TypeError') return ERROR_CODES.GENERIC_ERROR;
    return ERROR_CODES.GENERIC_ERROR;
  }

  formatErrorForUser(error) {
    const userMessage = this.getUserFriendlyMessage(error);
    
    return {
      message: userMessage,
      code: error.code,
      statusCode: error.statusCode,
      timestamp: error.timestamp,
      id: this.generateErrorId()
    };
  }

  getUserFriendlyMessage(error) {
    switch (error.code) {
      case ERROR_CODES.VALIDATION_ERROR:
        return error.message || MESSAGES.ERROR.GENERIC_ERROR;
      case ERROR_CODES.AUTH_ERROR:
        return error.message || MESSAGES.ERROR.LOGIN_FAILED;
      case ERROR_CODES.NETWORK_ERROR:
        return MESSAGES.ERROR.NETWORK_ERROR;
      case ERROR_CODES.FILE_ERROR:
        return error.message || MESSAGES.ERROR.FILE_INVALID_TYPE;
      case ERROR_CODES.STORAGE_ERROR:
        return 'Lỗi lưu trữ dữ liệu';
      default:
        return MESSAGES.ERROR.GENERIC_ERROR;
    }
  }

  logError(error) {
    // Add to internal log
    this.errorLog.unshift({
      ...error.toJSON(),
      id: this.generateErrorId()
    });

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${error.name}: ${error.message}`);
      console.error('Error Details:', error.toJSON());
      console.error('Stack Trace:', error.stack);
      console.groupEnd();
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(error);
    }
  }

  sendToMonitoring(error) {
    // Placeholder for error monitoring service integration
    // e.g., Sentry, LogRocket, etc.
    try {
      // Example: Sentry.captureException(error);
      console.log('Error sent to monitoring:', error.toJSON());
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError);
    }
  }

  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getErrorLog() {
    return [...this.errorLog];
  }

  clearErrorLog() {
    this.errorLog = [];
  }

  // Factory methods for creating specific errors
  createValidationError(message, field = null, value = null) {
    return new ValidationError(message, field, value);
  }

  createAuthError(message, action = null) {
    return new AuthError(message, action);
  }

  createNetworkError(message, url = null, method = null) {
    return new NetworkError(message, url, method);
  }

  createFileError(message, fileName = null, fileSize = null) {
    return new FileError(message, fileName, fileSize);
  }

  createStorageError(message, key = null) {
    return new StorageError(message, key);
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

export default errorHandler;
export { errorHandler };