const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadTypes = {
  category: {
    path: 'uploads/categories',
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    prefix: 'category',
  },
  'product-main': {
    path: 'uploads/products/product-main',
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    prefix: 'main',
  },
  'product-sub': {
    path: 'uploads/products/product-sub',
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    prefix: 'sub',
  },
  'product-section': {
    path: 'uploads/products/sections',
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    prefix: 'section',
  },
  subcategory: {
    path: 'uploads/subcategories',
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    prefix: 'subcategory',
  },
  'product-type': {
    path: 'uploads/product-types',
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    prefix: 'product-type',
  },
  warehouse: {
    path: 'uploads/warehouses',
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    prefix: 'warehouse',
  },
  manufacturer: {
    path: 'uploads/manufacturers',
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    prefix: 'manufacturer',
  },
  avatar: {
    path: 'uploads/avatars',
    allowedTypes: [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
    ],
    prefix: 'avatar',
  },
};

const getUploadType = (reqPath, fieldName = null) => {
  if (reqPath.includes('product')) {
    if (fieldName === 'mainImage') return 'product-main';
    if (fieldName === 'subImages') return 'product-sub';
    if (fieldName === 'section_images') return 'product-section';
  }

  if (reqPath.includes('subcategory')) return 'subcategory';
  if (reqPath.includes('product-type')) return 'product-type';
  if (reqPath.includes('warehouse')) return 'warehouse';
  if (reqPath.includes('manufacturer')) return 'manufacturer';
  if (reqPath.includes('avatar')) return 'avatar';
  return 'category';
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log('req.path:', req.path);
    // console.log('file.fieldname:', file.fieldname);
    const uploadType = getUploadType(req.path, file.fieldname);
    const uploadDir = uploadTypes[uploadType].path;
    // console.log(uploadType);
    const fullPath = path.join(__dirname, '..', uploadDir);
    // console.log(fullPath);

    fs.mkdir(fullPath, { recursive: true }, (err) => {
      if (err) {
        return cb(new Error(`Failed to create directory: ${err.message}`));
      }
      cb(null, fullPath);
    });
  },
  filename: (req, file, cb) => {
    const uploadType = getUploadType(req.path, file.fieldname);
    const prefix = uploadTypes[uploadType].prefix;
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${prefix}_${uniqueSuffix}${ext}`);
    // console.log('file.originalname:', file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const uploadType = getUploadType(req.path, file.fieldname);
  const allowedTypes = uploadTypes[uploadType].allowedTypes;

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        `Invalid file type for ${uploadType}. Allowed types: ${allowedTypes.join(', ')}`
      ),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
