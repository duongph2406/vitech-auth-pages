import React from 'react';
import './styles/App.css';
import { AuthForm, AccountProfile } from './components';
import { AppLayout } from './components/Layout';
import { AppProviders } from './context';
import { useApp } from './hooks/useApp';
import { PAGES } from './constants';
import './utils/clearAdminData';

function AppContent() {
  const {
    currentPage,
    authError,
    isLoading,
    formData,
    setFormData,
    handleLogin,
    handleSignUp,
    handleLogout,
    switchToSignUp,
    switchToLogin
  } = useApp();

  return (
    <AppLayout className={isLoading ? 'loading' : ''}>
      {currentPage === PAGES.PROFILE ? (
        <AccountProfile onLogout={handleLogout} />
      ) : (
        <AuthForm
          mode={currentPage}
          onSubmit={currentPage === PAGES.LOGIN ? handleLogin : handleSignUp}
          onSwitchMode={currentPage === PAGES.LOGIN ? switchToSignUp : switchToLogin}
          error={authError}
          formData={formData}
          setFormData={setFormData}
          isLoading={isLoading}
        />
      )}
    </AppLayout>
  );
}

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;
