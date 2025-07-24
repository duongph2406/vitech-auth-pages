import React, { useState, useEffect } from 'react';
import './styles/App.css';
import { AuthForm, AccountProfile } from './components';
import { PAGES } from './constants';
import authService from './services/authService';
import './utils/clearAdminData';

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.LOGIN);
  const [authError, setAuthError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    confirmPassword: ''
  });

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setCurrentPage(PAGES.PROFILE);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const result = authService.login(formData.username, formData.password);
    if (result.success) {
      setCurrentPage(PAGES.PROFILE);
    } else {
      setAuthError(result.message);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setAuthError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setAuthError('Mật khẩu xác nhận không khớp');
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
    } else {
      setAuthError(result.message);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentPage(PAGES.LOGIN);
    setFormData({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      confirmPassword: ''
    });
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

  if (currentPage === PAGES.PROFILE) {
    return <AccountProfile onLogout={handleLogout} />;
  }

  // Auth Form (Sign In or Sign Up)
  return (
    <AuthForm
      mode={currentPage}
      onSubmit={currentPage === PAGES.LOGIN ? handleLogin : handleSignUp}
      onSwitchMode={currentPage === PAGES.LOGIN ? switchToSignUp : switchToLogin}
      error={authError}
      formData={formData}
      setFormData={setFormData}
    />
  );
}

export default App;
