const express = require('express');
const { getChatHistory } = require('../controllers/chatController');
const router = express.Router();
// GET /api/chat/history/:room
router.get('api/chat/history/:room', getChatHistory);

module.exports = router;
