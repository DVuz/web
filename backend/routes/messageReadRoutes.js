const express = require('express');
const router = express.Router();
const messageReadController = require('../controllers/messageReadController');

router.post('/mark_multiple', messageReadController.markMessagesAsRead);
router.get(
  '/messageReads/:conversation_id',
  messageReadController.getConversationReadStatus
);
router.get('/unread_count', messageReadController.getUnreadMessageCount);

module.exports = router;
