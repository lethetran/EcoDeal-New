import React from 'react';
import './VerifiedBadge.css';

/**
 * Huy hiệu xác minh AI — chỉ render khi được truyền `true` từ một field boolean
 * trong dữ liệu (vd. deal.ecoCheckApproved), không bao giờ suy ra từ chuỗi text
 * do người bán nhập (tên sản phẩm...). Vì vậy người bán không thể "giả" huy hiệu
 * này chỉ bằng cách gõ ký tự ✅ vào tên sản phẩm.
 */
const VerifiedBadge = ({ label = 'Đã kiểm duyệt AI', size = 'md' }) => (
  <span
    className={`verified-badge verified-badge--${size}`}
    title="Nhãn này do hệ thống Ecodeal tự động gắn sau khi xác minh chất lượng — người bán không thể tự chỉnh sửa hay giả mạo."
  >
    <svg className="verified-badge__icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path d="M7 12.5l3.2 3.2L17 8.8" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="verified-badge__label">{label}</span>
  </span>
);

export default VerifiedBadge;
