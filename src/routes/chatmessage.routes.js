const express = require('express');
const router = express.Router();
const chatMessageController = require('../controllers/chatmessage.controller');

router.get('/', chatMessageController.getAllChatMessages);
router.get('/:id', chatMessageController.getChatMessageById);
router.post('/', chatMessageController.createChatMessage);
router.put('/:id', chatMessageController.updateChatMessage);
router.delete('/:id', chatMessageController.deleteChatMessage);
router.get('/user/:userId', chatMessageController.getChatMessagesByUserId);

module.exports = router;
