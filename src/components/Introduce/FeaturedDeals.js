import React, { useState, useEffect } from 'react'; // BỔ SUNG: Thêm useState và useEffect
import { Link } from 'react-router-dom';
import '../../pages/Introduce';
// import '../Home/DealCard'; // BỎ ĐI: Không cần thiết vì DealCard được định nghĩa ngay trong file này

// 1. DỮ LIỆU MẪU (Giữ nguyên)
const dealsData = [
    { id: 1, name: 'Combo Burger Thịt Bò', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', expiry: 'Còn lại 2 giờ', remaining: 5, originalPrice: 120000, discountPrice: 60000, storeName: 'Tiệm Burger House', distance: '1.2km' },
    { id: 2, name: 'Túi bánh ngọt tổng hợp', imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400', expiry: 'Trong ngày', remaining: 3, originalPrice: 150000, discountPrice: 50000, storeName: 'Paris Gateaux', distance: '2.5km' },
    { id: 3, name: 'Pizza Hải Sản Cỡ Lớn', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', expiry: 'Hết hạn 21:00', remaining: 8, originalPrice: 250000, discountPrice: 175000, storeName: 'Pizza Hut', distance: '3.1km' },
    { id: 4, name: 'Bún Chả Hà Nội Đặc Sắc', imageUrl: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_1_12_638406880045931692_cach-lam-bun-cha-ha-noi-0.jpg', expiry: 'Hết hạn 14:00', remaining: 6, originalPrice: 50000, discountPrice: 35000, storeName: 'Bún Chả Hàng Mành', distance: '800m' },
    { id: 5, name: 'Cà Phê Sữa Đá Đậm Đà', imageUrl: 'https://lh4.googleusercontent.com/proxy/f_asF6yuG_goBXmW-pxVm2RnCad4V2g5DtUsOYb_8POcLWCOX_pdRN_kpRG9TDFfKStgS0hoAYonih-5aXjLI9cKZqu0QdpdNxPCbwc_EEFfQhTn7RJ4Ww', expiry: 'Trong ngày', remaining: 10, originalPrice: 25000, discountPrice: 15000, storeName: 'Cộng Cà Phê', distance: '550m' },
    { id: 6, name: 'Combo 2 Miếng Gà Rán Giòn Tan', imageUrl: 'https://file.hstatic.net/200000700229/article/ga-ran-gion-1_83c75dcbff794589a4be4ae74e71c8e6.jpg', expiry: 'Còn lại 1 giờ', remaining: 4, originalPrice: 90000, discountPrice: 55000, storeName: 'KFC', distance: '2.1km' },
    { id: 7, name: 'Bánh Mì Kẹp Thịt Đặc Biệt', imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400', expiry: 'Cuối ngày', remaining: 11, originalPrice: 60000, discountPrice: 40000, storeName: 'Bánh Mì Huỳnh Hoa', distance: '3.5km' },
    { id: 8, name: 'Trà Sữa Trân Châu Đường Đen', imageUrl: 'https://mixuediemdien.com/wp-content/uploads/2024/03/Sua-tuoi-tran-chau-duong-den.jpg', expiry: 'Còn lại 3 giờ', remaining: 7, originalPrice: 55000, discountPrice: 30000, storeName: 'Gong Cha', distance: '1.9km' },
    { id: 9, name: 'Cơm Tấm Sườn Bì Chả', imageUrl: 'https://i-giadinh.vnecdn.net/2024/03/07/7Honthinthnhphm1-1709800144-8583-1709800424.jpg', expiry: 'Hết hạn 20:30', remaining: 2, originalPrice: 70000, discountPrice: 45000, storeName: 'Cơm Tấm Cali', distance: '4.2km' },
    { id: 10, name: 'Hộp 2 Bánh Croissant Bơ', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', expiry: 'Trong ngày', remaining: 9, originalPrice: 60000, discountPrice: 30000, storeName: 'Tous Les Jours', distance: '1.5km' },
    { id: 11, name: 'Mì Ý Sốt Bò Bằm', imageUrl: 'https://thucphamplaza.com/wp-content/uploads/products_img/cong-thuc-nau-mi-y-chuan-vi.jpg', expiry: 'Còn lại 2 giờ', remaining: 5, originalPrice: 110000, discountPrice: 70000, storeName: "Pizza 4P's", distance: '2.8km' },
    { id: 12, name: 'Chè Khúc Bạch Mát Lạnh', imageUrl: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_9_28_638315335535725712_che-khuc-bach-thumb.jpg', expiry: 'Cuối ngày', remaining: 12, originalPrice: 35000, discountPrice: 20000, storeName: 'Chè Liên Đà Nẵng', distance: '600m' },
    { id: 13, name: 'Bún Bò Huế Đặc Biệt', imageUrl: 'https://cdn.shortpixel.ai/spai2/q_glossy+ret_img+to_auto/www.hungryhuy.com/wp-content/uploads/bun-bo-hue-bowl.jpg', expiry: 'Hết hạn 13:30', remaining: 4, originalPrice: 65000, discountPrice: 45000, storeName: 'Bún Bò O Cương', distance: '1.1km' },
    { id: 14, name: 'Nước Cam Ép Nguyên Chất', imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', expiry: 'Trong ngày', remaining: 15, originalPrice: 40000, discountPrice: 25000, storeName: 'The Juice Box', distance: '750m' },
    { id: 15, name: 'Hộp 4 Bánh Donut Socola', imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', expiry: 'Còn lại 4 giờ', remaining: 6, originalPrice: 100000, discountPrice: 60000, storeName: "Dunkin' Donuts", distance: '3.9km' },
    { id: 16, name: 'Set Sushi Tổng Hợp (8 miếng)', imageUrl: 'https://file.hstatic.net/200000391061/article/sushi-mon-an-quoc-dan-cua-nguoi-nhat-2_c940b210a8094194b29216c31a3620d0.jpg', expiry: 'Hết hạn 21:30', remaining: 3, originalPrice: 180000, discountPrice: 90000, storeName: 'Sushi Hokkaido Sachi', distance: '2.4km' },
    { id: 17, name: 'Sinh Tố Bơ Sầu Riêng', imageUrl: 'https://elmich.vn/wp-content/uploads/2024/01/sinh-to-bo-sau-rieng-6.jpg', expiry: 'Trong ngày', remaining: 8, originalPrice: 50000, discountPrice: 35000, storeName: 'Five Boys Smoothie', distance: '1.3km' },
    { id: 18, name: 'Combo Lẩu Thái Tom Yum 2 người', imageUrl: 'https://shop.vietasiafoods.com/media/wysiwyg/Rectangle_31.png', expiry: 'Cuối ngày', remaining: 2, originalPrice: 350000, discountPrice: 200000, storeName: 'Coca Suki', distance: '4.5km' },
    { id: 19, name: 'Bánh Tiramisu Cacao', imageUrl: 'https://daylambanh.edu.vn/wp-content/uploads/2017/09/cach-lam-banh-tiramisu-socola.jpg', expiry: 'Còn lại 2 ngày', remaining: 7, originalPrice: 85000, discountPrice: 50000, storeName: 'The Coffee House', distance: '1.8km' }
];

// BỔ SUNG: Hàm giả lập việc gọi API để phân trang
const fetchDealsFromAPI = async (page, limit) => {
  console.log(`Đang tải trang ${page} với ${limit} sản phẩm...`);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const pageData = dealsData.slice(startIndex, endIndex);
  return new Promise(resolve => setTimeout(() => resolve(pageData), 500));
};

// TỐI ƯU: Bọc DealCard trong React.memo để tránh render lại không cần thiết
const DealCard = React.memo(({ deal }) => {
  const discountPercent = Math.round(((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100);

  return (
    <Link to={`/product/${deal.id}`} className="deal-card">
      <button className="deal-card__add-to-cart" onClick={(e) => {
        e.preventDefault();
        console.log(`Thêm sản phẩm ${deal.id} vào giỏ hàng`);
      }}>
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


// THAY ĐỔI: Cấu trúc lại toàn bộ component FeaturedDeals
const FeaturedDeals = () => {
  const DEALS_PER_PAGE = 8; // Số sản phẩm trên mỗi lần tải (thay thế INITIAL_VISIBLE_DEALS)

  // BỔ SUNG: State để quản lý dữ liệu động
  const [deals, setDeals] = useState([]);       // Mảng chứa các sản phẩm đang hiển thị
  const [page, setPage] = useState(1);          // Trang dữ liệu cần tải tiếp theo
  const [loading, setLoading] = useState(false); // Cờ báo đang tải dữ liệu
  const [hasMore, setHasMore] = useState(true);  // Cờ báo còn dữ liệu để tải không

  // BỔ SUNG: useEffect để tải dữ liệu lần đầu tiên khi component được render
  useEffect(() => {
    const loadInitialDeals = async () => {
      setLoading(true);
      const initialDeals = await fetchDealsFromAPI(1, DEALS_PER_PAGE);
      setDeals(initialDeals);
      setPage(2); // Chuẩn bị cho lần tải kế tiếp (trang 2)
      if (initialDeals.length < DEALS_PER_PAGE) {
        setHasMore(false); // Đã hết dữ liệu ngay từ lần tải đầu
      }
      setLoading(false);
    };
    loadInitialDeals();
  }, []); // Mảng rỗng `[]` để đảm bảo hàm này chỉ chạy 1 lần duy nhất

  // THAY ĐỔI: Logic hàm "Xem thêm"
  const handleSeeMore = async () => {
    setLoading(true);
    const newDeals = await fetchDealsFromAPI(page, DEALS_PER_PAGE);

    // Nối mảng sản phẩm mới vào danh sách hiện tại
    setDeals(prevDeals => [...prevDeals, ...newDeals]);
    setPage(prevPage => prevPage + 1);

    // Nếu API trả về ít sản phẩm hơn số lượng yêu cầu, nghĩa là đã hết
    if (newDeals.length < DEALS_PER_PAGE) {
      setHasMore(false);
    }
    setLoading(false);
  };

  return (
    <section className="deals-grid section pt-0">
      <div className="container">
        <h2 className="section__title">Ưu đãi nổi bật gần bạn</h2>
        <div className="deals-grid__container">
          {/* THAY ĐỔI: Map trên state `deals` thay vì `dealsData.slice` */}
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        {/* BỔ SUNG: Footer chứa nút, spinner và thông báo */}
        <div className="deals-grid__footer">
          {/* 1. Hiển thị vòng xoay khi đang tải */}
          {loading && <div className="loading-spinner"></div>}

          {/* 2. Hiển thị nút "Xem thêm" khi còn dữ liệu và không đang tải */}
          {hasMore && !loading && (
            <button onClick={handleSeeMore} className="see-more-btn">
              Xem thêm
            </button>
          )}

          {/* 3. Hiển thị thông báo khi đã hết dữ liệu và không đang tải */}
          {!hasMore && !loading && deals.length > 0 && (
             <p className="no-more-deals">Bạn đã xem hết các ưu đãi!</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;