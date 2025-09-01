import React, { useState } from 'react';

// Updated mock data with a 'status' field
const initialPartners = [
  { id: 1, name: 'John Doe', city: 'New York', status: 'Approved' },
  { id: 2, name: 'Jane Smith', city: 'Chicago', status: 'Pending' },
  { id: 3, name: 'Sam Wilson', city: 'Los Angeles', status: 'Approved' },
  { id: 4, name: 'Maria Garcia', city: 'Chicago', status: 'Denied' },
  { id: 5, name: 'Ken Adams', city: 'New York', status: 'Pending' },
];

function ManageDeliveryPartners() {
  const [partners, setPartners] = useState(initialPartners);

  // Function to handle approving a request
  const handleApprove = (id) => {
    setPartners(partners.map(partner => 
      partner.id === id ? { ...partner, status: 'Approved' } : partner
    ));
  };

  // Function to handle denying a request
  const handleDeny = (id) => {
    setPartners(partners.map(partner => 
      partner.id === id ? { ...partner, status: 'Denied' } : partner
    ));
  };

  return (
    <div className="page">
      <h2>Manage Delivery Partner Requests</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>City</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {partners.map(partner => (
            <tr key={partner.id}>
              <td>{partner.id}</td>
              <td>{partner.name}</td>
              <td>{partner.city}</td>
              <td>
                <span className={`status ${partner.status.toLowerCase()}`}>{partner.status}</span>
              </td>
              <td>
                {/* Only show buttons if the status is 'Pending' */}
                {partner.status === 'Pending' && (
                  <>
                    <button className="btn btn-approve" onClick={() => handleApprove(partner.id)}>
                      Approve
                    </button>
                    <button className="btn btn-deny" onClick={() => handleDeny(partner.id)}>
                      Deny
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageDeliveryPartners;