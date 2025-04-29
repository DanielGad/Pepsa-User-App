import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch, FaChevronRight } from 'react-icons/fa';
import DiademLogo from '../assets/images/diadem-luxury-logo.png';
import AccountIcon from "../assets/images/account-icon.png";
import CartIcon from "../assets/images/cart-icon.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-20 py-4 bg-white fixed top-0 left-0 z-50 border border-bottom-2 border-gray-400">
      {/* Left Section: Hamburger + Logo + Brand */}
      <div className="flex items-center space-x-3">
        {/* Hamburger (Mobile Only) */}
        <button
          className="md:hidden text-2xl text-red-600"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Logo + Brand */}
        <img src={DiademLogo} alt="Diadem Luxury Logo" className="hidden md:block w-10 h-auto" />
        <span className="Diadem hidden md:block text-xl font-bold text-gray-800">Diadem Luxury</span>
        <img src={DiademLogo} alt="Diadem Luxury Logo" className="block md:hidden w-8 h-auto" />
        <span className="Diadem block md:hidden text-lg font-bold text-gray-800">Diadem Luxury</span>
      </div>

      {/* Center Links on Desktop */}
      <ul className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
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
          <FaSearch className="block md:hidden text-lg cursor-pointer " />
          <input
            type="text"
            placeholder="Search"
            className="hidden md:block w-32 rounded-2xl text-center border p-1 border-gray-400 text-lg"
          />
        </div>

        {/* Account and Cart */}
        <Link to="/account">
          <img src={AccountIcon} alt="Account" className="w-8 lg:w-8" />
        </Link>
        <Link to="/cart">
          <img src={CartIcon} alt="Cart" className="w-8 lg:w-8" />
        </Link>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg p-6 flex flex-col space-y-6 text-gray-800 text-lg md:hidden transition-all">
          {/* Navigation links */}
          {[
            { label: 'Home', path: '/' },
            { label: 'Categories', path: '/categories' },
            { label: 'Sales', path: '/sales' },
            { label: 'Best Seller', path: '/best-seller' },
            { label: 'New In', path: '/new-in' },
            { label: 'Login', path: '/login' }, // Added Login
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
