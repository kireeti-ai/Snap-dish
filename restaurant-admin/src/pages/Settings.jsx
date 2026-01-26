import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { Save, RefreshCw, AlertCircle, CheckCircle, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    commissionRate: 15,
    deliveryFee: 5,
    platformName: 'SnapDish',
    supportEmail: 'support@snapdish.com'
  });

  const [originalSettings, setOriginalSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/api/admin/settings");

      if (response.data.success) {
        const settingsData = response.data.data;
        setSettings(settingsData);
        setOriginalSettings(settingsData);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Could not fetch settings.");
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (settingsData) => {
    setSaving(true);

    try {
      const response = await api.put("/api/admin/settings", settingsData);

      if (response.data.success) {
        toast.success("Settings updated successfully!");
        setOriginalSettings(settingsData);
        setHasUnsavedChanges(false);
      } else {
        toast.error(response.data.message || "Failed to update settings.");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);

    // Check if there are unsaved changes
    const hasChanges = Object.keys(newSettings).some(
      key => newSettings[key] !== originalSettings[key]
    );
    setHasUnsavedChanges(hasChanges);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (settings.commissionRate < 0 || settings.commissionRate > 100) {
      toast.error("Commission rate must be between 0 and 100");
      return;
    }

    if (settings.deliveryFee < 0) {
      toast.error("Delivery fee must be a positive number");
      return;
    }

    if (!settings.platformName.trim()) {
      toast.error("Platform name is required");
      return;
    }

    if (!settings.supportEmail.trim()) {
      toast.error("Support email is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(settings.supportEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    updateSettings(settings);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all changes? This will discard any unsaved changes.")) {
      setSettings(originalSettings);
      setHasUnsavedChanges(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Warn user about unsaved changes when leaving the page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500 animate-pulse">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Settings</h1>
        <p className="text-gray-600">Configure your platform settings and preferences</p>
      </div>


      {hasUnsavedChanges && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">You have unsaved changes</p>
            <p className="text-sm text-yellow-700">Don't forget to save your changes before leaving this page.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Platform Configuration */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <SettingsIcon className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Platform Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="platformName" className="block text-sm font-medium text-gray-700 mb-2">
                Platform Name
              </label>
              <input
                type="text"
                id="platformName"
                value={settings.platformName}
                onChange={(e) => handleInputChange('platformName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter platform name"
                required
                data-testid="platform-name-input"
              />
              <p className="text-xs text-gray-500 mt-1">This name will appear throughout the platform</p>
            </div>

            <div>
              <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                id="supportEmail"
                value={settings.supportEmail}
                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="support@example.com"
                required
                data-testid="support-email-input"
              />
              <p className="text-xs text-gray-500 mt-1">Primary email for customer support</p>
            </div>
          </div>
        </div>

    
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="commissionRate"
                  value={settings.commissionRate}
                  onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="15"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  data-testid="commission-rate-input"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Commission charged to restaurants per order</p>

              {/* Commission Preview */}
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Preview:</strong> For a ₹1000 order, commission will be ₹{(1000 * settings.commissionRate / 100).toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700 mb-2">
                Base Delivery Fee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                <input
                  type="number"
                  id="deliveryFee"
                  value={settings.deliveryFee}
                  onChange={(e) => handleInputChange('deliveryFee', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="5"
                  min="0"
                  step="0.1"
                  required
                  data-testid="delivery-fee-input"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Standard delivery fee for orders</p>


              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Current Fee:</strong> ₹{settings.deliveryFee} per delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Calculator</h2>
          <p className="text-sm text-gray-600 mb-4">Calculate potential platform revenue based on current settings</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-600 font-medium">Daily Orders</p>
              <p className="text-2xl font-bold text-blue-900">100</p>
              <p className="text-xs text-blue-600">Average order value: ₹500</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-green-600 font-medium">Commission Revenue</p>
              <p className="text-2xl font-bold text-green-900">
                ₹{((100 * 500 * settings.commissionRate) / 100).toFixed(0)}
              </p>
              <p className="text-xs text-green-600">Per day from commissions</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-sm text-purple-600 font-medium">Delivery Revenue</p>
              <p className="text-2xl font-bold text-purple-900">
                ₹{(100 * settings.deliveryFee).toFixed(0)}
              </p>
              <p className="text-xs text-purple-600">Per day from delivery fees</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              Total Daily Revenue:
              <span className="text-lg font-bold text-gray-900 ml-2">
                ₹{(((100 * 500 * settings.commissionRate) / 100) + (100 * settings.deliveryFee)).toFixed(0)}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Based on 100 orders/day with ₹500 average order value</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasUnsavedChanges || saving}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            data-testid="reset-settings-btn"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Reset Changes
          </button>

          <button
            type="submit"
            disabled={!hasUnsavedChanges || saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            data-testid="save-settings-btn"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 inline mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>

      {/* Settings History (if you want to show when settings were last updated) */}
      {originalSettings.updatedAt && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Last updated: {new Date(originalSettings.updatedAt).toLocaleString()}
            {originalSettings.updatedBy && (
              <span className="ml-2">by Admin</span>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Configuration Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Commission rates typically range from 10-25% in the food delivery industry</li>
          <li>• Lower delivery fees can increase order volume but reduce per-order revenue</li>
          <li>• Consider market competition when setting your rates</li>
          <li>• Changes take effect immediately after saving</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;