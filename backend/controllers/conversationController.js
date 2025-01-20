const { Conversation } = require('../models');
const conversationService = require('../services/conversationService');

// chứa test
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      logging: false,
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const { type, title, created_by, last_message_at } = req.body;

    // Use the service to create a conversation
    const result = await conversationService.CreateConversation(
      type,
      title,
      created_by,
      last_message_at
    );

    if (result.success) {
      res.status(201).json(result.conversation);
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversationById = async (req, res) => {
  const { id } = req.params;
  try {
    const conversation = await Conversation.findByPk(id, {
      logging: false,
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUserConversations = async (req, res) => {
  // console.log(req.user);
  try {
    const userId = req.user.id; // Assuming you have user info in request
    const result = await conversationService.GetUserConversationsV2(userId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    throw error;
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
