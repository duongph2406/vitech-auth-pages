import React, { useEffect, useState } from 'react';
import './NotificationItem.css';

const NotificationItem = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div 
      className={`notification-item notification-${notification.type} ${
        isVisible && !isLeaving ? 'visible' : ''
      } ${isLeaving ? 'leaving' : ''}`}
    >
      <div className="notification-icon">
        {getIcon()}
      </div>
      <div className="notification-content">
        {notification.title && (
          <div className="notification-title">{notification.title}</div>
        )}
        <div className="notification-message">{notification.message}</div>
      </div>
      <button 
        className="notification-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default NotificationItem;