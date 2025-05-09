import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Paid from "./OrderDetails/Paid";
import Delivered from "./OrderDetails/Delivered";
import Dispatched from "./OrderDetails/Dispatched";
import Invoice from "./OrderDetails/Invoice";
import Processing from "./OrderDetails/Processing";

interface Order {
  orderId: number;
  status: string;
  // other order fields...
}

const OrderDetails = () => {
  const { orderIndex } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const foundOrder = data.orders[Number(orderIndex)];
        setOrder(foundOrder);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [orderIndex, navigate]);

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found.</p>;

  const status = order.status.toLowerCase();

  switch (status) {
    case "paid":
      return <Paid order={order.status} />;
    case "delivered":
      return <Delivered order={order.status} />;
    case "dispatched":
      return <Dispatched order={order.status} />;
    case "invoice":
      return <Invoice order={order.status} />;
    default:
      return <Processing order={order.status} />;
  }
};

export default OrderDetails;
