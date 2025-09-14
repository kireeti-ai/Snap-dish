// Back/middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";

// Destination folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

// Accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;