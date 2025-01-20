const authService = require('../services/authService');
const otpRegisterService = require('../services/optRegisterService');
const userService = require('../services/userService');
const otpForgotPasswordService = require('../services/otpForgotPasswordService');
const userAuthentication = require('../services/userauthenticationService');
const jwt = require('jsonwebtoken');
const sendEmail = require('../mailers/sendOtpEmail');
const path = require('path');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const { accessToken, refreshToken } = await authService.login(
      email,
      password
    );

    // Set refresh token in http-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.logout = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    await authService.logout(req.user.id);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/', // Đảm bảo cookie được xóa đúng path
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during logout',
    });
  }
};
// Hàm xác minh accessToken
exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    const result = await authService.verifyAccessToken(token);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found',
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    if (!result.success) {
      res.clearCookie('refreshToken');
      return res.status(401).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
exports.checkExistedEmail = async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const checkEmail = await authService.checkExistedEmail(email);

    if (checkEmail) {
      // Trả về mã 409 khi email đã tồn tại
      return res.status(409).json({ message: 'Email already exists' });
    } else {
      // Chuẩn bị nội dung email

      const emailSubject = 'Verify your email to our website';
      const otpCode = '123456'; // Giả sử bạn sẽ sinh OTP thật sau này
      const emailContent = `
<html>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
      <div style="text-align: center; background-color: #4CAF50; padding: 20px;">
        <img src="cid:logo" alt="Logo" style="width: 100px; margin-bottom: 10px;" />
        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to Our Website!</h1>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Thank you for signing up for our website. Use the OTP code below to verify your email:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #4CAF50; background: #f2f2f2; padding: 10px 20px; border-radius: 5px;">${otpCode}</span>
        </div>
        <p style="font-size: 14px; color: #666; text-align: center;">If you didn't request this, please ignore this email.</p>
      </div>
      <div style="text-align: center; padding: 20px; background-color: #f1f1f1;">
        <p style="font-size: 12px; color: #999;">&copy; 2024 Our Website. All Rights Reserved.</p>
      </div>
    </div>
  </body>
</html>

      `;
      const logoPath = path.resolve(__dirname, '../assets/logo/logo.png');
      //tao otp
      const createdOTP = await otpRegisterService.createOTP(email, otpCode);
      // Gửi email
      await sendEmail(email, emailSubject, emailContent, logoPath);

      // Trả về mã 200 khi email chưa tồn tại và email gửi thành công
      return res.status(200).json({
        message: 'Email is available. OTP sent successfully.',
        otp_id: createdOTP.otp_id,
      });
    }
  } catch (error) {
    console.error('Lỗi trong backend:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.checkOTPRegister = async (req, res) => {
  const { otp_id, otp, user_name, email, gender, date_of_birth } = req.body; // Lấy otp_id và otp từ body request
  try {
    // Gọi service để kiểm tra OTP
    const result = await otpRegisterService.checkOTPById(otp_id, otp);

    // Trả về kết quả tùy theo kết quả trả về từ service
    if (result.success) {
      const rs = await userService.CreateUser(
        user_name,
        email,
        gender,
        date_of_birth
      );
      if (rs.success) {
        return res.status(200).json({
          success: true,
          message: rs.message, // Trả về thông tin người dùng đã tạo
        });
      } else {
        return res.status(400).json({
          success: false,
          message: rs.message,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while verifying OTP',
    });
  }
};
exports.checkEmailForgotPassword = async (req, res) => {
  const email = req.body.email;

  // Kiểm tra email có được cung cấp không
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Kiểm tra email có tồn tại trong cơ sở dữ liệu không
    const checkEmail = await userAuthentication.checkExistedEmail(email);

    if (!checkEmail) {
      return res.status(404).json({ error: 'Email does not exist' });
    }

    // Chuẩn bị nội dung email
    const emailSubject = 'Reset your password';
    const otpCode = 123456; // Sinh OTP ngẫu nhiên
    const emailContent = `
      <html>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="text-align: center; background-color: #4CAF50; padding: 20px;">
            <img src="cid:logo" alt="Logo" style="width: 100px; margin-bottom: 10px;" />
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Reset Your Password</h1>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">We received a request to reset your password. Use the OTP code below to proceed:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #4CAF50; background: #f2f2f2; padding: 10px 20px; border-radius: 5px;">${otpCode}</span>
            </div>
            <p style="font-size: 14px; color: #666; text-align: center;">If you didn’t request this, you can safely ignore this email.</p>
          </div>
          <div style="text-align: center; padding: 20px; background-color: #f1f1f1;">
            <p style="font-size: 12px; color: #999;">&copy; 2024 Our Website. All Rights Reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const logoPath = path.resolve(__dirname, '../assets/logo/logo.png');

    // Gửi email
    await sendEmail(email, emailSubject, emailContent, logoPath);
    await otpForgotPasswordService.createOTP(email, otpCode);
    // Trả lời thành công
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error in checkEmailForgotPassword:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.checkOTPForgotPassword = async (req, res) => {
  try {
    const { otp_id, email, otp, newpassword } = req.body;

    // Kiểm tra các tham số đầu vào
    if (!otp_id || !email || !otp || !newpassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Kiểm tra OTP qua otpForgotPasswordService
    const otpResult = await otpForgotPasswordService.checkOTPById(otp_id, otp);
    if (!otpResult.success) {
      return res.status(400).json({ message: otpResult.message });
    }

    // Cập nhật mật khẩu sau khi OTP hợp lệ
    const passwordResult = await userAuthentication.updatePassword(
      email,
      newpassword
    );
    if (!passwordResult.success) {
      return res.status(400).json({ message: passwordResult.message });
    }

    // Trả về phản hồi thành công
    return res.status(200).json({ message: passwordResult.message });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while verifying OTP or updating password',
    });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, current password, and new password are required',
      });
    }

    // Call the service to change password
    const result = await authService.changePassword(
      email,
      currentPassword,
      newPassword
    );

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
