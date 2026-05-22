import React, { useState, useEffect } from 'react';
import styles from './AddressModal.module.css';

// Import các icon cần thiết
import { FiX, FiMapPin, FiPlus, FiCheckCircle } from 'react-icons/fi';

// --- DỮ LIỆU GIẢ LẬP (Trong ứng dụng thật, bạn sẽ lấy từ API) ---
const mockUserAddresses = [
    {
        id: 1,
        fullName: 'Nguyễn Văn An',
        phone: '0987 654 321',
        fullAddress: '123 Đường D1, Phường 25, Quận Bình Thạnh, Thành phố Hồ Chí Minh',
        addressType: 'Nhà Riêng',
        isDefault: true,
    },
    {
        id: 2,
        fullName: 'Nguyễn Văn An',
        phone: '0912 345 678',
        fullAddress: 'Tòa nhà ABC, 789 Đường D2, Phường 26, Quận Bình Thạnh, Thành phố Hồ Chí Minh',
        addressType: 'Văn Phòng',
        isDefault: false,
    },
];

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

    // Điền dữ liệu vào form nếu đang ở chế độ "Cập nhật"
    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName,
                phone: initialData.phone,
                fullAddress: initialData.fullAddress, // Cần tách ra thành các trường nhỏ hơn trong thực tế
                addressDetail: initialData.fullAddress,
                addressType: initialData.addressType,
                isDefault: initialData.isDefault,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = () => {
        // ... (Logic validate dữ liệu ở đây)
        onSave({ ...formData, id: initialData?.id || Date.now() }); // Gửi lại cả ID nếu là cập nhật
    };

    return (
        <div className={styles.formContainer}>
            <h3 className={styles.modalTitle}>{initialData ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}</h3>
            
            <div className={styles.formGrid}>
                <input type="text" name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleChange} className={styles.formInput} />
                <input type="tel" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} className={styles.formInput} />
            </div>
            <input type="text" placeholder="Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã" className={styles.formInput} />
            <textarea name="addressDetail" placeholder="Địa chỉ cụ thể" value={formData.addressDetail} onChange={handleChange} className={styles.formTextarea} rows="3"></textarea>
            
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
const AddressModal = ({ isOpen, onClose, onSelectAddress }) => {
    const [view, setView] = useState('list'); // 'list' hoặc 'form'
    const [addresses, setAddresses] = useState(mockUserAddresses);
    const [editingAddress, setEditingAddress] = useState(null); // null: thêm mới, object: cập nhật

    if (!isOpen) return null;

    const handleSetDefault = (id) => {
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === id })));
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setView('form');
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setView('form');
    };
    
    const handleSaveAddress = (savedData) => {
        if (editingAddress) { // Cập nhật
            setAddresses(prev => prev.map(addr => addr.id === savedData.id ? savedData : addr));
        } else { // Thêm mới
            setAddresses(prev => [...prev, savedData]);
        }
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
                            {addresses.map(addr => (
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