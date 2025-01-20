'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ShippingFee extends Model {
    static associate(models) {
      // define association here
    }
  }

  ShippingFee.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      min_distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      max_distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isGreaterThanMin(value) {
            if (parseInt(value) <= parseInt(this.min_distance)) {
              throw new Error('max_distance must be greater than min_distance');
            }
          },
        },
      },
      fee: {
        type: DataTypes.INTEGER, // Chuyển thành INTEGER
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ShippingFee',
      tableName: 'ShippingFees',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return ShippingFee;
};
