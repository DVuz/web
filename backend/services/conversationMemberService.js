const { ConversationMember, sequelize } = require('../models');

/**
 * Tạo mới một ConversationMember.
 * @param {Object} options
 * @param {number} options.conversation_id - ID của cuộc trò chuyện.
 * @param {number} options.user_id - ID của người dùng.
 * @param {string} [options.notification_status='on'] - Trạng thái thông báo ('on', 'off', 'muted').
 * @param {string} [options.role='member'] - Vai trò trong cuộc trò chuyện ('admin', 'member').
 * @param {Date|null} [options.mute_until=null] - Thời điểm tắt thông báo (nếu có).
 * @returns {Object} - Kết quả tạo ConversationMember.
 */
exports.createConversationMember = async ({
  conversation_id,
  user_id,
  notification_status = 'on',
  role = 'member',
  mute_until = null,
}) => {
  const transaction = await sequelize.transaction(); // Bắt đầu một transaction

  try {
    // Kiểm tra các giá trị bắt buộc
    if (!conversation_id || !user_id) {
      return {
        success: false,
        message: 'conversation_id và user_id là bắt buộc.',
      };
    }

    // Kiểm tra xem người dùng đã tồn tại trong cuộc trò chuyện chưa
    const existingMember = await ConversationMember.findOne({
      where: { conversation_id, user_id },
      transaction,
    });

    if (existingMember) {
      return {
        success: false,
        message: 'Người dùng đã tham gia cuộc trò chuyện này.',
      };
    }

    // Tạo ConversationMember mới
    const newConversationMember = await ConversationMember.create(
      {
        conversation_id,
        user_id,
        notification_status,
        mute_until,
        role,
        joined_at: new Date(),
      },
      { transaction }
    );

    // Commit transaction
    await transaction.commit();

    return { success: true, conversationMember: newConversationMember };
  } catch (error) {
    // Rollback transaction nếu xảy ra lỗi
    await transaction.rollback();
    console.error('Error creating ConversationMember:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi tạo ConversationMember.',
    };
  }
};

/**
 * Xóa một ConversationMember.
 * @param {number} id - ID của ConversationMember cần xóa.
 * @returns {Object} - Kết quả xóa.
 */
exports.deleteConversationMember = async (id) => {
  try {
    const deleted = await ConversationMember.destroy({
      where: { id },
    });

    if (!deleted) {
      return { success: false, message: 'Không tìm thấy ConversationMember.' };
    }

    return { success: true, message: 'Đã xóa ConversationMember thành công.' };
  } catch (error) {
    console.error('Error deleting ConversationMember:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi xóa ConversationMember.',
    };
  }
};

/**
 * Lấy thông tin tất cả ConversationMember trong một cuộc trò chuyện.
 * @param {number} conversation_id - ID của cuộc trò chuyện.
 * @returns {Object} - Danh sách ConversationMember.
 */
exports.getMembersByConversation = async (conversation_id) => {
  try {
    const members = await ConversationMember.findAll({
      where: { conversation_id },
    });

    if (!members.length) {
      return {
        success: false,
        message: 'Không tìm thấy thành viên nào trong cuộc trò chuyện này.',
      };
    }

    return { success: true, members };
  } catch (error) {
    console.error('Error fetching members:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách thành viên.',
    };
  }
};
