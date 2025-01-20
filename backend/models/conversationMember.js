'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConversationMember extends Model {
    static associate(models) {
      // Ràng buộc khóa ngoại với Conversation
      this.belongsTo(models.Conversation, { foreignKey: 'conversation_id' });
      // Ràng buộc khóa ngoại với User
      this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  ConversationMember.init(
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      notification_status: {
        type: DataTypes.ENUM('on', 'off', 'muted'),
        defaultValue: 'on',
        allowNull: false,
      },
      mute_until: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('admin', 'member'),
        defaultValue: 'member',
        allowNull: false,
      },
      joined_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      left_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'ConversationMember',
      tableName: 'ConversationMembers',
      timestamps: false,
      indexes: [
        {
          fields: ['conversation_id', 'user_id'],
          unique: true,
        },
      ],
    }
  );

  return ConversationMember;
};
