import React, { useState } from 'react';
import './ManageRestaurant.css';
import { assets } from '../../assets/assets'; 
const ManageRestaurant = () => {
    
    const [view, setView] = useState('restaurant');
    const [step, setStep] = useState(1);

    const [restaurantData, setRestaurantData] = useState({
        name: '', description: '', address: '', cuisine: 'Italian', openingTime: '09:00', closingTime: '22:00'
    });
    const [restaurantImage, setRestaurantImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [agentData, setAgentData] = useState({
        name: '', phone: '', vehicleType: 'Bike'
    });

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
    const handleRestaurantSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting Restaurant Data:', restaurantData);
        alert('Restaurant registration submitted successfully!');
        setStep(1); 
    };
    const handleAgentChange = (e) => {
        setAgentData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleAgentSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting Agent Data:', agentData);
        alert('Delivery Agent application submitted successfully!');
    };


    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);


    const RestaurantStep1 = () => (
        <>
            <div className="form-group with-icon">
                <label htmlFor="name">Restaurant Name</label>
                <i className="icon-building"></i>
                <input type="text" id="name" name="name" value={restaurantData.name} onChange={handleRestaurantChange} placeholder="ex : The Gourmet Place" required />
            </div>
            <div className="form-group">
                <label htmlFor="description">Short Description</label>
                <textarea id="description" name="description" value={restaurantData.description} onChange={handleRestaurantChange} placeholder="A short, catchy description of your restaurant" required />
            </div>
            <div className="form-group with-icon">
                <label htmlFor="address">Full Address</label>
                <i className="icon-location"></i>
                <input type="text" id="address" name="address" value={restaurantData.address} onChange={handleRestaurantChange} placeholder="123 Food Street, Flavor Town" required />
            </div>
        </>
    );

    const RestaurantStep2 = () => (
        <>
            <div className="form-group image-upload">
                <label>Restaurant Image</label>
                <label htmlFor="image" className="image-upload-box">
                    {imagePreview ? <img src={assets.restaurant} alt="Preview" className="image-preview"/> : <img src={assets.upload_area} alt="Upload Icon" />}
                </label>
                <input onChange={handleImageChange} type="file" id="image" accept="image/*" hidden required />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cuisine">Cuisine Type</label>
                    <select id="cuisine" name="cuisine" value={restaurantData.cuisine} onChange={handleRestaurantChange}>
                        <option>Italian</option><option>Indian</option><option>Chinese</option><option>Mexican</option><option>Continental</option>
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
        </>
    );

    return (
        <div className='manage-container'>
            <div className="manage-header">
                <h1>Grow With SnapDish</h1>
                <p>Choose your journey with us and unlock new opportunities.</p>
            </div>

            <div className="view-toggle">
                <button onClick={() => setView('restaurant')} className={view === 'restaurant' ? 'active' : ''}>Restaurant Partner</button>
                <button onClick={() => setView('agent')} className={view === 'agent' ? 'active' : ''}>Delivery Agent</button>
            </div>
            
            <div className={`form-view ${view === 'restaurant' ? 'show' : ''}`}>
                <div className="partner-section restaurant-partner">
                    <div className="partner-info">
                        <img src={assets.restaurant} alt="Restaurant Partner"/>
                        <h2>Partner with us and reach more customers than ever.</h2>
                        <div className="benefits-grid">
                            <div className="benefit-card"><h3>Wider Reach</h3><p>Connect with our large and growing user base.</p></div>
                            <div className="benefit-card"><h3>Easy Management</h3><p>Manage orders and menus with our simple dashboard.</p></div>
                            <div className="benefit-card"><h3>Growth Tools</h3><p>Utilize analytics and marketing tools to boost sales.</p></div>
                        </div>
                    </div>
                    <div className="form-wrapper">
                        <div className="progress-bar">
                            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>Details</div>
                            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>Operations</div>
                        </div>
                        <form onSubmit={handleRestaurantSubmit}>
                            {step === 1 && <RestaurantStep1 />}
                            {step === 2 && <RestaurantStep2 />}
                            <div className="form-navigation">
                                {step > 1 && <button type="button" onClick={prevStep} className="prev-btn">Back</button>}
                                {step < 2 ? <button type="button" onClick={nextStep} className="next-btn">Next</button> : <button type="submit" className="submit-btn">Register Restaurant</button>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className={`form-view ${view === 'agent' ? 'show' : ''}`}>
                <div className="partner-section agent-partner">
                    <div className="partner-info">
                        <img src={assets.agent} alt="Delivery Agent"/>
                        <h2>Become a delivery partner and earn on your own schedule.</h2>
                        <div className="benefits-grid">
                            <div className="benefit-card"><h3>Flexible Hours</h3><p>Work when you want, as much as you want.</p></div>
                            <div className="benefit-card"><h3>Weekly Earnings</h3><p>Get paid weekly with a transparent earning structure.</p></div>
                            <div className="benefit-card"><h3>Full Support</h3><p>Access to our support team whenever you need it.</p></div>
                        </div>
                    </div>
                    <div className="form-wrapper">
                        <h2>Your Details</h2>
                        <form onSubmit={handleAgentSubmit}>
                            <div className="form-group with-icon">
                                <label htmlFor="agent-name">Full Name</label><i className="icon-user"></i>
                                <input type="text" id="agent-name" name="name" value={agentData.name} onChange={handleAgentChange} placeholder="Enter your full name" required />
                            </div>
                             <div className="form-group with-icon">
                                <label htmlFor="phone">Phone Number</label><i className="icon-phone"></i>
                                <input type="tel" id="phone" name="phone" value={agentData.phone} onChange={handleAgentChange} placeholder="Enter your mobile number" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="vehicleType">Vehicle Type</label>
                                <select id="vehicleType" name="vehicleType" value={agentData.vehicleType} onChange={handleAgentChange}>
                                    <option>Bike</option><option>Scooter</option><option>Bicycle</option>
                                </select>
                            </div>
                            <div className="form-group terms"><input type="checkbox" id="terms" required/><label htmlFor="terms">I agree to the terms and have a valid driver's license.</label></div>
                            <button type="submit" className="submit-btn">Become a Delivery Partner</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageRestaurant;