import React, { useState } from 'react';

// Mock data simulating requests from users
const initialRequests = [
  { id: 101, name: 'The Corner Cafe', email: 'contact@cornercafe.com', type: 'Restaurant', status: 'Pending' },
  { id: 102, name: 'Ravi Kumar', email: 'ravi.k@email.com', type: 'Delivery Partner', status: 'Pending' },
  { id: 103, name: 'Gourmet Grill', email: 'info@gourmetgrill.com', type: 'Restaurant', status: 'Pending' },
  { id: 104, name: 'Priya Sharma', email: 'priya.sharma@email.com', type: 'Delivery Partner', status: 'Pending' },
];

function ManageRequests() {
  const [requests, setRequests] = useState(initialRequests);

  const handleDecision = (requestId, decision) => {
    // In a real app, you would send this decision to your backend API.
    const request = requests.find(r => r.id === requestId);
    alert(`Request from ${request.name} has been ${decision}.`);
    
    // For this demo, we'll just remove the request from the list.
    setRequests(requests.filter(req => req.id !== requestId));
  };

  if (requests.length === 0) {
    return (
      <div className="page">
        <h2>Manage Requests</h2>
        <p>No pending requests.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Manage Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Applicant Name</th>
            <th>Email</th>
            <th>Applying For</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id}>
              <td>{request.name}</td>
              <td>{request.email}</td>
              <td>{request.type}</td>
              <td>
                <span className={`status ${request.status.toLowerCase()}`}>{request.status}</span>
              </td>
              <td>
                <button className="btn btn-accept" onClick={() => handleDecision(request.id, 'Accepted')}>Accept</button>
                <button className="btn btn-deny" onClick={() => handleDecision(request.id, 'Denied')}>Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageRequests;