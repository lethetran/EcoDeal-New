import React, { useState, useEffect } from 'react';
import Header from '../components/Home/Header';
import SearchOverlay from '../components/Home/SearchOverlay'; 
import Footer from '../components/Introduce/Footer';
import FlashDealNotification from '../components/FlashDealNotification';
import TopFlashDeals from '../components/TopFlashDeals';
// import WelcomeSection from '../components/Home/WelcomeSection';
import DealsGrid from '../components/Home/DealsGrid';
import DiscoverDeals from '../components/Home/DiscoverDeals';
import HeroSlider from '../components/Home/HeroSlider';
import FiltersSection from '../components/Home/FiltersSection';
import MarqueeDeals from '../components/Home/MarqueeDeals'; // Import MarqueeDeals component
import SpotlightDeal from '../components/Home/SpotlightDeal';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';

function HomePage() {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [greetingName, setGreetingName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setGreetingName('');
        return;
      }

      const displayName = (user.displayName || '').trim();
      const emailName = (user.email || '').split('@')[0];
      setGreetingName(displayName || emailName || '');
    });

    return () => unsubscribe();
  }, []);


  return (
    <>
      <Header onSearchClick={() => setSearchOpen(true)} />
      <FlashDealNotification />

      {/* <WelcomeSection /> */}
      <HeroSlider userName={greetingName} />
      
      <TopFlashDeals />

      <FiltersSection />

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />

      <main>
        <MarqueeDeals />
        <SpotlightDeal />
        
        {/* Thêm phần DealsGrid */}
        <DealsGrid />
        <DiscoverDeals />

      </main>

      <Footer />
    </>
  );
}

export default HomePage;