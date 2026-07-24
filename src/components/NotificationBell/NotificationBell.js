import React, { useCallback, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { fetchMyNotifications, markNotificationRead } from '../../services/notificationService';
import './NotificationBell.css';

const POLL_INTERVAL_MS = 30000;

const formatRelativeTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return `${Math.floor(diffHours / 24)} ngày trước`;
};

const NotificationBell = () => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  useOnClickOutside(panelRef, () => setIsOpen(false));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  const loadNotifications = useCallback(() => {
    if (!currentUser?.uid) {
      setNotifications([]);
      return;
    }
    fetchMyNotifications(currentUser.uid)
      .then(setNotifications)
      .catch((error) => console.error('Cannot load notifications:', error));
  }, [currentUser]);

  useEffect(() => {
    loadNotifications();
    if (!currentUser?.uid) return undefined;
    const interval = setInterval(loadNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [currentUser, loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notification) => {
    if (notification.read) return;
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
    try {
      await markNotificationRead(notification.id);
    } catch (error) {
      console.error('Cannot mark notification as read:', error);
    }
  };

  if (!currentUser) {
    return (
      <span className="nav__action-link notif-bell-btn notif-bell-btn--disabled" title="Đăng nhập để xem thông báo">
        <i className="bx bx-bell"></i>
      </span>
    );
  }

  return (
    <div className="notif-bell" ref={panelRef}>
      <button
        type="button"
        className="nav__action-link notif-bell-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Thông báo"
      >
        <i className="bx bx-bell"></i>
        {unreadCount > 0 && <span className="cart-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notif-panel">
          <div className="notif-panel__header">Thông báo</div>
          <div className="notif-panel__list">
            {notifications.length === 0 ? (
              <p className="notif-panel__empty">Chưa có thông báo nào.</p>
            ) : (
              notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  className={`notif-item ${notification.read ? '' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <span className="notif-item__message">{notification.message}</span>
                  <span className="notif-item__time">{formatRelativeTime(notification.createdAt)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
