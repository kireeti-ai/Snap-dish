import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrders, setUpdatingOrders] = useState(new Set());

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/order/restaurant");
      
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Could not fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Could not fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setUpdatingOrders(prev => new Set(prev.add(orderId)));
    
    try {
      const response = await api.post("/api/order/restaurant/update", {
        orderId,
        status
      });
      
      if (response.data.success) {
        toast.success("Order status updated!");
        fetchOrders(); // Refresh orders after update
      } else {
        toast.error(response.data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Confirmation':
        return 'bg-yellow-100 text-yellow-800';
      case 'Preparing':
        return 'bg-blue-100 text-blue-800';
      case 'Awaiting Delivery Agent':
        return 'bg-orange-100 text-orange-800';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500 animate-pulse">Loading orders...</div>
      </div>
    );
  }

  const pendingOrders = orders.filter((order) => order.status === "Pending Confirmation");
  const activeOrders = orders.filter((order) => ["Preparing", "Awaiting Delivery Agent", "Out for Delivery"].includes(order.status));
  const pastOrders = orders.filter((order) => ["Delivered", "Cancelled"].includes(order.status));

  const OrderCard = ({ order, showActions = false }) => {
    const isUpdating = updatingOrders.has(order._id);
    
    return (
      <div className={`border rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
        order.status === "Pending Confirmation" ? "bg-yellow-50 border-yellow-200" : 
        order.status === "Cancelled" ? "bg-red-50 border-red-200" : 
        order.status === "Delivered" ? "bg-green-50 border-green-200" : "bg-white"
      }`} data-testid={`order-card-${order._id.slice(-6)}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">Order #{order._id.slice(-6)}</h3>
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-xl font-bold text-green-600 mb-1">₹{order.amount}</p>
            <p className="text-sm text-gray-500 mb-2">{formatDate(order.date)}</p>
            
            {order.items && order.items.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Items:</p>
                <div className="text-sm text-gray-600">
                  {order.items.map((item, index) => (
                    <span key={index}>
                      {item.name} x{item.quantity}
                      {index < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {order.address && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">Delivery Address:</p>
                <p className="text-sm text-gray-600">
                  {typeof order.address === 'string' ? order.address : 
                   `${order.address.street || ''}, ${order.address.city || ''}, ${order.address.state || ''} ${order.address.zipcode || ''}`}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            {order.status === "Pending Confirmation" && (
              <>
                <button
                  data-testid={`accept-order-${order._id.slice(-6)}`}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => updateOrderStatus(order._id, "Preparing")}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Processing..." : "Accept Order"}
                </button>
                <button
                  data-testid={`reject-order-${order._id.slice(-6)}`}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => updateOrderStatus(order._id, "Cancelled")}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Processing..." : "Reject Order"}
                </button>
              </>
            )}
            
            {order.status === "Preparing" && (
              <button
                data-testid={`ready-order-${order._id.slice(-6)}`}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => updateOrderStatus(order._id, "Awaiting Delivery Agent")}
                disabled={isUpdating}
              >
                {isUpdating ? "Processing..." : "Mark as Ready for Pickup"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Manage incoming orders and track their progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-400">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(order => 
                  order.status === "Delivered" && 
                  new Date(order.date).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-400">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          New Orders ({pendingOrders.length})
        </h2>
        <div className="space-y-4">
          {pendingOrders.length > 0 ? (
            pendingOrders.map((order) => (
              <OrderCard key={order._id} order={order} showActions={true} />
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No new orders waiting for confirmation.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Active Orders */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
          Active Orders ({activeOrders.length})
        </h2>
        <div className="space-y-4">
          {activeOrders.length > 0 ? (
            activeOrders.map((order) => (
              <OrderCard 
                key={order._id} 
                order={order} 
                showActions={order.status === "Preparing"} 
              />
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No active orders in progress.</p>
            </div>
          )}
        </div>
      </div>

      {/* Order History */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
          Order History ({pastOrders.length})
        </h2>
        <div className="space-y-4">
          {pastOrders.length > 0 ? (
            pastOrders.slice(0, 10).map((order) => (
              <OrderCard key={order._id} order={order} showActions={false} />
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No completed orders yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;