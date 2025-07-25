// Application Constants
export const APP_CONFIG = {
  NAME: 'ViTech Group',
  COMPANY: 'ViTech Group Company',
  COPYRIGHT_YEARS: '2019 - 2025',
  VERSION: '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USERS: 'vitech_users',
  CURRENT_USER: 'vitech_current_user',
  THEME: 'vitech_theme',
  SETTINGS: 'vitech_settings'
};

// Form Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PHONE: {
    PATTERN: /^[0-9]{10}$/,
    LENGTH: 10
  }
};

// Application Pages
export const PAGES = {
  LOGIN: 'login',
  SIGNUP: 'signup', 
  PROFILE: 'profile',
  DASHBOARD: 'dashboard',
  SETTINGS: 'settings'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

// Messages
export const MESSAGES = {
  LOGIN_ERROR: 'Tên đăng nhập hoặc mật khẩu không đúng',
  USERNAME_EXISTS: 'Tên đăng nhập đã tồn tại',
  EMAIL_EXISTS: 'Email đã được sử dụng',
  PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp',
  ADMIN_BLOCKED: 'Tên đăng nhập không được phép',
  PASSWORD_WEAK: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
  PROFILE_UPDATE_SUCCESS: 'Cập nhật thông tin thành công!',
  PASSWORD_CHANGE_SUCCESS: 'Đổi mật khẩu thành công!',
  ADDRESS_ADD_SUCCESS: 'Thêm địa chỉ thành công!',
  ADDRESS_DELETE_SUCCESS: 'Xóa địa chỉ thành công!',
  PAYMENT_ADD_SUCCESS: 'Thêm thẻ thanh toán thành công!',
  PAYMENT_DELETE_SUCCESS: 'Xóa thẻ thanh toán thành công!'
};

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/user/profile',
  ADDRESSES: '/api/user/addresses',
  PAYMENTS: '/api/user/payments'
};