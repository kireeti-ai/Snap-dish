import React from 'react';
import './EarningsPage.css';

const mockEarnings = [
  { id: 'ORD-12344', amount: '₹55.00', time: '10:30 AM' },
  { id: 'ORD-12343', amount: '₹48.50', time: '09:15 AM' },
  { id: 'ORD-12342', amount: '₹62.00', time: 'Yesterday' },
];

const EarningsPage = () => {
    const totalEarnings = mockEarnings.reduce((acc, curr) => acc + parseFloat(curr.amount.replace('₹', '')), 0).toFixed(2);

  return (
    <div>
        <h2>Earnings</h2>
        <div className="card earnings-summary">
            <h3>Today's Earnings</h3>
            <p>₹{totalEarnings}</p>
        </div>
        <h3>Completed Deliveries</h3>
        <div className="card">
            <ul className="earnings-list">
                {mockEarnings.map(earning => (
                    <li key={earning.id}>
                        <span>Order {earning.id}</span>
                        <strong>{earning.amount}</strong>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};
export default EarningsPage;