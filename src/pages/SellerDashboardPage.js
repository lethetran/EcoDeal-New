import React, { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import EditDealModal from '../components/PostProduct/EditDealModal';
import styles from './SellerDashboardPage.module.css';
import { fetchDealsByOwner, deleteDeal } from '../services/dealService';
import { computeSellerWallet, submitWithdrawalRequest } from '../services/walletService';

const formatVnd = (n) => `${Number(n || 0).toLocaleString('vi-VN')}đ`;

const WITHDRAWAL_STATUS_LABEL = {
  pending: 'Đang chờ xử lý',
  completed: 'Đã chuyển khoản',
  rejected: 'Bị từ chối',
  cancelled: 'Đã huỷ',
};

const SellerDashboardPage = () => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [wallet, setWallet] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDeal, setEditingDeal] = useState(null);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  const loadData = useCallback(async () => {
    if (!currentUser?.uid) {
      setWallet(null);
      setDeals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [walletData, myDeals] = await Promise.all([
        computeSellerWallet(currentUser.uid),
        fetchDealsByOwner(currentUser.uid),
      ]);
      setWallet(walletData);
      setDeals(myDeals);
    } catch (error) {
      console.error('Cannot load seller dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!currentUser || !wallet) return;

    const amount = Math.round(Number(withdrawAmount) || 0);
    if (amount <= 0) {
      setWithdrawMessage('⚠️ Nhập số tiền hợp lệ.');
      return;
    }
    if (amount > wallet.availableBalance) {
      setWithdrawMessage('⚠️ Số tiền vượt quá số dư khả dụng.');
      return;
    }
    if (!bankAccountNumber.trim() || !bankName.trim() || !accountHolderName.trim()) {
      setWithdrawMessage('⚠️ Vui lòng nhập đủ thông tin ngân hàng.');
      return;
    }

    setSubmittingWithdraw(true);
    setWithdrawMessage('');
    try {
      await submitWithdrawalRequest(currentUser.uid, {
        amount,
        bankAccountNumber,
        bankName,
        accountHolderName,
      });
      setWithdrawMessage('✅ Đã gửi yêu cầu rút tiền, chờ xử lý.');
      setWithdrawAmount('');
      await loadData();
    } catch (error) {
      console.error('Cannot submit withdrawal request:', error);
      setWithdrawMessage('❌ Không thể gửi yêu cầu lúc này, vui lòng thử lại.');
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm('Xoá bài đăng này? Không thể hoàn tác.')) return;
    try {
      await deleteDeal(dealId);
      setDeals((prev) => prev.filter((d) => d.id !== dealId));
    } catch (error) {
      console.error('Cannot delete deal:', error);
      alert('Không thể xoá lúc này, vui lòng thử lại.');
    }
  };

  if (!currentUser) {
    return (
      <>
        <Header />
        <div className={styles.pageWrapper}>
          <p className={styles.emptyState}>Bạn cần đăng nhập để xem trang quản lý shop.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.pageWrapper}>
        <h1 className={styles.pageTitle}>Kênh người bán</h1>

        {loading || !wallet ? (
          <p className={styles.emptyState}>Đang tải...</p>
        ) : (
          <>
            <section className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span>Số dư khả dụng</span>
                <strong>{formatVnd(wallet.availableBalance)}</strong>
              </div>
              <div className={styles.statCard}>
                <span>Đang giữ ({wallet.holdDays} ngày)</span>
                <strong>{formatVnd(wallet.pendingBalance)}</strong>
              </div>
              <div className={styles.statCard}>
                <span>Bị giữ do báo cáo</span>
                <strong className={styles.statDanger}>{formatVnd(wallet.disputedAmount)}</strong>
              </div>
              <div className={styles.statCard}>
                <span>Tổng doanh thu (đã trừ hoa hồng {Math.round(wallet.commissionRate * 100)}%)</span>
                <strong>{formatVnd(wallet.totalEarned)}</strong>
              </div>
            </section>

            <section className={styles.panel}>
              <h2 className={styles.panelTitle}>Rút tiền</h2>
              <form className={styles.withdrawForm} onSubmit={handleWithdraw}>
                <div className={styles.formRow}>
                  <input
                    type="number"
                    min="0"
                    placeholder="Số tiền muốn rút"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Tên ngân hàng (vd: MB Bank)"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className={styles.formRow}>
                  <input
                    type="text"
                    placeholder="Số tài khoản"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Tên chủ tài khoản"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={submittingWithdraw}>
                  {submittingWithdraw ? 'Đang gửi...' : 'Gửi yêu cầu rút tiền'}
                </button>
                {withdrawMessage && <p className={styles.withdrawMessage}>{withdrawMessage}</p>}
              </form>

              {wallet.withdrawals.length > 0 && (
                <div className={styles.withdrawHistory}>
                  <h3 className={styles.subTitle}>Lịch sử rút tiền</h3>
                  {wallet.withdrawals.map((w) => (
                    <div key={w.id} className={styles.withdrawRow}>
                      <span>{formatVnd(w.amount)} — {w.bankName} · {w.bankAccountNumber}</span>
                      <span className={styles[`status_${w.status}`] || ''}>
                        {WITHDRAWAL_STATUS_LABEL[w.status] || w.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={styles.panel}>
              <h2 className={styles.panelTitle}>Quản lý sản phẩm ({deals.length})</h2>

              {deals.length === 0 ? (
                <p className={styles.emptyState}>Bạn chưa đăng sản phẩm nào.</p>
              ) : (
                <div className={styles.dealList}>
                  {deals.map((deal) => (
                    <div key={deal.id} className={styles.dealRow}>
                      <img src={deal.mainImage} alt={deal.productName} className={styles.dealThumb} />
                      <div className={styles.dealInfo}>
                        <strong>{deal.productName}</strong>
                        <span>
                          {formatVnd(deal.salePrice)} · Còn {deal.quantity} {deal.quantityUnit === 'kg' ? 'kg' : 'sản phẩm'}
                        </span>
                      </div>
                      <div className={styles.dealActions}>
                        <button type="button" onClick={() => setEditingDeal(deal)}>Sửa</button>
                        <button type="button" className={styles.deleteBtn} onClick={() => handleDeleteDeal(deal.id)}>Xoá</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {editingDeal && (
        <EditDealModal
          deal={editingDeal}
          onClose={() => setEditingDeal(null)}
          onSaved={loadData}
        />
      )}

      <Footer />
    </>
  );
};

export default SellerDashboardPage;
