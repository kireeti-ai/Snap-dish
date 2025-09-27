import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    if (req.baseUrl.includes('restaurants')) {
      uploadPath += 'restaurants/';
    } else if (req.baseUrl.includes('menu-items')) {
      uploadPath += 'foods/';
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

const upload = multer({ storage });

export default upload;