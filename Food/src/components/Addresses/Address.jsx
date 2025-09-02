import React, { useState, useEffect } from 'react';
import './Address.css'
function AddressForm({ address, onSave, onCancel }) {
  const [formData, setFormData] = useState(address);

  // This effect syncs the form's state with the prop from the parent
  useEffect(() => {
    setFormData(address);
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="form-overlay">
      <form className="address-form-professional" onSubmit={handleSubmit}>
        <h3>{formData.id ? 'Edit Address' : 'Add New Address'}</h3>
        <div className="form-group">
          <label>Address Type</label>
          <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="e.g., Home, Work" required />
        </div>
        <div className="form-group">
          <label>Street</label>
          <input type="text" name="street" value={formData.street} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Zip Code</label>
            <input type="text" name="zip" value={formData.zip} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
            <label>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone number</label>
            <input type="number" name="num" value={formData.num} onChange={handleChange} required />

          </div>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-save">Save Address</button>
        </div>
      </form>
    </div>
  );
}

export default AddressForm;