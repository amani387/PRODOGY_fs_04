const express = require('express');
const Group = require('../models/Groups');
const { createGroup, getGroups, addMemberToGroup } = require('../controllers/groupController');
const authenticateToken = require('../middleware/authMiddleware');
const { sendMessageToGroup, getGroupMessages } = require('../controllers/groupMessageController');
const router = express.Router();

// Create a new group
router.post('/create',authenticateToken, createGroup);

// Get all groups
router.get('/',authenticateToken,getGroups);

//add user to the groups
router.post('/add-user',addMemberToGroup)

// POST /api/groups/:groupId/messages - Send a message to a group
router.post("/:groupId/messages",authenticateToken, sendMessageToGroup);

// GET /api/groups/:groupId/messages - Get all messages in a group
router.get("/:groupId/messages",authenticateToken, getGroupMessages);

module.exports = router;
