'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MessageRead extends Model {
    static associate(models) {
      // Ràng buộc khóa ngoại với Message
      this.belongsTo(models.Message, { foreignKey: 'message_id' });
      // Ràng buộc khóa ngoại với User
      this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  MessageRead.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      message_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Messages',
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      read_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'MessageRead',
      tableName: 'MessageReads',
      timestamps: false,
      indexes: [
        {
          fields: ['message_id', 'user_id'],
          unique: true,
        },
      ],
    }
  );

  return MessageRead;
};
