/**
 * Enhanced form hook with validation and submission handling
 */

import { useState, useCallback, useRef } from 'react';
import validationSystem from '../lib/validation';
import errorHandler from '../lib/errorHandler';

export const useForm = (initialValues = {}, validationSchema = {}, options = {}) => {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    resetOnSubmit = false,
    onSubmit = null,
    onValidationError = null
  } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  
  const initialValuesRef = useRef(initialValues);

  // Update field value
  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    // Validate on change if enabled
    if (validateOnChange && validationSchema[name]) {
      try {
        const result = validationSystem.applyBuiltInValidator(
          validationSchema[name],
          value,
          { field: name }
        );
        
        if (!result.isValid) {
          setErrors(prev => ({ ...prev, [name]: result.errors[0] }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, [name]: error.message }));
      }
    }
  }, [errors, validateOnChange, validationSchema]);

  // Handle input change
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setValue(name, fieldValue);
  }, [setValue]);

  // Handle field blur
  const handleBlur = useCallback((event) => {
    const { name, value } = event.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate on blur if enabled
    if (validateOnBlur && validationSchema[name]) {
      try {
        const result = validationSystem.applyBuiltInValidator(
          validationSchema[name],
          value,
          { field: name }
        );
        
        if (!result.isValid) {
          setErrors(prev => ({ ...prev, [name]: result.errors[0] }));
        } else {
          setErrors(prev => ({ ...prev, [name]: null }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, [name]: error.message }));
      }
    }
  }, [validateOnBlur, validationSchema]);

  // Validate all fields
  const validate = useCallback(() => {
    try {
      const result = validationSystem.validateForm(values, validationSchema);
      setErrors(result.errors);
      return result.isValid;
    } catch (error) {
      const processedError = errorHandler.handleError(error);
      setErrors({ _form: processedError.message });
      return false;
    }
  }, [values, validationSchema]);

  // Validate specific field
  const validateField = useCallback((name) => {
    if (!validationSchema[name]) return true;

    try {
      const result = validationSystem.applyBuiltInValidator(
        validationSchema[name],
        values[name],
        { field: name }
      );
      
      if (!result.isValid) {
        setErrors(prev => ({ ...prev, [name]: result.errors[0] }));
        return false;
      } else {
        setErrors(prev => ({ ...prev, [name]: null }));
        return true;
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, [name]: error.message }));
      return false;
    }
  }, [values, validationSchema]);

  // Submit form
  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }

    setSubmitCount(prev => prev + 1);
    setIsSubmitting(true);

    try {
      // Validate all fields
      const isValid = validate();
      
      if (!isValid) {
        if (onValidationError) {
          onValidationError(errors);
        }
        return false;
      }

      // Call submit handler
      if (onSubmit) {
        await onSubmit(values);
      }

      // Reset form if requested
      if (resetOnSubmit) {
        reset();
      }

      return true;
    } catch (error) {
      const processedError = errorHandler.handleError(error);
      setErrors(prev => ({ ...prev, _form: processedError.message }));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, onSubmit, onValidationError, resetOnSubmit, values, errors]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValuesRef.current);
    setErrors({});
    setTouched({});
    setSubmitCount(0);
  }, []);

  // Reset field
  const resetField = useCallback((name) => {
    setValues(prev => ({ ...prev, [name]: initialValuesRef.current[name] }));
    setErrors(prev => ({ ...prev, [name]: null }));
    setTouched(prev => ({ ...prev, [name]: false }));
  }, []);

  // Set multiple values
  const setValues = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Set field error
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Clear field error
  const clearFieldError = useCallback((name) => {
    setErrors(prev => ({ ...prev, [name]: null }));
  }, []);

  // Get field props for easy binding
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur
  }), [values, handleChange, handleBlur]);

  // Get field state
  const getFieldState = useCallback((name) => ({
    value: values[name],
    error: errors[name],
    touched: touched[name],
    hasError: !!errors[name],
    isTouched: !!touched[name]
  }), [values, errors, touched]);

  // Check if form is dirty
  const isDirty = useCallback(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
  }, [values]);

  // Check if form is valid
  const isValid = useCallback(() => {
    return Object.keys(errors).every(key => !errors[key]);
  }, [errors]);

  return {
    // Values and state
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,

    // Actions
    setValue,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    validateField,
    reset,
    resetField,
    setFieldError,
    clearFieldError,

    // Helpers
    getFieldProps,
    getFieldState,
    isDirty: isDirty(),
    isValid: isValid(),
    hasErrors: Object.keys(errors).some(key => errors[key])
  };
};