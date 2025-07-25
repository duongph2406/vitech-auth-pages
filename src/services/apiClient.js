/**
 * Centralized API client for future backend integration
 */

import { API_ENDPOINTS } from '../constants';
import { errorHandler } from '../utils/errorHandler';

class ApiClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.timeout = 10000; // 10 seconds
  }

  /**
   * Generic request method
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        status: response.status
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        throw errorHandler.createNetworkError('Request timeout');
      }
      throw errorHandler.createNetworkError(error.message);
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Authentication methods
   */
  async login(credentials) {
    return this.post(API_ENDPOINTS.LOGIN, credentials);
  }

  async register(userData) {
    return this.post(API_ENDPOINTS.REGISTER, userData);
  }

  async logout() {
    return this.post(API_ENDPOINTS.LOGOUT);
  }

  /**
   * User profile methods
   */
  async getProfile() {
    return this.get(API_ENDPOINTS.PROFILE);
  }

  async updateProfile(profileData) {
    return this.put(API_ENDPOINTS.PROFILE, profileData);
  }

  /**
   * Address methods
   */
  async getAddresses() {
    return this.get(API_ENDPOINTS.ADDRESSES);
  }

  async addAddress(addressData) {
    return this.post(API_ENDPOINTS.ADDRESSES, addressData);
  }

  async updateAddress(addressId, addressData) {
    return this.put(`${API_ENDPOINTS.ADDRESSES}/${addressId}`, addressData);
  }

  async deleteAddress(addressId) {
    return this.delete(`${API_ENDPOINTS.ADDRESSES}/${addressId}`);
  }

  /**
   * Payment methods
   */
  async getPaymentMethods() {
    return this.get(API_ENDPOINTS.PAYMENTS);
  }

  async addPaymentMethod(paymentData) {
    return this.post(API_ENDPOINTS.PAYMENTS, paymentData);
  }

  async updatePaymentMethod(paymentId, paymentData) {
    return this.put(`${API_ENDPOINTS.PAYMENTS}/${paymentId}`, paymentData);
  }

  async deletePaymentMethod(paymentId) {
    return this.delete(`${API_ENDPOINTS.PAYMENTS}/${paymentId}`);
  }
}

// Create singleton instance
const apiClient = new ApiClient();
export default apiClient;