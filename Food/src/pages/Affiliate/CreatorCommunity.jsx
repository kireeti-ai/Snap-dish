import React, { useState } from 'react';
import './CreatorCommunity.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreatorCommunity = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        bio: '',
        platforms: [{ name: 'Instagram', handle: '', followers: '' }],
        contentStyle: [],
        bestPosts: ['', '', ''],
        proposal: '',
        rates: '',
        agreedToTerms: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox' && name === 'contentStyle') {
            const newContentStyle = checked
                ? [...formData.contentStyle, value]
                : formData.contentStyle.filter((style) => style !== value);
            setFormData({ ...formData, contentStyle: newContentStyle });
        } else {
            setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        }
    };

    const handlePlatformChange = (index, e) => {
        const { name, value } = e.target;
        const newPlatforms = [...formData.platforms];
        newPlatforms[index][name] = value;
        setFormData({ ...formData, platforms: newPlatforms });
    };

    const addPlatform = () => {
        setFormData({
            ...formData,
            platforms: [...formData.platforms, { name: 'YouTube', handle: '', followers: '' }],
        });
    };

    const removePlatform = (index) => {
        if (formData.platforms.length > 1) {
            const newPlatforms = formData.platforms.filter((_, i) => i !== index);
            setFormData({ ...formData, platforms: newPlatforms });
        }
    };

    const handleBestPostsChange = (index, e) => {
        const newBestPosts = [...formData.bestPosts];
        newBestPosts[index] = e.target.value;
        setFormData({ ...formData, bestPosts: newBestPosts });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form submitted!'); // DEBUG
        console.log('Form data:', formData); // DEBUG

        if (!formData.agreedToTerms) {
            toast.error('You must agree to the terms and conditions.');
            return;
        }

        // Filter out empty best posts
        const filteredBestPosts = formData.bestPosts.filter(post => post.trim() !== '');

        if (filteredBestPosts.length === 0) {
            toast.error('Please provide at least one link to your best post.');
            return;
        }

        // Prepare submission data
        const submissionData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            bio: formData.bio,
            platforms: formData.platforms,
            contentStyle: formData.contentStyle,
            bestPosts: filteredBestPosts,
            proposal: formData.proposal,
            rates: formData.rates || '',
        };

        console.log('Submitting data:', submissionData); // DEBUG

        setLoading(true);

        try {
            // Use environment variable or fallback to localhost
            const API_URL = 'http://localhost:4000';
            console.log('API URL:', `${API_URL}/api/creator-application/submit`); // DEBUG

            const response = await axios.post(
                `${API_URL}/api/creator-application/submit`,
                submissionData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000, // 10 second timeout
                }
            );

            console.log('Response:', response.data); // DEBUG
            toast.success(response.data.message || 'Application submitted successfully!');

            // Reset form after successful submission
            setFormData({
                name: '',
                email: '',
                phone: '',
                city: '',
                bio: '',
                platforms: [{ name: 'Instagram', handle: '', followers: '' }],
                contentStyle: [],
                bestPosts: ['', '', ''],
                proposal: '',
                rates: '',
                agreedToTerms: false,
            });
        } catch (error) {
            console.error('Full error object:', error); // DEBUG
            console.error('Error response:', error.response); // DEBUG

            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || 'Server error. Please try again.';
                toast.error(errorMessage);
                console.error('Server error:', error.response.status, error.response.data);
            } else if (error.request) {
                // Request made but no response received
                toast.error('Cannot connect to server. Please check if the server is running.');
                console.error('No response from server:', error.request);
            } else {
                // Error in request setup
                toast.error('Error submitting form. Please try again.');
                console.error('Request setup error:', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="creator-community-page">
            <div className="creator-form-container">
                <div className="form-header">
                    <h1>Join Our Creator Community</h1>
                    <p>Partner with SnapDish to share your love for food and earn rewards!</p>
                </div>
                <form onSubmit={handleSubmit} className="creator-form">
                    <fieldset>
                        <legend>Your Information</legend>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City & Country"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="bio"
                            placeholder="Tell us about yourself and your content"
                            value={formData.bio}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </fieldset>

                    <fieldset>
                        <legend>Your Platforms</legend>
                        {formData.platforms.map((platform, index) => (
                            <div key={index} className="platform-group">
                                <select
                                    name="name"
                                    value={platform.name}
                                    onChange={(e) => handlePlatformChange(index, e)}
                                    required
                                >
                                    <option value="Instagram">Instagram</option>
                                    <option value="YouTube">YouTube</option>
                                    <option value="TikTok">TikTok</option>
                                    <option value="Blog">Blog</option>
                                    <option value="Twitter/X">Twitter/X</option>
                                </select>
                                <input
                                    type="text"
                                    name="handle"
                                    placeholder="@handle or URL"
                                    value={platform.handle}
                                    onChange={(e) => handlePlatformChange(index, e)}
                                    required
                                />
                                <input
                                    type="text"
                                    name="followers"
                                    placeholder="Followers (e.g., 50k, 1.2M)"
                                    value={platform.followers}
                                    onChange={(e) => handlePlatformChange(index, e)}
                                    required
                                />
                                {formData.platforms.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePlatform(index)}
                                        className="remove-platform-btn"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addPlatform} className="add-platform-btn">
                            Add Another Platform
                        </button>
                    </fieldset>

                    <fieldset>
                        <legend>Content & Audience</legend>
                        <div className="checkbox-group">
                            <p>What is your content style? (Select all that apply)</p>
                            <label>
                                <input
                                    type="checkbox"
                                    name="contentStyle"
                                    value="Restaurant Reviews"
                                    onChange={handleChange}
                                /> Restaurant Reviews
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="contentStyle"
                                    value="Home Cooking"
                                    onChange={handleChange}
                                /> Home Cooking
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="contentStyle"
                                    value="Mukbang"
                                    onChange={handleChange}
                                /> Mukbang
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="contentStyle"
                                    value="Food Photography"
                                    onChange={handleChange}
                                /> Food Photography
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="contentStyle"
                                    value="Healthy Lifestyle"
                                    onChange={handleChange}
                                /> Healthy Lifestyle
                            </label>
                        </div>
                        <p>Links to your best food-related posts (at least 1 required):</p>
                        {formData.bestPosts.map((post, index) => (
                            <input
                                key={index}
                                type="url"
                                placeholder={`Post URL #${index + 1}`}
                                value={post}
                                onChange={(e) => handleBestPostsChange(index, e)}
                            />
                        ))}
                    </fieldset>

                    <fieldset>
                        <legend>Partnership Details</legend>
                        <textarea
                            name="proposal"
                            placeholder="How do you envision promoting SnapDish?"
                            value={formData.proposal}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <input
                            type="text"
                            name="rates"
                            placeholder="Your standard rates for a sponsored post (Optional)"
                            value={formData.rates}
                            onChange={handleChange}
                        />
                    </fieldset>

                    <fieldset>
                        <div className="terms-agreement">
                            <input
                                type="checkbox"
                                id="agreedToTerms"
                                name="agreedToTerms"
                                checked={formData.agreedToTerms}
                                onChange={handleChange}
                            />
                            <label htmlFor="agreedToTerms">
                                I confirm that the information provided is accurate and I agree to the terms of the SnapDish Creator Program.
                            </label>
                        </div>
                    </fieldset>

                    <button
                        type="submit"
                        className="submit-application-btn"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatorCommunity;