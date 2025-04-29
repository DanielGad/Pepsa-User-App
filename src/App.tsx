import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import WhatsAppButton from './components/WhatsappButton';
import ProductDetails from './pages/ProductDetails';
// import Categories from './pages/Categories';
// import Sales from './pages/Sales';
// import BestSeller from './pages/BestSeller';
// import NewIn from './pages/NewIn';
// import Account from './pages/Account';
// import Cart from './pages/Cart';

function App() {
  return (
    <Router>
      <Navbar />
      <WhatsAppButton />
      <div className="pt-24"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          {/* <Route path="/categories" element={<Categories />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/best-seller" element={<BestSeller />} />
          <Route path="/new-in" element={<NewIn />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cart" element={<Cart />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
