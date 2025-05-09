import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { ClipLoader } from "react-spinners";
import Order from "../../assets/images/order.png";

dayjs.extend(advancedFormat);

interface OrderItem {
  name: string;
  productId: number;
  quantity: number;
  image: string;
  orderId: number;
  selectedVariation: {
    color: string;
    price: number;
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

const Invoice: React.FC = () => {
  const { orderIndex } = useParams<{ orderIndex: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempOrder, setTempOrder] = useState<Order | null>(null);

  const Delivery = ["Vendor Delivery", "Self Pickup", "Pepsa Dispatch"];
  const Fee = [6000, 0, 5000];

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
        
        const orderWithUnitPrices = {
          ...orders[idx],
          items: orders[idx].items.map(item => ({
            ...item,
            // Ensure image path is correct
            image: item.image || Order // Fallback to default image if not provided
          }))
        };
        
        setOrder(orderWithUnitPrices);
        setTempOrder(orderWithUnitPrices);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load order details.");
        setLoading(false);
      });
  }, [navigate, orderIndex]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setTempOrder(order);
    }
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (!tempOrder || newQuantity < 1) return;
    
    const updatedItems = [...tempOrder.items];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: newQuantity
    };
    
    const newSubtotal = updatedItems.reduce(
      (sum, item) => sum + (item.selectedVariation.price * item.quantity), 0);
    
    const deliveryIndex = Delivery.indexOf(tempOrder.deliveryMethod);
    const deliveryFee = deliveryIndex >= 0 ? Fee[deliveryIndex] : 0;
    
    const newTotal = newSubtotal - tempOrder.discount + tempOrder.vat + 
                     deliveryFee + tempOrder.serviceFee;
    
    setTempOrder({
      ...tempOrder,
      items: updatedItems,
      subtotal: newSubtotal,
      total: newTotal
    });
  };

  const handleDeliveryChange = (method: string) => {
    if (!tempOrder) return;
    
    const deliveryIndex = Delivery.indexOf(method);
    const deliveryFee = deliveryIndex >= 0 ? Fee[deliveryIndex] : 0;
    
    const newTotal = tempOrder.subtotal - tempOrder.discount + tempOrder.vat + 
                     deliveryFee + tempOrder.serviceFee;
    
    setTempOrder({
      ...tempOrder,
      deliveryMethod: method,
      deliveryFee: deliveryFee,
      total: newTotal
    });
  };

  const handleRemoveItem = (index: number) => {
    if (!tempOrder) return;
    
    const updatedItems = [...tempOrder.items];
    updatedItems.splice(index, 1);
    
    if (updatedItems.length === 0) {
      const newTotal = tempOrder.serviceFee;
      setTempOrder({
        ...tempOrder,
        items: updatedItems,
        subtotal: 0,
        total: newTotal
      });
      return;
    }
    
    const newSubtotal = updatedItems.reduce(
      (sum, item) => sum + (item.selectedVariation.price * item.quantity), 0);
    
    const deliveryIndex = Delivery.indexOf(tempOrder.deliveryMethod);
    const deliveryFee = deliveryIndex >= 0 ? Fee[deliveryIndex] : 0;
    
    const newTotal = newSubtotal - tempOrder.discount + tempOrder.vat + 
                     deliveryFee + tempOrder.serviceFee;
    
    setTempOrder({
      ...tempOrder,
      items: updatedItems,
      subtotal: newSubtotal,
      total: newTotal
    });
  };

  const handleSaveChanges = async () => {
    if (!tempOrder) return;
    
    try {
      setLoading(true);
      setError(null);
  
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }
  
      // First, fetch the current user data
      const userResponse = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`
      );
      
      if (!userResponse.ok) throw new Error("User not found");
      
      const userData = await userResponse.json();
      const orders: Order[] = userData.orders || [];

      const generateOrderId = () => Math.floor(10000000 + Math.random() * 90000000);

      
      // Find the index of the order we're updating
      const orderIndex = orders.findIndex(o => o.orderId === tempOrder.orderId);
      if (orderIndex === -1) throw new Error("Order not found in user data");
      
      // Create the updated order with Processing status
      const updatedOrder = {
        ...tempOrder,
        status: "Processing",
        orderId: generateOrderId(),
        updatedAt: new Date().toISOString() // Add update timestamp
      };
      
      // Update the orders array
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = updatedOrder;
      
      // Send the update to the server
      const updateResponse = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userData, orders: updatedOrders }),
        }
      );
      
      if (!updateResponse.ok) throw new Error("Failed to update order");
      
      // Update local state
      setOrder(updatedOrder);
      setTempOrder(updatedOrder);
      setIsEditing(false);
      
      // Show success message
      alert("Order Placed Successfully!");
      navigate("/order-history")
    } catch (err) {
      console.error("Failed to update order:", err);
      setError("There was an error updating your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

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

  if (!order || !tempOrder) {
    return <p className="text-center text-red-600 mt-10">Order not found</p>;
  }

  return (
    <>
      <div className="flex justify-between px-4 md:px-20 bg-red-50 items-center py-4">
        <img src={Order} alt="order" className="w-16 h-16 object-contain" />

        <div className="flex flex-col justify-center">
          <h2 className="font-semibold text-lg md:text-xl">Order ID: {tempOrder.orderId}</h2>
          <p className="text-gray-500 text-sm md:text-lg">
            {dayjs(tempOrder.createdAt).format("Do MMMM YYYY")}
          </p>
        </div>

        <p className="text-lg md:text-2xl font-semibold text-red-800">
          {tempOrder.status}
        </p>
      </div>
      
      <div className="p-4 md:p-6 md:mx-20">
        <div key={tempOrder.orderId}>
          <div className="space-y-6">
            {tempOrder.items.map((item, index) => {
              const totalPrice = item.selectedVariation.price * item.quantity;

              return (
                <div
                  key={`${item.productId}-${item.selectedVariation.color}-${index}`}
                  className="flex flex-col md:flex-row items-center justify-between gap-4 shadow-md py-4 px-4 md:px-8 rounded-md"
                >
                  <img
                    src={`/invoice/${item.image || Order}`} // Fallback to default image if not provided
                    alt={item.name}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = Order; // Fallback if image fails to load
                    }}
                  />
                  <div className="text-center md:text-left">
                    <p className="text-lg font-medium">
                      {isEditing ? (
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleQuantityChange(index, item.quantity - 1)}
                            className="px-2 bg-gray-200 rounded"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(index, item.quantity + 1)}
                            className="px-2 bg-gray-200 rounded"
                          >
                            +
                          </button>
                          <span className="ml-2">× {item.name}</span>
                        </div>
                      ) : (
                        `${item.quantity}× ${item.name}`
                      )}
                    </p>
                    {item.selectedVariation && (
                      <p className="text-sm text-gray-500">
                        {item.selectedVariation.color} color
                      </p>
                    )}
                    <p className="text-gray-800 mt-1 text-sm">
                      ₦{item.selectedVariation.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-red-700 font-bold mt-2 md:mt-0">
                      ₦{totalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    {isEditing && (
                      <button 
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
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
                    value={v}
                    checked={tempOrder.deliveryMethod === v}
                    onChange={() => handleDeliveryChange(v)}
                    className="accent-red-600"
                    disabled={!isEditing}
                  />
                  <span className="w-3/9">{v}</span>
                  <span className="ml-6 text-sm text-left">
                    ₦{Fee[i].toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </label>
              ))}
            </div>

            <div className="w-full md:w-3/5 flex flex-col gap-5 shadow-xl p-5 rounded-xl">
              <h2 className="text-2xl font-semibold text-gray-600">Payment Summary</h2>
              <div className="flex justify-between text-gray-600">
                <p>Subtotal:</p>
                <p className="font-semibold">
                  ₦{tempOrder.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex justify-between text-gray-600">
                <p>Discount:</p>
                <p className="font-semibold">
                  -₦{tempOrder.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex justify-between text-gray-600">
                <p>VAT(0%):</p>
                <p className="font-semibold">
                  ₦{tempOrder.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex justify-between text-gray-600">
                <p>Delivery Fee:</p>
                <p className="font-semibold">
                  ₦{tempOrder.deliveryFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex justify-between text-gray-600">
                <p>Service Fee:</p>
                <p className="font-semibold">
                  ₦{tempOrder.serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex justify-between text-md text-gray-800 font-semibold">
                <p>Total Amount:</p>
                <p>
                  ₦{tempOrder.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons moved to bottom */}
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
          {isEditing ? (
            <div className="flex flex-col gap-5">
              <button
                onClick={handleSaveChanges}
                className="px-20 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-lg font-medium cursor-pointer"
              >
                  Place Order
                </button>
              <button 
                onClick={handleEditToggle}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-lg font-medium"
              >
                Cancel Changes
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <button
                onClick={handleSaveChanges}
                className="px-20 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-lg font-medium cursor-pointer"
              >
                  Place Order
                </button>
            <button
                onClick={handleEditToggle}
                className="px-6 py-3 text-red-700 rounded-lg hover:text-gray-700 text-lg font-medium cursor-pointer"
              >
                Edit Order
              </button>
                </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Invoice;