const { OTPPreRegister } = require('../models');

/**
 * Hàm tạo OTP mới và lưu vào cơ sở dữ liệu
 * @param {string} email - Địa chỉ email của người nhận OTP
 * @param {string} otp - Mã OTP cần tạo
 */
exports.createOTP = async (email, otp) => {
  try {
    const createdAt = new Date(); // Thời gian hiện tại
    console.log(createdAt);
    const expiresAt = new Date(createdAt.getTime() + 15 * 60 * 1000); // 15 phút sau

    // Tạo bản ghi OTP mới
    const newOTP = await OTPPreRegister.create({
      email,
      otp,
      created_at: createdAt, // Đúng tên trường trong database
      expires_at: expiresAt,
    });
    // console.log('Generated OTP:', newOTP.otp_id);
    return newOTP;
  } catch (error) {
    console.error('Error creating OTP:', error);
    throw new Error(error);
  }
};
exports.checkOTPById = async (otp_id, inputOtp) => {
  try {
    // Tìm OTP theo otp_id
    const otpRecord = await OTPPreRegister.findOne({
      where: { otp_id },
    });

    // Kiểm tra nếu không tìm thấy bản ghi
    if (!otpRecord) {
      return { success: false, message: 'OTP not found' };
    }

    // Kiểm tra thời gian hết hạn
    const currentTime = new Date();
    if (currentTime > otpRecord.expires_at) {
      otpRecord.is_valid = false; // Vô hiệu hóa OTP nếu hết hạn
      await otpRecord.save();
      return { success: false, message: 'OTP has expired' };
    }

    // Kiểm tra nếu OTP đã bị vô hiệu hóa
    if (!otpRecord.is_valid) {
      return { success: false, message: 'OTP is no longer valid' };
    }

    // Kiểm tra nếu đã vượt quá số lần thử cho phép
    if (otpRecord.failed_attempts >= 5) {
      return {
        success: false,
        message: 'OTP is invalid after 5 failed attempts',
      };
    }

    // Kiểm tra OTP
    if (otpRecord.otp !== inputOtp) {
      // Tăng số lần thất bại
      otpRecord.failed_attempts += 1;

      // Nếu vượt quá 5 lần, vô hiệu hóa OTP
      if (otpRecord.failed_attempts >= 5) {
        otpRecord.is_valid = false;
        await otpRecord.save();
        return {
          success: false,
          message: 'Invalid OTP. You have exceeded the maximum attempts.',
        };
      }

      await otpRecord.save(); // Lưu cập nhật số lần thất bại
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    return { success: true, message: 'OTP is valid' };
  } catch (error) {
    console.error('Error checking OTP:', error);
    throw new Error(error);
  }
};
