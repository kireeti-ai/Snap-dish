// In Back/utils/cloudinary.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const uploadToCloudinary = async (localFilePath, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: folderName, // e.g., 'restaurants', 'foods', 'avatars'
      resource_type: 'auto',
    });
    
    // Delete the file from local storage after a successful upload
    fs.unlinkSync(localFilePath);
    
    return result.secure_url;
  } catch (error) {
    // If upload fails, still delete the local file
    fs.unlinkSync(localFilePath);
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

export default uploadToCloudinary;