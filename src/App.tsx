import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import WhatsAppButton from './components/WhatsappButton';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
// import Sales from './pages/Sales';
// import BestSeller from './pages/BestSeller';
// import NewIn from './pages/NewIn';
// import Account from './pages/Account';
import Cart from './pages/Cart';
import { useEffect, useState } from 'react';
import MobileCart from './pages/MobileCart';
import ScrollToTop from './util/ScrollToTop';
import Checkout from './pages/Checkout';
import MobileCheckout from './pages/MobileCheckout';
import DeliveryRequest from './pages/DeliveryRequest';
import Login from './pages/Login';
import Register from './pages/Register';
import MobileAccount from './pages/MobileAccount';
import MobileAccDetails from './pages/MobileAccDetails';
import MyAccount from './pages/MyAccount';

function App() {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <WhatsAppButton />
      <div className="pt-24"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={isMobile ? <MobileCart /> : <Cart />} />
          <Route path="/checkout" element={isMobile ? <MobileCheckout /> : <Checkout />} />
          <Route path="delivery-request" element={<DeliveryRequest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/account" element={isMobile ? <MobileAccount /> : <MyAccount />} />
          <Route path="/my-details" element={<MobileAccDetails />} />
          {/* <Route path="/sales" element={<Sales />} />
          <Route path="/best-seller" element={<BestSeller />} />
          <Route path="/new-in" element={<NewIn />} />
          <Route path="/account" element={<Account />} /> */} 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
