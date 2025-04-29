import { useParams } from "react-router-dom";
import products from "../assets/products.json"; // Adjust path as needed
import { FaRegStar, FaStar, FaStarHalf } from "react-icons/fa";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import 'swiper/swiper-bundle.css';

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  // const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.Variation?.[0]?.color);

  if (!product) return <div className="p-10">Product not found</div>;

  return (
    <div className="p-6 md:p-20 grid grid-cols-1 md:grid-cols-2 gap-10 mt-[-50px]">
      {/* Left: Image Carousel */}
      <div className="flex flex-col mx-auto">
        <div className="w-80 mx-auto md:w-100 h-100">
          <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={1}
              loop
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className="rounded-2xl"
              navigation={{
                nextEl: '.custom-next',
                prevEl: '.custom-prev',
              }}
            >
              {product.image.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img}
                    alt={`About slide ${i + 1}`}
                    className="w-full h-96 rounded-2xl object-cover"
                  />
                </SwiperSlide>
              ))}
              <div className="custom-prev absolute left-4 z-10"></div>
              <div className="custom-next absolute right-4 z-10"></div>
            </Swiper>
        </div>
            
        <div className="flex flex-col md:flex-row justify-between">
          <h3 className="text-xl">{product.name}</h3>
          <h3 className="text-xl"><b>₦{product.price}</b></h3>
          <p className="">Avaliability: <span className="text-green-500">{product.Avaliability}</span></p>
        </div>
        <div className="flex items-center text-yellow-500 mt-5">
          {/* Filled stars */}
          {Array.from({ length: Math.floor(product.rating) }, (_, i) => (
            <FaStar key={`filled-${i}`} className="mr-3 text-2xl" />
          ))}
          
          {/* Half star (if needed) */}
          {product.rating % 1 >= 0.5 && (
            <FaStarHalf key="half-star" className="mr-3 text-2xl" />
          )}
          
          {/* Empty stars */}
          {Array.from({ length: 5 - Math.ceil(product.rating) }, (_, i) => (
            <FaRegStar key={`empty-${i}`} className="mr-3 text-2xl" />
          ))}
          <div className="text-black">{product.rating}</div>
        </div>
        
      </div>

      {/* Right: Product Info */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Item Details</h2>
        <p className="text-gray-600 mb-4">{product.description}</p>

        <div className="mb-4">
          <p className="font-semibold text-2xl mb-2">Product Variation</p>
          {product.Variation.map((v, index) => (
            <label key={index} className="flex space-x-2 mb-3">
              <input
                type="radio"
                name="variation"
                value={v.color}
                checked={selectedColor === v.color}
                onChange={() => setSelectedColor(v.color)}
                className="accent-[#a00000]"
              />
              <span className="w-1/9">{v.color}</span>
              <span className="ml-20 text-sm text-left">₦{(v.price ?? 0).toLocaleString()}</span>
            </label>
          ))}
        </div>

        {/* Quantity and Buttons */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 border"
          >-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-1 border">+</button>
        </div>

        <div className="flex space-x-4">
          <button className="px-6 py-2 border rounded text-red-600 border-red-600 hover:bg-red-100">
            Buy Now
          </button>
          <button className="px-6 py-2 bg-red-700 text-white rounded hover:bg-red-800">
            Add to Cart
          </button>
        </div>

      </div>
      {/* Reviews */}
        <div className="mt-10 lg:mx-20 lg:w-full">
          <h3 className="text-2xl font-semibold mb-3">Reviews</h3>
          <div className="mb-3">
          <input type="text" placeholder="Write a review" className="w-full py-3 pl-3 border border-gray-400" />
          </div>
          {product.reviews.map((review, index) => (
            <div key={index} className="py-3 text-sm">
              <div className="flex items-center text-yellow-500 mb-2">
                {Array(review.rating).fill(0).map((_, i) => <FaStar key={i} className="mr-2 mb-1" />)}
                <p className="font-bold text-gray-800 text-sm">- {review.title}</p>
              </div>
              
              <p className="text-gray-600">{review.comment} Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae dicta ducimus pariatur aspernatur harum provident sequi aliquid, impedit inventore quod praesentium, voluptas, at voluptatibus ab nesciunt! Nisi autem rerum veritatis. – <span>{review.user}</span></p>
            </div>
          ))}
        </div>
    </div>
  );
};

export default ProductDetails;
