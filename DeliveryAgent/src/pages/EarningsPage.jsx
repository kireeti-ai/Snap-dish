import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './EarningsPage.css';

const EarningsPage = () => {
    const { API_BASE_URL, token } = useContext(AuthContext);
    const [chartType, setChartType] = useState('bar');
    const [loading, setLoading] = useState(true);
    const [earningsData, setEarningsData] = useState([]);
    const [statistics, setStatistics] = useState({
        totalEarnings: '0.00',
        totalDeliveries: 0,
        todayEarnings: '0.00',
        todayDeliveries: 0,
        averageEarning: '0.00'
    });

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/delivery/earnings`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data.success) {
                    setEarningsData(response.data.data.earnings);
                    setStatistics(response.data.data.statistics);
                } else {
                    toast.error(response.data.message || 'Failed to load earnings data');
                }
            } catch (error) {
                console.error('Earnings fetch error:', error);
                const message = error.response?.data?.message || 'An error occurred while fetching earnings.';
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, [API_BASE_URL, token]); // Add dependencies to useEffect

    // Process data for charts
    const chartData = earningsData
        .reduce((acc, earning) => {
            const dateObj = new Date(earning.date);
            // Use a stable date format for grouping, like YYYY-MM-DD
            const dateKey = dateObj.toISOString().split('T')[0];
            const existing = acc.find(item => item.dateKey === dateKey);

            if (existing) {
                existing.earnings += parseFloat(earning.earnings);
                existing.deliveries += 1;
            } else {
                acc.push({
                    dateKey: dateKey,
                    // Format the label for display
                    dateLabel: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    earnings: parseFloat(earning.earnings),
                    deliveries: 1
                });
            }
            return acc;
        }, [])
        .sort((a, b) => new Date(a.dateKey) - new Date(b.dateKey)); // Sort chronologically for the chart

    // Function to handle downloading the report as a CSV file
    const handleDownload = () => {
        if (earningsData.length === 0) {
            toast.info('No earnings data to download');
            return;
        }

        const headers = ['Order ID', 'Date', 'Restaurant', 'Order Amount (₹)', 'Your Earnings (₹)'];
        
        // Helper to safely format CSV fields (handles commas)
        const formatCsvField = (field) => {
            const str = String(field ?? 'N/A'); // Use 'N/A' for null/undefined
            // If the field contains a comma, double quote, or newline, wrap it in double quotes
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`; // Escape existing double quotes
            }
            return str;
        };

        const csvRows = earningsData.map(row => 
            [
                formatCsvField(row.orderNumber),
                formatCsvField(new Date(row.date).toLocaleDateString('en-US')),
                formatCsvField(row.restaurantName),
                parseFloat(row.amount).toFixed(2),
                parseFloat(row.earnings).toFixed(2) // Ensure earnings are formatted
            ].join(',')
        );

        // Use '\n' for newlines for better compatibility
        const csvContent = [headers.join(','), ...csvRows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'earnings-report.csv');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Report downloaded successfully!');
    };

    // Render loading state
    if (loading) {
        return (
            <div className="earnings-page">
                <div className="earnings-container">
                    <h2 className="earnings-title">Earnings Report</h2>
                    <div className="loading-message">Loading earnings data...</div>
                </div>
            </div>
        );
    }

    // Render empty state
    if (earningsData.length === 0) {
        return (
            <div className="earnings-page">
                <div className="earnings-container">
                    <h2 className="earnings-title">Earnings Report</h2>
                    <div className="empty-state">
                        <p>💰 No earnings yet</p>
                        <p className="empty-subtext">Complete deliveries to start earning.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Main component render
    return (
        <div className="earnings-page">
            <div className="earnings-container">
                <h2 className="earnings-title">Earnings Report</h2>

                {/* Summary Cards */}
                <div className="summary-cards">
                    {/* ... cards remain the same ... */}
                </div>

                {/* Chart */}
                {chartData.length > 0 && (
                    <div className="chart-card">
                         {/* ... chart header remains the same ... */}
                        <ResponsiveContainer width="100%" height={300}>
                            {chartType === 'bar' ? (
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="dateLabel" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Earnings']} contentStyle={{ borderRadius: '8px' }} />
                                    <Legend />
                                    <Bar dataKey="earnings" fill="#3b82f6" name="Daily Earnings (₹)" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            ) : (
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="dateLabel" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Earnings']} contentStyle={{ borderRadius: '8px' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={3} name="Daily Earnings (₹)" dot={{ fill: '#3b82f6', r: 6 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Earnings Table */}
                <div className="table-card">
                    {/* ... table header remains the same ... */}
                    <div className="table-wrapper">
                        <table className="earnings-table">
                            <thead>
                                {/* ... thead remains the same ... */}
                            </thead>
                            <tbody>
                                {earningsData.map(earning => (
                                    <tr key={earning.orderId || earning.orderNumber}> {/* More robust key */}
                                        <td>{earning.orderNumber}</td>
                                        <td>{new Date(earning.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                        <td>{earning.restaurantName || 'N/A'}</td>
                                        <td>₹{parseFloat(earning.amount).toFixed(2)}</td>
                                        <td className="earnings-amount">₹{parseFloat(earning.earnings).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                {/* ... tfoot remains the same ... */}
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsPage;