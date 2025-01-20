const messageReadService = require('../services/messageReadService');

exports.markMessagesAsRead = async (req, res) => {
  const { conversation_id, user_id, last_message_id } = req.body;

  try {
    if (!conversation_id || !user_id) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const result = await messageReadService.MarkMessagesAsRead(
      conversation_id,
      user_id,
      last_message_id
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getConversationReadStatus = async (req, res) => {
  const { conversation_id } = req.params;
  const { limit } = req.query;

  try {
    const result = await messageReadService.GetConversationReadStatus(
      conversation_id,
      parseInt(limit) || 20
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting conversation read status:', error);
    res.status(500).json({ error: error.message });
  }
};
exports.getUnreadMessageCount = async (req, res) => {
  try {
    // Lấy user_id từ JWT token hoặc request body
    const user_id = req.user?.id || req.body.user_id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID là bắt buộc',
      });
    }

    const result = await messageReadService.GetUnreadMessageCount(user_id);

    // Trả về kết quả
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting unread message count:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Có lỗi xảy ra khi lấy số tin nhắn chưa đọc',
    });
  }
};
