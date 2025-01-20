// models/AddressInfo.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AddressInfo extends Model {
    static associate(models) {
      AddressInfo.belongsTo(models.User, { 
        foreignKey: 'user_id', 
        as: 'user',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  }
  AddressInfo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      city_id: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      district_id: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      ward_id: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      exact_address: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Detailed location information like house number, street name, etc.'
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    },
    {
      sequelize,
      modelName: 'AddressInfo',
      tableName: 'AddressInfo',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return AddressInfo;
};