import React, { useState, useEffect } from 'react'; // BƯỚC 1: Thêm useState và useEffect
import { Link } from 'react-router-dom';
import '../../pages/Home.css';
import { useCart } from '../../hooks/useCart';

// Dữ liệu mẫu (Giữ nguyên)
// Trong thực tế, bạn sẽ không cần mảng lớn này ở client nữa khi gọi API
const dealsData = [
  { id: 1, name: 'Combo Burger Thịt Bò', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', expiry: 'Còn lại 2 giờ', remaining: 5, originalPrice: 120000, discountPrice: 60000, storeName: 'Tiệm Burger House', distance: '1.2km' },
  { id: 2, name: 'Túi bánh ngọt tổng hợp', imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400', expiry: 'Trong ngày', remaining: 3, originalPrice: 150000, discountPrice: 50000, storeName: 'Paris Gateaux', distance: '2.5km' },
  { id: 3, name: 'Pizza Hải Sản Cỡ Lớn', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', expiry: 'Hết hạn 21:00', remaining: 8, originalPrice: 250000, discountPrice: 175000, storeName: 'Pizza Hut', distance: '3.1km' },
  // Thêm nhiều sản phẩm nữa vào đây để thấy rõ hiệu ứng "Xem thêm"
  { id: 4, name: 'Bún Chả Hà Nội Đặc Sắc', imageUrl: '/placeholders/deal-placeholder.svg', expiry: 'Hết hạn 14:00', remaining: 6, originalPrice: 50000, discountPrice: 35000, storeName: 'Bún Chả Hàng Mành', distance: '800m' },
  { id: 5, name: 'Cà Phê Sữa Đá Đậm Đà', imageUrl: '/placeholders/deal-placeholder.svg', expiry: 'Trong ngày', remaining: 10, originalPrice: 25000, discountPrice: 15000, storeName: 'Cộng Cà Phê', distance: '550m' },
  { id: 6, name: 'Combo 2 Miếng Gà Rán Giòn Tan', imageUrl: '/placeholders/deal-placeholder.svg', expiry: 'Còn lại 1 giờ', remaining: 4, originalPrice: 90000, discountPrice: 55000, storeName: 'KFC', distance: '2.1km' },
  { id: 7, name: 'Bánh Mì Kẹp Thịt Đặc Biệt', imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400', expiry: 'Cuối ngày', remaining: 11, originalPrice: 60000, discountPrice: 40000, storeName: 'Bánh Mì Huỳnh Hoa', distance: '3.5km' },
  { id: 8, name: 'Trà Sữa Trân Châu Đường Đen', imageUrl: '/placeholders/deal-placeholder.svg', expiry: 'Còn lại 3 giờ', remaining: 7, originalPrice: 55000, discountPrice: 30000, storeName: 'Gong Cha', distance: '1.9km' },
  { id: 9, name: 'Cơm Tấm Sườn Bì Chả', imageUrl: '/placeholders/deal-placeholder.svg', expiry: 'Hết hạn 20:30', remaining: 2, originalPrice: 70000, discountPrice: 45000, storeName: 'Cơm Tấm Cali', distance: '4.2km' },
  { id: 10, name: 'Hộp 2 Bánh Croissant Bơ', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', expiry: 'Trong ngày', remaining: 9, originalPrice: 60000, discountPrice: 30000, storeName: 'Tous Les Jours', distance: '1.5km' },
];

// BỔ SUNG: Hàm giả lập việc gọi API để phân trang
const fetchDealsFromAPI = async (page, limit) => {
  console.log(`Đang tải trang ${page} với ${limit} sản phẩm...`);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const pageData = dealsData.slice(startIndex, endIndex);
  // Giả lập độ trễ mạng
  return new Promise(resolve => setTimeout(() => resolve(pageData), 500));
};

// Component DealCard (Giữ nguyên, nhưng thêm React.memo để tối ưu)
const DealCard = React.memo(({ deal, onAddToCart }) => {
  const discountPercent = Math.round(((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100);

  return (
    <Link to={`/product/${deal.id}`} className="deal-card">
      <button className="deal-card__add-to-cart" onClick={(e) => onAddToCart(e, deal)} type="button">
        <i className='bx bx-cart-add'></i>
      </button>
      <div className="deal-card__image">
        <img src={deal.imageUrl} alt={deal.name} />
        {discountPercent > 0 && (
          <span className="deal-card__discount-tag">-{discountPercent}%</span>
        )}
      </div>
      <div className="deal-card__content">
        <h3 className="deal-card__title">{deal.name}</h3>
        <div className="deal-card__info-bar">
          <span className="info-item"><i className='bx bx-time-five'></i> {deal.expiry}</span>
          <span className="info-item"><i className='bx bx-package'></i> Còn lại: {deal.remaining}</span>
        </div>
        <div className="deal-card__store-info">
          <span className="store-name">{deal.storeName}</span>
          <span className="store-distance">{deal.distance}</span>
        </div>
        <div className="deal-card__price">
          <span className="price--new">{deal.discountPrice.toLocaleString('vi-VN')}đ</span>
          <span className="price--old">{deal.originalPrice.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>
    </Link>
  );
});

// Component DealsGrid chính (Đã được nâng cấp)
function DealsGrid() {
  const { handlers } = useCart();
  // BƯỚC 2: Thêm các state để quản lý
  const DEALS_PER_PAGE = 4; // Số sản phẩm tải mỗi lần
  const [deals, setDeals] = useState([]);       // Mảng chứa sản phẩm đang hiển thị
  const [page, setPage] = useState(1);          // Trang dữ liệu cần tải
  const [loading, setLoading] = useState(false); // Trạng thái đang tải
  const [hasMore, setHasMore] = useState(true);  // Còn dữ liệu để tải không

  // BƯỚC 3: Dùng useEffect để tải dữ liệu ban đầu
  useEffect(() => {
    const loadInitialDeals = async () => {
      setLoading(true);
      const initialDeals = await fetchDealsFromAPI(1, DEALS_PER_PAGE);
      setDeals(initialDeals);
      setPage(2); // Chuẩn bị cho lần tải kế tiếp
      if (initialDeals.length < DEALS_PER_PAGE) {
        setHasMore(false);
      }
      setLoading(false);
    };
    loadInitialDeals();
  }, []); // Mảng rỗng đảm bảo hàm chỉ chạy 1 lần

  // BƯỚC 4: Tạo hàm xử lý sự kiện "Xem thêm"
  const handleSeeMore = async () => {
    setLoading(true);
    const newDeals = await fetchDealsFromAPI(page, DEALS_PER_PAGE);
    setDeals(prevDeals => [...prevDeals, ...newDeals]);
    setPage(prevPage => prevPage + 1);
    if (newDeals.length < DEALS_PER_PAGE) {
      setHasMore(false);
    }
    setLoading(false);
  };

  const handleAddToCart = async (e, deal) => {
    e.preventDefault();
    e.stopPropagation();

    const basePrice = Number(deal.originalPrice || deal.discountPrice || 0);
    const dealPercent = basePrice > 0
      ? Math.max(0, Math.round(((basePrice - Number(deal.discountPrice || 0)) / basePrice) * 1000) / 10)
      : 0;

    try {
      await handlers.handleAddDealToCart({
        id: `sample-${deal.id}`,
        productName: deal.name,
        salePrice: basePrice || Number(deal.discountPrice || 0),
        dealPercentage: dealPercent,
        quantity: Number(deal.remaining || 1),
        quantityUnit: 'item',
        mainImage: deal.imageUrl,
        allImages: [deal.imageUrl],
        ownerUid: `sample-store-${String(deal.storeName || 'store').replace(/\s+/g, '-').toLowerCase()}`,
        ownerDisplayName: deal.storeName || 'Cửa hàng mẫu',
      });
    } catch (error) {
      console.error('Cannot add sample deal to cart:', error);
      alert('Không thể thêm vào giỏ hàng, vui lòng thử lại.');
    }
  };

  return (
    <section className="deals-grid-section section pt-0">
      <div className="dashboard-section-header">
                <h2>Khám Phá Tự Do</h2>
                <p>Dạo một vòng quanh "khu chợ" FoodSave và tìm kiếm những bất ngờ cho riêng mình.</p>
      </div>
      <div className="container">
        {/* THAY ĐỔI: Map trên state `deals` thay vì `dealsData` */}
        <div className="deals-grid__container">
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} onAddToCart={handleAddToCart} />
          ))}
        </div>

        {/* BƯỚC 5: Thêm JSX cho footer chứa nút và các trạng thái */}
        <div className="deals-grid__footer">
          {/* Hiển thị vòng xoay khi đang tải */}
          {loading && <div className="loading-spinner"></div>}

          {/* Hiển thị nút khi còn dữ liệu và không đang tải */}
          {hasMore && !loading && (
            <button onClick={handleSeeMore} className="see-more-btn">
              Xem thêm
            </button>
          )}

          {/* Hiển thị thông báo khi đã hết */}
          {!hasMore && !loading && deals.length > 0 && (
             <p className="no-more-deals">Bạn đã xem hết các ưu đãi!</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default DealsGrid;