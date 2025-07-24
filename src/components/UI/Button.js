import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const buttonClass = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    isLoading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="small" color="white" />
          <span className="btn-loading-text">Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="btn-icon btn-icon-left">{icon}</span>
          )}
          <span className="btn-text">{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="btn-icon btn-icon-right">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;