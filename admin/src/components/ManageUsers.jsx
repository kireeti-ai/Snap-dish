import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = 'https://snap-dish.onrender.com';

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${url}/api/users/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handler to update a user's role
    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${url}/api/users/admin/users/${userId}`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("User role updated successfully!");
                fetchUsers(); // Re-fetch to show the change
            }
        } catch (error) {
            toast.error("Failed to update user role.");
        }
    };
    
    // Handler to update a user's status
    const handleStatusChange = async (userId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${url}/api/users/admin/users/${userId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("User status updated successfully!");
                fetchUsers(); // Re-fetch to show the change
            }
        } catch (error) {
            toast.error("Failed to update user status.");
        }
    };

    if (loading) return <p>Loading users...</p>;

    return (
        <div className="manage-users-page">
            <h2>Manage All Users</h2>
            <div className="user-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="user-info">
                                    <img src={user.avatar || '/default-avatar.png'} alt="avatar" className="user-avatar" />
                                    <span>{user.firstName} {user.lastName}</span>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className="role-select"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="restaurant_owner">Restaurant Owner</option>
                                        <option value="delivery_agent">Delivery Agent</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                     <select 
                                        value={user.status} 
                                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                                        className={`status-select status-${user.status}`}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;