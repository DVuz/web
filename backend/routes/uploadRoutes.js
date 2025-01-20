const express = require('express');
const upload = require('../config/multerConfig');
const router = express.Router();

// Route upload file (vd: /api/upload/message/img)
router.post('/upload/:category/:type', upload.single('file'), (req, res) => {
  const { category, type } = req.params; // Ví dụ: category = 'message', type = 'img'

  // Kiểm tra nếu không có tệp được tải lên
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Đường dẫn tệp
  const filePath = `/uploads/${category}/${type}/${req.file.filename}`;

  // Phản hồi thành công
  res.status(200).json({
    message: 'File uploaded successfully!',
    filePath, // Đường dẫn file để frontend sử dụng
  });
});

module.exports = router;
