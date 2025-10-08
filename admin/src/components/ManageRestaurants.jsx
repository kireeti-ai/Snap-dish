import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/admin/restaurants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRestaurants(response.data.data);
      } else {
        toast.error('Failed to fetch restaurants.');
      }
    } catch (err) {
      toast.error('An error occurred while fetching restaurants.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/admin/restaurants/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setRestaurants(restaurants.map(r => 
          r._id === id ? { ...r, status: newStatus } : r
        ));
        toast.success('Status updated successfully!');
      } else {
        toast.error('Failed to update status.');
      }
    } catch (err) {
      toast.error('An error occurred.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/users/admin/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setRestaurants(restaurants.filter(r => r._id !== id));
          toast.success('Restaurant deleted successfully!');
        } else {
          toast.error('Failed to delete restaurant.');
        }
      } catch (err) {
        toast.error('An error occurred during deletion.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Manage Restaurants</h2>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Manage Restaurants</h2>
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