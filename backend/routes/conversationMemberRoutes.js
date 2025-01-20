const express = require('express');
const router = express.Router();
const conversationMemberController = require('../controllers/conversationMemberController');

// Route cho ConversationMember
router.get(
  '/conversation_members',
  conversationMemberController.getConversationMembers
);
router.get(
  '/conversation_members/:id',
  conversationMemberController.getConversationMemberById
);
router.post(
  '/create_new_conversation_members',
  conversationMemberController.createConversationMember
);
router.delete(
  '/conversation_members/:id',
  conversationMemberController.deleteConversationMember
);

module.exports = router;
