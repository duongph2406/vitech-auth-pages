import React from 'react';
import './FormField.css';

const FormField = ({
  label,
  error,
  required = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {children}
      </div>
      {error && (
        <div className="form-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;