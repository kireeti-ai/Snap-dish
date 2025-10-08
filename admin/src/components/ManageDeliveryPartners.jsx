import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function ManageDeliveryPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filter the full user list to get only delivery agents
        const deliveryAgents = response.data.data.filter(
          user => user.role === 'delivery_agent'
        );
        setPartners(deliveryAgents);
        setError('');
      } else {
        setError('Failed to fetch users.');
        toast.error('Failed to fetch users.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred while fetching users.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/users/admin/users/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPartners(partners.map(partner =>
          partner._id === id ? { ...partner, status: newStatus } : partner
        ));
        toast.success(`Partner status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update status.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred while updating status.';
      toast.error(errorMessage);
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this delivery partner?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/users/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPartners(partners.filter(partner => partner._id !== id));
        toast.success('Delivery partner deleted successfully!');
      } else {
        toast.error('Failed to delete partner.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during deletion.';
      toast.error(errorMessage);
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Manage Delivery Partners</h2>
        <p>Loading delivery partners...</p>
      </div>
    );
  }

  if (error && partners.length === 0) {
    return (
      <div className="page">
        <h2>Manage Delivery Partners</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="page">
        <h2>Manage Delivery Partners</h2>
        <p>No delivery partners found.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Manage Delivery Partners ({partners.length})</h2>
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {partners.map(partner => (
            <tr key={partner._id}>
              <td>{partner.firstName} {partner.lastName}</td>
              <td>{partner.email}</td>
              <td>{partner.phone_number || 'N/A'}</td>
              <td>
                <span className={`status ${partner.status?.toLowerCase() || 'active'}`}>
                  {partner.status || 'Active'}
                </span>
              </td>
              <td className="action-buttons">
                {partner.status === 'active' && (
                  <button 
                    className="btn btn-deny" 
                    onClick={() => handleUpdateStatus(partner._id, 'suspended')}
                  >
                    Suspend
                  </button>
                )}
                {partner.status === 'suspended' && (
                  <button 
                    className="btn btn-approve" 
                    onClick={() => handleUpdateStatus(partner._id, 'active')}
                  >
                    Activate
                  </button>
                )}
                {partner.status === 'inactive' && (
                  <button 
                    className="btn btn-approve" 
                    onClick={() => handleUpdateStatus(partner._id, 'active')}
                  >
                    Activate
                  </button>
                )}
                <button 
                  className="btn btn-delete" 
                  onClick={() => handleDelete(partner._id)}
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

export default ManageDeliveryPartners;