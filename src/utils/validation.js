// Legacy validation file - use src/lib/validation.js for new code
import { VALIDATION_RULES, MESSAGES } from '../lib/constants';
import errorHandler from '../lib/errorHandler';

// Validation patterns from constants
const { EMAIL, PASSWORD, USERNAME, PHONE } = VALIDATION_RULES;

/**
 * Enhanced validation functions with better error handling
 */

export const validateEmail = (email) => {
  try {
    if (!email) return 'Email là bắt buộc';
    if (!EMAIL.PATTERN.test(email)) return 'Vui lòng nhập email hợp lệ';
    return '';
  } catch (error) {
    throw errorHandler.createValidationError('Lỗi xác thực email');
  }
};

export const validatePassword = (password) => {
  try {
    if (!password) return 'Mật khẩu là bắt buộc';
    if (password.length < PASSWORD.MIN_LENGTH) {
      return `Mật khẩu phải có ít nhất ${PASSWORD.MIN_LENGTH} ký tự`;
    }
    if (password.length > PASSWORD.MAX_LENGTH) {
      return `Mật khẩu không được vượt quá ${PASSWORD.MAX_LENGTH} ký tự`;
    }
    if (!PASSWORD.PATTERN.test(password)) {
      return MESSAGES.PASSWORD_WEAK;
    }
    return '';
  } catch (error) {
    throw errorHandler.createValidationError('Lỗi xác thực mật khẩu');
  }
};

export const validateUsername = (username) => {
  try {
    if (!username) return 'Tên đăng nhập là bắt buộc';
    if (username.length < USERNAME.MIN_LENGTH) {
      return `Tên đăng nhập phải có ít nhất ${USERNAME.MIN_LENGTH} ký tự`;
    }
    if (username.length > USERNAME.MAX_LENGTH) {
      return `Tên đăng nhập không được vượt quá ${USERNAME.MAX_LENGTH} ký tự`;
    }
    if (!USERNAME.PATTERN.test(username)) {
      return 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    }
    if (username.toLowerCase() === 'admin') {
      return MESSAGES.ADMIN_BLOCKED;
    }
    return '';
  } catch (error) {
    throw errorHandler.createValidationError('Lỗi xác thực tên đăng nhập');
  }
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return MESSAGES.PASSWORD_MISMATCH;
  return '';
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateName = (name, fieldName) => {
  const requiredError = validateRequired(name, fieldName);
  if (requiredError) return requiredError;
  
  if (name.length < 2) return `${fieldName} must be at least 2 characters`;
  if (name.length > 50) return `${fieldName} must be no more than 50 characters`;
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) return `${fieldName} can only contain letters and spaces`;
  
  return '';
};

export const validatePhone = (phone) => {
  try {
    if (!phone) return ''; // Phone is optional
    
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length !== PHONE.LENGTH) {
      return `Số điện thoại phải có đúng ${PHONE.LENGTH} số`;
    }
    
    if (!PHONE.PATTERN.test(cleanPhone)) {
      return 'Số điện thoại chỉ được chứa các chữ số từ 0-9';
    }
    
    // Check if starts with valid Vietnamese phone prefixes
    const validPrefixes = ['03', '05', '07', '08', '09'];
    const prefix = cleanPhone.substring(0, 2);
    
    if (!validPrefixes.includes(prefix)) {
      return 'Số điện thoại phải bắt đầu bằng 03, 05, 07, 08 hoặc 09';
    }
    
    return '';
  } catch (error) {
    throw errorHandler.createValidationError('Lỗi xác thực số điện thoại');
  }
};

// Form validation schemas
export const loginSchema = {
  username: validateUsername,
  password: (password) => validateRequired(password, 'Password')
};

export const signupSchema = {
  firstName: (value) => validateName(value, 'First Name'),
  lastName: (value) => validateName(value, 'Last Name'),
  email: validateEmail,
  username: validateUsername,
  password: validatePassword,
  confirmPassword: (value, formData) => validateConfirmPassword(formData.password, value)
};

export const profileSchema = {
  firstName: (value) => validateName(value, 'First Name'),
  lastName: (value) => validateName(value, 'Last Name'),
  email: validateEmail,
  username: validateUsername,
  phone: validatePhone
};

// Validate entire form
export const validateForm = (formData, schema) => {
  const errors = {};
  let isValid = true;

  Object.keys(schema).forEach(field => {
    const validator = schema[field];
    const error = validator(formData[field], formData);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};