import React, { useState, useEffect } from 'react';
import './PostProduct.css';
import { auth } from '../../firebase-config';
import { saveDeal } from '../../services/dealService';

const SCAN_DATE_API_URL = process.env.REACT_APP_SCAN_DATE_API_URL || 'https://ac15-34-87-17-43.ngrok-free.app/scan-date';
const SCAN_FRUITS_API_URL = process.env.REACT_APP_SCAN_FRUITS_API_URL || 'https://ac15-34-87-17-43.ngrok-free.app/scan-fruits';
const SCAN_MEAT_API_URL = process.env.REACT_APP_SCAN_MEAT_API_URL || 'https://ac15-34-87-17-43.ngrok-free.app/scan-meat';

const getFirstScanResult = (data) => {
  if (Array.isArray(data)) {
    return data[0] || null;
  }
  return data || null;
};

const PostProduct = ({ nsxData, onClose }) => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    quantity: '', // Số lượng sản phẩm
    salePrice: '',
    initialDiscount: '', // Giảm giá ban đầu (%)
    dailyReduction: '', // Giảm bao nhiêu %/ngày/giờ
    maxDiscountThreshold: '', // Mức giảm tối đa
    enableFreeAlert: false, // Tùy chọn bật/tắt thông báo hỗ trợ cộng đồng
    hoursBeforeFreeAlert: '', // Thông báo khi còn bao nhiêu giờ
    nsx: nsxData?.nsx || '',
    hsd: nsxData?.hsd || '',
    freshShelfLifeDays: '',
    freshShelfLifeHours: '',
  });
  
  // Image states - support multiple images
  const [productImages, setProductImages] = useState([]); // Array of {file, preview}
  const [mainImageIndex, setMainImageIndex] = useState(0); // Index of main thumbnail
  const [qualityCheckImages, setQualityCheckImages] = useState([]); // Array of {file, preview} dành riêng cho AI kiểm duyệt chất lượng
  const [dateImagePreview, setDateImagePreview] = useState(null);
  const [dateImageFile, setDateImageFile] = useState(null); // Lưu file object để quét
  const [dateExtracted, setDateExtracted] = useState(false);
  const [dateWasScanned, setDateWasScanned] = useState(false); // Theo dõi NSX/HSD có quét từ ảnh không
  
  const [ecoCheckStatus, setEcoCheckStatus] = useState(null); // null, 'pending', 'approved', 'rejected'
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [reductionUnit, setReductionUnit] = useState('day'); // 'day' hoặc 'hour'
  const [timeRemaining, setTimeRemaining] = useState(0); // Thời gian còn lại theo unit
  const [dealPercentage, setDealPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false); // Loading riêng cho quét ảnh
  const [aiCheckLoading, setAiCheckLoading] = useState(false); // Loading riêng cho AI check
  const [message, setMessage] = useState('');

  const isFreshFruits = formData.category === 'fresh_fruits';
  const isMeatCategory = formData.category === 'raw_meat_bread';
  const isKgCategory = isFreshFruits || isMeatCategory;
  const isAICheckCategory = isFreshFruits || isMeatCategory;
  const aiProductLabel = isFreshFruits ? 'hoa quả' : 'thịt tươi';
  const isQualityRejected = isAICheckCategory && ecoCheckStatus === 'rejected';

  const formatRemaining = (value) => {
    if (!Number.isFinite(value)) return '0';
    const rounded = Math.round(value * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
  };

  // Tính toán thời gian còn lại và deal percentage
  useEffect(() => {
    let daysLeft = 0;
    let timeLeft = 0;

    if (isAICheckCategory) {
      const shelfDays = parseInt(formData.freshShelfLifeDays, 10) || 0;
      const shelfHours = parseInt(formData.freshShelfLifeHours, 10) || 0;
      const totalHours = (shelfDays * 24) + shelfHours;
      if (totalHours > 0) {
        daysLeft = totalHours / 24;
        timeLeft = reductionUnit === 'hour' ? totalHours : daysLeft;
      }
    } else if (formData.hsd) {
      const hsdDate = new Date(formData.hsd);
      const today = new Date();
      const msLeft = hsdDate - today;
      daysLeft = msLeft / (1000 * 60 * 60 * 24);
      timeLeft = reductionUnit === 'hour'
        ? (msLeft / (1000 * 60 * 60))
        : daysLeft;
    }

    const normalizedDays = Math.max(0, daysLeft);
    const normalizedTime = Math.max(0, timeLeft);

    setDaysRemaining(Math.round(normalizedDays * 100) / 100);
    setTimeRemaining(Math.round(normalizedTime * 100) / 100);

    const initial = parseFloat(formData.initialDiscount) || 0;
    const daily = parseFloat(formData.dailyReduction) || 0;
    const maxThreshold = parseFloat(formData.maxDiscountThreshold) || 0;

    if (timeLeft > 0) {
      let dealPercent = initial + (daily * timeLeft);
      if (maxThreshold > 0 && dealPercent > maxThreshold) {
        dealPercent = maxThreshold;
      }
      dealPercent = Math.min(100, dealPercent);
      setDealPercentage(Math.max(0, Math.round(dealPercent * 10) / 10));
    } else {
      setDealPercentage(initial);
    }
  }, [
    isAICheckCategory,
    formData.hsd,
    formData.freshShelfLifeDays,
    formData.freshShelfLifeHours,
    formData.initialDiscount,
    formData.dailyReduction,
    formData.maxDiscountThreshold,
    reductionUnit,
  ]);

  // Handler cho file upload ảnh
  const handleImageUpload = (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === 'product') {
      // Tải nhiều ảnh sản phẩm
      const validFiles = [];
      
      // Filter valid files trước
      Array.from(files).forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          setMessage('❌ File ' + file.name + ' quá lớn (max 5MB)');
        } else {
          validFiles.push(file);
        }
      });

      if (validFiles.length === 0) {
        setMessage('❌ Không có file hợp lệ để tải');
        return;
      }

      const newImages = [];
      let filesProcessed = 0;

      // Load tất cả valid files
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push({
            file: file,
            preview: event.target.result,
          });
          filesProcessed++;

          // Khi tất cả ảnh đã được xử lý, cập nhật state
          if (filesProcessed === validFiles.length) {
            const updatedImages = [...productImages, ...newImages];
            setProductImages(updatedImages);
            // Auto set first image as main nếu chưa có
            if (updatedImages.length > 0 && mainImageIndex === 0) {
              setMainImageIndex(0);
            }
            if (newImages.length > 0) {
              setMessage(`✅ Đã tải ${newImages.length} ảnh`);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    } else if (type === 'fruit-check') {
      const validFiles = [];

      Array.from(files).forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          setMessage('❌ File ' + file.name + ' quá lớn (max 5MB)');
        } else {
          validFiles.push(file);
        }
      });

      if (validFiles.length === 0) {
        setMessage('❌ Không có ảnh AI kiểm duyệt hợp lệ để tải');
        return;
      }

      const newImages = [];
      let filesProcessed = 0;

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push({
            file,
            preview: event.target.result,
          });
          filesProcessed++;

          if (filesProcessed === validFiles.length) {
            const updatedImages = [...qualityCheckImages, ...newImages];
            setQualityCheckImages(updatedImages);
            setEcoCheckStatus(null);
            setMessage(`✅ Đã tải ${newImages.length} ảnh AI kiểm duyệt`);
          }
        };
        reader.readAsDataURL(file);
      });
    } else if (type === 'date') {
      // Ảnh NSX/HSD - chỉ một ảnh (dùng cách giống ScanImage.js)
      const file = files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ File ảnh quá lớn (max 5MB)');
        return;
      }

      // Set file ngay để tránh timing issue
      setDateImageFile(file);
      
      // Tạo preview URL (hiệu quả hơn FileReader)
      const previewUrl = URL.createObjectURL(file);
      setDateImagePreview(previewUrl);
      
      // Reset form khi chọn ảnh mới
      setFormData(prev => ({
        ...prev,
        nsx: '',
        hsd: ''
      }));
      setDateWasScanned(false);
      setDateExtracted(false);
      setEcoCheckStatus(null);
      setMessage('📷 Ảnh đã chọn. Nhấn nút "Quét" để trích xuất NSX/HSD');
    }
    // Clear input để cho phép chọn lại file
    e.target.value = '';
  };

  // Quét ảnh NSX/HSD từ ảnh đã chọn
  const handleScanDates = async () => {
    if (!dateImageFile) {
      setMessage('⚠️ Vui lòng chọn ảnh trước');
      return;
    }
    setScanLoading(true);
    setMessage('🔄 Đang quét NSX và HSD...');
    
    try {
      // Tạo FormData chứa file ảnh (giống ScanImage.js)
      const formData = new FormData();
      formData.append('file', dateImageFile);

      console.log('Gửi file:', dateImageFile.name, 'Size:', dateImageFile.size);

      const response = await fetch(SCAN_DATE_API_URL, {
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
        throw new Error(`Server error: ${response.status}`);
      }

      const resJson = await response.json();
      console.log('API Response:', resJson);

      // Kiểm tra kết quả từ API
      const result = getFirstScanResult(resJson.data);

      if (resJson.success && result) {
        console.log('Extracted result:', result);

        // Điền NSX và HSD vào form
        if (result.nsx && result.hsd) {
          setFormData(prev => ({
            ...prev,
            nsx: result.nsx,
            hsd: result.hsd
          }));
          setDateExtracted(true);
          setDateWasScanned(true); // ✅ Cả 2 được quét
          setEcoCheckStatus('pending');
          setMessage(`✅ Quét thành công! NSX: ${result.nsx}, HSD: ${result.hsd}`);
        } else if (result.nsx || result.hsd) {
          // ⚠️ Nếu chỉ có 1 trong 2 - không set dateWasScanned = true
          setFormData(prev => ({
            ...prev,
            nsx: result.nsx || '',
            hsd: result.hsd || ''
          }));
          setDateExtracted(true);
          setDateWasScanned(false); // ❌ Chỉ quét được 1, không đủ
          setMessage(`⚠️ Chỉ tìm thấy: NSX: ${result.nsx || '(chưa có)'}, HSD: ${result.hsd || '(chưa có)'} - Quét lại ảnh!`);
        } else {
          setMessage('⚠️ Không thể đọc NSX/HSD từ ảnh này. Vui lòng nhập thủ công.');
        }
      } else {
        setMessage(`⚠️ ${resJson.message || 'Không thể xử lý ảnh. Vui lòng thử ảnh khác.'}`);
      }
    } catch (error) {
      console.error('Scan error:', error);
      if (error.message?.includes('Failed to fetch')) {
        setMessage('⚠️ Không kết nối được API quét. Có thể tunnel ngrok đã offline, vui lòng chạy lại backend và cập nhật URL mới.');
      } else {
        setMessage(`⚠️ Lỗi: ${error.message}. Vui lòng nhập NSX/HSD thủ công.`);
      }
    } finally {
      setScanLoading(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        freshShelfLifeDays: (value === 'fresh_fruits' || value === 'raw_meat_bread') ? prev.freshShelfLifeDays : '',
        freshShelfLifeHours: (value === 'fresh_fruits' || value === 'raw_meat_bread') ? prev.freshShelfLifeHours : '',
      }));

      if (value === 'fresh_fruits' || value === 'raw_meat_bread') {
        setDateExtracted(false);
        setDateWasScanned(false);
        setEcoCheckStatus(null);
      } else {
        setQualityCheckImages([]);
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Nếu sửa NSX/HSD thủ công, chỉ reset scan flag và status
    if (name === 'nsx' || name === 'hsd') {
      if (dateWasScanned) {
        setDateWasScanned(false);
        setEcoCheckStatus(null);
      }
    }
  };

  // Kiểm tra AI - verify NSX/HSD bằng cách quét lại từ API
  const handleAICheck = async () => {
    setAiCheckLoading(true);
    
    try {
      if (isAICheckCategory) {
        if (qualityCheckImages.length === 0) {
          setEcoCheckStatus('rejected');
          setMessage(`❌ Vui lòng tải ảnh AI kiểm duyệt ${aiProductLabel} trước khi kiểm tra.`);
          setAiCheckLoading(false);
          return;
        }

        const qualityFormData = new FormData();
        qualityCheckImages.forEach((img, index) => {
          if (img.file) {
            qualityFormData.append('files', img.file, img.file.name || `quality-${index}.jpg`);
          }
        });

        const aiApiUrl = isMeatCategory ? SCAN_MEAT_API_URL : SCAN_FRUITS_API_URL;

        const response = await fetch(aiApiUrl, {
          method: 'POST',
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
          body: qualityFormData,
        });

        if (!response.ok) {
          const ngrokErrorCode = response.headers.get('ngrok-error-code');
          if (ngrokErrorCode) {
            throw new Error(`Ngrok offline (${ngrokErrorCode})`);
          }
          throw new Error(`Server error: ${response.status}`);
        }

        const resJson = await response.json();
        if (!resJson.success) {
          setEcoCheckStatus('rejected');
          setMessage(`❌ AI quét ${aiProductLabel} thất bại: ${resJson.message || 'Không rõ nguyên nhân.'}`);
          setAiCheckLoading(false);
          return;
        }

        const isPassed = Boolean(resJson.is_pass) || resJson.status === 'PASSED';

        if (isPassed) {
          setEcoCheckStatus('approved');
          setMessage('✅ AI kiểm duyệt: Tốt.');
        } else {
          setEcoCheckStatus('rejected');
          setMessage('❌ AI kiểm duyệt: Hư hỏng.');
        }
        setAiCheckLoading(false);
        return;
      }

      // Bước 1: Kiểm tra xem có quét được cả 2 ngày không
      if (!dateWasScanned || !formData.nsx || !formData.hsd) {
        setEcoCheckStatus('rejected');
        setMessage('❌ Quét không đủ thông tin. Cần cả NSX và HSD. Vui lòng quét ảnh lại.');
        setAiCheckLoading(false);
        return;
      }
      
      // Bước 2: Nếu có dateImageFile, quét lại từ API để verify
      if (dateImageFile) {
        const formDataForScan = new FormData();
        formDataForScan.append('file', dateImageFile);
        
        const response = await fetch(SCAN_DATE_API_URL, {
          method: 'POST',
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
          body: formDataForScan
        });

        if (!response.ok) {
          const ngrokErrorCode = response.headers.get('ngrok-error-code');
          if (ngrokErrorCode) {
            throw new Error(`Ngrok offline (${ngrokErrorCode})`);
          }
          throw new Error(`Server error: ${response.status}`);
        }
        
        const resJson = await response.json();
        
        const result = getFirstScanResult(resJson.data);

        if (resJson.success && result) {
          
          // So sánh kết quả từ API với giá trị form
          const apiNsx = result.nsx?.trim();
          const apiHsd = result.hsd?.trim();
          const formNsx = formData.nsx?.trim();
          const formHsd = formData.hsd?.trim();
          
          const nsxMatch = apiNsx === formNsx;
          const hsdMatch = apiHsd === formHsd;
          
          console.log(`🔍 AI Verify:`, {
            fromAPI: { nsx: apiNsx, hsd: apiHsd },
            fromForm: { nsx: formNsx, hsd: formHsd },
            nsxMatch,
            hsdMatch
          });
          
          // Bước 3: Kiểm tra xem khớp không
          if (nsxMatch && hsdMatch) {
            // Tính lại daysRemaining từ HSD
            const hsdDate = new Date(formData.hsd);
            const today = new Date();
            const msLeft = hsdDate - today;
            const currentDaysRemaining = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
            
            if (currentDaysRemaining > 0) {
              setEcoCheckStatus('approved');
              setMessage('✅ Thông tin khớp! Sản phẩm được gán nhãn "EcoCheck"');
            } else {
              setEcoCheckStatus('rejected');
              setMessage('❌ HSD đã hết hạn. Không được gán nhãn.');
            }
          } else {
            setEcoCheckStatus('rejected');
            const mismatch = [];
            if (!nsxMatch) mismatch.push('NSX');
            if (!hsdMatch) mismatch.push('HSD');
            setMessage(`❌ Thông tin không khớp: ${mismatch.join(' + ')} bị sai. Quét lại hoặc sửa thủ công.`);
          }
        } else {
          setEcoCheckStatus('rejected');
          setMessage('❌ Không thể quét lại ảnh. Thông tin không được xác minh.');
        }
      } else {
        // Nếu không có dateImageFile, chỉ check daysRemaining
        const hsdDate = new Date(formData.hsd);
        const today = new Date();
        const msLeft = hsdDate - today;
        const currentDaysRemaining = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
        
        if (currentDaysRemaining > 0) {
          setEcoCheckStatus('approved');
          setMessage('✅ Thông tin hợp lệ. Sản phẩm được gán nhãn "EcoCheck"');
        } else {
          setEcoCheckStatus('rejected');
          setMessage('❌ HSD đã hết hạn. Không được gán nhãn.');
        }
      }
    } catch (error) {
      console.error('AI Check error:', error);
      setEcoCheckStatus('rejected');
      setMessage(`❌ Lỗi kiểm tra: ${error.message}`);
    } finally {
      setAiCheckLoading(false);
    }
  };

  const handlePost = async () => {
    if (!auth.currentUser) {
      setMessage('❌ Bạn cần đăng nhập trước khi đăng deal.');
      return;
    }

    if (!formData.productName || !formData.category || !formData.quantity || !formData.salePrice) {
      setMessage('⚠️ Vui lòng điền đầy đủ thông tin sản phẩm');
      return;
    }

    if (productImages.length === 0) {
      setMessage('📸 Vui lòng tải ít nhất một ảnh sản phẩm');
      return;
    }

    const freshTotalHours = (parseInt(formData.freshShelfLifeDays, 10) || 0) * 24 + (parseInt(formData.freshShelfLifeHours, 10) || 0);

    if (isAICheckCategory && freshTotalHours <= 0) {
      setMessage(`⚠️ Vui lòng nhập thời gian sử dụng còn lại cho ${aiProductLabel}.`);
      return;
    }

    if (isQualityRejected) {
      setMessage(`🚫 AI đánh giá ${aiProductLabel} đã hư hỏng. Bài đăng bị khoá để đảm bảo an toàn thực phẩm.`);
      return;
    }

    if (!isAICheckCategory && (!formData.nsx || !formData.hsd)) {
      setMessage('⚠️ Vui lòng nhập NSX và HSD');
      return;
    }

    setMessage('⏳ Đang đăng bài và tải ảnh lên, vui lòng đợi...');
    setLoading(true);
    
    // Khi post, dealPercentage = initialDiscount (chưa có thời gian trôi qua)
    // Sau đó, mỗi giờ/ngày sẽ tăng thêm dailyReduction
    const initial = parseFloat(formData.initialDiscount) || 0;
    const daily = parseFloat(formData.dailyReduction) || 0;
    const maxThreshold = parseFloat(formData.maxDiscountThreshold) || 0;
    
    // Lúc vừa post, finalDealPercentage = initialDiscount
    let finalDealPercentage = initial;
    
    // Nếu có max threshold và initial > max, thì cap tại max
    if (maxThreshold > 0 && finalDealPercentage > maxThreshold) {
      finalDealPercentage = maxThreshold;
    }
    
    // Cap tại 100%
    finalDealPercentage = Math.min(100, finalDealPercentage);
    finalDealPercentage = Math.round(finalDealPercentage * 10) / 10;
    
    console.log(`📤 Post product - dealPercentage:`, {
      initialDiscount: initial,
      dailyReduction: daily,
      maxDiscountThreshold: maxThreshold,
      atPostTime: finalDealPercentage,
      formula: 'dealPercent = initial + ((now - timestamp) * daily)'
    });
    
    const now = new Date();
    const computedNsx = now.toISOString().slice(0, 10);
    let computedHsd = formData.hsd;
    let computedExpiryAt = null;
    if (isAICheckCategory) {
      const expiresAt = new Date(now.getTime() + freshTotalHours * 60 * 60 * 1000);
      computedHsd = expiresAt.toISOString().slice(0, 10);
      computedExpiryAt = expiresAt.toISOString();
    } else if (formData.hsd) {
      const endOfHsdDay = new Date(formData.hsd);
      endOfHsdDay.setHours(23, 59, 59, 999);
      computedExpiryAt = endOfHsdDay.toISOString();
    }

    // Gửi dữ liệu lên server
    const productData = {
      productName: formData.productName,
      category: formData.category,
      quantity: isKgCategory ? (parseFloat(formData.quantity) || 0) : (parseInt(formData.quantity, 10) || 0),
      quantityUnit: isKgCategory ? 'kg' : 'item',
      salePrice: parseFloat(formData.salePrice) || 0,
      initialDiscount: parseFloat(formData.initialDiscount) || 0,
      dailyReduction: parseFloat(formData.dailyReduction) || 0,
      maxDiscountThreshold: parseFloat(formData.maxDiscountThreshold) || 0,
      reductionUnit,
      enableFreeAlert: formData.enableFreeAlert,
      hoursBeforeFreeAlert: formData.enableFreeAlert ? Math.max(0, parseInt(formData.hoursBeforeFreeAlert) || 0) : 0,
      dealPercentage: finalDealPercentage,
      nsx: isAICheckCategory ? computedNsx : formData.nsx,
      hsd: computedHsd,
      expiryAt: computedExpiryAt,
      daysRemaining: Math.round((Number(daysRemaining) || 0) * 100) / 100,
      freshShelfLifeDays: isAICheckCategory ? (parseInt(formData.freshShelfLifeDays, 10) || 0) : 0,
      freshShelfLifeHours: isAICheckCategory ? (parseInt(formData.freshShelfLifeHours, 10) || 0) : 0,
      aiCheckLabel: isAICheckCategory
        ? (ecoCheckStatus === 'approved'
          ? (isFreshFruits ? 'AI kiểm duyệt hoa quả' : 'AI kiểm duyệt thịt tươi')
          : (isFreshFruits ? 'Chờ kiểm duyệt hoa quả' : 'Chờ kiểm duyệt thịt tươi'))
        : (ecoCheckStatus === 'approved' ? 'EcoCheck Approved' : 'Chờ Admin duyệt'),
      qualityResult: isAICheckCategory ? (ecoCheckStatus === 'approved' ? 'Tốt' : (ecoCheckStatus === 'rejected' ? 'Hư hỏng' : '')) : '',
      qualityAverageConfidence: 0,
      ecoCheckApproved: ecoCheckStatus === 'approved',
      mainImage: productImages[mainImageIndex]?.preview || productImages[0]?.preview,
      allImages: productImages.map(img => img.preview),
      timestamp: new Date().toISOString(),
    };

    try {
      // TODO: Thay đổi URL API thực tế
      // const response = await fetch('/api/products/post', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(productData),
      // });

      // Lưu deal lên Firestore theo tài khoản đang đăng nhập
      console.log('Product posted:', productData);
      const savedDeal = await saveDeal({
        ...productData,
        id: `deal-${Date.now()}`,
      });
      
      // Lưu local cache để giao diện cập nhật tức thì
      const flashDeals = JSON.parse(localStorage.getItem('flashDeals') || '[]');
      flashDeals.unshift(savedDeal);
      localStorage.setItem('flashDeals', JSON.stringify(flashDeals));
      
      // Gửi event để Home.js biết có sản phẩm mới
      window.dispatchEvent(new CustomEvent('newFlashDeal', { detail: savedDeal }));
      
      setMessage('✅ Bài đăng thành công! Deal đã được lưu vào CSDL và hiển thị trên trang Ưu Đãi Tức thì.');
      
      // Đóng modal sau 2.5 giây
      setTimeout(() => onClose(), 2500);
    } catch (error) {
      console.error('Post deal failed:', error);
      if (error?.message === 'AUTH_REQUIRED') {
        setMessage('❌ Bạn cần đăng nhập để lưu deal lên CSDL.');
      } else if (String(error?.message || '').startsWith('IMAGE_UPLOAD_ALL_FAILED:')) {
        const reason = String(error.message).replace('IMAGE_UPLOAD_ALL_FAILED:', '');
        setMessage(`❌ Không thể tải ảnh lên Storage (${reason}). Vui lòng kiểm tra bucket/rules rồi thử lại.`);
      } else if (error?.message === 'IMAGE_UPLOAD_ALL_FAILED') {
        setMessage('❌ Không thể tải ảnh lên Storage. Vui lòng kiểm tra bucket/rules rồi thử lại.');
      } else if (String(error?.message || '').includes('TIMEOUT')) {
        setMessage('❌ Hệ thống phản hồi chậm hoặc mạng yếu. Vui lòng thử lại với ít ảnh hơn.');
      } else {
        setMessage(`❌ Lỗi khi đăng bài: ${error?.message || 'Vui lòng thử lại.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-product-overlay">
      <div className="post-product-modal">
        <button className="post-product-close" onClick={onClose}>✕</button>
        
        <h2>📤 Đăng Sản Phẩm Ưu Đãi</h2>
        
        {/* Form nhập thông tin */}
        <form className="post-product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Loại sản phẩm *</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="">-- Chọn loại --</option>
                <option value="packaged_food">🥫 Đồ Đóng Gói Kín (⚡ Chỉ quét NSX/HSD)</option>
                <option value="fresh_fruits">🍎 Trái Cây / Hoa Quả Tươi (🔍 AI Soi Mốc & Thâm Nát)</option>
                <option value="fresh_vegetables">🥦 Rau Củ & Nông Sản (🔍 AI Soi Nấm & Sâu Bệnh)</option>
                <option value="raw_meat_bread">🥩 Thịt Tươi (🔍 AI Soi Mốc & Ôi Thiu)</option>
              </select>
              {formData.category && (
                <div className="category-badge" style={{ marginTop: '8px', fontSize: '12px', padding: '6px 8px', backgroundColor: '#f0f0f0', borderRadius: '4px', textAlign: 'center' }}>
                  {formData.category === 'packaged_food' && '⚡ Chỉ quét NSX/HSD (Tối ưu)'}
                  {formData.category === 'fresh_fruits' && '🔍 AI Soi Mốc & Thâm Nát'}
                  {formData.category === 'fresh_vegetables' && '🔍 AI Soi Nấm & Sâu Bệnh'}
                  {formData.category === 'raw_meat_bread' && '🔍 AI Soi Mốc & Ổi Thiu'}
                </div>
              )}
            </div>
          </div>

          {!formData.category && (
            <div className="post-product-message warning">
              ⚠️ Vui lòng chọn loại sản phẩm trước khi nhập các thông tin còn lại.
            </div>
          )}

          <fieldset disabled={!formData.category} style={{ border: 'none', padding: 0, margin: 0, minInlineSize: 0 }}>
          <div className="form-row">
            <div className="form-group">
              <label>Tên sản phẩm *</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="VD: Burger Bò Wagyu"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>{isKgCategory ? 'Khối lượng (kg) *' : 'Số lượng (cái/sản phẩm) *'}</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder={isKgCategory ? 'VD: 2.5' : 'VD: 10'}
                min={isKgCategory ? '0.1' : '1'}
                step={isKgCategory ? '0.1' : '1'}
                max="9999"
              />
            </div>
          </div>

          {/* Ảnh sản phẩm */}
          <div className="form-group">
            <label>📸 Ảnh sản phẩm (Tải nhiều ảnh, ảnh đầu sẽ làm nền) *</label>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, 'product')}
                id="product-image-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="product-image-input" className="image-upload-label">
                📤 Tải nhiều ảnh sản phẩm
              </label>
              {productImages.length > 0 && (
                <div className="image-thumbnails">
                  <p className="thumbnails-label">Ảnh đã chọn ({productImages.length}):</p>
                  <div className="thumbnails-grid">
                    {productImages.map((img, index) => (
                      <div
                        key={index}
                        className={`thumbnail ${mainImageIndex === index ? 'main' : ''}`}
                        onClick={() => setMainImageIndex(index)}
                      >
                        <img src={img.preview} alt={`Product ${index + 1}`} />
                        {mainImageIndex === index && <span className="badge">Nền</span>}
                        <button
                          type="button"
                          className="remove-thumbnail"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newImages = productImages.filter((_, i) => i !== index);
                            setProductImages(newImages);
                            if (mainImageIndex >= newImages.length) {
                              setMainImageIndex(Math.max(0, newImages.length - 1));
                            }
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Thông tin NSX/HSD hoặc thời gian sử dụng hoa quả */}
          <div className="eco-check-section">
            <h3>{isAICheckCategory ? (isFreshFruits ? '🍎 Thời Gian Sử Dụng Hoa Quả' : '🥩 Thời Gian Sử Dụng Thịt Tươi') : '🔍 Thông tin NSX/HSD'}</h3>

            {isAICheckCategory ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Số ngày còn lại</label>
                    <input
                      type="number"
                      name="freshShelfLifeDays"
                      value={formData.freshShelfLifeDays}
                      onChange={handleInputChange}
                      placeholder="VD: 2"
                      min="0"
                      max="999"
                    />
                  </div>
                  <div className="form-group">
                    <label>Số giờ còn lại</label>
                    <input
                      type="number"
                      name="freshShelfLifeHours"
                      value={formData.freshShelfLifeHours}
                      onChange={handleInputChange}
                      placeholder="VD: 6"
                      min="0"
                      max="999"
                    />
                  </div>
                </div>

                <p className="image-note">💡 Nhập linh hoạt ngày và giờ còn lại (chỉ cần một trong hai lớn hơn 0). Sau đó bấm AI Kiểm Duyệt để quét ảnh và xác nhận chất lượng.</p>

                <div className="form-group">
                  <label>🧪 Ảnh dùng để AI kiểm duyệt {aiProductLabel}</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, 'fruit-check')}
                      id="fruit-check-image-input"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="fruit-check-image-input" className="image-upload-label">
                      📤 Tải ảnh AI kiểm duyệt
                    </label>
                    {qualityCheckImages.length > 0 && (
                      <div className="image-thumbnails">
                        <p className="thumbnails-label">Ảnh AI kiểm duyệt ({qualityCheckImages.length}):</p>
                        <div className="thumbnails-grid">
                          {qualityCheckImages.map((img, index) => (
                            <div key={index} className="thumbnail">
                              <img src={img.preview} alt={`AI Check ${index + 1}`} />
                              <button
                                type="button"
                                className="remove-thumbnail"
                                onClick={() => {
                                  const newImages = qualityCheckImages.filter((_, i) => i !== index);
                                  setQualityCheckImages(newImages);
                                  setEcoCheckStatus(null);
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>

                {/* Ảnh NSX/HSD rõ - Một ảnh duy nhất */}
                <div className="form-group">
                  <label>📷 Ảnh NSX/HSD rõ (chứa cả 2 ngày)</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'date')}
                      id="date-image-input"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="date-image-input" className="image-upload-label">
                      {dateExtracted ? '✅ Đã quét NSX/HSD' : 'Chụp hoặc chọn ảnh NSX/HSD'}
                    </label>
                    {dateImagePreview && (
                      <div className="image-preview">
                        <img src={dateImagePreview} alt="NSX/HSD" />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => {
                            // Reset file input
                            const fileInput = document.getElementById('date-image-input');
                            if (fileInput) fileInput.value = '';
                            
                            setDateImagePreview(null);
                            setDateImageFile(null);
                            setDateExtracted(false);
                            setDateWasScanned(false);
                            setEcoCheckStatus(null);
                            setMessage('📷 Ảnh đã xoá. Chọn ảnh mới để tiếp tục.');
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nút Quét */}
                <button
                  type="button"
                  className="btn-scan-date"
                  onClick={handleScanDates}
                  disabled={scanLoading || loading || !dateImageFile}
                >
                  {scanLoading ? '🔄 Đang quét...' : '📷 Quét NSX/HSD'}
                </button>
                
                <p className="image-note">💡 Chọn ảnh rồi nhấn nút "Quét" để AI trích xuất NSX và HSD. Nếu sai, bạn có thể nhập thủ công:</p>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày sản xuất (NSX) *</label>
                    <input
                      type="date"
                      name="nsx"
                      value={formData.nsx}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Hạn sử dụng (HSD) *</label>
                    <input
                      type="date"
                      name="hsd"
                      value={formData.hsd}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Hiển thị trạng thái */}
            <div className="eco-info">
              <div className="info-item">
                <span className="info-label">📝 Trạng thái:</span>
                <span className={`info-value status-${ecoCheckStatus}`}>
                  {ecoCheckStatus === 'approved' && (isAICheckCategory ? '✅ Tốt' : '✅ EcoCheck Approved')}
                  {ecoCheckStatus === 'rejected' && (isAICheckCategory ? '❌ Hư hỏng' : '⏳ Chờ Admin duyệt')}
                  {ecoCheckStatus === null && '⚪ Chưa kiểm tra'}
                </span>
              </div>
            </div>
            
            {/* Nút AI Check */}
            <button
              type="button"
              className="btn-eco-check"
              onClick={handleAICheck}
              disabled={
                aiCheckLoading || loading ||
                (isAICheckCategory
                  ? qualityCheckImages.length === 0
                  : (!formData.nsx || !formData.hsd))
              }
            >
              {aiCheckLoading ? '🔄 Đang kiểm tra...' : (isAICheckCategory ? `🤖 AI Kiểm Duyệt ${isFreshFruits ? 'Hoa Quả' : 'Thịt Tươi'}` : '🤖 AI Kiểm Duyệt')}
            </button>

            {/* Message */}
            {message && (
              <div className={`post-product-message ${ecoCheckStatus === 'approved' ? 'success' : 'warning'}`}>
                {message}
              </div>
            )}
          </div>

          {/* Giá bán - Di chuyển xuống dưới NSX/HSD */}
          <div className="price-section">
            <h4>💰 Thiết Lập Giá & Deal</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label>{isKgCategory ? 'Đơn giá (VNĐ/1kg) *' : 'Giá bán (VNĐ) *'}</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  placeholder={isKgCategory ? 'VD: 85000' : 'VD: 100000'}
                  min="0"
                />
              </div>
            </div>

            {/* Giảm giá ban đầu */}
            <div className="form-row">
              <div className="form-group">
                <label>Giảm giá ban đầu (%) <span style={{color: '#999'}}>tuỳ chọn</span></label>
                <div className="percent-input-group">
                  <input
                    type="number"
                    name="initialDiscount"
                    value={formData.initialDiscount}
                    onChange={handleInputChange}
                    placeholder="VD: 20"
                    min="0"
                    max="100"
                    step="0.5"
                  />
                  <span className="percent-symbol">%</span>
                </div>
              </div>
            </div>

            {/* Chọn đơn vị giảm giá */}
            <div className="form-row">
              <div className="form-group">
                <label>Đơn vị giảm giá <span style={{color: '#999'}}>tuỳ chọn</span></label>
                <select value={reductionUnit} onChange={(e) => setReductionUnit(e.target.value)} style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}}>
                  <option value="day">Theo ngày (%/ngày)</option>
                  <option value="hour">Theo giờ (%/giờ)</option>
                </select>
              </div>
            </div>

            {/* Giảm theo thời gian */}
            <div className="form-row">
              <div className="form-group">
                <label>Giảm thêm {reductionUnit === 'hour' ? '%/giờ' : '%/ngày'} <span style={{color: '#999'}}>tuỳ chọn</span></label>
                <div className="percent-input-group">
                  <input
                    type="number"
                    name="dailyReduction"
                    value={formData.dailyReduction}
                    onChange={handleInputChange}
                    placeholder={reductionUnit === 'hour' ? 'VD: 2 (2%/giờ)' : 'VD: 5 (5%/ngày)'}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                  <span className="percent-symbol">{reductionUnit === 'hour' ? '%/giờ' : '%/ngày'}</span>
                </div>
              </div>
            </div>

            {/* Mức giảm tối đa */}
            <div className="form-row">
              <div className="form-group">
                <label>Mức giảm tối đa (%)<span style={{color: '#999'}}> tuỳ chọn</span></label>
                <div className="percent-input-group">
                  <input
                    type="number"
                    name="maxDiscountThreshold"
                    value={formData.maxDiscountThreshold}
                    onChange={handleInputChange}
                    placeholder="VD: 50"
                    min="0"
                    max="100"
                    step="0.5"
                  />
                  <span className="percent-symbol">%</span>
                </div>
              </div>
            </div>

            {/* Phần thông báo hỗ trợ cộng đồng (tùy chọn) */}
            <div style={{marginTop: '20px', padding: '15px', background: '#fff3e0', borderRadius: '8px', border: '1px solid #ffe0b2'}}>
              <h5 style={{margin: '0 0 12px 0', color: '#e65100'}}>🤝 Thông Báo Hỗ Trợ Cộng Đồng <span style={{fontSize: '12px', color: '#8d6e63'}}>(tuỳ chọn)</span></h5>
              
              <label style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer'}}>
                <input
                  type="checkbox"
                  checked={formData.enableFreeAlert}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      enableFreeAlert: e.target.checked,
                      hoursBeforeFreeAlert: e.target.checked ? prev.hoursBeforeFreeAlert : ''
                    }))
                  }
                  style={{width: '18px', height: '18px', cursor: 'pointer'}}
                />
                <span>Bật thông báo chuyển sản phẩm tới nhà hảo tâm/tổ chức từ thiện khi gần hết hạn</span>
              </label>

              {formData.enableFreeAlert && (
                <div className="form-group">
                  <label>Thông báo khi còn bao nhiêu giờ? <span style={{color: '#999'}}>tuỳ chọn</span></label>
                  <input
                    type="number"
                    name="hoursBeforeFreeAlert"
                    value={formData.hoursBeforeFreeAlert}
                    onChange={handleInputChange}
                    placeholder="VD: 2 (nếu để trống, hệ thống không đặt mốc giờ cụ thể)"
                    min="0"
                    max="999"
                  />
                  <small style={{color: '#7f8c8d', marginTop: '5px', display: 'block'}}>Ví dụ: Nhập 2 = Khi còn 2 giờ đến hết hạn, hệ thống gửi thông báo cho các đầu mối thiện nguyện trong khu vực để tiếp nhận sản phẩm phù hợp.</small>
                </div>
              )}
            </div>

            {/* Hiển thị ví dụ tính toán */}
            {(formData.initialDiscount || formData.dailyReduction) && timeRemaining > 0 && (
              <div className="calculation-example">
                <p className="example-text">
                  📊 <strong>Ví dụ:</strong>
                  {formData.initialDiscount && ` ${formData.initialDiscount}%`}
                  {formData.initialDiscount && formData.dailyReduction && ' +'}
                  {formData.dailyReduction && ` ${formData.dailyReduction}%/${reductionUnit === 'hour' ? 'giờ' : 'ngày'} × ${timeRemaining} ${reductionUnit === 'hour' ? 'giờ' : 'ngày'}`}
                  {formData.dailyReduction && ` (+${Math.round(formData.dailyReduction * timeRemaining * 10) / 10}%)`}
                  {' = '}
                  <span className="deal-result">{dealPercentage}% deal</span>
                </p>
              </div>
            )}

            {/* Hiển thị tính toán deal */}
            <div className="deal-summary">
              <div className="summary-item">
                <span>Hạn còn lại:</span>
                <strong>{reductionUnit === 'hour' ? `${formatRemaining(timeRemaining)} giờ` : `${formatRemaining(daysRemaining)} ngày`}</strong>
              </div>
              <div className="summary-item">
                <span>Deal tự động:</span>
                <strong className="deal-percentage">{dealPercentage}%</strong>
              </div>
            </div>

            {/* Hiển thị thông tin free alert nếu bật */}
            {formData.enableFreeAlert && formData.hoursBeforeFreeAlert && (
              <div style={{marginTop: '15px', padding: '12px', background: '#f3e5f5', borderRadius: '6px', border: '1px solid #e1bee7'}}>
                <p style={{margin: '0', fontSize: '13px', color: '#4a148c'}}>
                  🔔 Thông báo: Khi còn <strong>{formData.hoursBeforeFreeAlert} giờ</strong>, các đơn vị thiện nguyện trong khu vực sẽ nhận thông tin để kết nối tiếp nhận sản phẩm.
                </p>
              </div>
            )}
          </div>

          {/* Nút Đăng bài */}
          <button
            type="button"
            className="btn-post"
            onClick={handlePost}
            disabled={
              loading ||
              !formData.productName ||
              !formData.category ||
              !formData.quantity ||
              !formData.salePrice ||
              productImages.length === 0 ||
              isQualityRejected ||
              (isAICheckCategory
                ? (((parseInt(formData.freshShelfLifeDays, 10) || 0) * 24 + (parseInt(formData.freshShelfLifeHours, 10) || 0)) <= 0)
                : (!formData.nsx || !formData.hsd))
            }
          >
            {loading ? '⏳ Đang đăng...' : '🚀 Đăng Bài'}
          </button>

          {isQualityRejected && (
            <div className="post-product-message error">
              🚫 Cảnh báo an toàn: {isFreshFruits ? 'Hoa quả' : 'Thịt tươi'} được AI xác định là hư hỏng. Đăng bài đã bị khoá.
            </div>
          )}
          </fieldset>
        </form>

        <p className="post-product-note">
          💡 <strong>Lưu ý:</strong> Đồ đóng gói được gán nhãn "EcoCheck" khi NSX/HSD hợp lệ. Riêng hoa quả tươi và thịt tươi sẽ gán nhãn AI kiểm duyệt khi hệ thống không phát hiện hư hỏng.
        </p>
      </div>
    </div>
  );
};

export default PostProduct;
