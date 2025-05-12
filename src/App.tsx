import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import WhatsAppButton from './components/WhatsappButton';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import { useEffect, useState } from 'react';
// import MobileCart from './pages/MobileCart';
import ScrollToTop from './util/ScrollToTop';
import Checkout from './pages/Checkout';
// import MobileCheckout from './pages/MobileCheckout';
import DeliveryRequest from './pages/DeliveryRequest';
import Login from './pages/Login';
import Register from './pages/Register';
import MobileAccount from './pages/MobileAccount';
import MobileAccDetails from './pages/MobileAccDetails';
import MyAccount from './pages/MyAccount';
import OrderHistory from './pages/OrderHistory';
import Delivered from './pages/OrderDetails/Delivered';
import Invoice from './pages/OrderDetails/Invoice';
import Paid from './pages/OrderDetails/Paid';
import Dispatched from './pages/OrderDetails/Dispatched';
import Processing from './pages/OrderDetails/Processing';

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
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="delivery-request" element={<DeliveryRequest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/account" element={isMobile ? <MobileAccount /> : <MyAccount />} />
          <Route path="/my-details" element={<MobileAccDetails />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/orders/delivered/:orderId" element={<Delivered />} />
          <Route path="/orders/invoice/:invoiceId" element={<Invoice />} />
          <Route path="/orders/paid/:orderId" element={<Paid />} />
          <Route path="/orders/dispatched/:orderId" element={<Dispatched />} />
          <Route path="/orders/:orderId" element={<Processing />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
