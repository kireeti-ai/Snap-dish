import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  
  const API_URL = 'https://snap-dish.onrender.com/api/users'; 
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setCustomers(response.data.data);
        } else {
          setError('Failed to fetch customers.');
        }
      } catch (err) {
        setError('An error occurred while fetching customers.');
        console.error(err);
      }
    };

    if (token) {
      fetchCustomers();
    } else {
      setError("Not authorized. Please log in as admin.");
    }
  }, [token]);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const response = await axios.put(`${API_URL}/admin/users/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCustomers(customers.map(customer =>
          customer._id === id ? { ...customer, status: newStatus } : customer
        ));
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      alert('An error occurred.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      try {
        const response = await axios.delete(`${API_URL}/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setCustomers(customers.filter(c => c._id !== id));
        } else {
          alert('Failed to delete user.');
        }
      } catch (err) {
        alert('An error occurred during deletion.');
        console.error(err);
      }
    }
  };

  return (
    <div className="page">
      <h2>Manage Customers</h2>
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.firstName} {customer.lastName}</td>
              <td>{customer.email}</td>
              <td>{customer.role}</td>
              <td>
                <span className={`status ${customer.status.toLowerCase()}`}>
                  {customer.status}
                </span>
              </td>
              <td className='action-buttons'>
                <button
                  className={`btn ${customer.status === 'active' ? 'btn-deny' : 'btn-approve'}`}
                  onClick={() => handleToggleStatus(customer._id, customer.status)}
                >
                  {customer.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => handleDelete(customer._id)}
                >
                  Delete
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