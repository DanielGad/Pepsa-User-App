import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

interface Order {
  deliveryMethod: string;
  deliveryFee: number;
  discount: number;
  serviceFee: number;
  vat: number;
  subtotal: number;
  total: number;
  createdAt: string;
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
        setError("Could not load order history.");
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Your Order History</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order, idx) => (
            <li
              key={order.createdAt}
              className="p-4 border rounded-lg hover:shadow"
            >
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Delivery:</span>{" "}
                {order.deliveryMethod}
              </p>
              <p>
                <span className="font-medium">Total:</span> ₦
                {order.total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
              <Link
                to={`/order-details/${idx}`}
                className="inline-block mt-2 text-red-600 hover:underline"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
