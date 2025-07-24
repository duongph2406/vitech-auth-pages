import React from 'react';
import { AppProvider } from './AppContext';
import { ThemeProvider } from './ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { NotificationContainer } from '../components/Notification';

const AppProviders = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          {children}
          <NotificationContainer />
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default AppProviders;