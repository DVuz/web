const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');

// Route để lấy tất cả người dùng (yêu cầu xác thực)
router.get('/', authMiddleware, userController.getUsers);

// Route để tạo người dùng mới (yêu cầu xác thực)
router.post('/', authMiddleware, userController.createUser);
router.get(
  '/get_user_by_email',
  authMiddleware,
  userController.getUserInfoByEmail
);
router.put(
  '/update_user_with_avatar',
  authMiddleware,
  upload.single('avatar'),
  userController.updateUserWithAvatar
);

router.get('/search', authMiddleware, userController.searchUsers);

module.exports = router;
