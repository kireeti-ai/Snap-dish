import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
    const { logout } = useContext(AuthContext);

    return (
        <div>
            <h2>My Profile</h2>
            <div className="card profile-details">
                <div className="detail-item"><span>Name</span><strong>Ravi Kumar</strong></div>
                <div className="detail-item"><span>Phone</span><strong>+91 98765 43210</strong></div>
                <div className="detail-item"><span>Vehicle No.</span><strong>TN 37 DZ 1234</strong></div>
                <div className="detail-item"><span>Member Since</span><strong>Sep 1, 2025</strong></div>
            </div>
            <button className="btn btn-danger" onClick={logout}>Log Out</button>
        </div>
    );
}
export default ProfilePage;