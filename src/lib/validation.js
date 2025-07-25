/**
 * Enhanced validation system with comprehensive rules
 */

import { VALIDATION_RULES, MESSAGES } from './constants';
import { ValidationError } from './errorHandler';

class ValidationSystem {
  constructor() {
    this.rules = VALIDATION_RULES;
    this.customValidators = new Map();
  }

  // Register custom validator
  registerValidator(name, validator) {
    this.customValidators.set(name, validator);
  }

  // Email validation
  validateEmail(email, options = {}) {
    const { required = true, field = 'email' } = options;

    if (!email) {
      if (required) {
        throw new ValidationError('Email là bắt buộc', field, email);
      }
      return { isValid: true, errors: [] };
    }

    const errors = [];

    if (email.length > this.rules.EMAIL.MAX_LENGTH) {
      errors.push(`Email không được vượt quá ${this.rules.EMAIL.MAX_LENGTH} ký tự`);
    }

    if (!this.rules.EMAIL.PATTERN.test(email)) {
      errors.push('Định dạng email không hợp lệ');
    }

    const isValid = errors.length === 0;
    if (!isValid && options.throwOnError) {
      throw new ValidationError(errors[0], field, email);
    }

    return { isValid, errors, value: email.toLowerCase().trim() };
  }

  // Password validation
  validatePassword(password, options = {}) {
    const { required = true, field = 'password', confirmPassword = null } = options;

    if (!password) {
      if (required) {
        throw new ValidationError('Mật khẩu là bắt buộc', field, password);
      }
      return { isValid: true, errors: [] };
    }

    const errors = [];
    const rules = this.rules.PASSWORD;

    if (password.length < rules.MIN_LENGTH) {
      errors.push(`Mật khẩu phải có ít nhất ${rules.MIN_LENGTH} ký tự`);
    }

    if (password.length > rules.MAX_LENGTH) {
      errors.push(`Mật khẩu không được vượt quá ${rules.MAX_LENGTH} ký tự`);
    }

    if (!rules.PATTERN.test(password)) {
      errors.push('Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt');
    }

    // Check password confirmation
    if (confirmPassword !== null && password !== confirmPassword) {
      errors.push(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }

    const strength = this.calculatePasswordStrength(password);
    const isValid = errors.length === 0;

    if (!isValid && options.throwOnError) {
      throw new ValidationError(errors[0], field, password);
    }

    return { 
      isValid, 
      errors, 
      strength,
      requirements: this.getPasswordRequirements(password)
    };
  }

  // Username validation
  validateUsername(username, options = {}) {
    const { required = true, field = 'username' } = options;

    if (!username) {
      if (required) {
        throw new ValidationError('Tên đăng nhập là bắt buộc', field, username);
      }
      return { isValid: true, errors: [] };
    }

    const errors = [];
    const rules = this.rules.USERNAME;
    const normalizedUsername = username.trim().toLowerCase();

    if (normalizedUsername.length < rules.MIN_LENGTH) {
      errors.push(`Tên đăng nhập phải có ít nhất ${rules.MIN_LENGTH} ký tự`);
    }

    if (normalizedUsername.length > rules.MAX_LENGTH) {
      errors.push(`Tên đăng nhập không được vượt quá ${rules.MAX_LENGTH} ký tự`);
    }

    if (!rules.PATTERN.test(normalizedUsername)) {
      errors.push('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới');
    }

    if (rules.RESERVED.includes(normalizedUsername)) {
      errors.push(MESSAGES.ERROR.ADMIN_BLOCKED);
    }

    const isValid = errors.length === 0;
    if (!isValid && options.throwOnError) {
      throw new ValidationError(errors[0], field, username);
    }

    return { isValid, errors, value: normalizedUsername };
  }

  // Phone validation
  validatePhone(phone, options = {}) {
    const { required = false, field = 'phone' } = options;

    if (!phone) {
      if (required) {
        throw new ValidationError('Số điện thoại là bắt buộc', field, phone);
      }
      return { isValid: true, errors: [] };
    }

    const errors = [];
    const rules = this.rules.PHONE;
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== rules.LENGTH) {
      errors.push(`Số điện thoại phải có đúng ${rules.LENGTH} số`);
    }

    if (!rules.PATTERN.test(cleanPhone)) {
      errors.push('Số điện thoại chỉ được chứa các chữ số từ 0-9');
    }

    const prefix = cleanPhone.substring(0, 2);
    if (!rules.PREFIXES.includes(prefix)) {
      errors.push(`Số điện thoại phải bắt đầu bằng ${rules.PREFIXES.join(', ')}`);
    }

    const isValid = errors.length === 0;
    if (!isValid && options.throwOnError) {
      throw new ValidationError(errors[0], field, phone);
    }

    return { isValid, errors, value: cleanPhone };
  }

