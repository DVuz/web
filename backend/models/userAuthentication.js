'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserAuthentication extends Model {
    static associate(models) {
      UserAuthentication.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }

  UserAuthentication.init(
    {
      method_id: {
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
        onDelete: 'CASCADE',
      },
      provider: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      provider_user_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'UserAuthentication',
      tableName: 'UserAuthentication',
      timestamps: true, // Bật quản lý tự động created_at và updated_at
      underscored: true, // Đổi định dạng createdAt -> created_at (snake_case)
    }
  );

  return UserAuthentication;
};
