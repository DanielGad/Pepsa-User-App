import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import { ClipLoader } from "react-spinners";
import Order from "../../assets/images/order.png"
import { FaChevronDown, FaChevronUp, FaEye, FaPrint } from "react-icons/fa";

interface OrderItem {
  name: string;
  productId: number;
  quantity: number;
  image: string;
  orderId: number;
  selectedVariation: {
    color: string;
    price: number
  };
}

interface Order {
  orderId: number;
  deliveryMethod: string;
  deliveryFee: number;
  discount: number;
  serviceFee: number;
  vat: number;
  subtotal: number;
  total: number;
  createdAt: string;
  deliveryDate?: string;
  status: string;
  items: OrderItem[];
}

const Dispatched: React.FC = () => {
   const { orderId } = useParams<{ orderId: string }>();
   const navigate = useNavigate();
   const [order, setOrder] = useState<Order | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
     const [showPaymentSummary, setShowPaymentSummary] = useState(false);
   
     const togglePaymentSummary = () => {
     setShowPaymentSummary(prev => !prev);
   };

     const Delivery = ["Vendor Delivery", "Self Pickup", "Pepsa Dispatch"];
     const Fee = ["₦6,000.00", "₦0.00", "₦5,000.00"];
 
useEffect(() => {  
  if (!orderId) {
    setError("Order ID is missing.");
    setLoading(false);
    return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    navigate("/login");
    return;
  }

  fetch(`https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    })
    .then((userData) => {
      const orders: Order[] = userData.orders || [];

      const foundOrder = orders.find(
        (order) => order.orderId === Number(orderId)
      );

      if (!foundOrder) {
        throw new Error("Order not found");
      }

      setOrder(foundOrder);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error loading order:", err);
      setError("Could not load order details.");
      setLoading(false);
    });
}, [navigate, orderId]);
 
   if (loading) {
     return (
       <div className="flex justify-center items-center h-screen">
         <ClipLoader size={40} color="#E53E3E" />
         <div className="ml-3 text-[#E53E3E]">Please Wait...</div>
       </div>
     );
   }
 
   if (error) {
     return <p className="text-center text-red-600 mt-10">{error}</p>;
   }
 
   if (!order) {
     return null;
   }

  if (error) {
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  }

  if (!order) {
    return <p className="text-center text-red-600 mt-10">Order not found</p>;
  }

    function formatFullDate(dateStr: string): string {
    const date = new Date(dateStr);

    const weekday = date.toLocaleString("en-US", { weekday: "long" });
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHour = hours % 12 === 0 ? 12 : hours % 12;

    const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

    return `${weekday}, ${month} ${dayWithSuffix} ${year}. ${formattedHour}:${minutes}${ampm} `;
  }

    function getOrdinalSuffix(day: number): string {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return (
      <>
      <div className="lg:hidden mt-[-20px] mb-10 flex justify-center gap-2 text-sm bg-gray-200 py-1 relative">
          <Link to={"/"}><span>Home</span></Link> &gt;
          <Link to={"/account"}><span>My Account</span></Link> &gt;
          <Link to={"/order-history"}><span>My Orders</span></Link> &gt;
          <span>Dispatched</span> 
        </div>
        
      <div className="flex justify-between mt-[-20px] px-3 lg:px-20 bg-red-50 items-center">
        <img src={Order} alt="order image" className="lg:w-18 w-12"/>

        <div className="flex flex-col justify-center">
          <h2 className="font-semibold lg:text-xl">Order ID: {order.orderId}</h2>
          <p className="text-gray-500 text-[12px] lg:text-lg">{formatFullDate(order.createdAt)}</p>
        </div>

        <p className="lg:text-2xl font-semibold text-red-800 mr-5">{order.status}</p>
      </div>
      
      <p className="lg:hidden text-xl font-semibold text-red-800 mt-8 mx-5">Items</p>
      <div className="p-4 md:p-6 md:mx-20">
      <div key={order.orderId}>
        <div className="hidden lg:block space-y-6">
          {order.items.map((item, index) => {
            const itemPrice = item.selectedVariation.price * item.quantity

            return (
              <div
                key={`${item.productId}-${item.selectedVariation.color}-${index}`}
                className="flex flex-col md:flex-row items-center justify-between gap-4 shadow-md py-4 px-4 md:px-8 rounded-md"
              >
                <div className="">
                  <img
                  src={`/invoice/${item.image || Order}`}
                  alt={item.name}
                  className="w-32 h-32 md:w-40 md:h-40 object-cover rounded" />
                </div>

                <div className="text-center md:text-left">
                  <p className="text-lg font-medium">
                    {item.quantity}× {item.name}
                  </p>
                  {item.selectedVariation && (
                    <p className="text-sm text-gray-500">
                      {item.selectedVariation.color} color
                    </p>
                  )}
                  <p className="text-gray-800 mt-1 text-sm">
                    ₦{item.selectedVariation.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  </p>
                </div>

                <div className="text-red-700 font-bold mt-2 md:mt-0">
                  ₦{
                  
                  itemPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            );
          })}
        </div>


        {/* Mobile view */}
        <div className="lg:hidden space-y-6">
          {order.items.map((item, index) => {
            const itemPrice = item.selectedVariation.price * item.quantity

            return (
              <div
                key={`${item.productId}-${item.selectedVariation.color}-${index}`}
                className="flex items-center justify-between gap-4 shadow-md py-4 px-4 md:px-8 rounded-md"
              >
                <img
                  src={`/invoice/${item.image || Order}`}
                  alt={item.name}
                  className="w-25 h-25 object-cover rounded" />
                <div className="text-center ">
                  <p className="text-sm font-medium">
                    {item.quantity}× {item.name}
                  </p>
                  {item.selectedVariation && (
                    <p className="text-sm text-gray-500">
                      {item.selectedVariation.color} color
                    </p>
                  )}
                  <p className="text-gray-800 mt-1 text-sm">
                    (₦{item.selectedVariation.price.toLocaleString()})
                  </p>
                </div>

                <p className="text-red-700 text-sm font-bold mt-2 md:mt-0">
                  ₦{
                  itemPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            );
          })}
        </div>



        <div className="mt-10 flex flex-col md:flex-row justify-between gap-10 px-2 md:px-5">
          <div className="lg:hidden flex flex-col gap-5 text-gray-600 w-full md:w-3/5 shadow-xl p-5 rounded-xl">
            <h2 className="text-2xl font-semibold">Delivery Method</h2>
            {Delivery.map((v, i) => (
              <label key={v} className="flex space-x-3 mb-3 items-center">
                <input
                  type="radio"
                  name="delivery"
                  value={order.deliveryMethod}
                  checked={order.deliveryMethod === v}
                  onChange={() => { }}
                  className="accent-red-600"
                  readOnly />
                <span className="lg:w-3/9 w-full">{v}</span>
                <span className="ml-6 text-sm text-left">{Fee[i]}</span>
              </label>
            ))}
          </div>

          <div className="w-full md:w-3/5 flex flex-col gap-5 shadow-xl p-5 rounded-xl" onClick={togglePaymentSummary}>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-600">Payment Summary</h2>
              {showPaymentSummary ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
              </div>
              {showPaymentSummary && (
              <><div className="flex justify-between text-gray-600">
                  <p>Subtotal:</p>
                  <p className="font-semibold">
                    ₦{order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div><div className="flex justify-between text-gray-600">
                    <p>Discount:</p>
                    <p className="font-semibold">
                      -₦{order.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div><div className="flex justify-between text-gray-600">
                    <p>VAT(0%):</p>
                    <p className="font-semibold">
                      ₦{order.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div><div className="flex justify-between text-gray-600">
                    <p>Delivery Fee:</p>
                    <p className="font-semibold">
                      ₦{order.deliveryFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div><div className="flex justify-between text-gray-600">
                    <p>Service Fee:</p>
                    <p className="font-semibold">
                      ₦{order.serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div></>
              )}
              <div className="flex justify-between text-md text-gray-800 font-semibold">
                    <p>Total Amount:</p>
                    <p>
                      ₦{order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
            </div>

            <div className="mt-8 pt-4 lg:w-1/2">
              <h3 className="text-xl font-semibold text-red-700 mb-4">Transaction Terms</h3>
              <div className="space-y-3 text-sm text-gray-800">
                {/* Terms and Conditions */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-lg">Terms and Conditions</span>
                  <FaEye className="text-gray-600 cursor-pointer" />
                </div>

                {/* Delivery Details */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-lg">Delivery Details</span>
                  <FaEye className="text-gray-600 cursor-pointer" />
                </div>

                {/* Payment Details */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-lg">Payment Details</span>
                  <FaEye className="text-gray-600 cursor-pointer" />
                </div>

                {/* Order Status */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-lg">Order Status</span>
                  <FaChevronDown className="text-gray-600 cursor-pointer" />
                </div>

                {/* Print Details */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-lg">Print Details</span>
                  <FaPrint className="text-gray-600 cursor-pointer" />
                </div>
              </div>
              </div>

        </div>
              <div className="flex flex-col justify-center items-center">
                <button
              className="lg:w-1/3 w-full flex bg-red-600 text-white cursor-pointer px-15 py-3 mt-5 justify-center rounded-xl transition hover:bg-red-800 font-semibold text-lg"
              >Cancel Order</button>

              <button
              className="lg:w-1/3 w-full flex  text-gray-400 cursor-pointer px-15 py-3 mt-3 justify-center rounded-xl transition hover:bg-gray-400 hover:text-gray-500"
              >Report Transaction</button>
              </div>
      </div>
    </div><Footer /></>
  );
};

export default Dispatched;
