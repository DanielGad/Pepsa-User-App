import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch, FaChevronRight } from 'react-icons/fa';
import DiademLogo from '../assets/images/diadem-luxury-logo.png';
import AccountIcon from "../assets/images/account-icon.png";
import CartIcon from "../assets/images/cart-icon.png";
import { useCart } from "./CartContext"; // adjust the path if needed


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

      const userId = localStorage.getItem("userId");
      
      const authLink = userId
  ? { label: 'My Account', path: '/account' }
  : { label: 'Login', path: '/login' };



  return (
    <nav className="w-full flex items-center justify-between px-4 lg:px-20 py-4 bg-white fixed top-0 left-0 z-50 border border-bottom-2 border-gray-400">
      {/* Left Section: Hamburger + Logo + Brand */}
      <Link to="/">
          <div className="flex items-center space-x-3">
          {/* Hamburger (Mobile Only) */}
          <button
            className="lg:hidden text-2xl text-red-600"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Logo + Brand */}
          <img src={DiademLogo} alt="Diadem Luxury Logo" className="hidden lg:block w-10 h-auto" />
          <span className="Diadem hidden lg:block text-xl font-bold text-gray-800">Diadem Luxury</span>
          <img src={DiademLogo} alt="Diadem Luxury Logo" className="block lg:hidden w-8 h-auto" />
          <span className="Diadem block lg:hidden text-lg font-bold text-gray-800">Diadem Luxury</span>
        </div>
      </Link>

      {/* Center Links on Desktop */}
      <ul className="hidden lg:flex items-center space-x-8 text-gray-700 font-medium">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/categories">Categories</Link></li>
        <li><Link to="/sales">Sales</Link></li>
        <li><Link to="/best-seller">Best Seller</Link></li>
        <li><Link to="/new-in">New In</Link></li>
      </ul>

      {/* Right Icons */}
      <div className="flex items-center space-x-3 text-gray-700 text-xl">
        {/* Search (icon on mobile, input on desktop) */}
        <div className="flex items-center">
          <FaSearch className="block lg:hidden text-lg cursor-pointer " />
          <input
            type="text"
            placeholder="Search"
            className="hidden lg:block w-32 rounded-2xl text-center border p-1 border-gray-400 text-lg"
          />
        </div>

        {/* Account and Cart */}
        <Link to="/account">
          <img src={AccountIcon} alt="Account" className="w-8 lg:w-8" />
        </Link>
        <Link to="/cart">
        <div className="relative">
           <img src={CartIcon} alt="Cart" className="w-8 lg:w-8" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        </Link>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg p-6 flex flex-col space-y-6 text-gray-800 text-lg lg:hidden transition-all">
          {/* Navigation links */}
          {[
            { label: 'Home', path: '/' },
            { label: 'Categories', path: '/categories' },
            { label: 'Sales', path: '/sales' },
            { label: 'Best Seller', path: '/best-seller' },
            { label: 'New In', path: '/new-in' },
            authLink
          ].map((item) => (
            <Link
              to={item.path}
              key={item.label}
              className="flex items-center justify-between py-2 border-b border-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              <span>{item.label}</span>
              <FaChevronRight />
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
