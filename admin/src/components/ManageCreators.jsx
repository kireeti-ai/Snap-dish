import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ManageCreators.css'; 

const ManageCreators = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // API URL - update this if your backend runs on a different port
    const API_URL = 'http://localhost:4000';

    const fetchApplications = async () => {
        try {
            setLoading(true);
            // ✅ Changed from https to http
            const response = await axios.get(`${API_URL}/api/creator-application`);
            setApplications(response.data);
            console.log('Fetched applications:', response.data); // DEBUG
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch applications.';
            toast.error(errorMessage);
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            // ✅ Changed from https to http
            const response = await axios.patch(
                `${API_URL}/api/creator-application/${id}/status`, 
                { status: newStatus },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            toast.success(`Application status updated to ${newStatus}`);
            console.log('Status updated:', response.data); // DEBUG
            fetchApplications(); // Refresh the list
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update status.';
            toast.error(errorMessage);
            console.error('Update error:', error);
        }
    };

    const viewApplicationDetails = (app) => {
        setSelectedApp(app);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedApp(null);
    };

    if (loading) {
        return <div className="loader">Loading applications...</div>;
    }

    if (applications.length === 0) {
        return (
            <div className="manage-creators-container">
                <h2>Creator Applications (0)</h2>
                <div className="no-applications">
                    <p>No applications submitted yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-creators-container">
            <h2>Creator Applications ({applications.length})</h2>
            <div className="applications-table">
                <div className="table-header">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Primary Platform</div>
                    <div>Status</div>
                    <div>Actions</div>
                </div>
                {applications.map((app) => (
                    <div className="table-row" key={app._id}>
                        <div>{app.name}</div>
                        <div>{app.email}</div>
                        <div>{app.platforms?.length > 0 ? app.platforms[0].name : 'N/A'}</div>
                        <div>
                            <span className={`status-badge status-${app.status?.toLowerCase() || 'pending'}`}>
                                {app.status || 'Pending'}
                            </span>
                        </div>
                        <div className="action-buttons">
                            <select 
                                value={app.status || 'Pending'} 
                                onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <button 
                                onClick={() => viewApplicationDetails(app)}
                                className="view-details-btn"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for viewing application details */}
            {showModal && selectedApp && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>&times;</button>
                        <h3>Application Details</h3>
                        
                        <div className="detail-section">
                            <h4>Personal Information</h4>
                            <p><strong>Name:</strong> {selectedApp.name}</p>
                            <p><strong>Email:</strong> {selectedApp.email}</p>
                            <p><strong>Phone:</strong> {selectedApp.phone}</p>
                            <p><strong>City:</strong> {selectedApp.city}</p>
                            <p><strong>Bio:</strong> {selectedApp.bio}</p>
                        </div>

                        <div className="detail-section">
                            <h4>Social Media Platforms</h4>
                            {selectedApp.platforms?.map((platform, index) => (
                                <div key={index} className="platform-detail">
                                    <p><strong>{platform.name}:</strong> {platform.handle} ({platform.followers} followers)</p>
                                </div>
                            ))}
                        </div>

                        <div className="detail-section">
                            <h4>Content Style</h4>
                            <p>{selectedApp.contentStyle?.join(', ') || 'Not specified'}</p>
                        </div>

                        <div className="detail-section">
                            <h4>Best Posts</h4>
                            {selectedApp.bestPosts?.map((post, index) => (
                                <p key={index}>
                                    <a href={post} target="_blank" rel="noopener noreferrer">
                                        Post {index + 1}
                                    </a>
                                </p>
                            ))}
                        </div>

                        <div className="detail-section">
                            <h4>Proposal</h4>
                            <p>{selectedApp.proposal}</p>
                        </div>

                        {selectedApp.rates && (
                            <div className="detail-section">
                                <h4>Rates</h4>
                                <p>{selectedApp.rates}</p>
                            </div>
                        )}

                        <div className="detail-section">
                            <p><strong>Submitted At:</strong> {new Date(selectedApp.submittedAt).toLocaleString()}</p>
                            <p><strong>Status:</strong> <span className={`status-badge status-${selectedApp.status?.toLowerCase()}`}>{selectedApp.status}</span></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCreators;