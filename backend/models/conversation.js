'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      // Định nghĩa quan hệ cơ bản với ConversationMember
      this.hasMany(models.ConversationMember, {
        foreignKey: 'conversation_id',
        as: 'ConversationMembers', // Định nghĩa alias chính
      });

      // // Định nghĩa thêm một quan hệ khác để lấy thành viên
      // this.hasMany(models.ConversationMember, {
      //   foreignKey: 'conversation_id',
      //   as: 'Members'  // Định nghĩa alias phụ cho trường hợp lấy members
      // });

      // Quan hệ với Message vẫn giữ nguyên
      this.hasMany(models.Message, {
        foreignKey: 'conversation_id',
      });
    }
  }

  Conversation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('private', 'group'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
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
      last_message_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Conversation',
      tableName: 'Conversations',
      timestamps: false, // Không tự động thêm `createdAt` và `updatedAt`
      indexes: [
        {
          fields: ['created_by'],
        },
        {
          fields: ['last_message_at'],
        },
      ],
    }
  );

  return Conversation;
};
