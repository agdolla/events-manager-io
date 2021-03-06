import React from 'react';
import HomeHeader from '../components/HomeHeader';
import HomeShowcaseSection from '../components/HomeShowcaseSection';
import HomeSlantCard from '../components/HomeSlantCard';
import HomeAboutSection from '../components/HomeAboutSection';

const HomeBody = () => (
  <div className="io-body-content io-banner-head">
    <HomeHeader />
    <HomeShowcaseSection />
    <HomeSlantCard />
    <HomeSlantCard extraClass="io-reverse" />
    <HomeAboutSection />
  </div>
);

export default HomeBody;
