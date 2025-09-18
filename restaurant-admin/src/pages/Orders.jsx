// Orders.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchOrders = async () => {
    try {
      // This endpoint doesn't exist yet in your API - you'll need to create it
      const response = await axios.get("https://snap-dish.onrender.com/api/orders", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      // This endpoint doesn't exist yet in your API - you'll need to create it
      const response = await axios.put(
        `https://snap-dish.onrender.com/api/orders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      
      if (response.data.success) {
        // Refresh orders after update
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

      {/* Pending Orders */}
      <h3 className="text-xl font-semibold mb-3">Pending Orders</h3>
      <div className="space-y-4 mb-8">
        {orders
          .filter((order) => order.status === "pending")
          .map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="font-semibold">Order ID: {order._id}</p>
                <p>Total: ₹{order.totalAmount}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => updateOrderStatus(order._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => updateOrderStatus(order._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Past Orders */}
      <h3 className="text-xl font-semibold mb-3">Past Orders</h3>
      <div className="space-y-4">
        {orders
          .filter((order) =>
            ["accepted", "rejected", "completed"].includes(order.status)
          )
          .map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="font-semibold">Order ID: {order._id}</p>
                <p>Total: ₹{order.totalAmount}</p>
                <p>Status: {order.status}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Orders;