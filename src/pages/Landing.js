import React, { useState, useEffect } from 'react';
import styles from './Landing.module.css'; // Import file CSS vừa tạo

// Giả sử các component này sẽ được tạo trong các bước tiếp theo
import Header from '../components/Landing/Header';
import HeroSlider from '../components/Landing/HeroSlider';
import StorySection from '../components/Landing/StorySection';
import HowItWorksSection from '../components/Landing/HowItWorksSection';
import DealsGallery from '../components/Landing/DealsGallery';
import CommunitySection from '../components/Landing/CommunitySection';
import ImpactSection from '../components/Landing/ImpactSection';
import PartnerBenefitsSection from '../components/Landing/PartnerBenefitsSection';
import CallToActionSection from '../components/Landing/CallToActionSection';
import Footer from '../components/Home/Footer';
// ... các section khác

// Component Preloader đơn giản
const Preloader = () => (
    <div className={styles.preloader}>
        <div className={styles.logoLoader}>PheniFood</div>
    </div>
);


const IntroducePage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); 

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Preloader />;
    }

    return (
        <div className={styles.pageWrapper}>
            <Header />
            <main>
                <HeroSlider />
                <StorySection />
                <HowItWorksSection />
                <DealsGallery />
                <CommunitySection />
                <ImpactSection />
                <PartnerBenefitsSection />
                <CallToActionSection />
            </main>
            <Footer />

        </div>
    );
};

export default IntroducePage;