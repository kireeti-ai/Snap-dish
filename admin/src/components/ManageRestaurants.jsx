import React, { useState } from 'react';

const initialRestaurants = [
  { id: 1, name: 'Pizza Place', city: 'New York', status: 'Active' },
  { id: 2, name: 'Sushi Spot', city: 'Los Angeles', status: 'Inactive' },
  { id: 3, name: 'Burger Barn', city: 'Chicago', status: 'Active' },
];

function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  // In a real app, you would manage form state for adding/editing restaurants

  const handleDelete = (id) => {
    setRestaurants(restaurants.filter(r => r.id !== id));
  };

  return (
    <div className="page">
      <h2>Manage Restaurants</h2>
      {/* Add Restaurant Form would go here */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>City</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map(restaurant => (
            <tr key={restaurant.id}>
              <td>{restaurant.id}</td>
              <td>{restaurant.name}</td>
              <td>{restaurant.city}</td>
              <td>{restaurant.status}</td>
              <td>
                <button className="btn btn-edit">Edit</button>
                <button className="btn btn-delete" onClick={() => handleDelete(restaurant.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageRestaurants;