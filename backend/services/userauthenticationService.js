const { UserAuthentication } = require('../models');
const validateEmail = require('../utils/email');
const {
  hashPassword,
  comparePassword,
  validatePassword,
} = require('../utils/passwordUtils');

exports.checkExistedEmail = async (email) => {
  // Kiểm tra email có định dạng hợp lệ không
  if (!validateEmail(email)) {
    return { success: false, message: 'Email is not valid' };
  }
  const existingUser = await UserAuthentication.findOne({ where: { email } });
  if (existingUser) {
    return true;
  }
};

exports.updatePassword = async (email, newPassword) => {
  try {
    // Kiểm tra email có định dạng hợp lệ
    if (!validateEmail(email)) {
      return { success: false, message: 'Email is not valid' };
    }

    // Kiểm tra mật khẩu mới hợp lệ
    const { valid, errors } = validatePassword(newPassword);
    if (!valid) {
      return { success: false, message: 'Password is not valid', errors };
    }

    // Tìm người dùng theo email
    const user = await UserAuthentication.findOne({ where: { email } });
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Băm mật khẩu mới
    const hashedPassword = await hashPassword(newPassword);

    // Cập nhật mật khẩu
    user.password = hashedPassword;
    user.updated_at = new Date(); // Cập nhật thời gian chỉnh sửa

    // Lưu thay đổi
    await user.save();

    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, message: 'Error updating password' };
  }
};

//chua check
exports.addUserAuthentication = async (data) => {
  try {
    // Kiểm tra email có định dạng hợp lệ
    if (!validateEmail(data.email)) {
      return { success: false, message: 'Email is not valid' };
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await UserAuthentication.findOne({
      where: { email: data.email },
    });
    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }

    // Tạo dữ liệu mới
    const newUser = await UserAuthentication.create({
      user_id: data.user_id,
      provider: data.provider || 'EmailPassword', // Default provider nếu không có
      provider_user_id: data.provider_user_id || null,
      email: data.email,
      password: data.password, // Đảm bảo băm mật khẩu trước khi lưu
      created_at: new Date(),
      updated_at: new Date(),
    });

    return { success: true, data: newUser };
  } catch (error) {
    console.error('Error adding user authentication:', error);
    throw new Error('Error adding user authentication');
  }
};
