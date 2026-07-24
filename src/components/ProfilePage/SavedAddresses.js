import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './ProfileContent.module.css';
import Card from '../CartPage/Card';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { fetchUserAddresses } from '../../services/userProfileService';

const CHECKOUT_ADDRESSES_STORAGE_KEY = 'checkoutAddresses';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const SavedAddresses = () => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadAddresses = async () => {
      setLoading(true);

      if (currentUser?.uid) {
        try {
          const userAddresses = await fetchUserAddresses(currentUser.uid);
          setAddresses(Array.isArray(userAddresses) ? userAddresses : []);
        } catch (error) {
          console.error('Cannot load saved addresses:', error);
          setAddresses([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        const localAddresses = JSON.parse(localStorage.getItem(CHECKOUT_ADDRESSES_STORAGE_KEY) || '[]');
        setAddresses(Array.isArray(localAddresses) ? localAddresses : []);
      } catch {
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [currentUser]);

  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card>
        <h2 className={styles.contentTitle}>Địa chỉ đã lưu</h2>
        <div className={styles.orderList}>
          {loading && <p className={styles.emptyOrderText}>Đang tải địa chỉ...</p>}
          {!loading && addresses.length === 0 && (
            <p className={styles.emptyOrderText}>Bạn chưa có địa chỉ đã lưu.</p>
          )}

          {!loading && addresses.map((address, index) => (
            <div key={address.id || `saved-address-${index}`} className={styles.savedAddressCard}>
              <div className={styles.savedAddressHeader}>
                <strong>{address.fullName || address.name || 'Khách hàng'}</strong>
                {address.isDefault && <span className={styles.savedAddressTag}>Mặc định</span>}
              </div>
              <p><strong>SĐT:</strong> {address.phone || '--'}</p>
              <p><strong>Địa chỉ:</strong> {address.fullAddress || address.address || '--'}</p>
              {address.addressType && <p><strong>Loại:</strong> {address.addressType}</p>}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default SavedAddresses;
