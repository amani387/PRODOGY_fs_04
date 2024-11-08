const Message = require('../models/Message');

// Fetch chat history for a room
exports.getChatHistory = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ group: req.params.groupId }).populate('sender'); // Retrieve messages for a specific group
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// Handle sending a new chat message (for example, you might use this with the REST API)
exports.sendMessage = async (req, res) => {
  const { room, sender, message } = req.body;
  console.log("message body ",req.body)
  try {
    const newMessage = await Message.create({ room, sender, message });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
