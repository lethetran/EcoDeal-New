import React from 'react';
import Navbar from '../components/Introduce/Navbar';
import HeroSection from '../components/Introduce/HeroSection';
import FeaturedDeals from '../components/Introduce/FeaturedDeals';
import HowItWorks from '../components/Introduce/HowItWorks';
import PartnerCTA from '../components/Introduce/PartnerCTA';
import Footer from '../components/Introduce/Footer';
import { Link } from 'react-router-dom';

const Introduce = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedDeals />
        <HowItWorks />
        <PartnerCTA />
      </main>
      <Footer />
    </>
  );
};

export default Introduce;