import { VALIDATION, MESSAGES } from '../constants';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Username validation regex (3-20 chars, alphanumeric and underscore only)
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
  }
  if (!PASSWORD_REGEX.test(password)) {
    return MESSAGES.PASSWORD_WEAK;
  }
  return '';
};

export const validateUsername = (username) => {
  if (!username) return 'Username is required';
  if (username.length < VALIDATION.USERNAME_MIN_LENGTH) {
    return `Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters`;
  }
  if (username.length > VALIDATION.USERNAME_MAX_LENGTH) {
    return `Username must be no more than ${VALIDATION.USERNAME_MAX_LENGTH} characters`;
  }
  if (!USERNAME_REGEX.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  if (username.toLowerCase() === 'admin') {
    return MESSAGES.ADMIN_BLOCKED;
  }
  return '';
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
  if (!phone) return ''; // Phone is optional
  
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number';
  }
  return '';
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