import { useParams } from "react-router-dom";
import products from "../assets/products.json"; // Adjust path as needed
import { FaRegStar, FaStar, FaStarHalf, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import 'swiper/swiper-bundle.css';
import Footer from "../components/Footer";
import { useCart } from "../components/CartContext";
import ReviewModal from "../components/ReviewModal";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(product?.Variation[0]);
  const [showReviews, setShowReviews] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showModal, setShowModal] = useState(false);


  if (!product) return <div className="p-10">Product not found</div>;

  const toggleReviews = () => {
    setShowReviews(!showReviews);
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <><div className="p-6 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-10 mt-[-50px]">
      {/* Left: Image Carousel */}
      <div className="flex flex-col mx-auto">
        <div className="w-80 mx-auto lg:w-100 h-100">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={1}
            loop
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="rounded-sm"
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
                  className="w-full h-96 rounded-sm object-cover" />
              </SwiperSlide>
            ))}
            <div className="custom-prev absolute left-4 z-10"></div>
            <div className="custom-next absolute right-4 z-10"></div>
          </Swiper>
        </div>

        <div className="flex flex-col lg:flex-row justify-between">
          <h3 className="text-xl">{product.name}</h3>
          <h3 className="text-xl mt-2 lg:mt-0"><b>₦{(product.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </b></h3>
          <p className="mt-2 lg:mt-0">Avaliability: <span className="text-green-500">{product.Avaliability}</span></p>
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

        <div className="flex justify-between space-x-10 py-2">
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
      <div className="lg:mx-20 lg:w-full">
      <div
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={toggleReviews}
      >
        <h3 className="text-2xl font-semibold">Reviews</h3>
        {showReviews ? <FaChevronUp className="text-xl" /> : <FaChevronDown className="text-xl" />}
      </div>

      {showReviews && (
        <>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Write a review"
              className="w-full py-3 pl-3 border border-gray-400"
              onClick={() => setShowModal(true)}
            />
          <ReviewModal isOpen={showModal} onClose={() => setShowModal(false)} />
          </div>

          {product.reviews.slice(0, visibleCount).map((review, index) => (
            <div key={index} className="py-3 text-sm">
              <div className="flex items-center text-yellow-500 mb-2">
                {Array(review.rating).fill(0).map((_, i) => (
                  <FaStar key={i} className="mr-2 mb-1" />
                ))}
                <p className="font-bold text-gray-800 text-sm">- {review.title}</p>
              </div>
              <p className="text-gray-600">
                {review.comment} Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae id autem modi voluptate sit magnam enim ipsum maxime assumenda veniam corporis excepturi voluptas inventore unde est, natus commodi praesentium. Explicabo. – <span>{review.user}</span>
              </p>
            </div>
          ))}

          {visibleCount < product.reviews.length && (
            <div className="text-center mt-4">
              <button
                onClick={loadMore}
                className="text-red-600 cursor-pointer text-md hover:underline"
              >
                See more reviews
              </button>
            </div>
          )}
        </>
      )}
    </div>
    </div>

    <Footer />
    </>
  );
};

export default ProductDetails;
