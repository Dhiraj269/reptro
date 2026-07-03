import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import LocationSelector from '../components/LocationSelector';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import DeliveryInfo from '../components/DeliveryInfo';
import FlashSale from '../components/FlashSale';
import PopularPicks from '../components/PopularPicks';
import ReptroFresh from '../components/ReptroFresh';
import CategorySection from '../components/CategorySection';
import WhyReptro from '../components/WhyReptro';
import Founders from '../components/Founders';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import ProductModal from '../components/ProductModal';
import SEO from '../components/SEO';

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const searchRef = useRef(null);
  const shopRef = useRef(null);

  return (
    <div>
      <SEO 
        title="Reptro - Fast Campus Delivery App for GEC Arwal Students"
        description="Order groceries, snacks, medicines, dairy & fresh sprouts online. 10-minute delivery, student prices, free morning sprouts delivery at GEC Arwal campus."
        keywords="reptro, campus delivery arwal, GEC Arwal grocery, hostel food delivery, student grocery online, arwal college essentials, quick delivery bihar, 10 minute delivery, campus store online, fresh sprouts delivery"
        url="https://reptro.in/"
      />
      <Navbar onSearchClick={() => searchRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      <LocationSelector />
      <HeroSection onSearchClick={() => searchRef.current?.scrollIntoView({ behavior: 'smooth' })} onShopClick={() => shopRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      <div ref={searchRef}><SearchBar isVisible={true} onProductClick={setSelectedProduct} /></div>
      <DeliveryInfo />
      <FlashSale onProductClick={setSelectedProduct} />
      <PopularPicks onProductClick={setSelectedProduct} />
      <ReptroFresh />
      <div ref={shopRef}><CategorySection onProductClick={setSelectedProduct} /></div>
      <WhyReptro />
      <Founders />
      <Footer />
      <Cart />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};

export default Home;