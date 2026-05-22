import React, { useState } from 'react';
import Header from '../components/Home/Header';
import SearchOverlay from '../components/Home/SearchOverlay'; 
import Footer from '../components/Introduce/Footer';
// import WelcomeSection from '../components/Home/WelcomeSection';
import DealsGrid from '../components/Home/DealsGrid';   
import StoresSection from '../components/Home/StoresSection';
import DiscoverDeals from '../components/Home/DiscoverDeals';
import HeroSlider from '../components/Home/HeroSlider';
import FiltersSection from '../components/Home/FiltersSection';
import MarqueeDeals from '../components/Home/MarqueeDeals'; // Import MarqueeDeals component
import SpotlightDeal from '../components/Home/SpotlightDeal';
import { Link } from 'react-router-dom';

function HomePage() {
  const [isSearchOpen, setSearchOpen] = useState(false);


  return (
    <>
      <Header onSearchClick={() => setSearchOpen(true)} />

      {/* <WelcomeSection /> */}
      <HeroSlider userName="An" />
      
      <FiltersSection />

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />

      <main>
        <MarqueeDeals />
        <SpotlightDeal />
        
        {/* Thêm phần DealsGrid */}
        <DealsGrid />
        <StoresSection />
        <DiscoverDeals />

      </main>

      <Footer />
    </>
  );
}

export default HomePage;