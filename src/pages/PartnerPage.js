import React from 'react';
import PartnerHero from '../components/PartnerPage/PartnerHero';
import PartnerBenefits from '../components/PartnerPage/PartnerBenefits';
import PartnerForm from '../components/PartnerPage/PartnerForm ';

import Header from '../components/Landing/Header';
import Footer from '../components/Home/Footer';
import './PartnerPage.css';

const PartnerPage = () => {
  return (
    <>
      <Header />
      <main className="partner-page">
        <PartnerHero />
        <PartnerBenefits />
        <PartnerForm />
      </main>
      <Footer />
    </>
  );
};

export default PartnerPage;