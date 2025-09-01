import React, { useState } from 'react';

function Settings() {
  const [commission, setCommission] = useState(15); // Default 15%
  const [deliveryFee, setDeliveryFee] = useState(5); // Default $5

  const handleSave = () => {
    // In a real app, this would make an API call to save the settings
    alert(`Settings saved: Commission is ${commission}% and Delivery Fee is $${deliveryFee}.`);
  };

  return (
    <div className="page">
      <h2>Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="commission">Restaurant Commission Rate (%)</label>
          <input
            type="number"
            id="commission"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="deliveryFee">Base Delivery Fee ($)</label>
          <input
            type="number"
            id="deliveryFee"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(e.target.value)}
          />
        </div>
        <button className="btn" onClick={handleSave}>Save Settings</button>
      </div>
    </div>
  );
}

export default Settings;