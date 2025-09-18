import { useState, useEffect, useContext, useRef } from "react";
import { Edit3, Save, X, Camera, User } from "lucide-react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext.jsx";
import { toast } from "react-toastify";
import "./profile.css";

export default function PersonalInfoEdit() {
  const { token, url } = useContext(StoreContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${url}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('avatar', imageFile);

    try {
      setUploading(true);
      const { data } = await axios.post(`${url}/api/users/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        return data.avatarPath;
      } else {
        toast.error(data.message || 'Failed to upload image');
        return null;
      }
    } catch (error) {
      toast.error('Error uploading image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      let avatarPath = formData.avatar;

      // Upload image if there's a new one
      if (imageFile) {
        const uploadedPath = await uploadImage();
        if (uploadedPath) {
          avatarPath = uploadedPath;
        } else {
          return; // Don't proceed if image upload failed
        }
      }

      const updateData = {
        ...formData,
        avatar: avatarPath
      };

      const { data } = await axios.put(`${url}/api/users/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProfileData(data.user);
        setFormData(data.user);
        setImageFile(null);
        setImagePreview(null);
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
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!profileData) return <p>Loading profile...</p>;

  return (
    <div className="personal-container">
      <div className="personal-card">
        {/* Left Side */}
        <div className="personal-form">
          <h2>Personal Information</h2>

          {/* First Name */}
          <div className="form-group">
            <label>First Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            ) : (
              <p>{profileData.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label>Last Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            ) : (
              <p>{profileData.lastName}</p>
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
                <button 
                  className="save-btn" 
                  onClick={handleSave}
                  disabled={uploading}
                >
                  <Save size={16} /> {uploading ? 'Uploading...' : 'Save'}
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
          <div className="avatar-container">
            <div className="avatar-wrapper">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="avatar" />
              ) : profileData.avatar ? (
                <img 
                  src={`${url}/${profileData.avatar}`} 
                  alt="Profile" 
                  className="avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="avatar-placeholder">
                  <User size={40} />
                </div>
              )}
              
              {isEditing && (
                <button 
                  className="camera-btn" 
                  onClick={triggerFileInput}
                  type="button"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          <h3>
            {profileData.firstName} {profileData.lastName}
          </h3>
          <p className="joined">
            Customer since{" "}
            {new Date(profileData.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}