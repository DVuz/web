const express = require('express');
const conversationController = require('../controllers/conversationController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.post(
  '/create_new_conversations',
  conversationController.createConversation
);

router.get('/', conversationController.getConversations);
router.get('/conversations/:id', conversationController.getConversationById);
router.get(
  '/user_conversations',
  authMiddleware,
  conversationController.getUserConversations
);

module.exports = router;
