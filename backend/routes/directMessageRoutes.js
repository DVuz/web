const express = require('express');
const router = express.Router();
const directMessageController = require('../controllers/directMessageController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/get_messages', directMessageController.getMessagesBetweenUsers);
router.get(
  '/get_messages_with_media',
  directMessageController.getMessagesMediaBetweenUsers
);
router.post('/create_new_messages', directMessageController.createMessage);
router.get(
  '/search_messages',
  directMessageController.searchMessagesController
);
router.put('/edit_messages', directMessageController.updateMessage);
module.exports = router;
