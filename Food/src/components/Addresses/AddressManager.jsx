// AddressManager.jsx
import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddressForm from "./Address";
import { FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import "./AddressManager.css";
import { StoreContext } from "../../Context/StoreContext";

function AddressManager() {
  const { savedAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } =
    useContext(StoreContext);

  const [editingAddress, setEditingAddress] = useState(null);

  const handleSaveAddress = (addressData) => {
    if (addressData._id) {
      updateAddress(addressData);
    } else {
      addAddress(addressData);
    }
    setEditingAddress(null);
  };

  const handleAddNew = () => {
    setEditingAddress({ 
      type: "Home", 
      firstName: "",
      lastName: "",
      email: "",
      street: "", 
      city: "", 
      state: "", 
      zipCode: "", 
      zip: "",
      country: "India",
      phone: "", 
      num: "",
      isDefault: false 
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    hover: { scale: 1.03, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" },
  };

  return (
    <div className="address-manager-page">
      <div className="address-manager-content">
        <div className="header">
          <button className="btn-add-new" onClick={handleAddNew}>
            <FaPlus /> Add New Address
          </button>
        </div>

        {/* Address Form */}
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
            {savedAddresses.map((addr) => (
              <motion.div
                key={addr._id}
                className={`address-card-professional ${addr.isDefault ? "default" : ""}`}
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
                {/* Handle both old and new field names */}
                {(addr.firstName || addr.lastName) && (
                  <p><strong>{addr.firstName} {addr.lastName}</strong></p>
                )}
                <p>{addr.street}</p>
                <p>
                  {addr.city}, {addr.state} - {addr.zipCode || addr.zip}
                </p>
                {addr.country && <p>{addr.country}</p>}
                {addr.email && <p>Email: {addr.email}</p>}
                <p>Phone: {addr.phone || addr.num}</p>
                <div className="card-actions">
                  <button className="btn-action" onClick={() => setEditingAddress(addr)}>Edit</button>
                  <button className="btn-action btn-delete" onClick={() => deleteAddress(addr._id)}>Delete</button>
                  {!addr.isDefault && (
                    <button className="btn-action btn-default" onClick={() => setDefaultAddress(addr._id)}>
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