'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DirectMessage extends Model {
    static associate(models) {
      // define association here
    }
  }

  DirectMessage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Tên bảng mà cột này tham chiếu
          key: 'user_id', // Tên cột khóa chính trong bảng Users
        },
      },
      receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Tên bảng mà cột này tham chiếu
          key: 'user_id', // Tên cột khóa chính trong bảng Users
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: [
          'text',
          'image',
          'video',
          'voiceRecord',
          'doc',
          'docx',
          'pdf',
          'xlsx',
          'ppt',
          'pptx',
          'mp4',
          'avi',
          'mkv',
          'gif',
          'audio',
        ],
        allowNull: false,
      },
      sent_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      read_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'DirectMessage',
      tableName: 'DirectMessages',
    }
  );

  return DirectMessage;
};
