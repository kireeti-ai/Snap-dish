import React, { useState } from 'react';

function StatusToggle() {
  const [isOnline, setIsOnline] = useState(true); // Default to 'Online'

  const handleChange = () => {
    setIsOnline(!isOnline);
    // In a real app, you would also make an API call here
    // to update the restaurant's status on the server.
  };

  return (
    <div className="status-toggle-container">
      <span className={isOnline ? 'online' : 'offline'}>
        {isOnline ? 'You are Online' : 'You are Offline'}
      </span>
      <div className="toggle-switch">
        <input
          type="checkbox"
          id="status-toggle"
          checked={isOnline}
          onChange={handleChange}
        />
        <label htmlFor="status-toggle"></label>
      </div>
    </div>
  );
}

export default StatusToggle;