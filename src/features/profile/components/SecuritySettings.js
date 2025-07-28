/**
 * Security settings component for password management
 */

import React, { memo, useState, useCallback } from 'react';
import { FormField } from '../../shared/components/FormField';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { Toast } from '../../shared/components/Toast';
import { authService } from '../../../services';
import { useFormValidation } from '../../../hooks/useFormValidation';

const SecuritySettings = memo(() => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateAll,
    reset
  } = useFormValidation({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const handleShowPasswordForm = useCallback(() => {
    setShowPasswordForm(true);
    reset();
  }, [reset]);

  const handleCancelPasswordForm = useCallback(() => {
    setShowPasswordForm(false);
    reset();
  }, [reset]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      showToast('error', 'Vui lòng kiểm tra lại thông tin');
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      showToast('error', 'Mật khẩu mới không khớp');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = authService.changePassword(
        values.currentPassword,
        values.newPassword
      );
      
      if (result.success) {
        setShowPasswordForm(false);
        reset();
        showToast('success', 'Đổi mật khẩu thành công!');
      } else {
        showToast('error', result.message);
      }
    } catch (error) {
      showToast('error', 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateAll, reset, showToast]);

  const getFieldError = useCallback((fieldName) => {
    return touched[fieldName] && errors[fieldName] ? errors[fieldName][0] : null;
  }, [touched, errors]);

  return (
    <div className="security-settings">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="security-settings__options">
        <Card className="security-settings__option">
          <div className="security-settings__option-content">
            <div className="security-settings__option-info">
              <h3>Mật khẩu</h3>
              <p>Thay đổi mật khẩu để bảo vệ tài khoản của bạn</p>
            </div>
            <Button
              variant="primary"
              onClick={handleShowPasswordForm}
              disabled={showPasswordForm}
            >
              Thay đổi
            </Button>
          </div>
        </Card>
      </div>

      {showPasswordForm && (
        <Card className="security-settings__form">
          <h3>Thay đổi mật khẩu</h3>
          <form onSubmit={handleSubmit}>
            <FormField
              label="Mật khẩu hiện tại"
              type="password"
              value={values.currentPassword}
              onChange={(value) => handleChange('currentPassword', value)}
              onBlur={() => handleBlur('currentPassword')}
              error={getFieldError('currentPassword')}
              hasError={!!getFieldError('currentPassword')}
              required
            />

            <FormField
              label="Mật khẩu mới"
              type="password"
              value={values.newPassword}
              onChange={(value) => handleChange('newPassword', value)}
              onBlur={() => handleBlur('newPassword')}
              error={getFieldError('newPassword')}
              hasError={!!getFieldError('newPassword')}
              required
            />

            <FormField
              label="Xác nhận mật khẩu mới"
              type="password"
              value={values.confirmPassword}
              onChange={(value) => handleChange('confirmPassword', value)}
              onBlur={() => handleBlur('confirmPassword')}
              error={getFieldError('confirmPassword')}
              hasError={!!getFieldError('confirmPassword')}
              required
            />

            <div className="security-settings__form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelPasswordForm}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              >
                Cập nhật
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
});

SecuritySettings.displayName = 'SecuritySettings';

export { SecuritySettings };