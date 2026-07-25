import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { firestore } from '../firebase-config';

// Số ngày giữ tiền trước khi shop rút được, tính từ lúc đơn được xác nhận (settledAt) —
// nếu trong thời gian này khách bấm "Báo cáo vấn đề", khoản tiền đó bị giữ lại (không tính vào available).
const HOLD_DAYS = 2;
const DEFAULT_COMMISSION_RATE = 0;
const SETTLED_STATUSES = ['paid', 'confirmed'];

const toIso = (value) => (value?.toDate ? value.toDate().toISOString() : value);

// % hoa hồng nền tảng — cấu hình tại Firestore settings/platform.commissionRate (0 đến 1).
// Mặc định 0 (không thu gì) cho tới khi giá trị thật được điền — tránh tự trừ 1 con số bịa ra.
export const fetchCommissionRate = async () => {
  try {
    const snap = await getDoc(doc(firestore, 'settings', 'platform'));
    if (!snap.exists()) return DEFAULT_COMMISSION_RATE;
    const rate = Number(snap.data()?.commissionRate);
    return Number.isFinite(rate) ? Math.max(0, Math.min(1, rate)) : DEFAULT_COMMISSION_RATE;
  } catch (error) {
    console.error('Cannot load commission rate:', error);
    return DEFAULT_COMMISSION_RATE;
  }
};

export const fetchSellerOrders = async (sellerUid) => {
  const ordersQuery = query(collection(firestore, 'orders'), where('sellerUids', 'array-contains', sellerUid));
  const snapshot = await getDocs(ordersQuery);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: toIso(data.createdAt),
      settledAt: toIso(data.settledAt),
    };
  });
};

const sellerPortionOfOrder = (order, sellerUid) =>
  (order.items || [])
    .filter((item) => item.store?.id === sellerUid)
    .reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

export const submitWithdrawalRequest = async (uid, { amount, bankAccountNumber, bankName, accountHolderName, note }) => {
  await addDoc(collection(firestore, 'withdrawalRequests'), {
    uid,
    amount: Math.round(Number(amount) || 0),
    bankAccountNumber: String(bankAccountNumber || '').trim(),
    bankName: String(bankName || '').trim(),
    accountHolderName: String(accountHolderName || '').trim(),
    note: String(note || '').trim(),
    status: 'pending',
    requestedAt: serverTimestamp(),
  });
};

export const fetchMyWithdrawals = async (uid) => {
  const withdrawalsQuery = query(collection(firestore, 'withdrawalRequests'), where('uid', '==', uid));
  const snapshot = await getDocs(withdrawalsQuery);
  return snapshot.docs
    .map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        requestedAt: toIso(data.requestedAt),
        processedAt: toIso(data.processedAt),
      };
    })
    .sort((a, b) => new Date(b.requestedAt || 0).getTime() - new Date(a.requestedAt || 0).getTime());
};

// Tính ví của 1 shop: doanh thu ròng (đã trừ hoa hồng), số dư khả dụng (đã trừ các yêu cầu
// rút tiền đang chờ/đã xử lý để không cho rút vượt quá), số dư đang giữ (chưa đủ 2 ngày),
// và phần bị giữ vì có báo cáo tranh chấp từ khách.
export const computeSellerWallet = async (sellerUid) => {
  const [orders, commissionRate, withdrawals] = await Promise.all([
    fetchSellerOrders(sellerUid),
    fetchCommissionRate(),
    fetchMyWithdrawals(sellerUid),
  ]);

  const now = Date.now();
  const holdMs = HOLD_DAYS * 24 * 60 * 60 * 1000;

  let totalEarned = 0;
  let availableBalance = 0;
  let pendingBalance = 0;
  let disputedAmount = 0;

  const settledOrders = orders.filter((order) => SETTLED_STATUSES.includes(order.status) && order.settledAt);

  settledOrders.forEach((order) => {
    const gross = sellerPortionOfOrder(order, sellerUid);
    if (gross <= 0) return;
    const net = Math.round(gross * (1 - commissionRate));

    totalEarned += net;

    if (order.disputed) {
      disputedAmount += net;
      return;
    }

    const settledTime = new Date(order.settledAt).getTime();
    if (Number.isFinite(settledTime) && now - settledTime >= holdMs) {
      availableBalance += net;
    } else {
      pendingBalance += net;
    }
  });

  const reservedByWithdrawals = withdrawals
    .filter((w) => w.status === 'pending' || w.status === 'completed')
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);

  return {
    commissionRate,
    totalEarned,
    availableBalance: Math.max(0, availableBalance - reservedByWithdrawals),
    pendingBalance,
    disputedAmount,
    ordersCount: settledOrders.length,
    withdrawals,
    holdDays: HOLD_DAYS,
  };
};
