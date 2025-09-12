import React, { useState } from 'react';

function ProfileManagement() {
  // 1. Updated state to include description and location to match the schema
  const [profile, setProfile] = useState({
    name: 'The Good Place Restaurant',
    address: '123 Foodie Lane, Gourmet City',
    cuisine_type: 'Multi-Cuisine',
    description: 'A cozy spot serving a variety of delicious dishes from around the world. Perfect for family dinners and casual meetups.',
    location: {
        coordinates: [76.95, 11.01] // [longitude, latitude]
    }
  });

  // Handles changes for simple, top-level fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // 2. Special handler for the nested location.coordinates array
  const handleLocationChange = (e, index) => {
    const { value } = e.target;
    setProfile(prev => {
        const newCoordinates = [...prev.location.coordinates];
        newCoordinates[index] = parseFloat(value) || 0; // Ensure it's a number
        return {
            ...prev,
            location: {
                ...prev.location,
                coordinates: newCoordinates
            }
        };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to a server
    alert('Profile updated successfully!');
    console.log('Updated Profile:', profile);
  };

  return (
    <div className="management-container">
      <h2>Restaurant Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Restaurant Name</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} />
        </div>
        
        {/* 3. New textarea for the description field */}
        <div className="form-group">
          <label>Description</label>
          <textarea 
            name="description" 
            value={profile.description} 
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={profile.address} onChange={handleChange} />
        </div>

        {/* 4. New number inputs for location coordinates */}
        <div className="form-group location-group">
            <label>Location Coordinates</label>
            <div className="coords-inputs">
                <input 
                    type="number" 
                    placeholder="Longitude"
                    value={profile.location.coordinates[0]}
                    onChange={(e) => handleLocationChange(e, 0)}
                    step="any"
                />
                <input 
                    type="number" 
                    placeholder="Latitude"
                    value={profile.location.coordinates[1]}
                    onChange={(e) => handleLocationChange(e, 1)}
                    step="any"
                />
            </div>
        </div>

        <div className="form-group">
          <label>Cuisine Type</label>
          <input type="text" name="cuisine_type" value={profile.cuisine_type} onChange={handleChange} />
        </div>

        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

export default ProfileManagement;