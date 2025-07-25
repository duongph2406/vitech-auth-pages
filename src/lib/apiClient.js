/**
 * Enhanced API client with interceptors, retry logic, and caching
 */

import { API_ENDPOINTS, APP_CONFIG } from './constants';
import { NetworkError } from './errorHandler';
import storage from './storage';

class ApiClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.timeout = APP_CONFIG.API_TIMEOUT;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.interceptors = {
      request: [],
      response: []
    };
    
    this.setupDefaultInterceptors();
  }

  setupDefaultInterceptors() {
    // Request interceptor for auth token
    this.addRequestInterceptor((config) => {
      const token = storage.getItem('auth_token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      return config;
    });

    // Response interceptor for token refresh
    this.addResponseInterceptor(
      (response) => response,
      async (error) => {
        if (error.statusCode === 401) {
          await this.handleTokenRefresh();
        }
        throw error;
      }
    );
  }

  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  addResponseInterceptor(onSuccess, onError) {
    this.interceptors.response.push({ onSuccess, onError });
  }

  async request(endpoint, options = {}) {
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: this.timeout,
      ...options
    };

    // Apply request interceptors
    let processedConfig = config;
    for (const interceptor of this.interceptors.request) {
      processedConfig = await interceptor(processedConfig);
    }

    // Check cache for GET requests
    const cacheKey = this.getCacheKey(endpoint, processedConfig);
    if (processedConfig.method === 'GET' && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    let lastError;
    
    // Retry logic
    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.makeRequest(endpoint, processedConfig);
        
        // Cache successful GET responses
        if (processedConfig.method === 'GET') {
          this.cache.set(cacheKey, {
            data: response,
            timestamp: Date.now()
          });
        }

        // Apply response interceptors
        let processedResponse = response;
        for (const { onSuccess } of this.interceptors.response) {
          if (onSuccess) {
            processedResponse = await onSuccess(processedResponse);
          }
        }

        return processedResponse;
      } catch (error) {
        lastError = error;

        // Apply error interceptors
        for (const { onError } of this.interceptors.response) {
          if (onError) {
            try {
              await onError(error);
            } catch (interceptorError) {
              lastError = interceptorError;
            }
          }
        }

        // Don't retry on client errors (4xx)
        if (error.statusCode >= 400 && error.statusCode < 500) {
          break;
        }

        // Wait before retry
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError;
  }

  async makeRequest(endpoint, config) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new NetworkError(
          `HTTP ${response.status}: ${response.statusText}`,
          url,
          config.method
        );
      }

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return {
        success: true,
        data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new NetworkError('Request timeout', url, config.method);
      }

      if (error instanceof NetworkError) {
        throw error;
      }

      throw new NetworkError(error.message, url, config.method);
    }
  }

  // HTTP methods
  async get(endpoint, params = {}, options = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // File upload
  async upload(endpoint, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
        ...options.headers
      }
    });
  }

  // Authentication methods
  async login(credentials) {
    const response = await this.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.data.token) {
      storage.setItem('auth_token', response.data.token);
    }
    return response;
  }

  async register(userData) {
    return this.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  async logout() {
    try {
      await this.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      storage.removeItem('auth_token');
      this.clearCache();
    }
  }

  async refreshToken() {
    const response = await this.post(API_ENDPOINTS.AUTH.REFRESH);
    if (response.data.token) {
      storage.setItem('auth_token', response.data.token);
    }
    return response;
  }

  // User profile methods
  async getProfile() {
    return this.get(API_ENDPOINTS.USER.PROFILE);
  }

  async updateProfile(profileData) {
    return this.put(API_ENDPOINTS.USER.PROFILE, profileData);
  }

  async updateAvatar(avatarFile) {
    return this.upload(API_ENDPOINTS.USER.AVATAR, avatarFile);
  }

  async deleteAvatar() {
    return this.delete(API_ENDPOINTS.USER.AVATAR);
  }

  // Address methods
  async getAddresses() {
    return this.get(API_ENDPOINTS.USER.ADDRESSES);
  }

  async addAddress(addressData) {
    return this.post(API_ENDPOINTS.USER.ADDRESSES, addressData);
  }

  async updateAddress(addressId, addressData) {
    return this.put(`${API_ENDPOINTS.USER.ADDRESSES}/${addressId}`, addressData);
  }

  async deleteAddress(addressId) {
    return this.delete(`${API_ENDPOINTS.USER.ADDRESSES}/${addressId}`);
  }

  // Payment methods
  async getPaymentMethods() {
    return this.get(API_ENDPOINTS.USER.PAYMENTS);
  }

  async addPaymentMethod(paymentData) {
    return this.post(API_ENDPOINTS.USER.PAYMENTS, paymentData);
  }

  async updatePaymentMethod(paymentId, paymentData) {
    return this.put(`${API_ENDPOINTS.USER.PAYMENTS}/${paymentId}`, paymentData);
  }

  async deletePaymentMethod(paymentId) {
    return this.delete(`${API_ENDPOINTS.USER.PAYMENTS}/${paymentId}`);
  }

  // Utility methods
  getCacheKey(endpoint, config) {
    return `${config.method}:${endpoint}:${JSON.stringify(config.body || {})}`;
  }

  clearCache() {
    this.cache.clear();
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async handleTokenRefresh() {
    try {
      await this.refreshToken();
    } catch (error) {
      // Redirect to login if refresh fails
      storage.removeItem('auth_token');
      window.location.href = '/login';
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Get API status
  getStatus() {
    return {
      baseURL: this.baseURL,
      cacheSize: this.cache.size,
      hasToken: !!storage.getItem('auth_token')
    };
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;