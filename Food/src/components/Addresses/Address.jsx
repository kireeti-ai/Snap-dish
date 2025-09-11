import React, { useState, useEffect } from 'react';
import './Address.css';
import { motion } from 'framer-motion';

function AddressForm({ address, onSave, onCancel }) {
  const [formData, setFormData] = useState(address);

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
        <h3>{formData.id ? 'Edit Address' : 'Add New Address'}</h3>
        <div className="form-group">
          <label>Address Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="e.g., Home, Work"
            required
          />
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