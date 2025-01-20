const jwt = require('jsonwebtoken');
const { UserAuthentication } = require('../models');
const { User } = require('../models');

const {
  hashPassword,
  comparePassword,
  validatePassword,
} = require('../utils/passwordUtils');

// Đăng nhập tài khoản
exports.login = async (email, password) => {
  console.log(email, password);
  const user = await UserAuthentication.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

  // So sánh mật khẩu (giả sử mật khẩu không được mã hóa)
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Password is incorrect');
  }

  // Tạo Access Token với thời gian hiệu lực là 20 giây
  const accessToken = jwt.sign(
    {
      id: user.user_id,
      user_name: user.user_name,
      email: user.email,
      user_name: user.user_name,
      avatar: 'https://192.168.0.102:3000/api/media/test/a.jpg',
    },
    process.env.JWT_SECRET,
    { expiresIn: '2m' }
  );
  // console.log(jwt.decode(accessToken));
  // Tạo Refresh Token với thời gian hiệu lực là 30 ngày
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};
const validateEmail = (email) => {
  // Biểu thức chính quy kiểm tra định dạng email hợp lệ
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};
exports.checkExistedEmail = async (email) => {
  // Kiểm tra email có định dạng hợp lệ không
  if (!validateEmail(email)) {
    return { success: false, message: 'Email is not valid' };
  }
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return true;
  }
};
