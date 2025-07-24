// Application Constants
export const APP_NAME = 'ViTech';
export const COMPANY_NAME = 'ViTech Group Company';
export const COPYRIGHT_YEARS = '2019 - 2021';

// Local Storage Keys
export const STORAGE_KEYS = {
  USERS: 'vitech_users',
  CURRENT_USER: 'vitech_current_user'
};

// Form Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20
};

// UI Constants
export const PAGES = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  PROFILE: 'profile'
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