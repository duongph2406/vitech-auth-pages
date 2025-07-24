import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEME } from '../config';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [colors, setColors] = useState(THEME);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('vitech_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vitech_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateColors = (newColors) => {
    setColors(prev => ({ ...prev, ...newColors }));
  };

  const value = {
    theme,
    colors,
    setTheme,
    toggleTheme,
    updateColors,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};