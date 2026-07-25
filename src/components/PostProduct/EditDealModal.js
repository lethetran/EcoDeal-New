import React, { useState } from 'react';
import { sanitizeProductName, updateDealFields } from '../../services/dealService';
import './PostProduct.css';

// Modal sửa nhanh các trường kinh doanh của 1 bài đăng đã có (giá, số lượng, mức giảm giá).
// Không cho sửa lại loại sản phẩm/ảnh/kết quả AI kiểm duyệt — những thứ đó gắn với lần đăng gốc,
// muốn đổi thì đăng bài mới để tránh mập mờ về tính xác thực của nhãn đã kiểm duyệt.
const EditDealModal = ({ deal, onClose, onSaved }) => {
  const [productName, setProductName] = useState(deal.productName || '');
  const [quantity, setQuantity] = useState(String(deal.quantity ?? ''));
  const [salePrice, setSalePrice] = useState(String(deal.salePrice ?? ''));
  const [initialDiscount, setInitialDiscount] = useState(String(deal.initialDiscount ?? ''));
  const [dailyReduction, setDailyReduction] = useState(String(deal.dailyReduction ?? ''));
  const [maxDiscountThreshold, setMaxDiscountThreshold] = useState(String(deal.maxDiscountThreshold ?? ''));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    if (!productName.trim() || !quantity || !salePrice) {
      setMessage('⚠️ Vui lòng nhập đủ tên, số lượng và giá bán.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      await updateDealFields(deal.id, {
        productName: sanitizeProductName(productName),
        quantity: Math.max(0, parseFloat(quantity) || 0),
        salePrice: Math.max(0, parseFloat(salePrice) || 0),
        initialDiscount: Math.max(0, Math.min(100, parseFloat(initialDiscount) || 0)),
        dailyReduction: Math.max(0, parseFloat(dailyReduction) || 0),
        maxDiscountThreshold: Math.max(0, Math.min(100, parseFloat(maxDiscountThreshold) || 0)),
      });
      setMessage('✅ Đã lưu thay đổi.');
      onSaved?.();
      setTimeout(() => onClose(), 800);
    } catch (error) {
      console.error('Cannot update deal:', error);
      setMessage('❌ Không thể lưu, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="post-product-overlay">
      <div className="post-product-modal">
        <div className="post-product-header">
          <div className="post-product-header-text">
            <h2>Sửa bài đăng</h2>
            <p className="post-product-subtitle">Chỉ áp dụng cho giá, số lượng và mức giảm giá</p>
          </div>
          <button type="button" className="post-product-close" onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        <div className="post-product-body">
          <div className="post-product-form">
            <div className="form-group">
              <label>Tên sản phẩm *</label>
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} maxLength={100} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số lượng còn lại *</label>
                <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Giá bán (VNĐ) *</label>
                <input type="number" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Giảm giá ban đầu (%)</label>
                <input type="number" min="0" max="100" value={initialDiscount} onChange={(e) => setInitialDiscount(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Giảm thêm mỗi {deal.reductionUnit === 'hour' ? 'giờ' : 'ngày'} (%)</label>
                <input type="number" min="0" max="100" value={dailyReduction} onChange={(e) => setDailyReduction(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label>Mức giảm tối đa (%)</label>
              <input type="number" min="0" max="100" value={maxDiscountThreshold} onChange={(e) => setMaxDiscountThreshold(e.target.value)} />
            </div>

            {message && (
              <div className={`post-product-message ${message.startsWith('✅') ? 'success' : 'warning'}`}>{message}</div>
            )}

            <button type="button" className="btn-post" onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDealModal;
