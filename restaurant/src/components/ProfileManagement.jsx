import React, { useState } from 'react';

function ProfileManagement() {
  const [profile, setProfile] = useState({
    name: 'The Good Place Restaurant',
    address: '123 Foodie Lane, Gourmet City',
    hours: '9:00 AM - 10:00 PM',
    cuisine: 'Multi-Cuisine',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
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
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={profile.address} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Operating Hours</label>
          <input type="text" name="hours" value={profile.hours} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Cuisine Type</label>
          <input type="text" name="cuisine" value={profile.cuisine} onChange={handleChange} />
        </div>
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

export default ProfileManagement;