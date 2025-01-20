// models/User.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define association with AddressInfo
      User.hasOne(models.AddressInfo, { 
        foreignKey: 'user_id',
        as: 'address'
      });
    }
  }
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: 'Vietnamese',
      },
      gender: {
        type: DataTypes.ENUM,
        values: ['Male', 'Female', 'Other'],
        allowNull: true,
      },
      avatar_link: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '/uploads/avatars/default.jpg',
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      user_role: {
        type: DataTypes.ENUM,
        values: ['Customer', 'Delivery', 'Employment', 'Admin'],
        allowNull: true,
        defaultValue: 'Customer',
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      registration_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      account_status: {
        type: DataTypes.STRING(20),
        defaultValue: 'active',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
      created_at: 'created_at',
      updated_at: 'updated_at',
    }
  );
  return User;
};