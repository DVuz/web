const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();
const baseUrl = process.env.BASE_URL;

router.post('/refresh', async (req, res) => {
  // Lấy refreshToken từ cookie
  const refreshToken = req.cookies.refreshToken;
  // console.log(refreshToken);
  if (!refreshToken)
    return res.status(401).json({ error: 'No refresh token provided' });

  try {
    // Kiểm tra tính hợp lệ của refreshToken
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // console.log(decoded);
    // console.log(jwt.decode(refreshToken));

    // Lấy thông tin người dùng từ ID trong refreshToken
    const user = await User.findOne({ where: { email: decoded.email } });
    // console.log(user);

    if (!user) throw new Error('User not found');

    // Tạo accessToken mới
    const accessToken = jwt.sign(
      {
        id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        user_role: user.user_role,
        avatar: `${baseUrl}${user.avatar_link}`,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    // console.log(accessToken);

    // Trả về accessToken mới
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid refresh token' });
  }
});

module.exports = router;
