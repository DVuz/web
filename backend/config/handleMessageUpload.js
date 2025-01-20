const multer = require('multer');
const path = require('path');
const fs = require('fs');

const messageUploadConfig = {
  image: {
    path: 'uploads/messages/images',
    allowedTypes: [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/gif',
    ],
    maxSize: 5 * 1024 * 1024, // 5MB per file
  },
  video: {
    path: 'uploads/messages/videos',
    allowedTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
    maxSize: 100 * 1024 * 1024, // 100MB per file
  },
  voiceRecord: {
    path: 'uploads/messages/voice',
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    maxSize: 10 * 1024 * 1024, // 10MB per file
  },
  file: {
    path: 'uploads/messages/files',
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/zip',
      'application/x-rar-compressed',
    ],
    maxSize: 25 * 1024 * 1024, // 25MB per file
  },
};

// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Lấy type từ field type trong form-data
    const type = req.body.type || 'file';
    const uploadDir =
      messageUploadConfig[type]?.path || messageUploadConfig.file.path;
    const fullPath = path.join(__dirname, '..', uploadDir);

    // Tạo thư mục nếu chưa tồn tại
    fs.mkdir(fullPath, { recursive: true }, (err) => {
      if (err) {
        return cb(new Error(`Failed to create directory: ${err.message}`));
      }
      cb(null, fullPath);
    });
  },
  filename: (req, file, cb) => {
    const type = req.body.type || 'file';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${type}_${uniqueSuffix}${ext}`);
  },
});

// Kiểm tra file type và size
const fileFilter = (req, file, cb) => {
  const type = req.body.type || 'file';
  const config = messageUploadConfig[type] || messageUploadConfig.file;

  if (!config.allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        `Invalid file type. Allowed types for ${type}: ${config.allowedTypes.join(', ')}`
      ),
      false
    );
  }

  if (file.size > config.maxSize) {
    return cb(
      new Error(
        `File size exceeds limit. Max size for ${type}: ${config.maxSize / (1024 * 1024)}MB`
      ),
      false
    );
  }

  cb(null, true);
};

// Cấu hình multer upload
const messageUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 10, // Giới hạn 10 file
    fileSize: (req, file) => {
      const type = req.body.type || 'file';
      return (
        messageUploadConfig[type]?.maxSize || messageUploadConfig.file.maxSize
      );
    },
  },
}).array('files', 10); // field name là 'files', tối đa 10 file

// Middleware xử lý upload
const handleMessageUpload = (req, res, next) => {
  messageUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Xóa file đã upload nếu có lỗi
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlink(file.path, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting file:', unlinkErr);
          });
        });
      }

      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum is 10 files per upload.',
        });
      }

      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: `File size too large. Check size limits for each file type.`,
        });
      }

      return res.status(400).json({
        success: false,
        message: 'File upload error',
        error: err.message,
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    next();
  });
};

module.exports = handleMessageUpload;
