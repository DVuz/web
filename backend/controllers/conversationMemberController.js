const { ConversationMember } = require('../models');
const conversationMemberService = require('../services/conversationMemberService');

/**
 * Lấy danh sách tất cả ConversationMember.
 */
exports.getConversationMembers = async (req, res) => {
  try {
    const conversationMembers = await ConversationMember.findAll({
      logging: false,
    });
    res.json(conversationMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy thông tin một ConversationMember theo ID.
 */
exports.getConversationMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const conversationMember = await ConversationMember.findByPk(id, {
      logging: false,
    });

    if (!conversationMember) {
      return res.status(404).json({ error: 'ConversationMember not found' });
    }

    res.json(conversationMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Tạo mới một ConversationMember.
 */
exports.createConversationMember = async (req, res) => {
  try {
    const { conversation_id, user_id, notification_status, role, mute_until } =
      req.body;

    // Sử dụng service để tạo ConversationMember
    const result = await conversationMemberService.createConversationMember({
      conversation_id,
      user_id,
      notification_status,
      role,
      mute_until,
    });

    if (result.success) {
      res.status(201).json(result.conversationMember);
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Xóa một ConversationMember theo ID.
 */
exports.deleteConversationMember = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await ConversationMember.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: 'ConversationMember not found' });
    }

    res.json({ message: 'ConversationMember deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
