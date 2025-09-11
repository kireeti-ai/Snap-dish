import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddressForm from './Address';
import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import './AddressManager.css'; 
import { StoreContext } from '../../Context/StoreContext';

const initialAddresses = [
  { id: 1, type: 'Home', street: '123 Palm Grove', city: 'Coimbatore', state: 'Tamil Nadu', zip: '641021', num: '9876543210', isDefault: true },
  { id: 2, type: 'Work', street: '456 Tech Park Rd', city: 'Chennai', state: 'Tamil Nadu', zip: '600001', num: '9123456789', isDefault: false },
];

function AddressManager() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editingAddress, setEditingAddress] = useState(null);
  const { savedAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useContext(StoreContext);

  const handleSaveAddress = (addressData) => {
    if (addressData.id) {
      setAddresses(addresses.map(addr => addr.id === addressData.id ? addressData : addr));
    } else {
      const newAddress = { ...addressData, id: Date.now(), isDefault: addresses.length === 0 };
      setAddresses([...addresses, newAddress]);
    }
    setEditingAddress(null);
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({ ...addr, isDefault: addr.id === id })));
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleAddNew = () => {
    setEditingAddress({ type: 'Home', street: '', city: '', state: '', zip: '', num: '', isDefault: false });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    hover: { scale: 1.03, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }
  };

  return (
    <div className="address-manager-page">
      <div className="address-manager-content">
        <div className="header">
          <button className="btn-add-new" onClick={handleAddNew}>
            <FaPlus /> Add New Address
          </button>
        </div>

        {/* Address Form with AnimatePresence */}
        <AnimatePresence>
          {editingAddress && (
            <motion.div
              key="address-form"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AddressForm
                address={editingAddress}
                onSave={handleSaveAddress}
                onCancel={() => setEditingAddress(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Address List */}
        <div className="address-list-professional">
          <AnimatePresence>
            {addresses.map(addr => (
              <motion.div
                key={addr.id}
                className={`address-card-professional ${addr.isDefault ? 'default' : ''}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover="hover"
                layout
              >
                {addr.isDefault && <div className="default-badge">Default</div>}
                <div className="card-header">
                  <FaMapMarkerAlt className="location-icon" />
                  <h3>{addr.type}</h3>
                </div>
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state} - {addr.zip}</p>
                <p>Phone: {addr.num}</p>
                <div className="card-actions">
                  <button className="btn-action" onClick={() => setEditingAddress(addr)}>Edit</button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(addr.id)}>Delete</button>
                  {!addr.isDefault && (
                    <button className="btn-action btn-default" onClick={() => handleSetDefault(addr.id)}>
                      Set as Default
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default AddressManager;