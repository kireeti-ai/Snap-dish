import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  
  const API_URL = 'http://localhost:4000/api/users';
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/restaurants`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setRestaurants(response.data.data);
        } else {
          setError('Failed to fetch restaurants.');
        }
      } catch (err) {
        setError('An error occurred while fetching restaurants.');
        console.error(err);
      }
    };

    if (token) {
      fetchRestaurants();
    } else {
      setError("Not authorized. Please log in as admin.");
    }
  }, [token]);
  
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/admin/restaurants/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setRestaurants(restaurants.map(r => 
          r._id === id ? { ...r, status: newStatus } : r
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
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        const response = await axios.delete(`${API_URL}/admin/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setRestaurants(restaurants.filter(r => r._id !== id));
        } else {
          alert('Failed to delete restaurant.');
        }
      } catch (err) {
        alert('An error occurred during deletion.');
        console.error(err);
      }
    }
  };

  return (
    <div className="page">
      <h2>Manage Restaurants</h2>
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cuisine</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map(restaurant => (
            <tr key={restaurant._id}>
              <td>{restaurant.name}</td>
              <td>{restaurant.cuisine}</td>
              <td>{restaurant.owner_id ? restaurant.owner_id.email : 'N/A'}</td>
              <td>
                <span className={`status ${restaurant.status.toLowerCase()}`}>
                    {restaurant.status.replace('_', ' ')}
                </span>
              </td>
              <td className='action-buttons'>
                {restaurant.status === 'pending_approval' && (
                  <button className="btn btn-approve" onClick={() => handleUpdateStatus(restaurant._id, 'active')}>Approve</button>
                )}
                 {restaurant.status === 'active' && (
                  <button className="btn btn-deny" onClick={() => handleUpdateStatus(restaurant._id, 'inactive')}>Deactivate</button>
                )}
                 {restaurant.status === 'inactive' && (
                  <button className="btn btn-approve" onClick={() => handleUpdateStatus(restaurant._id, 'active')}>Activate</button>
                )}
                <button className="btn btn-delete" onClick={() => handleDelete(restaurant._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageRestaurants;