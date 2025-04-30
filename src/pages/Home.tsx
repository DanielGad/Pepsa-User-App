import { Link } from 'react-router-dom';
import DiademLogo from '../assets/images/diadem-luxury-logo.png';
import Products from '../assets/products.json'
import Footer from '../components/Footer';
import { useCart } from '../components/CartContext';

const categories = [
  "All", 
  "Clothings", 
  "Bags", 
  "Hair", 
  "Skincare", 
  "Toys", 
  "Shoes", 
  "Accessories", 
  "Jewelry"
];

const Home = () => {
  const { addToCart } = useCart();
  const selectedVariation = Products[0].Variation[0];
  const quantity = 1; 

  return (
    <div className="">
      <section className="header-container text-center relative flex flex-col items-center justify-center lg:mx-20 " >
        <img src={DiademLogo} alt="Diadem Logo" className='shadow-md'/>
        <span className="Diadem text-4xl font-bold text-white">Diadem Luxury</span>
      </section>

      <section className="w-full mt-8 px-4 lg:px-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shop by Category</h2>

        <div className="flex space-x-2 lg:space-x-10 overflow-x-auto scrollbar-hide pb-4">
          {categories.map((category) => (
            <div 
              key={category}
              className="flex-shrink-0 bg-white rounded-xl border border-red-600 w-[150px] text-center py-1 text-gray-700 font-medium shadow hover:bg-[#a000004d] cursor-pointer transition-all"
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
          {Products.slice(0, 8).map((product) => (
            <div key={product.id} className="bg-white shadow rounded-lg md:p-4 flex flex-col items-center text-center">
              <Link to={`/product/${product.id}`}>
              <img 
                src={product.image?.[1] || product.image?.[0]} 
                alt={product.name} 
                className="w-60 h-full object-cover rounded mb-4" 
              />
              </Link>
              <div className='w-full text-left'>
                <h3 className="text-lg font-medium text-gray-800 mt-2">{product.name}</h3>
                <p className="text-red-600 font-bold">₦{(product.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <button className="mt-4 bg-red-600 text-white w-full py-2 rounded-md hover:bg-red-900 transition transform active:scale-90 cursor-pointer" onClick={() => addToCart(product, selectedVariation, quantity)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='relative flex justify-center items-center mt-10 md:hidden'>
          <span className="custom-prev-home absolute left-30 z-10"></span>
          1
          <span className="custom-next-home absolute right-30 z-10"></span>
        </div>

        <div className='hidden md:block'>
          <div className='relative flex justify-center items-center mt-10'>
            <span className="custom-prev-home absolute left-130 z-10"></span>
            1
            <span className="custom-next-home absolute right-130 z-10"></span>
          </div>
        </div>

        
      </section>

      <Footer />
    </div>
  )
}

export default Home