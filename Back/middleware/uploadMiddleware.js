import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "uploads/";
    
    // Determine upload path based on the route
    if (req.originalUrl.includes('/upload-avatar') || req.originalUrl.includes('/users/')) {
      uploadPath += "avatars";
    } else if (req.originalUrl.includes('/restaurants/')) {
      uploadPath += "restaurants";  
    } else if (req.originalUrl.includes('/menu/')) {
      uploadPath += "foods";
    } else {
      uploadPath += "avatars"; // default
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Sanitize filename
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + "_" + sanitizedName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    fieldSize: 1024 * 1024 // 1MB for text fields
  }
});

export default upload;