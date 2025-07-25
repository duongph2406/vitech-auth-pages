/**
 * Application-wide constants and configuration
 */

// Application Configuration
export const APP_CONFIG = {
  NAME: 'ViTech Group',
  COMPANY: 'ViTech Group Company',
  COPYRIGHT_YEARS: '2019 - 2025',
  VERSION: '2.1.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  API_TIMEOUT: 10000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  AVATAR_SIZE: 400
};

// Storage Keys
export const STORAGE_KEYS = {
  USERS: 'vitech_users',
  CURRENT_USER: 'vitech_current_user',
  THEME: 'vitech_theme',
  SETTINGS: 'vitech_settings',
  SESSION: 'vitech_session'
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    REQUIREMENTS: [
      'Ít nhất 8 ký tự',
      'Có chữ hoa và chữ thường',
      'Có ít nhất 1 số',
      'Có ít nhất 1 ký tự đặc biệt'
    ]
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
    RESERVED: ['admin', 'root', 'system', 'test']
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 254
  },
  PHONE: {
    PATTERN: /^[0-9]{10}$/,
    LENGTH: 10,
    PREFIXES: ['03', '05', '07', '08', '09']
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-ZÀ-ÿ\s]+$/
  }
};

// File Upload Rules
export const FILE_RULES = {
  AVATAR: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    DIMENSIONS: { width: 400, height: 400 },
    QUALITY: 0.8
  },
  DOCUMENT: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
};

// Application Pages
export const PAGES = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  PROFILE: 'profile',
  DASHBOARD: 'dashboard',
  SETTINGS: 'settings',
  HELP: 'help'
};

// User Roles and Permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

export const PERMISSIONS = {
  READ_PROFILE: 'read:profile',
  WRITE_PROFILE: 'write:profile',
  DELETE_ACCOUNT: 'delete:account',
  MANAGE_USERS: 'manage:users'
};

// UI Constants
export const UI_CONSTANTS = {
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200
  },
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 2000,
    TOOLTIP: 3000,
    NOTIFICATION: 4000
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password'
  },
  USER: {
    PROFILE: '/api/user/profile',
    AVATAR: '/api/user/avatar',
    ADDRESSES: '/api/user/addresses',
    PAYMENTS: '/api/user/payments',
    PREFERENCES: '/api/user/preferences'
  },
  ADMIN: {
    USERS: '/api/admin/users',
    ANALYTICS: '/api/admin/analytics'
  }
};

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  FILE_ERROR: 'FILE_ERROR',
  GENERIC_ERROR: 'GENERIC_ERROR'
};

// Success/Error Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Đăng nhập thành công!',
    REGISTER: 'Đăng ký tài khoản thành công!',
    PROFILE_UPDATE: 'Cập nhật thông tin thành công!',
    PASSWORD_CHANGE: 'Đổi mật khẩu thành công!',
    AVATAR_UPDATE: 'Cập nhật ảnh đại diện thành công!',
    AVATAR_REMOVE: 'Xóa ảnh đại diện thành công!',
    ADDRESS_ADD: 'Thêm địa chỉ thành công!',
    ADDRESS_UPDATE: 'Cập nhật địa chỉ thành công!',
    ADDRESS_DELETE: 'Xóa địa chỉ thành công!',
    PAYMENT_ADD: 'Thêm thẻ thanh toán thành công!',
    PAYMENT_UPDATE: 'Cập nhật thẻ thành công!',
    PAYMENT_DELETE: 'Xóa thẻ thanh toán thành công!'
  },
  ERROR: {
    LOGIN_FAILED: 'Tên đăng nhập hoặc mật khẩu không đúng',
    USERNAME_EXISTS: 'Tên đăng nhập đã tồn tại',
    EMAIL_EXISTS: 'Email đã được sử dụng',
    PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp',
    ADMIN_BLOCKED: 'Tên đăng nhập không được phép',
    PASSWORD_WEAK: 'Mật khẩu không đủ mạnh',
    NETWORK_ERROR: 'Lỗi kết nối mạng',
    GENERIC_ERROR: 'Đã xảy ra lỗi không xác định',
    FILE_TOO_LARGE: 'File quá lớn',
    FILE_INVALID_TYPE: 'Định dạng file không hợp lệ',
    PHONE_INVALID: 'Số điện thoại không hợp lệ',
    EMAIL_INVALID: 'Email không hợp lệ',
    REQUIRED_FIELD: 'Trường này là bắt buộc'
  }
};

// Theme Configuration
export const THEME = {
  COLORS: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#6b7280',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#06b6d4'
  },
  GRADIENTS: {
    PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    SUCCESS: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    ERROR: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  }
};