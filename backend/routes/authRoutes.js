const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', authController.login);
router.post('/verify', authController.verifyToken);
router.post('/check_email', authController.checkExistedEmail);
router.post('/check_otp_register', authController.checkOTPRegister);
router.post(
  '/check_email_forgot_password',
  authController.checkEmailForgotPassword
);
router.post('/logout', authMiddleware, authController.logout);
router.put('/check_otp_forgot_password', authController.checkOTPForgotPassword);

router.put('/change_password', authMiddleware, authController.changePassword);

module.exports = router;
