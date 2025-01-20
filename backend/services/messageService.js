const {
  Message,
  User,
  Conversation,
  ConversationMember,
  MessageRead,
  sequelize,
} = require('../models');
const TimeUtils = require('../utils/time');
const { Op } = require('sequelize');
const baseURL = process.env.BASE_URL || 'https://192.168.0.102:3000';

/**
 * Create a new message in a conversation
 * @param {number} conversation_id - ID of the conversation
 * @param {number} sender_id - ID of the message sender
 * @param {string} content - Message content
 * @param {string} type - Message type
 * @param {number|null} parent_id - ID of parent message for replies
 * @param {object} metadata - Additional message metadata
 * @returns {object} Result with success status and message/error
 */
exports.CreateMessage = async (
  conversation_id,
  sender_id,
  content,
  type,
  parent_id = null,
  uploadedFiles = []
) => {
  let savedFiles = [];

  try {
    // Kiểm tra thông tin bắt buộc
    if (
      !conversation_id ||
      !sender_id ||
      (!content && (!uploadedFiles || uploadedFiles.length === 0))
    ) {
      return {
        success: false,
        message:
          'Missing required information: conversation_id, sender_id, and either content or files are required',
      };
    }

    // Kiểm tra conversation và membership có thể thêm ở đây...

    let metadata = {};

    // Xử lý thông tin file
    if (uploadedFiles && uploadedFiles.length > 0) {
      savedFiles = uploadedFiles.map((file) => ({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        filePath: file.path.split('uploads')[1].replace(/\\/g, '/'),
        uploadDate: new Date(),
      }));

      metadata = {
        files: savedFiles,
        fileCount: savedFiles.length,
        totalSize: savedFiles.reduce((sum, file) => sum + file.size, 0),
      };
    }

    // Tạo message mới với metadata
    const messageData = {
      conversation_id,
      sender_id,
      content: content || '',
      type,
      parent_id,
      metadata: savedFiles.length > 0 ? metadata : null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newMessage = await Message.create(messageData);

    // Cập nhật thời gian tin nhắn cuối cùng của conversation
    await Conversation.update(
      {
        last_message_at: new Date(),
        last_message_type: type,
        last_message_sender_id: sender_id,
      },
      { where: { id: conversation_id } }
    );

    return {
      success: true,
      message: newMessage,
      files: savedFiles.length > 0 ? savedFiles : null,
    };
  } catch (error) {
    // Xóa file nếu có lỗi xảy ra
    if (uploadedFiles && uploadedFiles.length > 0) {
      uploadedFiles.forEach((file) => {
        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        });
      });
    }

    console.error('Error creating message:', error);
    return {
      success: false,
      message: 'Error occurred while creating message',
      error: error.message,
    };
  }
};
/**
 * Get messages from a conversation with access control
 * @param {number} conversation_id - ID of the conversation
 * @param {number} user_id - ID of the requesting user
 * @param {number|null} last_message_id - ID of last message for pagination
 * @param {number} limit - Number of messages to return
 * @returns {object} Result with success status and messages/error
 */
