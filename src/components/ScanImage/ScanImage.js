import React, { useState } from 'react';
import './ScanImage.css';

const ScanImage = ({ onClose, onPostProduct }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const API_URL = process.env.REACT_APP_SCAN_DATE_API_URL || 'https://adelaida-beastlike-vernia.ngrok-free.dev/scan-date';

  // Handling chọn ảnh & tạo link preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultData(null);
      setErrorMsg('');
    }
  };

  // Gửi ảnh lên FastAPI Server
  const handleUploadAndScan = async () => {
    if (!selectedFile) {
      setErrorMsg('Vui lòng chọn một file ảnh trước!');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResultData(null);

    // Tạo FormData chứa file ảnh
    const formData = new FormData();
    formData.append('file', selectedFile); // Key 'file' phải đúng với FastAPI UploadFile = File(...)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        body: formData,
      });

      if (!response.ok) {
        const ngrokErrorCode = response.headers.get('ngrok-error-code');
        if (ngrokErrorCode) {
          throw new Error(`Ngrok offline (${ngrokErrorCode})`);
        }
        throw new Error(`Lỗi Server: ${response.status}`);
      }

      const resJson = await response.json();

      if (resJson.success) {
        const normalizedData = Array.isArray(resJson.data)
          ? resJson.data
          : resJson.data
            ? [resJson.data]
            : [];
        setResultData(normalizedData);
      } else {
        setErrorMsg(resJson.message || 'Xử lý ảnh thất bại.');
      }
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
      if (err.message?.includes('Failed to fetch')) {
        setErrorMsg('Không kết nối được API. Có thể tunnel ngrok đã offline, hãy chạy lại backend và cập nhật URL mới.');
      } else {
        setErrorMsg(`Không thể kết nối tới API Server: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scan-image-overlay">
      <div className="scan-image-modal">
        <button className="scan-image-close" onClick={onClose}>✕</button>
        
        <h2>📸 Quét Ngày Sản Xuất & Hạn Sử Dụng</h2>
        
        {/* Ô chọn File */}
        <div className="scan-image-input-group">
          <label htmlFor="file-input" className="scan-image-file-label">
            <i className='bx bx-upload'></i>
            <span>Chọn ảnh hoặc chụp ảnh</span>
          </label>
          <input 
            id="file-input"
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="scan-image-file-input"
          />
        </div>

        {/* Hiển thị Xem trước ảnh */}
        {previewUrl && (
          <div className="scan-image-preview">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="scan-image-preview-img"
            />
          </div>
        )}

        {/* Nút Bắt đầu Quét */}
        <button
          onClick={handleUploadAndScan}
          disabled={loading || !selectedFile}
          className={`scan-image-button ${loading ? 'loading' : ''}`}
        >
          {loading ? '⏳ Đang phân tích ảnh...' : '🚀 Bắt đầu Quét'}
        </button>

        {/* Hiển thị Lỗi nếu có */}
        {errorMsg && (
          <div className="scan-image-error">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Hiển thị Kết quả từ FastAPI */}
        {resultData && (
          <div className="scan-image-result">
            <h3>📌 Kết quả trích xuất:</h3>

            {resultData.length === 0 ? (
              <p className="scan-image-empty">Không tìm thấy vùng thông tin NSX/HSD trên ảnh này.</p>
            ) : (
              <>
                {resultData.map((item, index) => (
                  <div key={index} className="scan-image-result-item">
                    <p><strong>📅 Ngày sản xuất (NSX):</strong> <span className={item.nsx ? 'highlight-green' : 'highlight-gray'}>{item.nsx || '---'}</span></p>
                    <p><strong>⏳ Hạn sử dụng (HSD):</strong> <span className={item.hsd ? 'highlight-red' : 'highlight-gray'}>{item.hsd || '---'}</span></p>
                  </div>
                ))}
                
                {/* Nút Tiếp tục đăng bài */}
                {resultData[0]?.nsx && resultData[0]?.hsd && onPostProduct && (
                  <button 
                    className="scan-image-next-button"
                    onClick={() => onPostProduct(resultData[0])}
                  >
                    📤 Tiếp tục đăng bài
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanImage;
