// authService.js
const jwt = require('jsonwebtoken');
const { UserAuthentication, User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const baseUrl = process.env.BASE_URL;
const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

const generateTokens = async (user) => {
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

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  // Calculate token expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Store refresh token in database
  await UserAuthentication.update(
    {
      refresh_token: refreshToken,
      token_expires_at: expiresAt,
      updated_at: new Date(),
    },
    {
      where: { user_id: user.user_id },
    }
  );

  return { accessToken, refreshToken };
};

const login = async (email, password) => {
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  const user = await UserAuthentication.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }
  const user1 = await User.findOne({
    where: {
      email,
    },
  });

  return generateTokens(user1);
};
const changePassword = async (email, currentPassword, newPassword) => {
  // Validate email format
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Find user by email
  const user = await UserAuthentication.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid current password');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password and timestamp
  user.password = hashedPassword;
  user.updated_at = new Date();

  // Save changes
  await user.save();

  return { success: true, message: 'Password updated successfully' };
};

const verifyAccessToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { success: false, message: 'Token has expired' };
    }
    return { success: false, message: 'Invalid token' };
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user with this refresh token
    const user = await UserAuthentication.findOne({
      where: {
        user_id: decoded.id,
        refresh_token: refreshToken,
        token_expires_at: {
          [Op.gt]: new Date(), // Check if token hasn't expired
        },
      },
    });

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const accessToken = jwt.sign(
      {
        id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        avatar: `${baseUrl}${user.avatar_link}`,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return { success: true, accessToken };
  } catch (error) {
    return { success: false, message: 'Invalid refresh token' };
  }
};

const logout = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const result = await UserAuthentication.update(
      {
        refresh_token: null,
        token_expires_at: null,
        updated_at: new Date(),
      },
      {
        where: { user_id: userId },
      }
    );

    if (result[0] === 0) {
      throw new Error('User not found');
    }

    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Error during logout service:', error);
    throw error;
  }
};

const checkExistedEmail = async (email) => {
  if (!validateEmail(email)) {
    return { success: false, message: 'Invalid email format' };
  }

  const existingUser = await UserAuthentication.findOne({
    where: {
      email,
      provider: 'email',
    },
  });

  return { success: true, exists: !!existingUser };
};

module.exports = {
  login,
  checkExistedEmail,
  verifyAccessToken,
  refreshAccessToken,
  logout,
  changePassword,
};
