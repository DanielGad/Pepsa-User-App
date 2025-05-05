import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import Footer from "../components/Footer";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import Discount from "../assets/images/discount.png"
import { useFirebase } from "../context/FirebaseContext";

const Checkout = () => {
  const navigate = useNavigate();
const { user } = useFirebase();

  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const Delivery = ["Vendor Delivery", "Self Pickup", "Pepsa Dispatch"];
  const Fee = ["₦6,000.00", "₦0.00", "₦5,000.00"];
  const [selectedDelivery, setSelectedDelivery] = useState(Delivery[0]);

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const price =
      item.product.Variation?.find(v => v.color === item.selectedVariation?.color)?.price ??
      item.product.price;
    return total + price * item.quantity;
  }, 0);

  // Extract delivery fee
  const deliveryFee = parseFloat(
    Fee[Delivery.indexOf(selectedDelivery)].replace(/[^0-9.-]+/g, "")
  );

  // Static charges
  const discount = 1000;
  const serviceFee = 100;
  const vat = 0;

  // Total
  const total = subtotal - discount + vat + serviceFee + deliveryFee;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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
          <><div className="mt-10 flex flex-col md:flex-row justify-between gap-10 px-2 md:px-5">
            {/* Delivery options */}
            <div className="flex flex-col gap-5 text-gray-600 w-full md:w-2/5 shadow-xl p-5 rounded-xl">
              <h2 className="text-2xl font-semibold">Delivery Method</h2>
              {Delivery.map((v, i) => (
                <label key={v} className="flex space-x-3 mb-3 items-center">
                  <input
                    type="radio"
                    name="delivery"
                    value={v}
                    checked={selectedDelivery === v}
                    onChange={() => setSelectedDelivery(v)}
                    className="accent-red-600" />
                  <span className="w-3/9">{v}</span>
                  <span className="ml-6 text-sm text-left">{Fee[i]}</span>
                </label>
              ))}
            </div>

            {/* Payment summary */}
            <div className="w-full md:w-2/5 flex flex-col gap-5 shadow-xl p-5 rounded-xl">
              <h2 className="text-2xl font-semibold text-gray-600">Payment Summary</h2>
              <div className="flex text-gray-600 justify-between">
                <p>Subtotal:</p>
                <p className="font-semibold">₦{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex text-gray-600 justify-between">
                <p>Discount:</p>
                <p className="font-semibold">-₦{discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex text-gray-600 justify-between">
                <p>VAT(0%):</p>
                <p className="font-semibold">₦{vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex text-gray-600 justify-between">
                <p>Delivery Fee:</p>
                <p className="font-semibold">₦{deliveryFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex text-gray-600 justify-between">
                <p>Service Fee:</p>
                <p className="font-semibold">₦{serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex text-md text-gray-800 font-semibold justify-between">
                <p>Total Amount:</p>
                <p>₦{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="relative flex items-center">
                <img src={Discount} alt="Disacount Icon" className="w-8 absolute left-15" />
                <input type="text" placeholder="Apply Discount Code" className="w-full text-center py-3 bg-red-100 rounded-xl uppercase" />
              </div>
            </div>

          </div>
          <div className="flex flex-col justify-center items-center">
              <Link to="/">
                <button className="mx-auto py-3 px-30 mt-10 rounded cursor-pointer bg-red-600 text-white font-semibold hover:bg-red-800 transition transform active:scale-90">
                  Place Order
                </button>
              </Link>
              <Link to="/">
                <button className="mx-auto py-3 px-30 mt-5 rounded cursor-pointer  text-black font-semibold hover:bg-gray-300 transition transform active:scale-90">
                  Request for Quotation
                </button>
              </Link>
            </div>
            </>
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

export default Checkout;
