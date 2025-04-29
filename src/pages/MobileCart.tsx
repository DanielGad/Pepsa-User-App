import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import Footer from "../components/Footer";
import { FaTrashAlt } from "react-icons/fa";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <>
      <div className="px-4 py-6 md:px-20">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h1 className="text-lg md:text-2xl font-semibold">Items</h1>
          <button
            onClick={clearCart}
            className="text-red-700 text-sm font-medium hover:text-red-900"
          >
            Clear cart
          </button>
        </div>

        <div className="space-y-6">
          {cartItems.map((item, index) => {
            const variationPrice =
              item.product.Variation?.find(v => v.color === item.selectedVariation?.color)?.price ??
              item.product.price;

            return (
              <div
                key={`${item.product.id}-${item.selectedVariation?.color}-${index}`}
                className="flex gap-4 items-start border-b pb-4"
              >
                {/* Image */}
                <img
                  src={item.product.image[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm">
                    <span>{item.quantity} x </span>
                    <strong>{item.product.name}</strong>
                  </p>
                  {item.selectedVariation?.color && (
                    <p className="text-xs text-gray-500">{item.selectedVariation.color} color (₦
                      {(item.product.Variation?.find(v => v.color === item.selectedVariation?.color)?.price ?? item.product.price).toLocaleString()}
                      )</p>
                  )}

                  {/* Quantity + Remove */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedVariation)}
                      className="text-red-600 border border-red-600 p-1 rounded hover:bg-red-50"
                    >
                      <FaTrashAlt />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1, item.selectedVariation)}
                        className="border border-red-600 px-2 py-0.5 rounded text-red-600 hover:bg-red-50"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1, item.selectedVariation)}
                        className="border border-red-600 px-2 py-0.5 rounded text-red-600 hover:bg-red-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <p className="text-sm font-semibold text-red-700">
                  ₦{(item.quantity * variationPrice).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Buttons */}
        {cartItems.length > 0 && (
          <div className="mt-6 mb-5 flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/categories" className="">
            <button className="border px-8 py-3 rounded w-full hover:bg-gray-100 transition">Add Items</button>
            </Link>
            <button className="bg-red-700 text-white px-8 py-3 rounded hover:bg-red-800 transition">
              Confirm Order
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Cart;