exports.GetMessagesByConversation = async (
  conversation_id,
  user_id,
  last_message_id = null,
  limit = 10
) => {
  try {
    // Input validation
    if (!conversation_id || !user_id) {
      return { success: false, message: 'Thiếu thông tin bắt buộc' };
    }

    // Check membership and access rights
    const memberStatus = await ConversationMember.findOne({
      where: { conversation_id, user_id },
    });

    if (!memberStatus) {
      return { success: false, message: 'Bạn không có quyền xem tin nhắn này' };
    }

    // Find the other member in private conversation
    const otherMember = await ConversationMember.findOne({
      where: {
        conversation_id,
        user_id: { [Op.ne]: user_id },
      },
    });

    let whereCondition = { conversation_id };

    // Handle messages visibility for users who left the conversation
    if (memberStatus.left_at) {
      whereCondition.sent_at = { [Op.lte]: memberStatus.left_at };
    }

    if (last_message_id) {
      whereCondition.id = { [Op.lt]: last_message_id };
    }

    const messages = await Message.findAll({
      where: whereCondition,
      limit: limit,
      order: [['id', 'DESC']],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['user_id', 'user_name', 'email', 'avatar_link'],
        },
        {
          model: Message,
          as: 'ParentMessage',
          attributes: ['id', 'content', 'sent_at'],
        },
        {
          // Include read status information
          model: MessageRead,
          required: false, // Use left join to get all messages even if not read
          where: {
            user_id: otherMember.user_id, // Get read status for the other user
          },
          attributes: ['read_at'],
        },
      ],
    });

    // Format the messages with additional information
    const formattedMessages = messages.map((message) => {
      // Create a plain object to modify
      const formattedMessage = message.get({ plain: true });

      // Format avatar URL
      if (formattedMessage.sender && formattedMessage.sender.avatar_link) {
        formattedMessage.sender.avatar_link = `${baseURL}${formattedMessage.sender.avatar_link}`;
      }

      // Process file metadata
      if (formattedMessage.metadata && formattedMessage.metadata.files) {
        formattedMessage.metadata.files = formattedMessage.metadata.files.map(
          (file) => {
            if (file.filePath) {
              file.filePath = `${baseURL}/uploads${file.filePath}`;
            }
            return file;
          }
        );

        // Update file statistics
        formattedMessage.metadata.fileCount =
          formattedMessage.metadata.files.length;
        formattedMessage.metadata.totalSize =
          formattedMessage.metadata.files.reduce(
            (total, file) => total + file.size,
            0
          );
      }

      // Format read status information
      formattedMessage.readStatus = {
        isRead: Boolean(
          formattedMessage.MessageReads && formattedMessage.MessageReads.length
        ),
        readAt: formattedMessage.MessageReads?.[0]?.read_at || null,
      };

      // Clean up by removing the raw MessageReads array
      delete formattedMessage.MessageReads;

      return formattedMessage;
    });

    return {
      success: true,
      messages: formattedMessages,
      otherUserId: otherMember.user_id,
    };
  } catch (error) {
    console.error('Lỗi khi lấy tin nhắn:', error);
    return { success: false, message: 'Đã có lỗi xảy ra khi lấy tin nhắn' };
  }
};

/**
 * Update an existing message
 * @param {number} message_id - ID of message to update
 * @param {number} sender_id - ID of user requesting update
 * @param {string} new_content - New message content
 * @returns {object} Result with success status and updated message/error
 */
exports.UpdateMessage = async (message_id, sender_id, new_content) => {
  try {
    const message = await Message.findByPk(message_id);

    if (!message) {
      return { success: false, message: 'Tin nhắn không tồn tại' };
    }

    if (message.sender_id !== sender_id) {
      return {
        success: false,
        message: 'Không có quyền chỉnh sửa tin nhắn này',
      };
    }

    if (message.type !== 'text') {
      return {
        success: false,
        message: 'Chỉ có thể chỉnh sửa tin nhắn văn bản',
      };
    }

    if (!TimeUtils.isWithinEditTimeLimit(message.sent_at)) {
      return {
        success: false,
        message: 'Đã quá thời gian cho phép chỉnh sửa (5 phút)',
      };
    }

    await message.update({
      content: new_content,
    });

    return { success: true, message: await Message.findByPk(message_id) };
  } catch (error) {
    console.error('Lỗi khi cập nhật tin nhắn:', error);
    return {
      success: false,
      message: 'Đã có lỗi xảy ra khi cập nhật tin nhắn',
    };
  }
};

/**
 * Delete (soft delete) a message
 * @param {number} message_id - ID of message to delete
 * @param {number} sender_id - ID of user requesting deletion
 * @returns {object} Result with success status and deleted message/error
 */
