import React, { useState } from 'react';

// Mock data for customers
const initialCustomers = [
  { id: 101, name: 'Alice Johnson', email: 'alice@example.com', joinDate: '2025-08-15', status: 'Active' },
  { id: 102, name: 'Bob Williams', email: 'bob@example.com', joinDate: '2025-07-22', status: 'Active' },
  { id: 103, name: 'Charlie Brown', email: 'charlie@example.com', joinDate: '2025-06-01', status: 'Suspended' },
  { id: 104, name: 'Diana Miller', email: 'diana@example.com', joinDate: '2025-08-20', status: 'Active' },
];

function ManageCustomers() {
  const [customers, setCustomers] = useState(initialCustomers);

  // Function to toggle a customer's status between Active and Suspended
  const handleToggleStatus = (id) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === id
          ? { ...customer, status: customer.status === 'Active' ? 'Suspended' : 'Active' }
          : customer
      )
    );
  };

  return (
    <div className="page">
      <h2>Manage Customers</h2>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Join Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.joinDate}</td>
              <td>
                <span className={`status ${customer.status.toLowerCase()}`}>
                  {customer.status}
                </span>
              </td>
              <td>
                <button
                  className={`btn ${customer.status === 'Active' ? 'btn-deny' : 'btn-approve'}`}
                  onClick={() => handleToggleStatus(customer.id)}
                >
                  {customer.status === 'Active' ? 'Suspend' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageCustomers;