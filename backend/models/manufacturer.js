'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Manufacturer extends Model {
    static associate(models) {
      Manufacturer.hasMany(models.Batch, {
        foreignKey: 'manufacturer_id',
        as: 'batches',
      });
    }
  }

  Manufacturer.init(
    {
      manufacturer_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      manufacturer_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      contact_info: {
        type: DataTypes.STRING(255),
      },
      address: {
        type: DataTypes.STRING(255),
      },
      phone_number: {
        type: DataTypes.STRING(15),
      },
      email: {
        type: DataTypes.STRING(100),
      },
      logo_url: {
        type: DataTypes.STRING(255),
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: 'Manufacturer',
      tableName: 'Manufacturers',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Manufacturer;
};
