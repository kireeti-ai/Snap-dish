import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function ManageDeliveryPartners() {
  const [partners, setPartners] = useState([]);
  const [error, setError] = useState('');

  const API_URL = 'https://snap-dish.onrender.com/api/users';
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          // Filter the full user list to get only delivery agents
          const deliveryAgents = response.data.data.filter(
            user => user.role === 'delivery_agent'
          );
          setPartners(deliveryAgents);
        } else {
          setError('Failed to fetch users.');
        }
      } catch (err) {
        setError('An error occurred while fetching users.');
        console.error(err);
      }
    };

    if (token) {
      fetchPartners();
    }
  }, [token]);

  // Function to change a partner's status (e.g., 'active' or 'suspended')
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/admin/users/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update the status in our local state to immediately reflect the change
        setPartners(partners.map(partner =>
          partner._id === id ? { ...partner, status: newStatus } : partner
        ));
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      alert('An error occurred while updating status.');
      console.error(err);
    }
  };

  return (
    <div className="page">
      <h2>Manage Delivery Partners</h2>
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {partners.map(partner => (
            <tr key={partner._id}>
              <td>{partner.firstName} {partner.lastName}</td>
              <td>{partner.email}</td>
              <td>
                <span className={`status ${partner.status.toLowerCase()}`}>
                  {partner.status}
                </span>
              </td>
              <td>
                {partner.status === 'active' && (
                  <button className="btn btn-deny" onClick={() => handleUpdateStatus(partner._id, 'suspended')}>
                    Suspend
                  </button>
                )}
                {partner.status === 'suspended' && (
                  <button className="btn btn-approve" onClick={() => handleUpdateStatus(partner._id, 'active')}>
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageDeliveryPartners;