import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import Footer from "../components/Footer";
import { FaSpinner, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";

const MobileCart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [confirming, setConfirming] = useState(false);


  const handleConfirm = async () => {
    setConfirming(true)
    // 1) Must be logged in
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      // 2) Fetch user profile
      const res = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch user profile");
      const user = await res.json();

      // 3) Check required address fields
      const { address, landmark, houseNo } = user;
      if (!address || !landmark || !houseNo) {
        // Redirect to account page to fill details
        navigate("/delivery-request");
        return;
      }

      // 4) All good: go to checkout
      navigate("/checkout");
    } catch (err) {
      console.error("Error during confirmation check:", err);
      // Fallback to login if something goes wrong
      navigate("/login");
    } finally {
      setConfirming(false)
    }
  };

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
        {cartItems.length > 0 ? (
          <div className="mt-6 mb-5 flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/">
              <button className="border px-8 py-3 rounded w-full cursor-pointer hover:bg-gray-100 transition transform active:scale-90">
                Add Items
              </button>
            </Link>
            <button className= "flex justify-center items-center bg-red-700 text-white w-full px-8 py-3 rounded cursor-pointer hover:bg-red-800 transition transform active:scale-90"
            onClick={handleConfirm}
            disabled={confirming}>
              {confirming && <FaSpinner className="animate-spin mr-2" />}
              {confirming ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        ) : (
          <div className="mt-10 text-center">
            <p className="mb-4 text-gray-500 text-lg">Your cart is empty</p>
            <Link to="/">
              <button className="border px-6 py-3 w-full rounded cursor-pointer hover:bg-gray-100 transition transform active:scale-90">
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

export default MobileCart;
