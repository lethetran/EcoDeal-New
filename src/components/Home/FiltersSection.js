import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './FiltersSection.css';

function FiltersSection() {
  const [activeFilter, setActiveFilter] = useState('nearby');
  const [activeView, setActiveView] = useState('grid'); 

  const filters = [
    { key: 'nearby', label: 'Gần bạn', icon: 'bx-map' },
    { key: 'deals', label: 'Ưu đãi', icon: 'bxs-discount' },
    { key: 'new', label: 'Mới nhất', icon: 'bx-time-five' },
  ];
  
  const views = [
    { key: 'grid', icon: 'bxs-grid-alt' },
    { key: 'map', icon: 'bxs-map' },
  ];

  return (
    <section className="filters-section">
      <div className="container">
        <div className="filters__card-container">
          <div className="filters__scroll-container">
            {filters.map((filter) => {
              // 1. KIỂM TRA: Nếu là nút "Ưu đãi"
              if (filter.key === 'deals') {
                // 2. RENDER RA COMPONENT <Link>
                return (
                  <Link 
                    key={filter.key} 
                    to="/promotions" // <-- Đặt đường dẫn đến trang ưu đãi của bạn ở đây
                    className="filter-chip"
                  >
                    <i className={`bx ${filter.icon}`}></i>
                    <span>{filter.label}</span>
                  </Link>
                );
              }
              
              // 3. Nếu không phải, render ra <button> như cũ
              return (
                <button
                  key={filter.key}
                  className={`filter-chip ${activeFilter === filter.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  <i className={`bx ${filter.icon}`}></i>
                  <span>{filter.label}</span>
                </button>
              );
            })}
            <Link to="/stores" className="filter-chip">
              <i className='bx bx-store'></i>
              <span>Cửa hàng</span>
            </Link>
          </div>
          <div className="view-toggle">
            {views.map(view => (
              <button key={view.key} className="view-toggle__btn" onClick={() => setActiveView(view.key)}>
                {activeView === view.key && <motion.div className="active-pill" layoutId="activeViewPill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <i className={`bx ${view.icon} ${activeView === view.key ? 'active' : ''}`}></i>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FiltersSection;