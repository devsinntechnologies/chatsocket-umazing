const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Chat routes
router.get('/chat_room/:id', chatController.getAllChatsInChatRoom);
router.get('/chat_rooms', chatController.getUserChatRooms);
router.post('/send_message', chatController.sendMessage);

module.exports = router;
