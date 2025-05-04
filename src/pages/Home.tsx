import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DiademLogo from '../assets/images/diadem-luxury-logo.png';
import Products from '../assets/products.json';
import Footer from '../components/Footer';
import { useCart } from '../components/CartContext';
import { useRef } from 'react';


const categories = [
  "All", 
  "Fashion", 
  "Bags",
  "Accessories", 
  "Clothings",
  "Hair", 
  "Skincare", 
  "Toys", 
  "Shoes", 
  "Jewelry",
  "Wears"
];

const Home = () => {
  const { addToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const productRef = useRef<HTMLDivElement>(null);
  const productsPerPage = 8;

  const selectedVariation = Products[0].Variation[0];
  const quantity = 1;

  // Filter products based on category
  const filteredProducts = useMemo(() => {
    return selectedCategory === "All"
      ? Products
      : Products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div>
      {/* Header Section */}
      <section className="header-container text-center relative flex flex-col items-center justify-center lg:mx-20">
        <img src={DiademLogo} alt="Diadem Logo" className='shadow-md'/>
        <span className="Diadem text-4xl font-bold text-white">Diadem Luxury</span>
      </section>

      {/* Category Section */}
      <section ref={productRef} className="w-full mt-8 px-4 lg:px-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shop by Category</h2>

        <div className="flex space-x-2 lg:space-x-10 overflow-x-auto scrollbar-hide pb-4">
          {categories.map((category) => (
            <div
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1); // Reset page on category change
              }}
              className={`flex-shrink-0 w-[150px] text-center py-1 font-medium rounded-xl border 
                ${selectedCategory === category ? "bg-red-600 text-white" : "bg-white text-gray-700"} 
                border-red-600 shadow hover:bg-[#a000004d] cursor-pointer transition-all`}
            >
              {category}
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="w-full mt-5 md:mt-12 px-4 lg:px-20 mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 md:mb-6">Featured Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="bg-white shadow rounded-lg md:p-4 flex flex-col items-left text-center">
              <Link to={`/product/${product.id}`}>
                <img 
                  src={product.image?.[1] || product.image?.[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded mb-4" 
                />
              </Link>
              <div className='w-full text-left'>
                <h3 className="text-lg font-medium text-gray-800 mt-2">{product.name}</h3>
                <p className="text-red-600 font-bold">
                  ₦{(product.price ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <button 
                  className="mt-4 bg-red-600 text-white w-full py-2 rounded-md hover:bg-red-900 transition transform active:scale-90 cursor-pointer"
                  onClick={() => addToCart(product, selectedVariation, quantity)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            onClick={() => {
              if (productRef.current) {
                productRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex justify-center items-center mt-10 space-x-4"
          >
            <button
              onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1  cursor-pointer border-2 text-red-600 border-red-600 rounded-full bg-white font-bold text-2xl hover:bg-gray-100 disabled:opacity-50"
            >
              &lt;
            </button>

            <span className="font-semibold text-gray-700">
              {currentPage}
            </span>

            <button
              onClick={() => currentPage < totalPages && setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 cursor-pointer border-2 text-red-600 border-red-600 rounded-full font-bold text-2xl bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Home;