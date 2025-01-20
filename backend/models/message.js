'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // Ràng buộc khóa ngoại với Conversation
      this.belongsTo(models.Conversation, { foreignKey: 'conversation_id' });
      // Ràng buộc khóa ngoại với User
      this.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
      // Ràng buộc tự tham chiếu cho các câu trả lời
      this.belongsTo(models.Message, {
        as: 'ParentMessage',
        foreignKey: 'parent_id',
      });
      this.hasMany(models.Message, { as: 'Replies', foreignKey: 'parent_id' });
      // Ràng buộc với MessageRead
      this.hasMany(models.MessageRead, { foreignKey: 'message_id' });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      conversation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Conversations',
          key: 'id',
        },
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('text', 'image', 'video', 'voiceRecord', 'file'),
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Messages',
          key: 'id',
        },
      },
      metadata: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'Messages',
      timestamps: false,
      indexes: [
        {
          fields: ['conversation_id', 'sent_at'],
        },
        {
          fields: ['parent_id'],
        },
      ],
    }
  );

  return Message;
};
