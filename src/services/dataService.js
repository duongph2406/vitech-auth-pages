import { STORAGE_KEYS } from '../constants';

// Local Storage Data Service
class DataService {
  constructor() {
    this.initializeDefaultData();
  }

  // Initialize default data if not exists
  initializeDefaultData() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, 'null');
    }

    // Remove any existing admin account
    this.removeAdminAccount();
  }

  // User Management
  getAllUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  getUserById(id) {
    const users = this.getAllUsers();
    return users.find(user => user.id === id);
  }

  getUserByUsername(username) {
    const normalizedUsername = username.trim().toLowerCase();
    const users = this.getAllUsers();
    return users.find(user => (user.username && user.username.trim().toLowerCase() === normalizedUsername));
  }

  getUserByEmail(email) {
    const users = this.getAllUsers();
    return users.find(user => user.email === email);
  }

  createUser(userData) {
    const users = this.getAllUsers();
    const newUser = {
      id: Date.now(),
      ...userData,
      addresses: [],
      paymentMethods: [],
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  }

  updateUser(userId, userData) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return users[userIndex];
    }
    return null;
  }

  // Current User Session
  getCurrentUser() {
    const currentUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (currentUserId && currentUserId !== 'null') {
      return this.getUserById(parseInt(currentUserId));
    }
    return null;
  }

  setCurrentUser(userId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId.toString());
  }

  clearCurrentUser() {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, 'null');
  }

  // Address Management
  addAddress(userId, addressData) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      const newAddress = {
        id: Date.now(),
        ...addressData,
        isDefault: users[userIndex].addresses.length === 0
      };
      users[userIndex].addresses.push(newAddress);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return newAddress;
    }
    return null;
  }

  updateAddress(userId, addressId, addressData) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      const addressIndex = users[userIndex].addresses.findIndex(addr => addr.id === addressId);
      if (addressIndex !== -1) {
        users[userIndex].addresses[addressIndex] = { 
          ...users[userIndex].addresses[addressIndex], 
          ...addressData 
        };
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return users[userIndex].addresses[addressIndex];
      }
    }
    return null;
  }

  deleteAddress(userId, addressId) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex].addresses = users[userIndex].addresses.filter(addr => addr.id !== addressId);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    }
    return false;
  }

  setDefaultAddress(userId, addressId) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex].addresses.forEach(addr => {
        addr.isDefault = addr.id === addressId;
      });
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    }
    return false;
  }

  // Payment Method Management
  addPaymentMethod(userId, paymentData) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      const newPayment = {
        id: Date.now(),
        ...paymentData,
        isDefault: users[userIndex].paymentMethods.length === 0
      };
      users[userIndex].paymentMethods.push(newPayment);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return newPayment;
    }
    return null;
  }

  updatePaymentMethod(userId, paymentId, paymentData) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      const paymentIndex = users[userIndex].paymentMethods.findIndex(payment => payment.id === paymentId);
      if (paymentIndex !== -1) {
        users[userIndex].paymentMethods[paymentIndex] = { 
          ...users[userIndex].paymentMethods[paymentIndex], 
          ...paymentData 
        };
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return users[userIndex].paymentMethods[paymentIndex];
      }
    }
    return null;
  }

  deletePaymentMethod(userId, paymentId) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex].paymentMethods = users[userIndex].paymentMethods.filter(payment => payment.id !== paymentId);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    }
    return false;
  }

  setDefaultPaymentMethod(userId, paymentId) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex].paymentMethods.forEach(payment => {
        payment.isDefault = payment.id === paymentId;
      });
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    }
    return false;
  }

  // Utility Methods
  clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.initializeDefaultData();
  }

  // Remove admin account if exists
  removeAdminAccount() {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(user => user.username !== 'admin');
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
    
    // If current user is admin, logout
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.username === 'admin') {
      this.clearCurrentUser();
    }
  }
}

export default new DataService();