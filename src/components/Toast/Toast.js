import React, { useEffect } from 'react';
import './Toast.css';

// Thông báo tự biến mất, không cần người dùng bấm gì để tắt.
const Toast = ({ message, show, onDone, duration = 2200 }) => {
  useEffect(() => {
    if (!show) return undefined;
    const timer = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(timer);
  }, [show, duration, onDone]);

  if (!show) return null;

  return (
    <div className="app-toast" role="status">
      {message}
    </div>
  );
};

export default Toast;
