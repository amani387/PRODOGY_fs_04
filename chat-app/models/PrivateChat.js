const mongoose = require('mongoose');

const PrivateChatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // The two users in the conversation
  ],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

const PrivateChat = mongoose.model('PrivateChat', PrivateChatSchema);
module.exports = PrivateChat;
