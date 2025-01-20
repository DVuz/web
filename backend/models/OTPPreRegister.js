'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class OTPPreRegister extends Model {
    static associate(models) {
      // Định nghĩa mối quan hệ với các model khác nếu cần.
      // Ví dụ: OTPPreRegister.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  OTPPreRegister.init(
    {
      otp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_valid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      failed_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OTPPreRegister',
      tableName: 'OTPPreRegister',
      timestamps: false, // Không sử dụng timestamps (createdAt, updatedAt) nếu không cần.
    }
  );

  return OTPPreRegister;
};
