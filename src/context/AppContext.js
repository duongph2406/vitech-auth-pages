import React, { createContext, useContext, useReducer } from 'react';
import { PAGES } from '../constants';

// Initial state
const initialState = {
  user: null,
  currentPage: PAGES.LOGIN,
  isLoading: false,
  error: null,
  theme: 'light'
};

// Action types
export const ACTION_TYPES = {
  SET_USER: 'SET_USER',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_THEME: 'SET_THEME',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: action.payload,
        currentPage: action.payload ? PAGES.PROFILE : PAGES.LOGIN
      };
    case ACTION_TYPES.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case ACTION_TYPES.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
    case ACTION_TYPES.RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setUser: (user) => dispatch({ type: ACTION_TYPES.SET_USER, payload: user }),
    setCurrentPage: (page) => dispatch({ type: ACTION_TYPES.SET_CURRENT_PAGE, payload: page }),
    setLoading: (loading) => dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ACTION_TYPES.CLEAR_ERROR }),
    setTheme: (theme) => dispatch({ type: ACTION_TYPES.SET_THEME, payload: theme }),
    resetState: () => dispatch({ type: ACTION_TYPES.RESET_STATE })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};