import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

interface Item {
  productId: number;
  name: string;
  quantity: number;
  selectedVariation: { color: string; price: number };
  unitPrice: number;
  image: string;
}

interface Order {
  deliveryMethod: string;
  deliveryFee: number;
  discount: number;
  serviceFee: number;
  vat: number;
  subtotal: number;
  total: number;
  createdAt: string;
  items: Item[];
}

const OrderDetails: React.FC = () => {
  const { orderIndex } = useParams<{ orderIndex: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Order Details</h1>
      <p>
        <span className="font-medium">Date:</span>{" "}
        {new Date(order.createdAt).toLocaleString()}
      </p>
      <p>
        <span className="font-medium">Delivery Method:</span>{" "}
        {order.deliveryMethod}
      </p>
      <p>
        <span className="font-medium">Delivery Fee:</span> ₦
        {order.deliveryFee.toLocaleString()}
      </p>
      <p>
        <span className="font-medium">Discount:</span> ₦
        {order.discount.toLocaleString()}
      </p>
      <p>
        <span className="font-medium">Service Fee:</span> ₦
        {order.serviceFee.toLocaleString()}
      </p>
      <p>
        <span className="font-medium">VAT:</span> ₦
        {order.vat.toLocaleString()}
      </p>
      <p>
        <span className="font-medium">Subtotal:</span> ₦
        {order.subtotal.toLocaleString()}
      </p>
      <p className="text-lg font-semibold">
        Total: ₦{order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Items</h2>
      <ul className="space-y-4">
        {order.items.map((item, i) => (
          <li key={i} className="flex items-center gap-4 border p-4 rounded-lg">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-medium">{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Unit Price: ₦{item.unitPrice.toLocaleString()}</p>
              <p>
                Total: ₦
                {(item.unitPrice * item.quantity).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Link to="/order-history" className="inline-block mt-6 text-red-600 hover:underline">
        ← Back to Order History
      </Link>
    </div>
  );
};

export default OrderDetails;
