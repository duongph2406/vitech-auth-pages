class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
    this.nextId = 1;
  }

  // Add notification
  add(notification) {
    const newNotification = {
      id: this.nextId++,
      timestamp: Date.now(),
      ...notification
    };

    this.notifications.push(newNotification);
    this.notifyListeners();

    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        this.remove(newNotification.id);
      }, notification.duration || 5000);
    }

    return newNotification.id;
  }

  // Remove notification
  remove(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Clear all notifications
  clear() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Get all notifications
  getAll() {
    return [...this.notifications];
  }

  // Subscribe to notifications
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(listener => {
      listener(this.notifications);
    });
  }

  // Convenience methods
  success(message, options = {}) {
    return this.add({
      type: 'success',
      message,
      ...options
    });
  }

  error(message, options = {}) {
    return this.add({
      type: 'error',
      message,
      duration: 0, // Don't auto-remove errors
      ...options
    });
  }

  warning(message, options = {}) {
    return this.add({
      type: 'warning',
      message,
      ...options
    });
  }

  info(message, options = {}) {
    return this.add({
      type: 'info',
      message,
      ...options
    });
  }
}

export default new NotificationService();