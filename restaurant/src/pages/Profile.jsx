import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();

    // If for some reason the component is rendered without a user, show a loading/error state.
    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile-container">
            <h2>My Profile</h2>
            <div className="card profile-details">
                <div className="detail-item">
                    <span>Name</span>
                    <strong>{user.name}</strong>
                </div>
                 <div className="detail-item">
                    <span>Email</span>
                    <strong>{user.email}</strong>
                </div>
                <div className="detail-item">
                    <span>Phone</span>
                    <strong>{user.phone}</strong>
                </div>
                <div className="detail-item">
                    <span>Vehicle No.</span>
                    <strong>{user.vehicleNo}</strong>
                </div>
                 <div className="detail-item">
                    <span>Member Since</span>
                    <strong>{user.memberSince}</strong>
                </div>
            </div>
            <button className="btn btn-danger" onClick={logout}>
                Log Out
            </button>
        </div>
    );
}

export default Profile;