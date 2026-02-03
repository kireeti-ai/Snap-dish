import React, { useState, useEffect } from 'react';
import './ManageRestaurant.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

// Restaurant Admin Dashboard URL
const RESTAURANT_ADMIN_URL = process.env.NODE_ENV === 'production'
    ? 'https://snap-dish-d5y5.vercel.app'
    : 'http://localhost:5174';

const API_URL = "https://snap-dish.onrender.com";

// --- Form Step Components (Moved Outside) ---

// Component for Step 1
const RestaurantStep1 = ({ restaurantData, handleRestaurantChange }) => (
    <>
        <div className="form-group with-icon">
            <label htmlFor="name">Restaurant Name</label>
            <i className="icon-building"></i>
            <input
                type="text"
                id="name"
                name="name"
                value={restaurantData.name}
                onChange={handleRestaurantChange}
                placeholder="Ex: The Gourmet Place"
                required
            />
        </div>
        <div className="form-group with-icon">
            <label htmlFor="address">Full Address</label>
            <i className="icon-location"></i>
            <input
                type="text"
                id="address"
                name="address"
                value={restaurantData.address}
                onChange={handleRestaurantChange}
                placeholder="123 Food Street, Flavor Town"
                required
            />
        </div>
        <div className="form-group">
            <label htmlFor="price_for_two">Price for Two</label>
            <input
                type="number"
                id="price_for_two"
                name="price_for_two"
                value={restaurantData.price_for_two}
                onChange={handleRestaurantChange}
                placeholder="Ex: 500"
                required
            />
        </div>
    </>
);

// Component for Step 2
const RestaurantStep2 = ({ restaurantData, handleRestaurantChange, handleImageChange, imagePreview }) => (
    <>
        <div className="form-group image-upload">
            <label>Restaurant Image</label>
            <label htmlFor="image" className="image-upload-box">
                {imagePreview ? <img src={imagePreview} alt="Preview" className="image-preview" /> : <img src={assets.upload_area} alt="Upload Icon" />}
            </label>
            <input
                onChange={handleImageChange}
                type="file"
                id="image"
                name="image"
                accept="image/*"
                hidden
            />
        </div>
        <div className="form-row">
            <div className="form-group">
                <label htmlFor="cuisine">Cuisine Type</label>
                <select
                    id="cuisine"
                    name="cuisine"
                    value={restaurantData.cuisine}
                    onChange={handleRestaurantChange}
                >
                    <option>Italian</option>
                    <option>Indian</option>
                    <option>Chinese</option>
                    <option>Mexican</option>
                    <option>Continental</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="timing">Timing</label>
                <input
                    type="text"
                    id="timing"
                    name="timing"
                    value={restaurantData.timing}
                    onChange={handleRestaurantChange}
                    placeholder="Ex: 09:00-22:00"
                    required
                />
            </div>
        </div>
    </>
);


// --- Main ManageRestaurant Component ---

const ManageRestaurant = ({ user, token }) => {
    const [step, setStep] = useState(1);
    const [restaurantData, setRestaurantData] = useState({
        name: '',
        address: '',
        cuisine: 'Italian',
        price_for_two: '',
        timing: '09:00-22:00'
    });
    const [restaurantImage, setRestaurantImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [role, setRole] = useState(user?.role || 'customer');

    useEffect(() => {
        setRole(user?.role || 'customer');
    }, [user]);

    const handleRestaurantChange = (e) => {
        setRestaurantData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setRestaurantImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRestaurantSubmit = async (e) => {
        e.preventDefault();

        if (!restaurantData.name || !restaurantData.address || !restaurantData.price_for_two || !restaurantData.cuisine) {
            alert("Please fill all required fields.");
            return;
        }

        if (!restaurantImage) {
            alert("Please upload a restaurant image.");
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(restaurantData).forEach(key => formData.append(key, restaurantData[key]));
            formData.append('image', restaurantImage);

            const res = await axios.post(`${API_URL}/api/restaurants`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success) {
                toast.success('Restaurant registered successfully! Redirecting to your dashboard...');
                localStorage.setItem('role', 'restaurant_owner');
                setRole('restaurant_owner');

                // Redirect to restaurant admin dashboard after a short delay
                setTimeout(() => {
                    window.location.href = RESTAURANT_ADMIN_URL;
                }, 1500);
            } else {
                alert(res.data.message || 'An error occurred during registration.');
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error registering restaurant.');
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    if (!user) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
    }

    if (role !== 'customer') {
        return (
            <div className="manage-container">
                <div className="manage-header">
                    <h1>Welcome, {user.firstName}</h1>
                    <p>You are already a restaurant owner.</p>
                    <button
                        onClick={() => window.location.href = RESTAURANT_ADMIN_URL}
                        style={{
                            marginTop: '20px',
                            padding: '12px 24px',
                            backgroundColor: '#ff6b35',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}
                    >
                        Go to Restaurant Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='manage-container'>
            <div className="manage-header">
                <h1>Grow With SnapDish</h1>
                <p>Partner with us and reach more customers than ever.</p>
            </div>
            <div className="partner-section restaurant-partner">
                <div className="partner-info">
                    <img src={assets.restaurant} alt="Restaurant Partner" />
                    <h2>Partner with us and unlock new opportunities.</h2>
                </div>
                <div className="form-wrapper">
                    <div className="progress-bar">
                        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>Details</div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>Operations</div>
                    </div>
                    <form onSubmit={handleRestaurantSubmit}>
                        {step === 1 && (
                            <RestaurantStep1
                                restaurantData={restaurantData}
                                handleRestaurantChange={handleRestaurantChange}
                            />
                        )}
                        {step === 2 && (
                            <RestaurantStep2
                                restaurantData={restaurantData}
                                handleRestaurantChange={handleRestaurantChange}
                                handleImageChange={handleImageChange}
                                imagePreview={imagePreview}
                            />
                        )}
                        <div className="form-navigation">
                            {step > 1 && <button type="button" onClick={prevStep} className="prev-btn">Back</button>}
                            {step < 2 ? <button type="button" onClick={nextStep} className="next-btn">Next</button> : <button type="submit" className="submit-btn">Register Restaurant</button>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageRestaurant;