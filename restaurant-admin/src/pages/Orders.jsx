import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // FIX: URL is now in a separate variable
  const API_BASE_URL = "http://localhost:4000";

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/order/restaurant`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Could not fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/order/restaurant/update`,
        { orderId, status },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      
      if (response.data.success) {
        toast.success("Order status updated!");
        fetchOrders(); // Refresh orders after update
      } else {
        toast.error(response.data.message || "Failed to update status.");
      }
    } catch (error)
    {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  const pendingOrders = orders.filter((order) => order.status === "Pending Confirmation");
  const activeOrders = orders.filter((order) => ["Preparing", "Awaiting Delivery Agent", "Out for Delivery"].includes(order.status));
  const pastOrders = orders.filter((order) => ["Delivered", "Cancelled"].includes(order.status));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

      {/* Pending Orders */}
      <h3 className="text-xl font-semibold mb-3">New Orders</h3>
      <div className="space-y-4 mb-8">
        {pendingOrders.length > 0 ? pendingOrders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 flex justify-between items-center shadow-sm bg-yellow-50">
              <div>
                <p className="font-semibold">Order ID: #{order._id.slice(-6)}</p>
                <p>Total: ₹{order.amount}</p> 
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => updateOrderStatus(order._id, "Preparing")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => updateOrderStatus(order._id, "Cancelled")}
                >
                  Reject
                </button>
              </div>
            </div>
          )) : <p>No new orders.</p>}
      </div>
      
      {/* Active Orders */}
      <h3 className="text-xl font-semibold mb-3">Active Orders</h3>
      <div className="space-y-4 mb-8">
        {activeOrders.length > 0 ? activeOrders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 flex justify-between items-center shadow-sm">
            <div>
              <p className="font-semibold">Order ID: #{order._id.slice(-6)}</p>
              <p>Total: ₹{order.amount}</p>
              <p className="font-bold text-blue-600">Status: {order.status}</p>
            </div>
            {order.status === "Preparing" && (
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => updateOrderStatus(order._id, "Awaiting Delivery Agent")}
                >
                  Mark as Ready for Pickup
                </button>
            )}
          </div>
        )) : <p>No active orders.</p>}
      </div>

      {/* Past Orders */}
      <h3 className="text-xl font-semibold mb-3">Order History</h3>
      <div className="space-y-4">
        {pastOrders.length > 0 ? pastOrders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 flex justify-between items-center shadow-sm bg-gray-50">
              <div>
                <p className="font-semibold">Order ID: #{order._id.slice(-6)}</p>
                <p>Total: ₹{order.amount}</p>
                <p className={`font-bold ${order.status === 'Delivered' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {order.status}
                </p>
              </div>
            </div>
          )) : <p>No past orders.</p>}
      </div>
    </div>
  );
};

export default Orders;