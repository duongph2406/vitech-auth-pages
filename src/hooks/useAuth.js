import { useState, useEffect } from 'react';
import authService from '../services/authService';
import { PAGES, MESSAGES } from '../constants';

export const useAuth = () => {
  const [currentPage, setCurrentPage] = useState(PAGES.LOGIN);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setCurrentPage(PAGES.PROFILE);
    }
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      const result = authService.login(credentials.username, credentials.password);
      if (result.success) {
        setCurrentPage(PAGES.PROFILE);
        return { success: true };
      } else {
        setAuthError(result.message);
        return { success: false, error: result.message };
      }
    } catch (error) {
      setAuthError(MESSAGES.LOGIN_ERROR);
      return { success: false, error: MESSAGES.LOGIN_ERROR };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      // Validate passwords match
      if (userData.password !== userData.confirmPassword) {
        setAuthError(MESSAGES.PASSWORD_MISMATCH);
        return { success: false, error: MESSAGES.PASSWORD_MISMATCH };
      }

      const result = authService.register({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        phone: userData.phone || ''
      });

      if (result.success) {
        setCurrentPage(PAGES.PROFILE);
        return { success: true };
      } else {
        setAuthError(result.message);
        return { success: false, error: result.message };
      }
    } catch (error) {
      setAuthError('Đã xảy ra lỗi khi đăng ký');
      return { success: false, error: 'Đã xảy ra lỗi khi đăng ký' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentPage(PAGES.LOGIN);
    setAuthError('');
  };

  const switchToSignUp = () => {
    setCurrentPage(PAGES.SIGNUP);
    setAuthError('');
  };

  const switchToLogin = () => {
    setCurrentPage(PAGES.LOGIN);
    setAuthError('');
  };

  const clearError = () => {
    setAuthError('');
  };

  return {
    currentPage,
    authError,
    isLoading,
    login,
    register,
    logout,
    switchToSignUp,
    switchToLogin,
    clearError
  };
};