exports.DeleteMessage = async (message_id, sender_id) => {
  try {
    const message = await Message.findByPk(message_id);

    if (!message) {
      return { success: false, message: 'Tin nhắn không tồn tại' };
    }

    if (message.sender_id !== sender_id) {
      return { success: false, message: 'Không có quyền xóa tin nhắn này' };
    }

    if (!TimeUtils.isWithinEditTimeLimit(message.sent_at)) {
      return {
        success: false,
        message: 'Đã quá thời gian cho phép xóa (5 phút)',
      };
    }

    await message.update({
      deleted_at: TimeUtils.toVNTime(new Date()),
      metadata: {
        ...message.metadata,
        deleted: true,
        deleted_by: sender_id,
        original_content: message.content,
        deleted_at: TimeUtils.toVNTime(new Date()).toISOString(),
      },
      content: 'Tin nhắn đã bị xóa',
    });

    const deletedMessage = await Message.findByPk(message_id);
    return { success: true, message: deletedMessage };
  } catch (error) {
    console.error('Lỗi khi xóa tin nhắn:', error);
    return { success: false, message: 'Đã có lỗi xảy ra khi xóa tin nhắn' };
  }
};
exports.GetMediaByType = async (
  conversation_id,
  user_id,
  mediaType,
  last_message_id = null,
  limit = 20
) => {
  try {
    if (!conversation_id || !user_id || !mediaType) {
      return { success: false, message: 'Missing required information' };
    }

    // Validate media type
    const validTypes = ['image', 'video', 'file'];
    if (!validTypes.includes(mediaType)) {
      return { success: false, message: 'Invalid media type' };
    }

    // Build where condition
    let whereCondition = {
      conversation_id,
      type: mediaType,
      deleted_at: null,
    };

    if (last_message_id) {
      whereCondition.id = { [Op.lt]: last_message_id };
    }

    const messages = await Message.findAll({
      where: whereCondition,
      limit: limit,
      order: [['id', 'DESC']],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['user_id', 'user_name', 'email', 'avatar_link'],
        },
      ],
      attributes: ['id', 'type', 'metadata', 'sent_at'],
    });

    // Format the response based on media type
    const formattedMedia = messages.map((message) => {
      const files = message.metadata?.files || [];
      return {
        message_id: message.id,
        sent_at: message.sent_at,
        sender: {
          user_id: message.sender.user_id,
          user_name: message.sender.user_name,
          avatar_link: message.sender.avatar_link,
        },
        files: files.map((file) => ({
          name: file.originalName,
          url: `${baseURL}/uploads${file.filePath}`,
          size: file.size,
          type: file.mimeType,
          upload_date: file.uploadDate,
        })),
      };
    });

    // Get total count for pagination
    const totalCount = await Message.count({
      where: {
        conversation_id,
        type: mediaType,
        deleted_at: null,
      },
    });

    return {
      success: true,
      media: formattedMedia,
      pagination: {
        total: totalCount,
        has_more: formattedMedia.length === limit,
      },
    };
  } catch (error) {
    console.error('Error fetching media:', error);
    return { success: false, message: 'Error occurred while fetching media' };
  }
};

exports.markMessagesAsReadInConversation = async (
  userId,
  conversation_id,
  message_id
) => {
  const transaction = await sequelize.transaction();

  try {
    if (!userId || !conversation_id || !message_id) {
      return {
        success: false,
        message: 'Missing required parameters',
      };
    }

    // Verify the message exists and belongs to the conversation
    const targetMessage = await Message.findOne({
      where: {
        id: message_id,
        conversation_id: conversation_id,
      },
    });

    if (!targetMessage) {
      await transaction.rollback();
      return {
        success: false,
        message: 'Message not found or does not belong to the conversation',
      };
    }

    // Get all unread messages from other users up to the target message
    const unreadMessages = await Message.findAll({
      where: {
        conversation_id: conversation_id,
        id: { [Op.lte]: message_id },
        sender_id: { [Op.ne]: userId },
        deleted_at: null,
        id: {
          [Op.notIn]: sequelize.literal(
            `(SELECT message_id FROM MessageReads WHERE user_id = ${userId})`
          ),
        },
      },
      attributes: ['id'],
    });

    // Create read records for unread messages
    if (unreadMessages.length > 0) {
      const readRecords = unreadMessages.map((msg) => ({
        message_id: msg.id,
        user_id: userId,
        read_at: new Date(),
      }));

      await MessageRead.bulkCreate(readRecords, { transaction });
    }

    // Get remaining unread count
    const remainingUnreadCount = await Message.count({
      where: {
        conversation_id: conversation_id,
        id: { [Op.gt]: message_id },
        sender_id: { [Op.ne]: userId },
        deleted_at: null,
      },
    });

    await transaction.commit();

    return {
      success: true,
      data: {
        marked_count: unreadMessages.length,
        remaining_unread: Math.min(remainingUnreadCount, 9),
      },
    };
  } catch (error) {
    await transaction.rollback();
    console.error('Error marking messages as read:', error);
    return {
      success: false,
      message: 'Failed to mark messages as read',
    };
  }
};

exports.getUnreadMessageCounts = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: 'User ID is required',
      };
    }

    const unreadCounts = await Message.findAll({
      attributes: [
        'conversation_id',
        [sequelize.fn('COUNT', sequelize.col('Message.id')), 'unread_count'],
      ],
      where: {
        sender_id: { [Op.ne]: userId },
        deleted_at: null,
        id: {
          [Op.notIn]: sequelize.literal(
            `(SELECT message_id FROM MessageReads WHERE user_id = ${userId})`
          ),
        },
      },
      group: ['conversation_id'],
    });

    const formattedCounts = unreadCounts.map((count) => ({
      conversation_id: count.conversation_id,
      unread_count: Math.min(parseInt(count.get('unread_count')), 9),
    }));

    return {
      success: true,
      data: formattedCounts,
    };
  } catch (error) {
    console.error('Error getting unread counts:', error);
    return {
      success: false,
      message: 'Failed to get unread message counts',
    };
  }
};
