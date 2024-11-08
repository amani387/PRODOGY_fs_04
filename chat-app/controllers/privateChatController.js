// controllers/privateChatController.js

const PrivateChat = require('../models/PrivateChat');
const User = require('../models/User');

// Get all users excluding the current user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }, 'username'); // Exclude current user, return username only
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
};

// Start a private chat or retrieve an existing one
exports.startPrivateChat = async (req, res) => {
  const { userId } = req.body; // Target user's ID to chat with
  const currentUserId = req.user.id; // Authenticated user's ID

  try {
    // Check if a private chat already exists between these two users
    let chat = await PrivateChat.findOne({
      participants: { $all: [currentUserId, userId] }
    }).populate('messages.sender', 'username'); // Populate sender username in messages

    // If no chat exists, create a new one
    if (!chat) {
      chat = new PrivateChat({
        participants: [currentUserId, userId],
        messages: []
      });
      await chat.save();
    }

    res.status(200).json({ chatId: chat._id, messages: chat.messages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start or retrieve private chat.' });
  }
};

// Get all messages in a specific private chat
exports.getChatMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await PrivateChat.findById(chatId).populate('messages.sender', 'username');
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }
    res.status(200).json(chat.messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages.' });
  }
};
