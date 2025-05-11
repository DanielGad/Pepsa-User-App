import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import Footer from "../components/Footer";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import Discount from "../assets/images/discount.png"

const MobileCheckout = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [message, setMessage] = useState("");

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
  
      clearCart();
      setMessage("Order placed successfully!");
      setTimeout(() => navigate("/order-history"), 2000);
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

      const generateInvoiceId = () => Math.floor(10000000 + Math.random() * 90000000);

  
      const order = {
        orderId: "",
        invoiceId: generateInvoiceId(),
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
  
      clearCart();
      setMessage("Invoice Requested successfully!");
      setTimeout(() => navigate("/order-history"), 2000);
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
        <div className="flex flex-row md:flex-row items-center justify-between mb-4 px-2 md:px-5">
          <h1 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Cart Items</h1>
          <button
            onClick={() => clearCart()}
            className="text-white font-medium cursor-pointer bg-red-600 px-4 py-2 rounded-2xl hover:bg-red-800 transition transform active:scale-90"
          >
            Clear Cart
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
                  <span className="w-4/9">{v}</span>
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
                <img src={Discount} alt="Disacount Icon" className="w-7 absolute left-5" />
                <input type="text" placeholder="Apply Discount Code" className="w-full text-center py-3 bg-red-100 rounded-xl uppercase" />
              </div>
            </div>

          </div>
          <div className="flex flex-col justify-center items-center">
              <Link to="/">
                <button className="mx-auto py-3 px-30 mt-10 rounded cursor-pointer bg-red-600 text-white font-semibold hover:bg-red-800 transition transform active:scale-90" onClick={handlePlaceOrder}>
                  {loadingOrder ? "Placing Order..." : message || "Place Order"}
                </button>
              </Link>
              <Link to="/">
                <button className="mx-auto py-3 px-10 mt-5 rounded cursor-pointer  text-black font-semibold hover:bg-gray-300 transition transform active:scale-90" onClick={handleInvoice}>
                  {loadingInvoice ? "Processing..." : message || "Request for Quotation"}
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

export default MobileCheckout;
