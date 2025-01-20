const messageService = require('../services/messageService');

/**
 * Create a new message
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.createMessage = async (req, res) => {
  try {
    const { conversation_id, sender_id, content, type, parent_id } = req.body;

    // Kiểm tra xem có file được upload không
    const uploadedFiles = req.files || [];

    // Kiểm tra điều kiện upload
    if (!content && uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Either message content or files are required',
      });
    }

    if (uploadedFiles.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 files allowed per message',
      });
    }

    const result = await messageService.CreateMessage(
      conversation_id,
      sender_id,
      content,
      type,
      parent_id,
      uploadedFiles
    );

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Message created successfully',
        data: result.message,
        files: result.files,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Error in createMessage controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get messages from a conversation
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.getMessages = async (req, res) => {
  const { conversation_id } = req.params;
  const { last_message_id, limit } = req.query;
  const user_id = req.user.id; // Assuming auth middleware sets user

  try {
    const result = await messageService.GetMessagesByConversation(
      conversation_id,
      user_id,
      last_message_id || null,
      parseInt(limit, 10) || 10
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(403).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Update an existing message
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.updateMessage = async (req, res) => {
  const { message_id, sender_id, content } = req.body;

  try {
    if (!message_id || !sender_id || !content) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const result = await messageService.UpdateMessage(
      message_id,
      sender_id,
      content
    );

    if (result.success) {
      res.status(200).json(result.message);
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Delete a message
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.deleteMessage = async (req, res) => {
  const { message_id, sender_id } = req.body;

  try {
    if (!message_id || !sender_id) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const result = await messageService.DeleteMessage(message_id, sender_id);

    if (result.success) {
      res.status(200).json({
        message: 'Tin nhắn đã được xóa thành công',
        data: result.message,
      });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getMediaByType = async (req, res) => {
  try {
    const { conversation_id, type } = req.params;
    const { last_message_id, limit } = req.query;
    const user_id = req.user.id; // Assuming you have authentication middleware

    const result = await messageService.GetMediaByType(
      parseInt(conversation_id),
      user_id,
      type,
      last_message_id ? parseInt(last_message_id) : null,
      limit ? parseInt(limit) : 20
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
exports.markMessagesAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversation_id, message_id } = req.body;

    const result = await messageService.markMessagesAsReadInConversation(
      userId,
      conversation_id,
      message_id
    );

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Controller error marking messages as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.getUnreadCounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await messageService.getUnreadMessageCounts(userId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Controller error getting unread counts:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
