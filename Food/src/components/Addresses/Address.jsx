import React, { useState, useEffect } from 'react';
import './Address.css';
import { motion } from 'framer-motion';

function AddressForm({ address, onSave, onCancel }) {
  const [formData, setFormData] = useState(address);

  useEffect(() => {
    // Handle both old and new field names
    const normalizedAddress = {
      ...address,
      zipCode: address.zipCode || address.zip || '',
      phone: address.phone || address.num || '',
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      email: address.email || '',
      country: address.country || 'India',
    };
    setFormData(normalizedAddress);
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Send data with BOTH old and new field names for backward compatibility
    const addressToSave = {
      ...formData,
      zip: formData.zipCode,      // Map new to old
      num: formData.phone,         // Map new to old
      zipCode: formData.zipCode,   // Also send new
      phone: formData.phone,       // Also send new
    };
    
    onSave(addressToSave);
  };

  return (
    <motion.div
      className="form-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.form
        className="address-form-professional"
        onSubmit={handleSubmit}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3>{formData._id ? 'Edit Address' : 'Add New Address'}</h3>
        
        <div className="form-group">
          <label>Address Type</label>
          <input
            type="text"
            name="type"
            value={formData.type || ''}
            onChange={handleChange}
            placeholder="e.g., Home, Work"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input 
              type="text" 
              name="firstName" 
              value={formData.firstName || ''} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              value={formData.lastName || ''} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email || ''} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Street</label>
          <input 
            type="text" 
            name="street" 
            value={formData.street || ''} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input 
              type="text" 
              name="city" 
              value={formData.city || ''} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input 
              type="text" 
              name="state" 
              value={formData.state || ''} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Zip Code</label>
            <input 
              type="text" 
              name="zipCode" 
              value={formData.zipCode || ''} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input 
              type="text" 
              name="country" 
              value={formData.country || ''} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone || ''} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-actions">
          <motion.button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            whileHover={{ scale: 1.05, backgroundColor: '#ff6b6b', color: '#fff' }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="btn-save"
            whileHover={{ scale: 1.05, backgroundColor: '#28a745', color: '#fff' }}
          >
            Save Address
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default AddressForm;