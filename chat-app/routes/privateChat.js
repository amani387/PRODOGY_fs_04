// routes/privateChat.js
const express = require('express');
const privateChatController = require('../controllers/privateChatController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', authenticateToken, privateChatController.getAllUsers);
router.post('/start', authenticateToken, privateChatController.startPrivateChat);
router.get('/messages/:chatId', authenticateToken, privateChatController.getChatMessages);

module.exports = router;
