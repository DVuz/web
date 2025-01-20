// models/UserSession.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserSession extends Model {
    static associate(models) {
      UserSession.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }

  UserSession.init(
    {
      session_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      device_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        // Unique identifier cho thiết bị
      },
      device_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        // Tên thiết bị (ví dụ: iPhone 12, Chrome on Windows)
      },
      device_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
        // Loại thiết bị (mobile, desktop, tablet)
      },
      os_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
        // Hệ điều hành (iOS, Android, Windows)
      },
      browser: {
        type: DataTypes.STRING(50),
        allowNull: true,
        // Trình duyệt được sử dụng
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      last_activity: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'UserSession',
      tableName: 'user_sessions',
      timestamps: false,
    }
  );

  return UserSession;
};

// services/authService.js
const jwt = require('jsonwebtoken');
const { UserAuthentication, UserSession, User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const UAParser = require('ua-parser-js');

const login = async (email, password, userAgent) => {
  const user = await UserAuthentication.findOne({
    where: { email, provider: 'email' },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  // Parse user agent để lấy thông tin thiết bị
  const parser = new UAParser(userAgent);
  const deviceInfo = parser.getResult();

  // Tạo device_id unique cho thiết bị này
  const deviceId = uuidv4();

  // Generate tokens
  const accessToken = jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      deviceId: deviceId,
    },
    process.env.JWT_SECRET,
    { expiresIn: '2m' }
  );

  const refreshToken = jwt.sign(
    { id: user.user_id, email: user.email, deviceId: deviceId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  // Lưu thông tin phiên đăng nhập
  await UserSession.create({
    user_id: user.user_id,
    device_id: deviceId,
    device_name: `${deviceInfo.device.vendor} ${deviceInfo.device.model}`,
    device_type: deviceInfo.device.type || 'desktop',
    os_type: deviceInfo.os.name,
    browser: deviceInfo.browser.name,
    refresh_token: refreshToken,
    token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    last_activity: new Date(),
  });

  return { accessToken, refreshToken };
};

const logout = async (userId, deviceId, logoutAll = false) => {
  try {
    if (logoutAll) {
      // Đăng xuất khỏi tất cả thiết bị
      await UserSession.update(
        {
          refresh_token: null,
          token_expires_at: null,
          is_active: false,
          updated_at: new Date(),
        },
        {
          where: { user_id: userId },
        }
      );
    } else {
      // Đăng xuất khỏi thiết bị hiện tại
      await UserSession.update(
        {
          refresh_token: null,
          token_expires_at: null,
          is_active: false,
          updated_at: new Date(),
        },
        {
          where: {
            user_id: userId,
            device_id: deviceId,
          },
        }
      );
    }

    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

const getUserSessions = async (userId) => {
  const sessions = await UserSession.findAll({
    where: {
      user_id: userId,
      is_active: true,
    },
    order: [['last_activity', 'DESC']],
  });

  return sessions;
};

const logoutFromDevices = async (userId, deviceIds) => {
  await UserSession.update(
    {
      refresh_token: null,
      token_expires_at: null,
      is_active: false,
      updated_at: new Date(),
    },
    {
      where: {
        user_id: userId,
        device_id: deviceIds,
      },
    }
  );

  return { success: true, message: 'Logged out from selected devices' };
};

module.exports = {
  login,
  logout,
  getUserSessions,
  logoutFromDevices,
};

// controllers/authController.js
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent'];

    const { accessToken, refreshToken } = await authService.login(
      email,
      password,
      userAgent
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
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
    const { logoutAll } = req.body;
    const userId = req.user.id;
    const deviceId = req.user.deviceId;

    await authService.logout(userId, deviceId, logoutAll);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await authService.getUserSessions(req.user.id);
    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logoutDevices = async (req, res) => {
  try {
    const { deviceIds } = req.body;
    await authService.logoutFromDevices(req.user.id, deviceIds);

    return res.status(200).json({
      success: true,
      message: 'Logged out from selected devices',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
