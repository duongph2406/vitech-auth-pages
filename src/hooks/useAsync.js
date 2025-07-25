/**
 * Enhanced async hook with better error handling and caching
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import errorHandler from '../lib/errorHandler';

export const useAsync = (asyncFunction, dependencies = [], options = {}) => {
  const {
    immediate = true,
    onSuccess = null,
    onError = null,
    retryAttempts = 0,
    retryDelay = 1000,
    cache = false,
    cacheKey = null
  } = options;

  const [state, setState] = useState({
    data: null,
    error: null,
    loading: false,
    lastExecuted: null
  });

  const mountedRef = useRef(true);
  const cacheRef = useRef(new Map());
  const retryCountRef = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args) => {
    if (!mountedRef.current) return;

    // Check cache
    const key = cacheKey || JSON.stringify(args);
    if (cache && cacheRef.current.has(key)) {
      const cached = cacheRef.current.get(key);
      setState(prev => ({ ...prev, data: cached, loading: false }));
      return cached;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFunction(...args);
      
      if (!mountedRef.current) return;

      // Cache result
      if (cache) {
        cacheRef.current.set(key, result);
      }

      setState({
        data: result,
        error: null,
        loading: false,
        lastExecuted: Date.now()
      });

      retryCountRef.current = 0;
      
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      if (!mountedRef.current) return;

      const processedError = errorHandler.handleError(error);

      // Retry logic
      if (retryCountRef.current < retryAttempts) {
        retryCountRef.current++;
        setTimeout(() => {
          if (mountedRef.current) {
            execute(...args);
          }
        }, retryDelay * retryCountRef.current);
        return;
      }

      setState({
        data: null,
        error: processedError,
        loading: false,
        lastExecuted: Date.now()
      });

      if (onError) {
        onError(processedError);
      }

      throw processedError;
    }
  }, [asyncFunction, onSuccess, onError, retryAttempts, retryDelay, cache, cacheKey]);

  // Auto-execute on mount or dependency change
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute, ...dependencies]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      loading: false,
      lastExecuted: null
    });
    retryCountRef.current = 0;
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearCache,
    isIdle: !state.loading && !state.data && !state.error,
    isLoading: state.loading,
    isSuccess: !state.loading && state.data && !state.error,
    isError: !state.loading && state.error,
    retryCount: retryCountRef.current
  };
};