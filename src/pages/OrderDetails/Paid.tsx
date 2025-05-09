import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { ClipLoader } from "react-spinners";
import Order from "../../assets/images/order.png"

dayjs.extend(advancedFormat);

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

const Paid: React.FC = () => {
   const { orderIndex } = useParams<{ orderIndex: string }>();
   const navigate = useNavigate();
   const [order, setOrder] = useState<Order | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

     const Delivery = ["Vendor Delivery", "Self Pickup", "Pepsa Dispatch"];
     const Fee = ["₦6,000.00", "₦0.00", "₦5,000.00"];
 
   useEffect(() => {
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
         const idx = parseInt(orderIndex ?? "", 10);
         const orders: Order[] = userData.orders || [];
         if (isNaN(idx) || idx < 0 || idx >= orders.length) {
           throw new Error("Order not found");
         }
         setOrder(orders[idx]);
         setLoading(false);
       })
       .catch((err) => {
         console.error(err);
         setError("Could not load order details.");
         setLoading(false);
       });
   }, [navigate, orderIndex]);
 
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

  return (
      <>
      <div className="flex justify-between lg:px-20 bg-red-50 items-center">
        <img src={Order} alt="order image" className="w-18"/>

        <div className="flex flex-col justify-center">
          <h2 className="font-semibold text-x">Order ID: {order.orderId}</h2>
          <p className="text-gray-500 text-lg">{dayjs(order.createdAt).format("Do MMMM YYYY")}</p>
        </div>

        <p className="text-2xl font-semibold text-red-800 mr-5">{order.status}</p>
      </div>
      
      <div className="p-4 md:p-6 md:mx-20">
      <div key={order.orderId}>
        <div className="space-y-6">
          {order.items.map((item, index) => {
            const itemPrice = item.selectedVariation.price * item.quantity

            return (
              <div
                key={`${item.productId}-${item.selectedVariation.color}-${index}`}
                className="flex flex-col md:flex-row items-center justify-between gap-4 shadow-md py-4 px-4 md:px-8 rounded-md"
              >
                <img
                  src={`/invoice/${item.image || Order}`}
                  alt={item.name}
                  className="w-32 h-32 md:w-40 md:h-40 object-cover rounded" />
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

                <p className="text-red-700 font-bold mt-2 md:mt-0">
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
          <div className="flex flex-col gap-5 text-gray-600 w-full md:w-3/5 shadow-xl p-5 rounded-xl">
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
                <span className="w-3/9">{v}</span>
                <span className="ml-6 text-sm text-left">{Fee[i]}</span>
              </label>
            ))}
          </div>

          <div className="w-full md:w-3/5 flex flex-col gap-5 shadow-xl p-5 rounded-xl">
            <h2 className="text-2xl font-semibold text-gray-600">Payment Summary</h2>
            <div className="flex justify-between text-gray-600">
              <p>Subtotal:</p>
              <p className="font-semibold">
                ₦{order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex justify-between text-gray-600">
              <p>Discount:</p>
              <p className="font-semibold">
                -₦{order.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex justify-between text-gray-600">
              <p>VAT(0%):</p>
              <p className="font-semibold">
                ₦{order.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex justify-between text-gray-600">
              <p>Delivery Fee:</p>
              <p className="font-semibold">
                ₦{order.deliveryFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex justify-between text-gray-600">
              <p>Service Fee:</p>
              <p className="font-semibold">
                ₦{order.serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex justify-between text-md text-gray-800 font-semibold">
              <p>Total Amount:</p>
              <p>
                ₦{order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div><Footer /></>
  );
};

export default Paid;
