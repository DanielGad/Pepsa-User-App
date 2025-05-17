import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import { ClipLoader } from "react-spinners";
import Order from "../../assets/images/order.png";
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaExclamationCircle, FaEye, FaPrint, FaTrashAlt } from "react-icons/fa";
import Discount from "../../assets/images/discount.png"
import { getUserId } from "../../components/CartContext";
import useAutoLogout from "../../components/AutoLogout";

interface OrderItem {
  name: string;
  productId: number;
  quantity: number;
  image: string;
  orderId: number;
  invoiceId?: number;
  selectedVariation: {
    color: string;
    price: number;
  };
}

interface Order {
  orderId: number;
  invoiceId?: number;
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
  useAutoLogout()
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [Buttonloading, setButtonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempOrder, setTempOrder] = useState<Order | null>(null);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const togglePaymentSummary = () => {
  setShowPaymentSummary(prev => !prev);
};


  const Delivery = ["Vendor Delivery", "Self Pickup", "Pepsa Dispatch"];
  const Fee = [6000, 0, 5000];

    useEffect(() => {
      if (error || success) {
        const t = setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 2000);
        return () => clearTimeout(t);
      }
    }, [error, success]);

  useEffect(() => {
    if (!invoiceId) {
      setError("Invoice ID is missing");
      setLoading(false);
      return;
    }

    const userId = getUserId();
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchOrderData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`
        );
        
        if (!response.ok) throw new Error("Failed to fetch user data");
        
        const userData = await response.json();
        const orders: Order[] = userData.orders || [];
        const targetId = Number(invoiceId);

        // console.log("Searching for invoice:", targetId);
        // console.log("Available orders:", orders.map(o => ({
        //   orderId: o.orderId,
        //   invoiceId: o.invoiceId,
        //   status: o.status
        // })));

        // First try to find by invoiceId
        let foundOrder = orders.find(o => o.invoiceId === targetId);

        // If not found, try by orderId
        if (!foundOrder) {
          console.warn("No order found with invoiceId, trying orderId fallback");
          foundOrder = orders.find(o => o.orderId === targetId);
        }

        if (!foundOrder) {
          throw new Error(`No order found with ID: ${targetId}`);
        }

        // Verify the found order matches the requested ID
        if (foundOrder.invoiceId !== targetId && foundOrder.orderId !== targetId) {
          throw new Error("ID mismatch in found order");
        }

        const orderWithImages = {
          ...foundOrder,
          items: foundOrder.items.map(item => ({
            ...item,
            image: item.image || Order
          }))
        };

        setOrder(orderWithImages);
        setTempOrder(orderWithImages);
      } catch (err) {
            const message = (err as Error).message;

    if (
      message.includes("Failed to fetch") ||
      message.includes("ERR_NAME_NOT_RESOLVED") ||
      message.includes("NetworkError") ||
      message.includes("No internet")
    ) {
      setError("No internet connection, please try again.");
    } else {
      setError(message || "Error loading invoice");
    }
        console.error("Error loading invoice:", err);
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [invoiceId, navigate]);

  // Add ID verification before rendering
  useEffect(() => {
    if (order && invoiceId) {
      const numericInvoiceId = Number(invoiceId);
      if (order.invoiceId !== numericInvoiceId && order.orderId !== numericInvoiceId) {
        console.error("ID MISMATCH DETECTED", {
          urlInvoiceId: numericInvoiceId,
          orderInvoiceId: order.invoiceId,
          orderId: order.orderId
        });
        setError("Data mismatch detected - wrong order loaded");
      }
    }
  }, [order, invoiceId]);

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
    if (!tempOrder || !invoiceId) return;
    
    // Verify we're working with the correct invoice
    const numericInvoiceId = Number(invoiceId);
    if (tempOrder.invoiceId !== numericInvoiceId && tempOrder.orderId !== numericInvoiceId) {
      setError("Cannot save - invoice mismatch detected");
      console.error("Trying to save wrong invoice!", {
        expected: numericInvoiceId,
        actualInvoiceId: tempOrder.invoiceId,
        actualOrderId: tempOrder.orderId
      });
      return;
    }

    try {
      setButtonLoading(true);
      setError(null);
  
      const userId = getUserId();
      if (!userId) {
        navigate("/login");
        return;
      }
  
      const userResponse = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`
      );
      
      if (!userResponse.ok) throw new Error("User not found");
      
      const userData = await userResponse.json();
      const orders: Order[] = userData.orders || [];

      // Find the existing order/invoice
      const orderIndex = orders.findIndex(o => 
        o.invoiceId === numericInvoiceId || o.orderId === numericInvoiceId
      );
      
      if (orderIndex === -1) throw new Error("Order not found in user data");
      
      const updatedOrder = {
        ...tempOrder,
        orderId: tempOrder.orderId || numericInvoiceId, // Use existing orderId or invoiceId
        status: "Paid",
        updatedAt: new Date().toISOString(),
        invoiceId: undefined // Remove invoiceId as it's now a proper order
      };
      
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = updatedOrder;
      
      const updateResponse = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userData, orders: updatedOrders }),
        }
      );
      
      if (!updateResponse.ok) throw new Error("Failed to update order");
      
      setOrder(updatedOrder);
      setTempOrder(updatedOrder);
      setSuccess("Order placed successfully!")
      
      // alert("Order placed successfully!");
        navigate("/order-history");
      handleDeleteInvoice();
    } catch (err) {
          const message = (err as Error).message;

    if (
      message.includes("Failed to fetch") ||
      message.includes("ERR_NAME_NOT_RESOLVED") ||
      message.includes("NetworkError") ||
      message.includes("No internet")
    ) {
      setError("No internet connection");
    } else {
      setError(message || "Failed to place order");
    }
      console.error("Failed to place order:", err);
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setButtonLoading(false)
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async () => {

    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        navigate("/login");
        return;
      }

      // Fetch current user data
      const response = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`
      );
      const userData = await response.json();
      
      // Filter out the current invoice
      const updatedOrders = userData.orders.filter(
        (o: Order) => o.invoiceId !== Number(invoiceId) && o.orderId !== Number(invoiceId)
      );

      // Update user data
      const updateResponse = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userData, orders: updatedOrders }),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to delete invoice");
      
      navigate("/order-history");
    } catch (err) {
          const message = (err as Error).message;

    if (
      message.includes("Failed to fetch") ||
      message.includes("ERR_NAME_NOT_RESOLVED") ||
      message.includes("NetworkError") ||
      message.includes("No internet")
    ) {
      setError("No internet connection");
    } else {
      setError(message || "Error deleting order");
    }
      console.error("Error deleting invoice:", err);
      setError("Failed to delete invoice");
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
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 rounded"
        >
          Refresh
        </button>
      </div>
    );
  }

  if (!order || !tempOrder) {
    return <p className="text-center text-red-600 mt-10">Order not found</p>;
  }

  // Final verification before render
  const numericInvoiceId = Number(invoiceId);
  if (order.invoiceId !== numericInvoiceId && order.orderId !== numericInvoiceId) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">Data mismatch detected</p>
        <p>URL ID: {numericInvoiceId}</p>
        <p>Order ID: {order.orderId}</p>
        <p>Invoice ID: {order.invoiceId}</p>
      </div>
    );
  }

  return (
    <>
     {success && (
                    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2 z-50">
                      <FaCheckCircle /> {success}
                    </div>
                  )}
                  {error && (
                    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2 z-50">
                      <FaExclamationCircle /> {error}
                    </div>
                  )}
      <div className="lg:hidden mt-[-20px] mb-10 flex justify-center gap-2 text-sm bg-gray-200 py-1 relative">
          <Link to={"/"}><span>Home</span></Link> &gt;
          <Link to={"/account"}><span>My Account</span></Link> &gt;
          <Link to={"/order-history"}><span>My Orders</span></Link> &gt;
          <span>Invoice</span> 
        </div>

      <div className="flex justify-between mx-5 lg:mx-20 items-center lg:text-2xl text-xl">
        <p className="font-semibold">Items</p>
        <button
            onClick={handleDeleteInvoice}
            className="p-2 text-red-600 hover:text-red-800 transition-colors cursor-pointer font-semibold"
            title="Clear Cart"
            disabled={loading}
          >
            Clear cart
          </button>
      </div>
      
      <div className="p-4 md:p-6 md:mx-20">
        <div key={tempOrder.orderId}>
          <div className="hidden lg:block space-y-6">
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
                    <div className="text-lg font-medium">
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
                    </div>
                    {item.selectedVariation && (
                      <p className="text-sm text-gray-500">
                        {item.selectedVariation.color} color
                      </p>
                    )}
                    <p className="text-gray-800 mt-1 text-sm">
                      ₦{item.selectedVariation.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-20">
                    <p className="text-red-700 font-bold mt-2 md:mt-0">
                      ₦{totalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                      <button
                      onClick={() => handleRemoveItem(index)}
                      className="flex items-center gap-2 text-sm text-red-600 border border-red-600 px-2 py-2 rounded-md cursor-pointer hover:text-red-800 transition-all"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>


          {/* Mobile view */}
          <div className="lg:hidden space-y-6">
            {tempOrder.items.map((item, index) => {
              const totalPrice = item.selectedVariation.price * item.quantity;

              return (
                <div
                    key={`${item.productId}-${item.selectedVariation?.color}-${index}`}
                    className="flex flex-row items-center justify-between gap-4 shadow-md py-4 px-2 md:px-8 rounded-md"
                  >
                    <div className="">
                      <img
                      src={`/invoice/${item.image || Order}`}
                      alt={item.name}
                      className="w-25 h-25 object-cover rounded-xl"
                    />
                    </div>
      
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">
                        {item.quantity}× {item.name}
                      </p>
                      
                      <div className="text-sm">
                        {item.selectedVariation && (
                        <p className="text-sm text-gray-500">
                          {item.selectedVariation.color} color
                        </p>
                      )}
                      <p className="text-sm">(₦
                      {item.selectedVariation.price.toLocaleString()}
                      )</p>
                      </div>
      
                      <div className="flex items-center gap-2 text-sm">
                        <button
                          onClick={() => handleQuantityChange(index, item.quantity - 1)}
                          className="border text-sm cursor-pointer border-red-600 px-2 rounded text-red-600 hover:bg-red-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(index, item.quantity + 1)}
                          className="border text-sm cursor-pointer border-red-600 px-2 rounded text-red-600 hover:bg-red-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
      
                    <div className="flex flex-col gap-8 justify-center items-center">
                        <p className="text-red-700 text-sm font-bold mt-2 md:mt-0">
                      ₦{totalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
      
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="flex items-center gap-2 text-sm text-red-600 border border-red-600 px-2 py-2 rounded-md cursor-pointer hover:text-red-800 transition-all"
                    >
                      <FaTrashAlt />
                    </button>
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
                  />
                  <span className="w-full lg:w-3/9">{v}</span>
                  <span className="ml-6 text-sm text-left">
                    ₦{Fee[i].toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </label>
              ))}
            </div>

            <div className="w-full md:w-3/5 flex flex-col gap-5 shadow-xl p-5 rounded-xl" >
              <div className="flex flex-col gap-5 shadow-xl p-5 rounded-xl" onClick={togglePaymentSummary}>
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
                    ₦{tempOrder.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div><div className="flex justify-between text-gray-600">
                    <p>Discount:</p>
                    <p className="font-semibold">
                      -₦{tempOrder.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div><div className="flex justify-between text-gray-600">
                    <p>VAT(0%):</p>
                    <p className="font-semibold">
                      ₦{tempOrder.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div><div className="flex justify-between text-gray-600">
                    <p>Delivery Fee:</p>
                    <p className="font-semibold">
                      ₦{tempOrder.deliveryFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div><div className="flex justify-between text-gray-600">
                    <p>Service Fee:</p>
                    <p className="font-semibold">
                      ₦{tempOrder.serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div></>
              )}
              <div className="flex justify-between text-md text-gray-800 font-semibold">
                    <p>Total Amount:</p>
                    <p>
                      ₦{tempOrder.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
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
            
            <div className="pt-4 lg:w-1/2 p-5 rounded-2xl shadow-md">
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
        </div>

        {/* Buttons moved to bottom */}
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
            <div className="flex flex-col gap-4">
              <button
                onClick={handleSaveChanges}
                className={`px-20 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-lg font-medium ${
                  Buttonloading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={Buttonloading}
              >
                {Buttonloading ? <ClipLoader size={20} color="#FFFFFF" />  : "Place Order"}
              </button>
                </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Invoice;