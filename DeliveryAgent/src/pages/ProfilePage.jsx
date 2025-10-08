import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, logout, updateUser, API_BASE_URL, token } = useContext(AuthContext);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone_number: '',
        email: ''
    });

    // Effect to sync form state with user data from context
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone_number: user.phone_number || '',
                email: user.email || ''
            });
        }
    }, [user]); // This effect runs whenever the 'user' object changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Using PUT for updates is more conventional than POST
            const response = await axios.put(
                `${API_BASE_URL}/api/users/update-profile`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                updateUser(response.data.user);
                setIsEditing(false);
                toast.success('Profile updated successfully!');
            } else {
                toast.error(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data from the original user object
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone_number: user.phone_number || '',
                email: user.email || ''
            });
        }
        setIsEditing(false);
    };

    // A more robust date formatting function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        // Check if the date is valid before formatting
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Helper to format the role for display
    const formatRole = (role) => {
        if (!role) return 'N/A';
        if (role === 'delivery_agent') return 'Delivery Agent';
        // Capitalize the first letter for other roles
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    if (!user) {
        return <div className="profile-page"><h2>Loading Profile...</h2></div>;
    }

    return (
        <div className="profile-page">
            <h2>My Profile</h2>
            
            <div className="card profile-details">
                {isEditing ? (
                    <>
                        <div className="detail-item">
                            <span>First Name</span>
                            <input 
                                type="text" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="profile-input"
                                disabled={loading}
                            />
                        </div>
                        <div className="detail-item">
                            <span>Last Name</span>
                            <input 
                                type="text" 
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="profile-input"
                                disabled={loading}
                            />
                        </div>
                        <div className="detail-item">
                            <span>Email</span>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                readOnly // It's often best practice to not allow email changes directly
                                className="profile-input profile-input-readonly"
                                title="Email cannot be changed."
                            />
                        </div>
                        <div className="detail-item">
                            <span>Phone</span>
                            <input 
                                type="tel" 
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="profile-input"
                                disabled={loading}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="detail-item">
                            <span>Name</span>
                            <strong>{user.firstName} {user.lastName}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Email</span>
                            <strong>{user.email || 'N/A'}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Phone</span>
                            <strong>{user.phone_number || 'N/A'}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Role</span>
                            <strong className="role-badge">{formatRole(user.role)}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Member Since</span>
                            <strong>{formatDate(user.createdAt)}</strong>
                        </div>
                    </>
                )}
            </div>

            <div className="button-group">
                {isEditing ? (
                    <>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                        <button className="btn btn-danger" onClick={logout}>
                            Log Out
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;