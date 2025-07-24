import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import NotificationItem from './NotificationItem';
import './NotificationContainer.css';

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => notificationService.remove(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;