/**
 * Enhanced storage system with encryption and error handling
 */

import { STORAGE_KEYS } from './constants';
import { StorageError } from './errorHandler';

class StorageSystem {
  constructor() {
    this.prefix = 'vitech_';
    this.encryptionEnabled = false; // Can be enabled for sensitive data
    this.compressionEnabled = true;
    this.listeners = new Map();
  }

  // Set item with error handling and optional encryption
  setItem(key, value, options = {}) {
    try {
      const { encrypt = false, compress = this.compressionEnabled, ttl = null } = options;
      
      let processedValue = {
        data: value,
        timestamp: Date.now(),
        ttl: ttl ? Date.now() + ttl : null,
        compressed: false,
        encrypted: false
      };

      // Compress large objects
      if (compress && this.shouldCompress(value)) {
        processedValue.data = this.compress(value);
        processedValue.compressed = true;
      }

      // Encrypt sensitive data
      if (encrypt && this.encryptionEnabled) {
        processedValue.data = this.encrypt(processedValue.data);
        processedValue.encrypted = true;
      }

      const serializedValue = JSON.stringify(processedValue);
      localStorage.setItem(this.getKey(key), serializedValue);

      // Notify listeners
      this.notifyListeners(key, value, 'set');

      return true;
    } catch (error) {
      throw new StorageError(`Failed to set item: ${error.message}`, key);
    }
  }

  // Get item with automatic decryption and decompression
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.getKey(key));
      
      if (!item) {
        return defaultValue;
      }

      const parsedItem = JSON.parse(item);

      // Check TTL
      if (parsedItem.ttl && Date.now() > parsedItem.ttl) {
        this.removeItem(key);
        return defaultValue;
      }

      let value = parsedItem.data;

      // Decrypt if needed
      if (parsedItem.encrypted && this.encryptionEnabled) {
        value = this.decrypt(value);
      }

      // Decompress if needed
      if (parsedItem.compressed) {
        value = this.decompress(value);
      }

      return value;
    } catch (error) {
      console.warn(`Failed to get item ${key}:`, error);
      return defaultValue;
    }
  }

  // Remove item
  removeItem(key) {
    try {
      const oldValue = this.getItem(key);
      localStorage.removeItem(this.getKey(key));
      
      // Notify listeners
      this.notifyListeners(key, oldValue, 'remove');
      
      return true;
    } catch (error) {
      throw new StorageError(`Failed to remove item: ${error.message}`, key);
    }
  }

  // Clear all app data
  clear() {
    try {
      const keys = Object.keys(localStorage);
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      
      appKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      // Notify listeners
      this.notifyListeners('*', null, 'clear');
      
      return true;
    } catch (error) {
      throw new StorageError(`Failed to clear storage: ${error.message}`);
    }
  }

  // Check if key exists
  hasItem(key) {
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  // Get all keys
  getKeys() {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, ''));
  }

  // Get storage size
  getSize() {
    let size = 0;
    const keys = this.getKeys();
    
    keys.forEach(key => {
      const item = localStorage.getItem(this.getKey(key));
      if (item) {
        size += item.length;
      }
    });

    return {
      bytes: size,
      kb: Math.round(size / 1024 * 100) / 100,
      mb: Math.round(size / (1024 * 1024) * 100) / 100
    };
  }

  // Watch for changes
  watch(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    // Return unwatch function
    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(callback);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  // Notify listeners
  notifyListeners(key, value, action) {
    // Notify specific key listeners
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach(callback => {
        try {
          callback({ key, value, action, timestamp: Date.now() });
        } catch (error) {
          console.error('Storage listener error:', error);
        }
      });
    }

    // Notify wildcard listeners
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach(callback => {
        try {
          callback({ key, value, action, timestamp: Date.now() });
        } catch (error) {
          console.error('Storage wildcard listener error:', error);
        }
      });
    }
  }

  // Get prefixed key
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  // Check if value should be compressed
  shouldCompress(value) {
    const serialized = JSON.stringify(value);
    return serialized.length > 1024; // Compress if larger than 1KB
  }

  // Simple compression (placeholder - could use actual compression library)
  compress(value) {
    // This is a placeholder - in real implementation, use a compression library
    return JSON.stringify(value);
  }

  // Simple decompression
  decompress(value) {
    // This is a placeholder - in real implementation, use a compression library
    return JSON.parse(value);
  }

  // Simple encryption (placeholder - use proper encryption in production)
  encrypt(value) {
    // This is a placeholder - in real implementation, use proper encryption
    return btoa(JSON.stringify(value));
  }

  // Simple decryption
  decrypt(value) {
    // This is a placeholder - in real implementation, use proper decryption
    return JSON.parse(atob(value));
  }

  // Backup data
  backup() {
    const data = {};
    const keys = this.getKeys();
    
    keys.forEach(key => {
      data[key] = this.getItem(key);
    });

    return {
      timestamp: Date.now(),
      version: '2.1.0',
      data
    };
  }

  // Restore data
  restore(backup) {
    try {
      if (!backup.data) {
        throw new Error('Invalid backup format');
      }

      // Clear existing data
      this.clear();

      // Restore data
      Object.entries(backup.data).forEach(([key, value]) => {
        this.setItem(key, value);
      });

      return true;
    } catch (error) {
      throw new StorageError(`Failed to restore backup: ${error.message}`);
    }
  }

  // Migrate data from old version
  migrate(fromVersion, toVersion) {
    // Placeholder for data migration logic
    console.log(`Migrating storage from ${fromVersion} to ${toVersion}`);
    return true;
  }
}

// Create singleton instance
const storage = new StorageSystem();

// Convenience methods for common operations
export const setUser = (user) => storage.setItem(STORAGE_KEYS.CURRENT_USER, user);
export const getUser = () => storage.getItem(STORAGE_KEYS.CURRENT_USER);
export const removeUser = () => storage.removeItem(STORAGE_KEYS.CURRENT_USER);

export const setUsers = (users) => storage.setItem(STORAGE_KEYS.USERS, users);
export const getUsers = () => storage.getItem(STORAGE_KEYS.USERS, []);

export const setTheme = (theme) => storage.setItem(STORAGE_KEYS.THEME, theme);
export const getTheme = () => storage.getItem(STORAGE_KEYS.THEME, 'light');

export const setSettings = (settings) => storage.setItem(STORAGE_KEYS.SETTINGS, settings);
export const getSettings = () => storage.getItem(STORAGE_KEYS.SETTINGS, {});

export default storage;