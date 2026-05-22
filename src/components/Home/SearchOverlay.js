// src/components/SearchOverlay.js
import React, { useEffect, useRef } from 'react';
import '../../pages/Home.css'; 
// Nhận `isOpen` và `onClose` từ component cha
function SearchOverlay({ isOpen, onClose }) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Tự động focus vào input khi overlay mở
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Chờ transition hoàn tất
    }

    // Xử lý đóng bằng phím Escape
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div className={`search-overlay ${isOpen ? 'active' : ''}`}>
      <div className="search-overlay__header">
        <div className="search-overlay__form">
          <i className='bx bx-search'></i>
          <input 
            type="text" 
            placeholder="Tìm kiếm món ăn, cửa hàng..." 
            className="search-overlay__input" 
            ref={inputRef} 
          />
        </div>
        <button className="search-overlay__close" onClick={onClose}>
          <i className='bx bx-x'></i>
        </button>
      </div>
      <div className="search-overlay__content">
        <p className="search-overlay__tip">Gõ để bắt đầu tìm kiếm...</p>
      </div>
    </div>
  );
}

export default SearchOverlay;