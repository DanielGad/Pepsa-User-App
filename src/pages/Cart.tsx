import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import Footer from "../components/Footer";
import { FaTrashAlt } from "react-icons/fa";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <>
      <div className="p-4 md:p-6 md:mx-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 px-2 md:px-5">
          <h1 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Cart Items</h1>
          <button
            onClick={() => clearCart()}
            className="text-white font-medium cursor-pointer bg-red-600 px-4 py-2 rounded-2xl hover:bg-red-800 transition transform active:scale-90"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-6">
          {cartItems.map((item, index) => (
            <div
              key={`${item.product.id}-${item.selectedVariation?.color}-${index}`}
              className="flex flex-col md:flex-row items-center justify-between gap-4 shadow-md py-4 px-4 md:px-8 rounded-md"
            >
              <img
                src={item.product.image[0]}
                alt={item.product.name}
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded"
              />

              <div className="text-center md:text-left md:flex-col">
                <p className="text-lg font-medium">
                  {item.quantity}× {item.product.name}
                </p>
                {item.selectedVariation && (
                  <p className="text-sm text-gray-500">{item.selectedVariation.color} color</p>
                )}
                <p className="text-gray-800 mt-1 text-sm">
                  (₦
                  {(item.product.Variation?.find(v => v.color === item.selectedVariation?.color)?.price ?? item.product.price).toLocaleString()}
                  )
                </p>
              </div>

              <p className="text-red-700 font-bold mt-2 md:mt-0">
                ₦
                {(
                  item.quantity *
                  (item.product.Variation?.find(v => v.color === item.selectedVariation?.color)?.price ?? item.product.price)
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.product.id, -1, item.selectedVariation)}
                  className="border cursor-pointer border-red-600 px-2 rounded text-red-600 hover:bg-red-50"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, 1, item.selectedVariation)}
                  className="border cursor-pointer border-red-600 px-2 rounded text-red-600 hover:bg-red-50"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.product.id, item.selectedVariation)}
                className="flex items-center gap-2 text-red-600 border border-red-600 px-4 py-2 rounded-md cursor-pointer hover:text-red-800 transition-all"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>

        {/* Footer buttons */}
        {cartItems.length > 0 ? (
          <div className="mt-6 mb-5 flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/categories">
              <button className="border px-8 py-3 rounded cursor-pointer hover:bg-gray-100 transition transform active:scale-90">
                Add Items
              </button>
            </Link>
            <button className="bg-red-700 text-white px-8 py-3 rounded cursor-pointer hover:bg-red-800 transition transform active:scale-90">
              Confirm Order
            </button>
          </div>
        ) : (
          <div className="mt-10 text-center">
            <p className="mb-4 text-gray-500 text-lg">Your cart is empty</p>
            <Link to="/">
              <button className="border px-6 py-3 rounded cursor-pointer hover:bg-gray-100 transition transform active:scale-90">
                Add Items
              </button>
            </Link>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
};

export default Cart;
