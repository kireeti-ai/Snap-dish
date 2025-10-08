import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function Settings() {
  const [settings, setSettings] = useState({
    commissionRate: 15,
    deliveryFee: 5,
    platformName: 'SnapDish',
    supportEmail: 'support@snapdish.com'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Settings fetch error:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === 'commissionRate' || name === 'deliveryFee' ? parseFloat(value) : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/api/admin/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success('Settings saved successfully!');
        setSettings(response.data.data);
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Settings save error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Settings</h2>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Platform Settings</h2>
      <div className="settings-form" style={{ maxWidth: '600px' }}>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="platformName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Platform Name
          </label>
          <input
            type="text"
            id="platformName"
            name="platformName"
            value={settings.platformName}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="supportEmail" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Support Email
          </label>
          <input
            type="email"
            id="supportEmail"
            name="supportEmail"
            value={settings.supportEmail}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="commissionRate" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Restaurant Commission Rate (%)
          </label>
          <input
            type="number"
            id="commissionRate"
            name="commissionRate"
            value={settings.commissionRate}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.1"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
          <small style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
            Percentage charged from restaurants on each order
          </small>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="deliveryFee" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Base Delivery Fee (₹)
          </label>
          <input
            type="number"
            id="deliveryFee"
            name="deliveryFee"
            value={settings.deliveryFee}
            onChange={handleChange}
            min="0"
            step="0.1"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
          <small style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
            Default delivery fee for orders
          </small>
        </div>

        <button 
          className="btn" 
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: saving ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ marginTop: 0 }}>Current Settings</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
            <strong>Platform Name:</strong> {settings.platformName}
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
            <strong>Support Email:</strong> {settings.supportEmail}
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
            <strong>Commission Rate:</strong> {settings.commissionRate}%
          </li>
          <li style={{ padding: '0.5rem 0' }}>
            <strong>Delivery Fee:</strong> ₹{settings.deliveryFee}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Settings;