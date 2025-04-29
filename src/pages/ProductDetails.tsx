import { useParams } from "react-router-dom";
import products from "../assets/products.json"; // Adjust path as needed
import { FaRegStar, FaStar, FaStarHalf } from "react-icons/fa";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import 'swiper/swiper-bundle.css';
import Footer from "../components/Footer";
import { useCart } from "../components/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(product?.Variation[0]);

  if (!product) return <div className="p-10">Product not found</div>;

  return (
    <><div className="p-6 md:p-20 grid grid-cols-1 md:grid-cols-2 gap-10 mt-[-50px]">
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
                  className="w-full h-96 rounded-2xl object-cover" />
              </SwiperSlide>
            ))}
            <div className="custom-prev absolute left-4 z-10"></div>
            <div className="custom-next absolute right-4 z-10"></div>
          </Swiper>
        </div>

        <div className="flex flex-col md:flex-row justify-between">
          <h3 className="text-xl">{product.name}</h3>
          <h3 className="text-xl"><b>₦{(product.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </b></h3>
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
        <p className="text-gray-600 mb-4">{product.description} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime ullam, tempore nemo quae delectus quisquam voluptatem reprehenderit possimus odio eligendi dolore eos neque repellat autem unde suscipit quidem cum alias!</p>

        <div className="mb-4">
          <p className="font-semibold text-2xl mb-2">Product Variation</p>
          {product.Variation.map((v, index) => (
          <label key={index} className="flex space-x-2 mb-3">
            <input
              type="radio"
              name="variation"
              value={v.color}
              checked={selectedVariation?.color === v.color}
              onChange={() => setSelectedVariation(v)}
              className="accent-red-600"
            />
            <span className="w-1/9">{v.color}</span>
            <span className="ml-20 text-sm text-left">
              ₦{(v.price ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </label>
        ))}
        </div>

        {/* Quantity and Buttons */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 border text-red-600 cursor-pointer border-red-600"
          >-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-1 text-red-600 border cursor-pointer border-red-600">+</button>
        </div>

        <div className="flex justify-between space-x-10 py-4">
        <button
          className="border px-4 py-4 w-full border-red-600 hover:bg-red-300 text-red-600 mb-4 rounded-md cursor-pointer transition transform active:scale-90"
          onClick={() => addToCart(product, selectedVariation, quantity)}
        >
          Buy Now
        </button>

        <button
          className="border px-4 py-4 w-full hover:bg-red-800 bg-red-600 text-white mb-4 rounded-md cursor-pointer transition transform active:scale-90"
          onClick={() => addToCart(product, selectedVariation, quantity)}
        >
          Add to Cart
        </button>
       
        </div>


      </div>
      {/* Reviews */}
      <div className="mt-5 lg:mx-20 lg:w-full">
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
    </div><Footer /></>
  );
};

export default ProductDetails;
