import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    if (req.baseUrl.includes('restaurants')) {
      uploadPath += 'restaurants/';
    } else if (req.baseUrl.includes('menu')) {
      uploadPath += 'foods/';
    } else if (req.baseUrl.includes('users')) {
      uploadPath += 'avatars/';
    } else {
      uploadPath += 'avatars/';
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const entityId = req.params.id || 'new';
    const entityType = req.baseUrl.split('/').pop();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${entityType}-${entityId}-${uniqueSuffix}${extension}`);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Export both default and named export for compatibility
export default upload;
export { upload };