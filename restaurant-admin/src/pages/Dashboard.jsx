import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import StatsCard from "../components/StatsCard";
import ChartCard from "../components/ChartCard";
import DataTable from "../components/DataTable";
import { 
  FaShoppingCart, 
  FaDollarSign, 
  FaUtensils, 
  FaPizzaSlice,
  FaClock,
  FaCheckCircle,
  FaCalendarDay,
  FaChartLine
} from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const   Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      toast.error('Please login to access dashboard');
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [token, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const axiosConfig = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Fetch all dashboard data
      const [statsRes, chartRes, ordersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/restaurant/dashboard/stats`, axiosConfig),
        axios.get(`${API_BASE_URL}/api/restaurant/dashboard/sales-chart?days=7`, axiosConfig),
        axios.get(`${API_BASE_URL}/api/restaurant/dashboard/recent-orders?limit=10`, axiosConfig)
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      } else {
        throw new Error('Failed to fetch stats');
      }

      if (chartRes.data.success) {
        setChartData(chartRes.data.data);
      }

      if (ordersRes.data.success) {
        setRecentOrders(ordersRes.data.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      if (error.response?.status === 403) {
        toast.error('Access denied. Restaurant owner privileges required.');
        setError('You do not have permission to view this page.');
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.status === 404) {
        toast.error('No restaurant found. Please create a restaurant first.');
        setError('No restaurant found for your account. Please create a restaurant.');
      } else {
        toast.error('Failed to load dashboard data');
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your restaurant dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-bold">Error</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Format table data
  const tableData = recentOrders.map(order => [
    order.orderNumber,
    order.customerName,
    order.items,
    `₹${order.amount.toFixed(2)}`,
    order.status
  ]);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{stats?.restaurantName} Dashboard</h1>
        <div className="flex items-center gap-3 mt-2">
          <p className="text-gray-600">Restaurant Overview</p>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            stats?.restaurantStatus === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {stats?.restaurantStatus}
          </span>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard 
          title="Today's Orders" 
          value={stats?.todayOrders?.toLocaleString() || '0'} 
          icon={<FaCalendarDay size={24} />}
          bgColor="bg-blue-500"
        />
        <StatsCard 
          title="Today's Revenue" 
          value={`₹${stats?.todayRevenue?.toLocaleString() || '0'}`} 
          icon={<FaChartLine size={24} />}
          bgColor="bg-green-500"
        />
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Orders" 
          value={stats?.totalOrders?.toLocaleString() || '0'} 
          icon={<FaShoppingCart size={24} />}
          bgColor="bg-purple-500"
        />
        <StatsCard 
          title="Total Revenue" 
          value={`₹${stats?.totalRevenue?.toLocaleString() || '0'}`} 
          icon={<FaDollarSign size={24} />}
          bgColor="bg-emerald-500"
        />
        <StatsCard 
          title="Pending Orders" 
          value={stats?.pendingOrders?.toLocaleString() || '0'} 
          icon={<FaClock size={24} />}
          bgColor="bg-orange-500"
        />
        <StatsCard 
          title="Completed Orders" 
          value={stats?.completedOrders?.toLocaleString() || '0'} 
          icon={<FaCheckCircle size={24} />}
          bgColor="bg-teal-500"
        />
      </div>

      {/* Menu Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Total Menu Items" 
          value={stats?.totalMenuItems?.toLocaleString() || '0'} 
          icon={<FaUtensils size={20} />}
          bgColor="bg-indigo-500"
        />
        <StatsCard 
          title="Active Menu Items" 
          value={stats?.activeMenuItems?.toLocaleString() || '0'} 
          icon={<FaUtensils size={20} />}
          bgColor="bg-cyan-500"
        />
        <StatsCard 
          title="Top Selling Dish" 
          value={stats?.topDish || 'N/A'} 
          icon={<FaPizzaSlice size={20} />}
          bgColor="bg-pink-500"
        />
      </div>

      {/* Sales Chart */}
      <ChartCard 
        data={chartData} 
        title="Weekly Sales Overview" 
      />

      {/* Recent Orders Table */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
        {recentOrders.length > 0 ? (
          <DataTable 
            columns={["Order ID", "Customer", "Items", "Amount", "Status"]} 
            data={tableData} 
          />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            No orders yet
          </div>
        )}
      </div>

      {/* Order Status Breakdown */}
      {stats?.ordersByStatus && stats.ordersByStatus.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Status Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stats.ordersByStatus.map((status, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-2xl font-bold text-gray-800">{status.count}</p>
                <p className="text-xs text-gray-600 mt-1">{status._id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;