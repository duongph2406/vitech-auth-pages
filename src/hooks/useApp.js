import { useState, useEffect, useCallback } from 'react';
import { PAGES, MESSAGES } from '../constants';
import authService from '../services/authService';

export const useApp = () => {
  const [currentPage, setCurrentPage] = useState(PAGES.LOGIN);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    confirmPassword: ''
  });

  // Check authentication status on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setCurrentPage(PAGES.PROFILE);
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      confirmPassword: ''
    });
  }, []);

  const clearError = useCallback(() => {
    setAuthError('');
  }, []);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    try {
      const result = authService.login(formData.username, formData.password);
      if (result.success) {
        setCurrentPage(PAGES.PROFILE);
        resetForm();
      } else {
        setAuthError(result.message);
      }
    } catch (error) {
      setAuthError(MESSAGES.LOGIN_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [formData.username, formData.password, resetForm]);

  const handleSignUp = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setAuthError(MESSAGES.PASSWORD_MISMATCH);
        setIsLoading(false);
        return;
      }

      const result = authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        phone: ''
      });

      if (result.success) {
        setCurrentPage(PAGES.PROFILE);
        resetForm();
      } else {
        setAuthError(result.message);
      }
    } catch (error) {
      setAuthError('Đã xảy ra lỗi khi đăng ký');
    } finally {
      setIsLoading(false);
    }
  }, [formData, resetForm]);

  const handleLogout = useCallback(() => {
    authService.logout();
    setCurrentPage(PAGES.LOGIN);
    resetForm();
    clearError();
  }, [resetForm, clearError]);

  const switchToSignUp = useCallback(() => {
    setCurrentPage(PAGES.SIGNUP);
    clearError();
  }, [clearError]);

  const switchToLogin = useCallback(() => {
    setCurrentPage(PAGES.LOGIN);
    clearError();
  }, [clearError]);

  return {
    currentPage,
    authError,
    isLoading,
    formData,
    setFormData,
    handleLogin,
    handleSignUp,
    handleLogout,
    switchToSignUp,
    switchToLogin,
    clearError
  };
};