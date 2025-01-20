const {
  Message,
  MessageRead,
  User,
  ConversationMember,
  Conversation,
  sequelize,
} = require('../models');
const TimeUtils = require('../utils/time');
const { Op } = require('sequelize');

// Lấy số tin nhắn chưa đọc của user
exports.GetUnreadMessageCount = async (user_id) => {
  try {
    // Lấy số tin nhắn chưa đọc cho mỗi cuộc trò chuyện
    const unreadMessages = await Message.findAll({
      attributes: [
        'conversation_id',
        [sequelize.fn('COUNT', sequelize.col('Message.id')), 'unread_count'],
      ],
      include: [
        {
          model: ConversationMember,
          attributes: [],
          where: {
            user_id,
            left_at: null, // Chỉ lấy các cuộc trò chuyện user chưa rời
          },
          required: true,
        },
        {
          model: MessageRead,
          attributes: [],
          where: { user_id },
          required: false,
        },
      ],
      where: {
        sender_id: { [Op.ne]: user_id }, // Không đếm tin nhắn do chính user gửi
        deleted_at: null,
        '$MessageReads.id$': null, // Chỉ lấy tin chưa đọc
      },
      group: ['conversation_id'],
      raw: true,
    });

    // Lấy thông tin chi tiết cuộc trò chuyện
    const conversationDetails = await Conversation.findAll({
      where: {
        id: unreadMessages.map((msg) => msg.conversation_id),
      },
      attributes: ['id', 'type', 'title'],
      raw: true,
    });

    // Kết hợp thông tin
    const result = unreadMessages.map((msg) => {
      const conversation = conversationDetails.find(
        (c) => c.id === msg.conversation_id
      );
      return {
        conversation_id: msg.conversation_id,
        conversation_type: conversation.type,
        conversation_title: conversation.title,
        unread_count: parseInt(msg.unread_count),
      };
    });

    return {
      success: true,
      data: {
        total_unread: result.reduce((sum, item) => sum + item.unread_count, 0),
        conversations: result,
      },
    };
  } catch (error) {
    throw error;
  }
};

// Sửa lại hàm đánh dấu đọc tin nhắn
exports.MarkMessagesAsRead = async (
  conversation_id,
  user_id,
  last_message_id = null
) => {
  const transaction = await sequelize.transaction();

  try {
    // Kiểm tra user có trong cuộc trò chuyện
    const member = await ConversationMember.findOne({
      where: { conversation_id, user_id },
    });

    if (!member) {
      throw new Error('Người dùng không thuộc cuộc trò chuyện này');
    }

    // Xác định điều kiện cho tin nhắn cần đánh dấu đã đọc
    const messageCondition = {
      conversation_id,
      sender_id: { [Op.ne]: user_id }, // Chỉ đánh dấu tin nhắn từ người khác
      deleted_at: null,
      id: last_message_id ? { [Op.lte]: last_message_id } : { [Op.gt]: 0 },
    };

    // Lấy tất cả tin nhắn cần đánh dấu
    const messages = await Message.findAll({
      where: messageCondition,
      order: [['sent_at', 'ASC']],
      attributes: ['id'],
    });

    // Tạo các bản ghi MessageRead cho những tin nhắn chưa đọc
    const existingReads = await MessageRead.findAll({
      where: {
        message_id: messages.map((m) => m.id),
        user_id,
      },
      attributes: ['message_id'],
    });

    const existingMessageIds = new Set(existingReads.map((r) => r.message_id));

    const newReads = messages
      .filter((m) => !existingMessageIds.has(m.id))
      .map((m) => ({
        message_id: m.id,
        user_id,
        read_at: TimeUtils.toVNTime(new Date()),
      }));

    if (newReads.length > 0) {
      await MessageRead.bulkCreate(newReads, { transaction });
    }

    await transaction.commit();

    return {
      success: true,
      message: `Đã đọc ${newReads.length} tin nhắn mới`,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.GetUnreadMessageCount = async (user_id) => {
  try {
    // Lấy số tin nhắn chưa đọc cho mỗi cuộc trò chuyện
    const unreadMessages = await Message.findAll({
      attributes: [
        'conversation_id',
        [sequelize.fn('COUNT', sequelize.col('Message.id')), 'unread_count'],
      ],
      include: [
        {
          model: MessageRead,
          attributes: [],
          required: false,
          where: { user_id },
        },
      ],
      where: {
        conversation_id: {
          [Op.in]: sequelize.literal(`(
            SELECT conversation_id 
            FROM ConversationMembers 
            WHERE user_id = ${user_id} 
            AND left_at IS NULL
          )`),
        },
        sender_id: { [Op.ne]: user_id }, // Không đếm tin nhắn do chính user gửi
        deleted_at: null,
        '$MessageReads.id$': null, // Chỉ lấy tin chưa đọc
      },
      group: ['conversation_id'],
      raw: true,
    });

    // Lấy thông tin chi tiết cuộc trò chuyện
    const conversations = await Conversation.findAll({
      where: {
        id: unreadMessages.map((msg) => msg.conversation_id),
      },
      include: [
        {
          model: ConversationMember,
          where: { user_id },
          attributes: [],
          required: true,
        },
      ],
      attributes: ['id', 'type', 'title'],
      raw: true,
    });

    // Kết hợp thông tin
    const result = unreadMessages.map((msg) => {
      const conversation = conversations.find(
        (c) => c.id === msg.conversation_id
      );
      return {
        conversation_id: msg.conversation_id,
        conversation_type: conversation?.type,
        conversation_title: conversation?.title,
        unread_count: parseInt(msg.unread_count),
      };
    });

    return {
      success: true,
      data: {
        total_unread: result.reduce((sum, item) => sum + item.unread_count, 0),
        conversations: result,
      },
    };
  } catch (error) {
    console.error('GetUnreadMessageCount error:', error);
    throw error;
  }
};
