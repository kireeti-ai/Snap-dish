import React, { useState } from 'react';

// Mock data for initial menu
const initialMenuItems = [
  { id: 1, name: 'Pizza', price: 12.99, available: true },
  { id: 2, name: 'Burger', price: 8.99, available: true },
  { id: 3, name: 'Pasta', price: 10.50, available: false },
];

function MenuManagement() {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [newItem, setNewItem] = useState({ name: '', price: '' });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.name && newItem.price) {
      const newMenuItem = {
        id: menuItems.length + 1,
        ...newItem,
        price: parseFloat(newItem.price),
        available: true,
      };
      setMenuItems([...menuItems, newMenuItem]);
      setNewItem({ name: '', price: '' }); // Reset form
    }
  };

  const toggleAvailability = (id) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };
  
  const deleteItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <div className="management-container">
      <h2>Menu Management</h2>
      
      {/* Add New Item Form */}
      <form onSubmit={handleAddItem} className="add-item-form">
        <h3>Add New Item</h3>
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <button type="submit" className="btn-primary">Add Item</button>
      </form>

      {/* Menu Item List */}
      <div className="item-list">
        <h3>Current Menu</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>₹{item.price.toFixed(2)}</td>
                <td>{item.available ? 'Available' : 'Unavailable'}</td>
                <td className="actions">
                  <button onClick={() => toggleAvailability(item.id)}>
                    Toggle
                  </button>
                  <button className="btn-delete" onClick={() => deleteItem(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuManagement;