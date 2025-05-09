import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Bag from "../assets/images/bags.png"
import Footer from "../components/Footer";

interface OrderItem {
  name: string;
  productId: number;
  quantity: number;
  image: string;
  selectedVariation: {
    color: string;
  };
}

interface Order {
  orderId: number;
  status: string;
  deliveryDate?: string;
  deliveryMethod: string;
  deliveryFee: number;
  discount: number;
  serviceFee: number;
  vat: number;
  subtotal: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setOrders(userData.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No internet connection, Kindly check your internet and try again");
        setLoading(false);
      });
  }, [navigate]);

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
  
    return `${weekday} ${month} ${dayWithSuffix} ${year}, ${formattedHour}:${minutes}${ampm}`;
  }
  
  function getOrdinalSuffix(day: number): string {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }
  

  return (
    <><div className="lg:p-6 lg:mx-20 mb-10">

      <div className="lg:hidden mt-[-20px] mb-10 flex justify-center gap-2 text-sm bg-gray-200 py-1 relative">
        <Link to={"/"}><span className="">Home</span></Link>
         &gt; 
         <Link to={"/account"}><span className="">My Account</span></Link>
      </div>

      <h1 className="hidden lg:block text-2xl font-semibold">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-5 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {orders.map((order, idx) => (
            <div key={idx} onClick={() => {
              const status = order.status.toLowerCase();
            
              // Define which route to go based on status
              switch (status) {
                case "paid":
                  navigate(`/orders/paid/${idx}`);
                  break;
                case "dispatched":
                  navigate(`/orders/dispatched/${idx}`);
                  break;
                case "delivered":
                  navigate(`/orders/delivered/${idx}`);
                  break;
                case "invoice":
                  navigate(`/orders/invoice/${idx}`);
                  break;
                default:
                  navigate(`/orders/${idx}`); // fallback or generic OrderDetails
              }
            }}
             >
              <div className="p-6 border-2 border-gray-200 rounded-lg hover:shadow-xl">
                <div className="grid lg:flex gap-5">
                  <div className="lg:w-1/2 w-2/2">
                    <img src={Bag} alt="bag" className="w-40 h-auto rounded-2xl" />
                  </div>

                  <div>
                    <h1 className="font-bold text-2xl">Diadem Luxury</h1>
                    <p className="text-gray-500 text-sm">
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <p className="text-gray-500 text-sm">
                      <span className="font-medium">Items:</span>{" "}
                      {(() => {
                        const firstTwoItems = order.items.slice(0, 2);
                        const remainingCount = order.items.length - 2;

                        const itemText = firstTwoItems.map((item) => {
                          const quantity = item.quantity;
                          const color = item.selectedVariation?.color || "unknown";
                          const name = item.name;

                          return `${quantity}pcs of ${color} ${name}`;
                        }).join(", ");

                        return (
                          <>
                            {itemText}
                            {remainingCount > 0 && ` and ${remainingCount} other item${remainingCount > 1 ? "s" : ""}`}
                          </>
                        );
                      })()}
                    </p>

                    <p className="text-gray-500 text-sm">
                      <span className="font-medium">Delivery Method:</span>{" "}
                      {order.deliveryMethod}
                    </p>

                    <p>
                      <span className="font-medium">Total:</span> ₦
                      {order.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-blace font-semibold mt-3">Order ID: {order.orderId || ""}</div>

                <p className={`mt-2 font-semibold ${order.status === "Delivered" ? "text-red-800" : "text-red-800"}`}>
                {order.status}
                {order.status === "Delivered" && order.deliveryDate && (
                  <>
                    {" on "}
                    {formatFullDate(order.deliveryDate)}
                  </>
                )}
              </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div><Footer /></>
  );
};

export default OrderHistory;
