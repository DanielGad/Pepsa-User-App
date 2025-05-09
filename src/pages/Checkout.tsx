import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import Footer from "../components/Footer";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import Discount from "../assets/images/discount.png";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const Delivery = ["Vendor Delivery", "Self Pickup", "Pepsa Dispatch"];
  const Fee = ["₦6,000.00", "₦0.00", "₦5,000.00"];
  const [selectedDelivery, setSelectedDelivery] = useState(Delivery[0]);

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [message, setMessage] = useState("");

  const subtotal = cartItems.reduce((total, item) => {
    const variationPrice =
      item.product.Variation?.find(v => v.color === item.selectedVariation?.color)?.price;
    const unitPrice = variationPrice ?? item.product.price ?? 0;
    return total + unitPrice * item.quantity;
  }, 0);

  const deliveryFee = parseFloat(
    Fee[Delivery.indexOf(selectedDelivery)]?.replace(/[^0-9.]/g, "") || "0"
  );

  const discount = 1000;
  const serviceFee = 100;
  const vat = 0;

  const total = subtotal - discount + vat + serviceFee + deliveryFee;

  const handlePlaceOrder = async () => {
    try {
      setLoadingOrder(true);
      setMessage("");
  
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      const generateOrderId = () => Math.floor(10000000 + Math.random() * 90000000);
  
      const order = {
        orderId: generateOrderId(),
        status: "Paid",
        deliveryMethod: selectedDelivery,
        deliveryFee,
        discount,
        serviceFee,
        vat,
        subtotal,
        total,
        items: cartItems.map(item => {
          const unitPrice =
            item.product.Variation?.find(v => v.color === item.selectedVariation?.color)?.price ??
            item.product.price ?? 0;
  
          return {
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            selectedVariation: item.selectedVariation,
            unitPrice,
            image: item.product.image?.[0] ?? "",
          };
        }),
        createdAt: new Date().toISOString(),
      };
  
      const userResponse = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`
      );
  
      if (!userResponse.ok) throw new Error("User not found");
  
      const userData = await userResponse.json();
      const updatedOrders = [...(userData.orders || []), order];
  
      const updateResponse = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`,
        {
          method: "PUT", // Or PATCH if you prefer partial update
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userData, orders: updatedOrders }),
        }
      );
  
      if (!updateResponse.ok) throw new Error("Failed to update user with new order");
  
      setMessage("Order placed successfully!");
      setTimeout(() => navigate("/order-history"), 2000);
      clearCart();
    } catch (error) {
      console.error("Failed to place order:", error);
      setMessage("There was an error placing your order.");
    } finally {
      setLoadingOrder(false);
    }
  };


  const handleInvoice = async () => {
    try {
      setLoadingInvoice(true);
      setMessage("");
  
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }
  
      const order = {
        orderId: "",
        status: "Invoice",
        deliveryMethod: selectedDelivery,
        deliveryFee,
        discount,
        serviceFee,
        vat,
        subtotal,
        total,
        items: cartItems.map(item => {
          const unitPrice =
            item.product.Variation?.find(v => v.color === item.selectedVariation?.color)?.price ??
            item.product.price ?? 0;
  
          return {
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            selectedVariation: item.selectedVariation,
            unitPrice,
            image: item.product.image?.[0] ?? "",
          };
        }),
        createdAt: new Date().toISOString(),
      };
  
      const userResponse = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`
      );
  
      if (!userResponse.ok) throw new Error("User not found");
  
      const userData = await userResponse.json();
      const updatedOrders = [...(userData.orders || []), order];
  
      const updateResponse = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`,
        {
          method: "PUT", // Or PATCH if you prefer partial update
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userData, orders: updatedOrders }),
        }
      );
  
      if (!updateResponse.ok) throw new Error("Failed to update user with new order");
  
      setMessage("Invoice Requested successfully!");
      setTimeout(() => navigate("/order-history"), 2000);
      clearCart();
    } catch (error) {
      console.error("Failed to place order:", error);
      setMessage("There was an error placing your order.");
    } finally {
      setLoadingInvoice(false);
    }
  };

  
  

  return (
    <>
      <div className="p-4 md:p-6 md:mx-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 px-2 md:px-5">
          <h1 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Cart Items</h1>
          <button
            onClick={clearCart}
            className="text-white font-medium cursor-pointer bg-red-600 px-4 py-2 rounded-2xl hover:bg-red-800 transition transform active:scale-90"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-6">
          {cartItems.map((item, index) => {
            const unitPrice =
              item.product.Variation?.find(v => v.color === item.selectedVariation?.color)?.price ??
              item.product.price ?? 0;

            const totalPrice = unitPrice * item.quantity;

            return (
              <div
                key={`${item.product.id}-${item.selectedVariation?.color}-${index}`}
                className="flex flex-col md:flex-row items-center justify-between gap-4 shadow-md py-4 px-4 md:px-8 rounded-md"
              >
                <img
                  src={item.product.image?.[0] ?? ""}
                  alt={item.product.name}
                  className="w-32 h-32 md:w-40 md:h-40 object-cover rounded"
                />
                <div className="text-center md:text-left">
                  <p className="text-lg font-medium">
                    {item.quantity}× {item.product.name}
                  </p>
                  {item.selectedVariation && (
                    <p className="text-sm text-gray-500">{item.selectedVariation.color} color</p>
                  )}
                  <p className="text-gray-800 mt-1 text-sm">₦{unitPrice.toLocaleString()}</p>
                </div>

                <p className="text-red-700 font-bold mt-2 md:mt-0">
                  ₦{totalPrice.toLocaleString(undefined, {
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
            );
          })}
        </div>

        {cartItems.length > 0 ? (
          <>
            <div className="mt-10 flex flex-col md:flex-row justify-between gap-10 px-2 md:px-5">
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
                      className="accent-red-600"
                    />
                    <span className="w-3/9">{v}</span>
                    <span className="ml-6 text-sm text-left">{Fee[i]}</span>
                  </label>
                ))}
              </div>

              <div className="w-full md:w-2/5 flex flex-col gap-5 shadow-xl p-5 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-600">Payment Summary</h2>
                <div className="flex justify-between text-gray-600">
                  <p>Subtotal:</p>
                  <p className="font-semibold">₦{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex justify-between text-gray-600">
                  <p>Discount:</p>
                  <p className="font-semibold">-₦{discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex justify-between text-gray-600">
                  <p>VAT(0%):</p>
                  <p className="font-semibold">₦{vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex justify-between text-gray-600">
                  <p>Delivery Fee:</p>
                  <p className="font-semibold">₦{deliveryFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex justify-between text-gray-600">
                  <p>Service Fee:</p>
                  <p className="font-semibold">₦{serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex justify-between text-md text-gray-800 font-semibold">
                  <p>Total Amount:</p>
                  <p>₦{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="relative flex items-center">
                  <img src={Discount} alt="Discount Icon" className="w-6 absolute left-3" />
                  <input
                    type="text"
                    placeholder="Apply Discount Code"
                    className="w-full pl-10 text-center py-3 bg-red-100 rounded-xl uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center">
              <button
                onClick={handlePlaceOrder}
                disabled={loadingOrder}
                className="mx-auto py-3 px-10 mt-10 rounded cursor-pointer bg-red-600 text-white font-semibold hover:bg-red-800 transition transform active:scale-90"
              >
                {loadingOrder ? "Placing Order..." : "Place Order"}
              </button>
              <button
                onClick={handleInvoice}
                disabled={loadingInvoice}
                className="mx-auto py-3 px-10 mt-5 rounded cursor-pointer text-black font-semibold hover:bg-gray-300 transition transform active:scale-90"
              >
                {loadingInvoice ? "Processing..." : "Request for Quotation"}
              </button>
              {message && (
                <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
              )}
            </div>
          </>
        ) : (
          <div className="mt-10 text-center text-gray-600">
            <p>Your cart is empty. <Link to="/" className="text-red-600 underline">Continue shopping</Link>.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
