import { useState, useEffect, useContext } from "react";
import { Edit3, Save, X } from "lucide-react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "./profile.css";

export default function PersonalInfoEdit() {
  const { token, url } = useContext(StoreContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${url}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          setProfileData(data.user);
          setFormData(data.user);
        } else {
          toast.error("Failed to fetch profile.");
        }
      } catch (error) {
        toast.error("Error fetching profile.");
      }
    };

    if (token) fetchProfile();
  }, [token, url]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put(`${url}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setProfileData(data.user);
        setFormData(data.user);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("Error updating profile.");
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setIsEditing(false);
  };

  if (!profileData) return <p>Loading profile...</p>;

  return (
    <div className="personal-container">
      <div className="personal-card">
        {/* Left Side */}
        <div className="personal-form">
          <h2>Personal Information</h2>

          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            ) : (
              <p>{profileData.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            ) : (
              <p>{profileData.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone_number || ""}
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
              />
            ) : (
              <p>{profileData.phone_number}</p>
            )}
          </div>

          {/* Role (read-only) */}
          <div className="form-group">
            <label>Role</label>
            <p>{profileData.role}</p>
          </div>

          {/* Status (read-only) */}
          <div className="form-group">
            <label>Status</label>
            <p>{profileData.status}</p>
          </div>

          <div className="button-group">
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} /> Edit
              </button>
            ) : (
              <>
                <button className="save-btn" onClick={handleSave}>
                  <Save size={16} /> Save
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  <X size={16} /> Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="personal-profile">
          <img
            src={profileData.avatar || "/api/placeholder/120/120"}
            alt="Profile"
            className="avatar"
          />
          <h3>{profileData.name}</h3>
          <p className="joined">Customer since {new Date(profileData.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}