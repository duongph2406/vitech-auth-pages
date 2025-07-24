import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const inputClass = [
    'form-input',
    icon && `has-icon-${iconPosition}`,
    disabled && 'disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-container">
      {icon && iconPosition === 'left' && (
        <span className="input-icon input-icon-left">{icon}</span>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        className={inputClass}
        {...props}
      />
      {icon && iconPosition === 'right' && (
        <span className="input-icon input-icon-right">{icon}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;