  // Name validation
  validateName(name, options = {}) {
    const { required = true, field = 'name' } = options;

    if (!name) {
      if (required) {
        throw new ValidationError(`${field} là bắt buộc`, field, name);
      }
      return { isValid: true, errors: [] };
    }

    const errors = [];
    const rules = this.rules.NAME;
    const trimmedName = name.trim();

    if (trimmedName.length < rules.MIN_LENGTH) {
      errors.push(`${field} phải có ít nhất ${rules.MIN_LENGTH} ký tự`);
    }

    if (trimmedName.length > rules.MAX_LENGTH) {
      errors.push(`${field} không được vượt quá ${rules.MAX_LENGTH} ký tự`);
    }

    if (!rules.PATTERN.test(trimmedName)) {
      errors.push(`${field} chỉ được chứa chữ cái và khoảng trắng`);
    }

    const isValid = errors.length === 0;
    if (!isValid && options.throwOnError) {
      throw new ValidationError(errors[0], field, name);
    }

    return { isValid, errors, value: trimmedName };
  }

  // Generic required field validation
  validateRequired(value, field) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new ValidationError(`${field} là bắt buộc`, field, value);
    }
    return { isValid: true, errors: [] };
  }

  // Form validation
  validateForm(formData, schema, options = {}) {
    const { throwOnFirstError = false } = options;
    const results = {};
    const errors = {};
    let isValid = true;

    for (const [field, rules] of Object.entries(schema)) {
      try {
        const value = formData[field];
        let fieldResult = { isValid: true, errors: [] };

        // Apply validation rules
        for (const rule of Array.isArray(rules) ? rules : [rules]) {
          if (typeof rule === 'function') {
            const result = rule(value, formData);
            if (!result.isValid) {
              fieldResult = result;
              break;
            }
          } else if (typeof rule === 'string') {
            // Use built-in validators
            fieldResult = this.applyBuiltInValidator(rule, value, { field });
            if (!fieldResult.isValid) break;
          }
        }

        results[field] = fieldResult;
        if (!fieldResult.isValid) {
          errors[field] = fieldResult.errors;
          isValid = false;
          
          if (throwOnFirstError) {
            throw new ValidationError(fieldResult.errors[0], field, value);
          }
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          results[field] = { isValid: false, errors: [error.message] };
          errors[field] = [error.message];
          isValid = false;
          
          if (throwOnFirstError) {
            throw error;
          }
        }
      }
    }

    return { isValid, errors, results };
  }

  // Apply built-in validator by name
  applyBuiltInValidator(validatorName, value, options = {}) {
    switch (validatorName) {
      case 'email':
        return this.validateEmail(value, options);
      case 'password':
        return this.validatePassword(value, options);
      case 'username':
        return this.validateUsername(value, options);
      case 'phone':
        return this.validatePhone(value, options);
      case 'required':
        return this.validateRequired(value, options.field || 'field');
      default:
        if (this.customValidators.has(validatorName)) {
          return this.customValidators.get(validatorName)(value, options);
        }
        throw new Error(`Unknown validator: ${validatorName}`);
    }
  }

  // Calculate password strength
  calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
      longLength: password.length >= 12
    };

    score += Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) return { level: 'weak', score, checks };
    if (score <= 4) return { level: 'medium', score, checks };
    return { level: 'strong', score, checks };
  }

  // Get password requirements status
  getPasswordRequirements(password) {
    return {
      minLength: password.length >= this.rules.PASSWORD.MIN_LENGTH,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password)
    };
  }
}

// Create singleton instance
const validationSystem = new ValidationSystem();

// Export individual validators for backward compatibility
export const validateEmail = (email, options) => validationSystem.validateEmail(email, options);
export const validatePassword = (password, options) => validationSystem.validatePassword(password, options);
export const validateUsername = (username, options) => validationSystem.validateUsername(username, options);
export const validatePhone = (phone, options) => validationSystem.validatePhone(phone, options);
export const validateName = (name, options) => validationSystem.validateName(name, options);
export const validateRequired = (value, field) => validationSystem.validateRequired(value, field);
export const validateForm = (formData, schema, options) => validationSystem.validateForm(formData, schema, options);

export default validationSystem;