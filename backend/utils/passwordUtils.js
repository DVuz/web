const bcrypt = require('bcrypt');

// Hàm băm mật khẩu
const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Số lần lặp để tạo salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Error hashing password');
  }
};

// Hàm so sánh mật khẩu
const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error comparing password:', error);
    throw new Error('Error comparing password');
  }
};
const validatePassword = (password) => {
  const errors = [];

  // Kiểm tra độ dài mật khẩu
  if (password.length < 8 || password.length > 16) {
    errors.push('Password must be between 8 and 16 characters.');
  }

  // Kiểm tra chữ hoa
  const uppercaseRegex = /[A-Z]/;
  if (!uppercaseRegex.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }

  // Kiểm tra chữ thường
  const lowercaseRegex = /[a-z]/;
  if (!lowercaseRegex.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
  }

  // Kiểm tra ký tự đặc biệt
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(password)) {
    errors.push('Password must contain at least one special character.');
  }

  // Kiểm tra chữ số
  const numberRegex = /[0-9]/;
  if (!numberRegex.test(password)) {
    errors.push('Password must contain at least one number.');
  }

  // Nếu có lỗi, trả về lỗi
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Mật khẩu hợp lệ
  return { valid: true, errors: [] };
};
// Xuất hàm để sử dụng ở nơi khác
module.exports = { hashPassword, comparePassword, validatePassword };
