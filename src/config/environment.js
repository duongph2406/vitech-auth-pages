// Environment configuration
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test'
};

// Feature flags
export const FEATURES = {
  ENABLE_PERFORMANCE_MONITORING: ENV.IS_DEVELOPMENT,
  ENABLE_ERROR_REPORTING: ENV.IS_PRODUCTION,
  ENABLE_DEBUG_LOGS: ENV.IS_DEVELOPMENT,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: ENV.IS_PRODUCTION
};

// App configuration
export const CONFIG = {
  APP_NAME: 'ViTech Authentication System',
  VERSION: '1.0.0',
  API_TIMEOUT: 10000,
  STORAGE_PREFIX: 'vitech_',
  MAX_LOGIN_ATTEMPTS: 5,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  DEBOUNCE_DELAY: 300
};

// Theme configuration
export const THEME = {
  PRIMARY_COLOR: '#003865',
  SECONDARY_COLOR: '#004a7c',
  SUCCESS_COLOR: '#059669',
  ERROR_COLOR: '#dc2626',
  WARNING_COLOR: '#d97706',
  INFO_COLOR: '#0284c7'
};