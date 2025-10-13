import React from 'react';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const RevenueOrdersChart = ({ data, title = "Revenue vs Orders Comparison" }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].payload.day}</p>
          <p className="text-sm text-gray-600 mb-2">Date: {payload[0].payload.date}</p>
          <div className="space-y-1">
            <p className="text-blue-600 font-semibold">
              Orders: {payload.find(p => p.dataKey === 'orders')?.value || 0}
            </p>
            <p className="text-green-600 font-semibold">
              Revenue: ₹{(payload.find(p => p.dataKey === 'revenue')?.value || 0).toLocaleString()}
            </p>
            {payload[0].payload.avgOrderValue && (
              <p className="text-purple-600 text-sm">
                Avg Order: ₹{payload[0].payload.avgOrderValue.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis for revenue
  const formatRevenue = (value) => {
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}k`;
    }
    return `₹${value}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Revenue</span>
          </div>
        </div>
      </div>
      
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#3b82f6"
              style={{ fontSize: '12px' }}
              label={{ value: 'Orders', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#10b981"
              style={{ fontSize: '12px' }}
              tickFormatter={formatRevenue}
              label={{ value: 'Revenue', angle: 90, position: 'insideRight', style: { fontSize: '12px' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Bar for Orders */}
            <Bar 
              yAxisId="left"
              dataKey="orders" 
              fill="#3b82f6" 
              name="Orders"
              radius={[8, 8, 0, 0]}
            />
            
            {/* Line for Revenue */}
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
              name="Revenue (₹)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[350px] flex items-center justify-center text-gray-500">
          No comparison data available
        </div>
      )}
      
      {/* Summary Stats */}
      {data && data.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-blue-600">
              {data.reduce((sum, item) => sum + (item.orders || 0), 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{data.reduce((sum, item) => sum + (item.revenue || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
            <p className="text-2xl font-bold text-purple-600">
              ₹{(
                data.reduce((sum, item) => sum + (item.revenue || 0), 0) /
                data.reduce((sum, item) => sum + (item.orders || 0), 0) || 0
              ).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueOrdersChart;