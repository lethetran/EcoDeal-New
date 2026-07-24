import React, { useState, useEffect } from 'react';
import styles from './AddressModal.module.css';

// Import các icon cần thiết
import { FiX, FiPlus } from 'react-icons/fi';

// --- COMPONENT CON: FORM THÊM/SỬA ĐỊA CHỈ ---
const AddressForm = ({ initialData, onBack, onSave }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        province: '',
        addressDetail: '',
        addressType: 'Nhà Riêng',
        isDefault: false,
    });
    const [errorMessage, setErrorMessage] = useState('');

    // Điền dữ liệu vào form nếu đang ở chế độ "Cập nhật"
    useEffect(() => {
        if (initialData) {
            const [province = '', ...details] = String(initialData.fullAddress || '').split(',');
            setFormData({
                fullName: initialData.fullName || '',
                phone: initialData.phone || '',
                province: province.trim(),
                addressDetail: details.join(',').trim() || String(initialData.fullAddress || ''),
                addressType: initialData.addressType || 'Nhà Riêng',
                isDefault: Boolean(initialData.isDefault),
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = () => {
        const fullName = formData.fullName.trim();
        const phone = formData.phone.trim();
        const province = formData.province.trim();
        const addressDetail = formData.addressDetail.trim();

        if (!fullName || !phone || !province || !addressDetail) {
            setErrorMessage('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.');
            return;
        }

        const normalizedPhone = phone.replace(/\s+/g, '');
        if (!/^[0-9]{9,11}$/.test(normalizedPhone)) {
            setErrorMessage('Số điện thoại không hợp lệ.');
            return;
        }

        setErrorMessage('');
        onSave({
            id: initialData?.id || `addr-${Date.now()}`,
            fullName,
            phone,
            fullAddress: `${province}, ${addressDetail}`,
            addressType: formData.addressType,
            isDefault: formData.isDefault,
        });
    };

    return (
        <div className={styles.formContainer}>
            <h3 className={styles.modalTitle}>{initialData ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}</h3>
            
            <div className={styles.formGrid}>
                <input type="text" name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleChange} className={styles.formInput} />
                <input type="tel" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} className={styles.formInput} />
            </div>
            <input type="text" name="province" placeholder="Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã" value={formData.province} onChange={handleChange} className={styles.formInput} />
            <textarea name="addressDetail" placeholder="Địa chỉ cụ thể" value={formData.addressDetail} onChange={handleChange} className={styles.formTextarea} rows="3"></textarea>

            {errorMessage && <p className={styles.formError}>{errorMessage}</p>}
            
            <button className={styles.mapButton}><FiPlus /> Thêm vị trí</button>

            <div className={styles.addressTypeGroup}>
                <span>Loại địa chỉ:</span>
                <button 
                    className={`${styles.typeButton} ${formData.addressType === 'Nhà Riêng' ? styles.active : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, addressType: 'Nhà Riêng' }))}
                >
                    Nhà Riêng
                </button>
                <button 
                    className={`${styles.typeButton} ${formData.addressType === 'Văn Phòng' ? styles.active : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, addressType: 'Văn Phòng' }))}
                >
                    Văn Phòng
                </button>
            </div>

            <label className={styles.defaultCheckbox}>
                <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange} />
                Đặt làm địa chỉ mặc định
            </label>

            <div className={styles.formActions}>
                <button className={styles.backButton} onClick={onBack}>Trở Lại</button>
                <button className={styles.saveButton} onClick={handleSave}>Hoàn thành</button>
            </div>
        </div>
    );
};


// --- COMPONENT CHÍNH: MODAL QUẢN LÝ ĐỊA CHỈ ---
const AddressModal = ({ isOpen, onClose, onSelectAddress, addresses = [], onSaveAddresses }) => {
    const [view, setView] = useState('list'); // 'list' hoặc 'form'
    const [localAddresses, setLocalAddresses] = useState([]);
    const [editingAddress, setEditingAddress] = useState(null); // null: thêm mới, object: cập nhật

    useEffect(() => {
        if (!isOpen) {
            setView('list');
        }
    }, [isOpen]);

    useEffect(() => {
        setLocalAddresses(Array.isArray(addresses) ? addresses : []);
    }, [addresses]);

    if (!isOpen) return null;

    const safeAddresses = Array.isArray(localAddresses) ? localAddresses : [];

    const persistAddresses = async (nextAddresses) => {
        setLocalAddresses(nextAddresses);
        if (typeof onSaveAddresses === 'function') {
            await onSaveAddresses(nextAddresses);
        }
    };

    const handleSetDefault = (id) => {
        const nextAddresses = safeAddresses.map((addr) => ({ ...addr, isDefault: addr.id === id }));
        persistAddresses(nextAddresses).catch((error) => {
            console.error('Cannot save default address:', error);
        });
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setView('form');
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setView('form');
    };
    
    const handleSaveAddress = async (savedData) => {
        const nextAddresses = editingAddress
            ? safeAddresses.map(addr => addr.id === savedData.id ? savedData : addr)
            : [...safeAddresses, savedData];

        const normalizedAddresses = nextAddresses.map((addr, index) => {
            if (savedData.isDefault) {
                return { ...addr, isDefault: addr.id === savedData.id };
            }

            if (!nextAddresses.some((item) => item.isDefault)) {
                return { ...addr, isDefault: index === 0 };
            }

            return addr;
        });

        await persistAddresses(normalizedAddresses);
        setView('list'); // Quay lại danh sách
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}><FiX /></button>
                
                {view === 'list' && (
                    <>
                        <h3 className={styles.modalTitle}>Địa chỉ của tôi</h3>
                        <div className={styles.addressList}>
                            {safeAddresses.map(addr => (
                                <div key={addr.id} className={`${styles.addressCard} ${addr.isDefault ? styles.defaultCard : ''}`}>
                                    <div className={styles.cardMain} onClick={() => onSelectAddress(addr)}>
                                        <div className={styles.cardHeader}>
                                            <span className={styles.fullName}>{addr.fullName}</span>
                                            <span className={styles.phone}>{addr.phone}</span>
                                        </div>
                                        <div className={styles.cardBody}>
                                            <p>{addr.fullAddress}</p>
                                            {addr.isDefault && <span className={styles.defaultTag}>Mặc định</span>}
                                        </div>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button className={styles.actionButton} onClick={() => handleEdit(addr)}>Cập nhật</button>
                                        {!addr.isDefault && (
                                            <button className={styles.actionButton} onClick={() => handleSetDefault(addr.id)}>Chọn làm mặc định</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {safeAddresses.length === 0 && (
                            <p className={styles.emptyAddresses}>Bạn chưa có địa chỉ nhận hàng. Hãy thêm địa chỉ mới.</p>
                        )}
                        <button className={styles.addNewButton} onClick={handleAddNew}>
                            <FiPlus /> Thêm địa chỉ mới
                        </button>
                    </>
                )}

                {view === 'form' && (
                    <AddressForm 
                        initialData={editingAddress} 
                        onBack={() => setView('list')}
                        onSave={handleSaveAddress}
                    />
                )}
            </div>
        </div>
    );
};

export default AddressModal;