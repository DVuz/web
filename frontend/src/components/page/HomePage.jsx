import React, { useEffect } from 'react';
import HomeBanner from '../shared/HomeBanner';
import Header from '../ui/Header';
import Footer from '../shared/Footer.jsx';
import Inspiration from '../shared/Inspiration.jsx';
import ProductList from '../shared/ProductList.jsx';
const HomePage = () => {
  useEffect(() => {
    document.title = 'DDStore';
  }, []);
  return (
    <div className=''>
      <Header />
      <HomeBanner />
      <div className='max-w-screen-2xl mx-auto'>
        <Inspiration />
        <ProductList />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
