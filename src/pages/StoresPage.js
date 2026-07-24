import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StoresPage.css'; 
import FlashDealNotification from '../components/FlashDealNotification';
import TopFlashDeals from '../components/TopFlashDeals';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Header/Header';

const allStoresData = [
    { id: 'burger-house', name: 'Tiệm Burger House', category: 'Quán ăn', bannerUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500', distance: 1.2, rating: 4.8, tags: ['Burger', 'Món Âu', 'Ưu đãi'], address: '123 Đường ABC, Quận 1', openingHours: '09:00 - 22:00' },
    { id: 'paris-gateaux', name: 'Paris Gateaux', category: 'Tiệm bánh', bannerUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500', distance: 2.5, rating: 4.7, tags: ['Bánh ngọt', 'Cafe'], address: '456 Đường DEF, Quận 3', openingHours: '08:00 - 21:00' },
    { id: 'pizza-hut', name: 'Pizza Hut', category: 'Quán ăn', bannerUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500', distance: 3.1, rating: 4.5, tags: ['Pizza', 'Món Ý'], address: '789 Đường GHI, Quận 10', openingHours: '10:00 - 22:00' },
    { id: 'cong-caphe', name: 'Cộng Cà Phê', category: 'Cà phê', bannerUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500', distance: 0.5, rating: 4.9, tags: ['Cà phê', 'Vintage'], address: '111 Đường KLM, Quận 1', openingHours: '07:00 - 23:00' },
    { id: 'kfc', name: 'KFC', category: 'Quán ăn', bannerUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500', distance: 2.1, rating: 4.3, tags: ['Gà rán', 'Thức ăn nhanh'], address: '222 Đường NOP, Quận 5', openingHours: '09:00 - 22:00' },
    { id: 'gong-cha', name: 'Gong Cha', category: 'Trà sữa', bannerUrl: '/placeholders/deal-placeholder.svg', distance: 1.9, rating: 4.6, tags: ['Trà sữa', 'Topping'], address: '333 Đường QRS, Quận 1', openingHours: '10:00 - 22:30' },
    { id: 'sushi-hokkaido', name: 'Sushi Hokkaido Sachi', category: 'Quán ăn', bannerUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500', distance: 2.4, rating: 4.8, tags: ['Sushi', 'Nhật Bản'], address: '444 Đường TUV, Quận 7', openingHours: '11:00 - 22:00' },
    { id: 'the-coffee-house', name: 'The Coffee House', category: 'Cà phê', bannerUrl: '/placeholders/deal-placeholder.svg', distance: 1.8, rating: 4.7, tags: ['Cà phê', 'Làm việc'], address: '555 Đường XYZ, Quận Tân Bình', openingHours: '07:00 - 22:00' },
];

// HÀM API GIẢ LẬP - ĐÃ CẬP NHẬT LOGIC LỌC
const fetchStoresAPI = async (page, limit, filters) => {
    console.log("Đang tải cửa hàng với bộ lọc:", filters);
    
    let filteredData = allStoresData;

    // 1. Lọc theo danh mục (category)
    if (filters.category && filters.category !== 'all') {
        filteredData = filteredData.filter(store => store.category === filters.category);
    }
    
    // 2. Phân trang trên dữ liệu đã được lọc
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pageData = filteredData.slice(startIndex, endIndex);

    return new Promise(resolve => setTimeout(() => resolve(pageData), 500));
};

// COMPONENT THẺ CỬA HÀNG - ĐÃ CẬP NHẬT GIAO DIỆN
const StoreCard = ({ store }) => (
    <Link to={`/store/${store.id}`} className="store-card">
        <div className="store-card-banner" style={{backgroundImage: `url(${store.bannerUrl})`}}>
            <div className="store-card-overlay">
                 <div className="store-card-rating">
                    <i className='bx bxs-star'></i> {store.rating}
                </div>
            </div>
        </div>
        <div className="store-card-content">
            <h3 className="store-card-name">{store.name}</h3>
            <p className="store-card-category">{store.category} • {store.distance}km</p>
            
            <div className="store-card-info-line">
                <i className='bx bxs-time-five'></i>
                <span>{store.openingHours}</span>
            </div>
            <div className="store-card-info-line">
                <i className='bx bxs-map'></i>
                <span>{store.address}</span>
            </div>

            <div className="store-card-tags">
                {store.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
        </div>
    </Link>
);


const StoresPage = () => {
    const STORES_PER_PAGE = 6;
    const [stores, setStores] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'Tất cả', icon: 'bxs-grid-alt' },
        { id: 'Quán ăn', name: 'Quán ăn', icon: 'bxs-store-alt' },
        { id: 'Cà phê', name: 'Cà phê', icon: 'bxs-coffee-togo' },
        { id: 'Trà sữa', name: 'Trà sữa', icon: 'bxs-drink' },
        { id: 'Tiệm bánh', name: 'Tiệm bánh', icon: 'bxs-cake' }
    ];

    // HÀM XỬ LÝ KHI THAY ĐỔI BỘ LỌC
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    useEffect(() => {
        const loadStores = async () => {
            setLoading(true);
            // Luôn tải lại từ trang 1 khi bộ lọc thay đổi
            const initialStores = await fetchStoresAPI(1, STORES_PER_PAGE, { category: activeCategory });
            setStores(initialStores);
            setPage(2); 
            setHasMore(initialStores.length >= STORES_PER_PAGE);
            setLoading(false);
        };

        loadStores();
    }, [activeCategory]); 

    const handleSeeMore = async () => {
        setLoading(true);
        const newStores = await fetchStoresAPI(page, STORES_PER_PAGE, { category: activeCategory });
        setStores(prevStores => [...prevStores, ...newStores]);
        setPage(prevPage => prevPage + 1);
        if (newStores.length < STORES_PER_PAGE) {
            setHasMore(false);
        }
        setLoading(false);
    };

    return (
        <>
            <Navbar />
            <FlashDealNotification />
            <TopFlashDeals />
            <div className="stores-page">
                <div className="container">
                    <header className="stores-header">
                        <h1>Khám phá các cửa hàng</h1>
                        <p>Tìm kiếm và lựa chọn những điểm đến ẩm thực yêu thích của bạn.</p>
                    </header>

                    <div className="filter-bar">
                        <div className="filter-tabs">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={activeCategory === category.id ? 'active' : ''}
                                    onClick={() => handleCategoryChange(category.id)}
                                >
                                    <i className={`bx ${category.icon}`}></i> 
                                    {category.name}
                                </button>
                            ))}
                        </div>
                         <div className="search-box">
                            <i className='bx bx-search'></i>
                            <input type="text" placeholder="Tìm tên cửa hàng..." />
                        </div>
                    </div>

                    <div className="stores-grid">
                        {stores.map(store => <StoreCard key={store.id} store={store} />)}
                    </div>

                    <div className="stores-footer">
                        {loading && <div className="loading-spinner"></div>}
                        {hasMore && !loading && (
                            <button onClick={handleSeeMore} className="see-more-btn">
                                Tải thêm cửa hàng
                            </button>
                        )}
                        {!hasMore && !loading && stores.length > 0 && (
                            <p className="no-more-deals">Bạn đã xem hết tất cả cửa hàng!</p>
                        )}
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
};

export default StoresPage;