import React, { useState } from 'react';
import './ManageRestaurant.css';
import { assets } from '../../assets/assets'; 

const ManageRestaurant = () => {
    const [view, setView] = useState('restaurant'); 
    const [restaurantData, setRestaurantData] = useState({
        name: '',
        description: '',
        address: '',
        cuisine: 'Italian',
        openingTime: '09:00',
        closingTime: '22:00'
    });
    const [restaurantImage, setRestaurantImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [agentData, setAgentData] = useState({
        name: '',
        phone: '',
        vehicleType: 'Bike'
    });

    const handleRestaurantChange = (e) => {
        const { name, value } = e.target;
        setRestaurantData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setRestaurantImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRestaurantSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', restaurantData.name);
        formData.append('description', restaurantData.description);
        formData.append('address', restaurantData.address);
        formData.append('cuisine', restaurantData.cuisine);
        formData.append('openingTime', restaurantData.openingTime);
        formData.append('closingTime', restaurantData.closingTime);
        if (restaurantImage) {
            formData.append('image', restaurantImage);
        }

        console.log('Submitting Restaurant Data:', Object.fromEntries(formData.entries()));
        alert('Restaurant registration submitted successfully! (Check console for data)');
        setRestaurantData({
            name: '', description: '', address: '', cuisine: 'Italian', openingTime: '09:00', closingTime: '22:00'
        });
        setRestaurantImage(null);
        setImagePreview(null);
    };


    const handleAgentChange = (e) => {
        const { name, value } = e.target;
        setAgentData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleAgentSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting Agent Data:', agentData);
        alert('Delivery Agent application submitted successfully! (Check console for data)');
        // Reset form
        setAgentData({ name: '', phone: '', vehicleType: 'Bike' });
    };


    return (
        <div className='manage-container'>
            <div className="manage-header">
                <h1>Partner With Us</h1>
                <p>Join our platform to grow your business or earn on your own schedule.</p>
            </div>

            <div className="view-toggle">
                <button onClick={() => setView('restaurant')} className={view === 'restaurant' ? 'active' : ''}>
                    Become a Restaurant Partner
                </button>
                <button onClick={() => setView('agent')} className={view === 'agent' ? 'active' : ''}>
                    Become a Delivery Agent
                </button>
            </div>

            {view === 'restaurant' ? (
                <div className="form-wrapper">
                    <h2>Register Your Restaurant</h2>
                    <form onSubmit={handleRestaurantSubmit} className="partner-form">
                        <div className="form-group image-upload">
                             <label htmlFor="image">Restaurant Image</label>
                             <label htmlFor="image" className="image-upload-box">
                                {imagePreview ? <img src={imagePreview} alt="Preview" className="image-preview"/> : <img src={assets.upload_area} alt="Upload Icon" />}
                             </label>
                            <input onChange={handleImageChange} type="file" id="image" accept="image/*" hidden required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Restaurant Name</label>
                            <input type="text" id="name" name="name" value={restaurantData.name} onChange={handleRestaurantChange} placeholder="Enter restaurant name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" name="description" value={restaurantData.description} onChange={handleRestaurantChange} placeholder="Tell us about your restaurant" required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="address">Full Address</label>
                            <input type="text" id="address" name="address" value={restaurantData.address} onChange={handleRestaurantChange} placeholder="e.g., 123 Food Street, City" required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cuisine">Cuisine Type</label>
                                <select id="cuisine" name="cuisine" value={restaurantData.cuisine} onChange={handleRestaurantChange}>
                                    <option>Italian</option>
                                    <option>Indian</option>
                                    <option>Chinese</option>
                                    <option>Mexican</option>
                                    <option>Continental</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="openingTime">Opening Time</label>
                                <input type="time" id="openingTime" name="openingTime" value={restaurantData.openingTime} onChange={handleRestaurantChange} required />
                            </div>
                             <div className="form-group">
                                <label htmlFor="closingTime">Closing Time</label>
                                <input type="time" id="closingTime" name="closingTime" value={restaurantData.closingTime} onChange={handleRestaurantChange} required />
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">Submit for Review</button>
                    </form>
                </div>
            ) : (
                 <div className="form-wrapper">
                    <h2>Join Our Delivery Fleet</h2>
                    <form onSubmit={handleAgentSubmit} className="partner-form">
                         <div className="form-group">
                            <label htmlFor="agent-name">Full Name</label>
                            <input type="text" id="agent-name" name="name" value={agentData.name} onChange={handleAgentChange} placeholder="Enter your full name" required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" value={agentData.phone} onChange={handleAgentChange} placeholder="Enter your mobile number" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="vehicleType">Vehicle Type</label>
                            <select id="vehicleType" name="vehicleType" value={agentData.vehicleType} onChange={handleAgentChange}>
                                <option>Bike</option>
                                <option>Scooter</option>
                                <option>Bicycle</option>
                                <option>E-Rickshaw</option>
                            </select>
                        </div>
                        <div className="form-group terms">
                            <input type="checkbox" id="terms" required/>
                            <label htmlFor="terms">I agree to the terms and conditions and have a valid driver's license.</label>
                        </div>
                        <button type="submit" className="submit-btn">Register as Delivery Agent</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageRestaurant;
