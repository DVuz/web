const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const handleMessageUpload = require('../config/handleMessageUpload');
const messageController = require('../controllers/messageController');

// Route cho ConversationMember
router.post(
  '/create_new_message',
  authMiddleware,
  handleMessageUpload,
  messageController.createMessage
);

router.get(
  '/:conversation_id/media/:type',
  authMiddleware,
  messageController.getMediaByType
);

router.get(
  '/get_message/:conversation_id',
  authMiddleware,
  messageController.getMessages
);
router.put('/update_message', messageController.updateMessage);
router.post('/delete_message', messageController.deleteMessage);

router.post('/mark_read', authMiddleware, messageController.markMessagesAsRead);
router.get('/unread-counts', authMiddleware, messageController.getUnreadCounts);

module.exports = router;
