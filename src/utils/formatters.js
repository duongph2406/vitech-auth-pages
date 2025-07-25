/**
 * Utility functions for formatting data
 */

/**
 * Format phone number to display format
 * @param {string} phone - Raw phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Format as XXX XXX XXXX
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  return cleanPhone;
};

/**
 * Clean phone number for storage (remove formatting)
 * @param {string} phone - Formatted phone number
 * @returns {string} Clean phone number
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

/**
 * Format currency (Vietnamese Dong)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
  if (!amount) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Format date to Vietnamese format
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Format card number for display (mask middle digits)
 * @param {string} cardNumber - Card number
 * @returns {string} Masked card number
 */
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleanNumber = cardNumber.replace(/\D/g, '');
  if (cleanNumber.length >= 4) {
    const lastFour = cleanNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
  }
  
  return cardNumber;
};