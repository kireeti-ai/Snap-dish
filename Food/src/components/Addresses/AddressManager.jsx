import React, { useState,useContext } from 'react';
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
    // Initialize with empty strings and default type for new address
    setEditingAddress({ type: 'Home', street: '', city: '', state: '', zip: '', num: '', isDefault: false });
  };

  return (
    <div className="address-manager-page"> {/* Changed class name for clarity */}
      <div className="address-manager-content">
        <div className="header">
            <button className="btn-add-new" onClick={handleAddNew}>
                <FaPlus />Manage Addresses
            </button>


          
          <button className="btn-add-new" onClick={handleAddNew}>
            <FaPlus /> Add New Address
          </button>
        </div>

        {editingAddress && (
          <AddressForm
            address={editingAddress}
            onSave={handleSaveAddress}
            onCancel={() => setEditingAddress(null)}
          />
        )}

        <div className="address-list-professional">
          {addresses.map(addr => (
            <div key={addr.id} className={`address-card-professional ${addr.isDefault ? 'default' : ''}`}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddressManager;