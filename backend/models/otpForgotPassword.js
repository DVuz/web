'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OtpForgotPassword extends Model {
    static associate(models) {
      // Nếu cần liên kết với các bảng khác, thêm tại đây
      // Ví dụ: OtpForgotPassword.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  OtpForgotPassword.init(
    {
      otp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_valid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      failed_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'OtpForgotPassword',
      tableName: 'otpForgotPassword', // Tên bảng trong cơ sở dữ liệu
      timestamps: false, // Bỏ qua `createdAt` và `updatedAt` mặc định của Sequelize
    }
  );

  return OtpForgotPassword;
};
